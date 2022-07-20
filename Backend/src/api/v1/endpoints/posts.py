import logging.config
from typing import List

from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session

from src import schemas, controllers, models
from src.api import dependencies
from src.api.v1.router_config import ENDPOINT

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(ENDPOINT.add_post, response_model=schemas.Response)
def create_post(
        *,
        db: Session = Depends(dependencies.get_db),
        current_user: models.User = Depends(dependencies.get_current_user),
        post_create: schemas.PostCreate,
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.add_post}")
    return controllers.post.create_post(db, current_user, post_create)


@router.get(ENDPOINT.read_post, response_model=schemas.Response)
def read_post(
        post: models.Post = Depends(dependencies.check_post_id_get),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.read_post}")
    return controllers.post.read_post(post)


@router.put(ENDPOINT.edit_post, response_model=schemas.Response)
def update_post(
        db: Session = Depends(dependencies.get_db),
        post: models.Post = Depends(dependencies.check_user_post_id),
        post_update: schemas.PostUpdate = Depends(schemas.PostUpdate)
) -> schemas.Response:
    logger.info(f"API call: [PUT] {ENDPOINT.edit_post}")
    return controllers.post.update_post(db, post_update, post)


@router.delete(ENDPOINT.delete_post, response_model=schemas.Response)
def delete_post(
        db: Session = Depends(dependencies.get_db),
        post: models.Post = Depends(dependencies.check_user_post_id),
) -> schemas.Response:
    logger.info(f"API call: [DELETE] {ENDPOINT.delete_post}")
    return controllers.post.delete_post(db, post)


@router.get(ENDPOINT.read_all_posts, response_model=schemas.Response)
def read_all_posts(
        db: Session = Depends(dependencies.get_db),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.read_all_posts}")
    return controllers.post.read_all_posts(db)


@router.get(ENDPOINT.read_all_saved_posts, response_model=schemas.Response)
def read_all_saved_posts(
        db: Session = Depends(dependencies.get_db),
        user: models.User = Depends(dependencies.get_current_user),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.read_all_saved_posts}")
    return controllers.post.read_all_saved_posts(db, user)


@router.get(ENDPOINT.read_user_posts, response_model=schemas.Response)
def read_user_posts(
        user: models.User = Depends(dependencies.check_user_id),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.read_user_posts}")
    return controllers.post.read_user_posts(user)


@router.post(ENDPOINT.upvote_post, response_model=schemas.Response)
def upvote_post(
        db: Session = Depends(dependencies.get_db),
        user: models.User = Depends(dependencies.get_current_user),
        post: models.Post = Depends(dependencies.check_post_id),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.upvote_post}")
    return controllers.post.upvote_post(db, user, post)


@router.post(ENDPOINT.downvote_post, response_model=schemas.Response)
def downvote_post(
        db: Session = Depends(dependencies.get_db),
        user: models.User = Depends(dependencies.get_current_user),
        post: models.Post = Depends(dependencies.check_post_id),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.downvote_post}")
    return controllers.post.downvote_post(db, user, post)


@router.post(ENDPOINT.search_post, response_model=schemas.Response)
def search_post(
        db: Session = Depends(dependencies.get_db),
        search_str: List[str] = Body(default=[]),
        filter_tags: List[str] = Body(default=[])
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.search_post}")
    return controllers.post.search_post(db, search_str, filter_tags)


@router.post(ENDPOINT.save_post, response_model=schemas.Response)
def save_post(
        db: Session = Depends(dependencies.get_db),
        current_user: models.User = Depends(dependencies.get_current_user),
        post: models.Post = Depends(dependencies.check_post_id),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.save_post}")
    return controllers.post.save_post(db, current_user, post)


@router.post(ENDPOINT.get_post_by_tag, response_model=schemas.Response)
def get_post_by_tag(
        db: Session = Depends(dependencies.get_db),
        filter_tags: List[str] = Body(default=[]),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.save_post}")
    return controllers.post.get_post_by_tag(db, filter_tags)
