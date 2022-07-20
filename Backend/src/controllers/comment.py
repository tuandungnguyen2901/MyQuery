import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from src import schemas, models, crud


class CommentController:
    @staticmethod
    def create_comment(db: Session, current_user: models.User, post: models.Post,
                       comment_create: schemas.CommentCreate) -> schemas.Response:
        created_at = datetime.fromtimestamp(int(comment_create.created_at))
        comment = crud.comment.create(db, schemas.Comment(id=str(uuid.uuid4()), user_id=current_user.id,
                                                          post_id=post.id, content=comment_create.content,
                                                          created_at=created_at))
        return schemas.Response(data=[comment])

    @staticmethod
    def update_comment(db: Session, comment_update: schemas.CommentUpdate, comment: models.Comment) -> schemas.Response:
        crud.comment.update(db, comment, comment_update)
        comment_updated = crud.comment.update(db, comment, {"updated_at": datetime.now()})
        return schemas.Response(data=[comment_updated])

    @staticmethod
    def read_comment(comment: models.Comment) -> schemas.Response:
        comment_dict = comment.__dict__
        up_votes = [comment_vote.user_id for comment_vote in comment.votes if
                    comment_vote.vote_id == "e9bdd2db-7942-4ac7-a926-708df93eec2c"]
        comment_dict["upvote"] = len(up_votes)
        comment_dict["upvote_list"] = up_votes

        down_votes = [comment_vote.user_id for comment_vote in comment.votes if
                      comment_vote.vote_id != "e9bdd2db-7942-4ac7-a926-708df93eec2c"]
        comment_dict["downvote"] = len(down_votes)
        comment_dict["downvote_list"] = down_votes

        del comment_dict["votes"]
        return schemas.Response(data=[comment])

    @staticmethod
    def delete_comment(db: Session, comment: models.Comment):
        crud.comment.remove(db, comment)
        return schemas.Response(data=[comment])

    @staticmethod
    def read_post_comments(post: models.Post):
        comments = post.comments
        return schemas.Response(data=comments)

    @staticmethod
    def upvote_comment(db: Session, user: models.User, comment: models.Comment) -> schemas.Response:
        vote = schemas.CommentUpvote(id=str(uuid.uuid4()), user_id=user.id, comment_id=comment.id)
        vote_db = crud.comment_vote.get_by_multi_attribute(db, [user.id, comment.id], ["user_id", "comment_id"])
        if vote_db:
            obj = crud.comment_vote.remove(db, vote_db)
            if vote_db.vote_id != vote.vote_id:
                obj = crud.comment_vote.create(db, vote)
        else:
            obj = crud.comment_vote.create(db, vote)

        return schemas.Response(data=[obj.id])

    @staticmethod
    def downvote_comment(db: Session, user: models.User, comment: models.Comment) -> schemas.Response:
        vote = schemas.CommentDownvote(id=str(uuid.uuid4()), user_id=user.id, comment_id=comment.id)
        vote_db = crud.comment_vote.get_by_multi_attribute(db, [user.id, comment.id], ["user_id", "comment_id"])
        if vote_db:
            obj = crud.comment_vote.remove(db, vote_db)
            if vote_db.vote_id != vote.vote_id:
                obj = crud.comment_vote.create(db, vote)
        else:
            obj = crud.comment_vote.create(db, vote)

        return schemas.Response(data=[obj.id])


comment_controller = CommentController()
