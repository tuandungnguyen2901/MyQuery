import logging.config
import uuid
from typing import List

from sqlalchemy.orm import Session

from src import models, schemas, crud
from src.core.const import string, status
from src.core.error_handler import WebException

logger = logging.getLogger(__name__)


class TagController:
    @staticmethod
    def read_all_tags(db: Session) -> schemas.Response:
        tags = crud.tag.get_multi(db)
        return schemas.Response(data=tags)

    @staticmethod
    def tag_post(db: Session, post: models.Post, tags_list: List[str]):
        post_tags = [post_tag.tag.id for post_tag in post.tags]
        if not tags_list:
            for tag_id in post_tags:
                remove_tag = crud.post_tag.get_by_multi_attribute(db, [tag_id, post.id], ["tag_id", "post_id"])
                crud.post_tag.remove(db, remove_tag)
        else:
            all_tags = crud.tag.get_multi(db)
            all_tags_dict = {tag.type: tag.id for tag in all_tags}
            for tag_type in tags_list:
                if tag_type not in all_tags_dict.keys():
                    raise WebException(err=tag_type + ": " + string.TAG_NOT_FOUND, err_status=status.ERR0003)
            list_tag_ids = [all_tags_dict.get(tag_type) for tag_type in tags_list]
            for tag_id in list_tag_ids:
                if tag_id not in post_tags:
                    crud.post_tag.create(db, schemas.PostTag(
                        id=str(uuid.uuid4()), post_id=post.id, tag_id=tag_id))
                else:
                    post_tags.remove(tag_id)
            if post_tags:
                for tag_id in post_tags:
                    remove_tag = crud.post_tag.get_by_multi_attribute(db, [tag_id, post.id], ["tag_id", "post_id"])
                    crud.post_tag.remove(db, remove_tag)
        return schemas.Response(data=post.tags)

    @staticmethod
    def tag_instructor(db: Session, instructor: models.Instructor, tags_list: List[str]):
        instructor_tags = [instructor_tag.tag.id for instructor_tag in instructor.tags]
        if not tags_list:
            for tag_id in instructor_tags:
                remove_tag = crud.instructor_tag.get_by_multi_attribute(db, [tag_id, instructor.id], ["tag_id", "instructor_id"])
                crud.instructor_tag.remove(db, remove_tag)
        else:
            all_tags = crud.tag.get_multi(db)
            all_tags_dict = {tag.type: tag.id for tag in all_tags}
            for tag_type in tags_list:
                if tag_type not in all_tags_dict.keys():
                    raise WebException(err=tag_type + ": " + string.TAG_NOT_FOUND, err_status=status.ERR0003)
            list_tag_ids = [all_tags_dict.get(tag_type) for tag_type in tags_list]
            for tag_id in list_tag_ids:
                if tag_id not in instructor_tags:
                    crud.instructor_tag.create(db, schemas.InstructorTag(
                        id=str(uuid.uuid4()), instructor_id=instructor.id, tag_id=tag_id))
                else:
                    instructor_tags.remove(tag_id)
            if instructor_tags:
                for tag_id in instructor_tags:
                    remove_tag = crud.instructor_tag.get_by_multi_attribute(db, [tag_id, instructor.id],
                                                                            ["tag_id", "instructor_id"])
                    crud.instructor_tag.remove(db, remove_tag)
        return schemas.Response(data=instructor.tags)


tag_controller = TagController()
