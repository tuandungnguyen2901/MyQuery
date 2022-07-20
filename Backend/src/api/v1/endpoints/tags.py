import logging.config
from typing import List

from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session

from src import schemas, controllers, models
from src.api import dependencies
from src.api.v1.router_config import ENDPOINT

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get(ENDPOINT.read_all_tags, response_model=schemas.Response)
def read_all_tags(
        db: Session = Depends(dependencies.get_db),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.read_all_tags}")
    return controllers.tag.read_all_tags(db)


@router.post(ENDPOINT.tag_post, response_model=schemas.Response)
def tag_post(
        db: Session = Depends(dependencies.get_db),
        post: models.Post = Depends(dependencies.check_user_post_id),
        tags: List[str] = Body(default=[]),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.tag_post}")
    return controllers.tag.tag_post(db, post, tags)


@router.post(ENDPOINT.tag_instructor, response_model=schemas.Response)
def tag_instructor(
        db: Session = Depends(dependencies.get_db),
        instructor: models.Instructor = Depends(dependencies.check_instructor_account),
        tags: List[str] = Body(default=[]),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.tag_instructor}")
    return controllers.tag.tag_instructor(db, instructor, tags)
