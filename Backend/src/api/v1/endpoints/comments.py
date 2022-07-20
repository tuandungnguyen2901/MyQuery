import logging.config

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src import schemas, controllers, models
from src.api import dependencies
from src.api.v1.router_config import ENDPOINT

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(ENDPOINT.add_comment, response_model=schemas.Response)
def create_comment(
        db: Session = Depends(dependencies.get_db),
        current_user: models.User = Depends(dependencies.get_current_user),
        post: models.Post = Depends(dependencies.check_post_id),
        comment_create: schemas.CommentCreate = Depends(schemas.CommentCreate),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.add_comment}")
    return controllers.comment.create_comment(db, current_user, post, comment_create)


@router.get(ENDPOINT.read_comment, response_model=schemas.Response)
def read_comment(comment: models.Comment = Depends(dependencies.check_comment_id_get)) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.read_comment}")
    return controllers.comment.read_comment(comment)


@router.put(ENDPOINT.edit_comment, response_model=schemas.Response)
def update_comment(
        db: Session = Depends(dependencies.get_db),
        comment: models.Comment = Depends(dependencies.check_user_comment_id),
        comment_update: schemas.CommentUpdate = Depends(schemas.CommentUpdate)
) -> schemas.Response:
    logger.info(f"API call: [PUT] {ENDPOINT.edit_comment}")
    return controllers.comment.update_comment(db, comment_update, comment)


@router.delete(ENDPOINT.delete_comment, response_model=schemas.Response)
def delete_comment(
        db: Session = Depends(dependencies.get_db),
        comment: models.Comment = Depends(dependencies.check_user_comment_id),
) -> schemas.Response:
    logger.info(f"API call: [DELETE] {ENDPOINT.delete_comment}")
    return controllers.comment.delete_comment(db, comment)


@router.get(ENDPOINT.read_post_comments, response_model=schemas.Response)
def read_post_comments(
        post: models.Post = Depends(dependencies.check_post_id_get)
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.read_post_comments}")
    return controllers.comment.read_post_comments(post)


@router.post(ENDPOINT.upvote_comment, response_model=schemas.Response)
def upvote_comment(
        db: Session = Depends(dependencies.get_db),
        user: models.User = Depends(dependencies.get_current_user),
        comment: models.Comment = Depends(dependencies.check_comment_id),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.upvote_comment}")
    return controllers.comment.upvote_comment(db, user, comment)


@router.post(ENDPOINT.downvote_comment, response_model=schemas.Response)
def downvote_comment(
        db: Session = Depends(dependencies.get_db),
        user: models.User = Depends(dependencies.get_current_user),
        comment: models.Comment = Depends(dependencies.check_comment_id),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.downvote_comment}")
    return controllers.comment.downvote_comment(db, user, comment)
