import uuid
from datetime import datetime
from typing import List

from sqlalchemy.orm import Session

from src import schemas, models, crud
from src.core.const import status, string
from src.core.error_handler import WebException


class PostController:
    @staticmethod
    def create_post(db: Session, current_user: models.User, post_create: schemas.PostCreate) -> schemas.Response:
        post_create.created_at = datetime.fromtimestamp(int(post_create.created_at))
        post = crud.post.create(db, schemas.Post(id=str(uuid.uuid4()), user_id=current_user.id, **post_create.__dict__))
        return schemas.Response(data=[post.id])

    @staticmethod
    def update_post(db: Session, post_update: schemas.PostUpdate, post: models.Post) -> schemas.Response:
        crud.post.update(db, post, post_update)
        post_updated = crud.post.update(db, post, {"updated_at": datetime.now()})
        return schemas.Response(data=[post_updated])

    @staticmethod
    def read_post(post: models.Post) -> schemas.Response:
        post_dict = post.__dict__

        post_dict["comments"] = len(post.comments)

        up_votes = [post_vote.user_id for post_vote in post.votes if
                    post_vote.vote_id == "e9bdd2db-7942-4ac7-a926-708df93eec2c"]
        post_dict["upvote"] = len(up_votes)
        post_dict["upvote_list"] = up_votes

        down_votes = [post_vote.user_id for post_vote in post.votes if
                      post_vote.vote_id != "e9bdd2db-7942-4ac7-a926-708df93eec2c"]
        post_dict["downvote"] = len(down_votes)
        post_dict["downvote_list"] = down_votes

        post_dict["user_saved_list"] = [saved_user.user_id for saved_user in post.saved_users]

        post_dict["tags"] = [post_tag.tag.type for post_tag in post.tags]

        post_dict["user"] = {"first_name": post.user.first_name, "last_name": post.user.last_name,
                             "email": post.user.email, "avatar": post.user.avatar}
        del post_dict["votes"]
        del post_dict["saved_users"]
        return schemas.Response(data=[post_dict])

    @staticmethod
    def delete_post(db: Session, post: models.Post) -> schemas.Response:
        crud.post.remove(db, post)
        return schemas.Response(data=[post])

    def read_all_posts(self, db: Session) -> schemas.Response:
        posts = crud.post.get_multi(db)
        data = []
        for post in posts:
            data.append(self.read_post(post).data[0])
        return schemas.Response(data=data)

    def read_user_posts(self, user: models.User) -> schemas.Response:
        posts = user.posts
        data = []
        for post in posts:
            data.append(self.read_post(post).data[0])
        return schemas.Response(data=data)

    def read_all_saved_posts(self, db: Session, user: models.User) -> schemas.Response:
        saved_posts = crud.post_saved.get_multi_by_attribute(db, user.id, "user_id")
        data = []
        for saved_post in saved_posts:
            data.append(self.read_post(crud.post.get(db, saved_post.post_id)).data[0])
        return schemas.Response(data=data)

    @staticmethod
    def upvote_post(db: Session, user: models.User, post: models.Post) -> schemas.Response:
        vote = schemas.PostUpvote(id=str(uuid.uuid4()), user_id=user.id, post_id=post.id)
        vote_db = crud.post_vote.get_by_multi_attribute(db, [user.id, post.id], ["user_id", "post_id"])
        if vote_db:
            obj = crud.post_vote.remove(db, vote_db)
            if vote_db.vote_id != vote.vote_id:
                obj = crud.post_vote.create(db, vote)
        else:
            obj = crud.post_vote.create(db, vote)

        return schemas.Response(data=[obj.id])

    @staticmethod
    def downvote_post(db: Session, user: models.User, post: models.Post) -> schemas.Response:
        vote = schemas.PostDownvote(id=str(uuid.uuid4()), user_id=user.id, post_id=post.id)
        vote_db = crud.post_vote.get_by_multi_attribute(db, [user.id, post.id], ["user_id", "post_id"])
        if vote_db:
            obj = crud.post_vote.remove(db, vote_db)
            if vote_db.vote_id != vote.vote_id:
                obj = crud.post_vote.create(db, vote)
        else:
            obj = crud.post_vote.create(db, vote)

        return schemas.Response(data=[obj.id])

    def search_post(self, db: Session, search_str: List[str], filter_tags: List[str]) -> schemas.Response:
        data = self.read_all_posts(db).data
        output = []
        all_tags = crud.tag.get_multi(db)
        all_tags_dict = {tag.type: tag.id for tag in all_tags}
        for post in data:
            is_tagged = False
            if not filter_tags:
                is_tagged = True
                output.append(post)
            for tag in filter_tags:
                if tag not in all_tags_dict.keys():
                    raise WebException(err=tag + ": " + string.TAG_NOT_FOUND, err_status=status.ERR0003)
                if tag in post["tags"]:
                    is_tagged = True
                    output.append(post)
                    break
            if is_tagged:
                is_searched = False
                if not search_str:
                    is_searched = True
                for subs in search_str:
                    if [i for i in [post["title"]] if subs in i]:
                        is_searched = True
                        break
                if not is_searched:
                    output.pop()

        return schemas.Response(data=output)

    @staticmethod
    def save_post(db: Session, user: models.User, post: models.Post) -> schemas.Response:
        if post.id in [post.id for post in user.posts]:
            raise WebException(err_status=status.ERR0005, err=string.INVALID_POST)
        saved_post = crud.post_saved.get_by_multi_attribute(db, [user.id, post.id], ["user_id", "post_id"])
        if saved_post:
            obj = crud.post_saved.remove(db, saved_post)
        else:
            obj = crud.post_saved.create(db, schemas.PostSaved(id=str(uuid.uuid4()), user_id=user.id, post_id=post.id))

        return schemas.Response(data=[obj.id])

    def get_post_by_tag(self, db: Session, filter_tags: List[str]) -> schemas.Response:
        data = self.search_post(db=db, search_str=[], filter_tags=filter_tags).data
        return schemas.Response(data=data)


post_controller = PostController()
