import logging.config
from typing import List

from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session

from src import schemas, controllers, models
from src.api import dependencies
from src.api.v1.router_config import ENDPOINT

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(ENDPOINT.add_user, response_model=schemas.Response)
async def create_user(
        db: Session = Depends(dependencies.get_db), *,
        user_create: schemas.UserCreate
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.add_user}")
    return await controllers.user.create_user(db, user_create)


@router.get(ENDPOINT.read_user, response_model=schemas.Response)
def read_user(
        db: Session = Depends(dependencies.get_db),
        user: models.User = Depends(dependencies.check_user_id),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.read_user}")
    return controllers.user.read_user(db, user)


@router.put(ENDPOINT.edit_user, response_model=schemas.Response)
def update_user(
        db: Session = Depends(dependencies.get_db),
        current_user: models.User = Depends(dependencies.get_current_user), *,
        user_update: schemas.UserUpdate,
) -> schemas.Response:
    logger.info(f"API call: [PUT] {ENDPOINT.edit_user}")
    return controllers.user.update_user(db, current_user, user_update)


@router.put(ENDPOINT.deactivate_user, response_model=schemas.Response)
def deactivate_user(
        db: Session = Depends(dependencies.get_db),
        current_user: models.User = Depends(dependencies.get_current_user)
) -> schemas.Response:
    logger.info(f"API call: [PUT] {ENDPOINT.deactivate_user}")
    return controllers.user.deactivate_user(db, current_user)


@router.put(ENDPOINT.reactivate_user, response_model=schemas.Response)
def reactivate_user(
        db: Session = Depends(dependencies.get_db),
        email: str = Body(...),
        password: str = Body(...),
        registry_by: schemas.RegistryType = Body(...)
) -> schemas.Response:
    logger.info(f"API call: [PUT] {ENDPOINT.reactivate_user}")
    return controllers.user.reactivate_user(db, email, password, registry_by.value)


@router.delete(ENDPOINT.delete_user, response_model=schemas.Response)
def delete_user(
        db: Session = Depends(dependencies.get_db),
        current_user: models.User = Depends(dependencies.get_current_user)
) -> schemas.Response:
    logger.info(f"API call: [DELETE] {ENDPOINT.delete_user}")
    return controllers.user.delete_user(db, current_user)


@router.get(ENDPOINT.read_all_instructors, response_model=schemas.Response)
def read_all_instructors(
        db: Session = Depends(dependencies.get_db),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.read_all_instructors}")
    return controllers.user.read_all_instructors(db)


@router.get(ENDPOINT.read_all_starred_instructors, response_model=schemas.Response)
def read_all_starred_instructors(
        db: Session = Depends(dependencies.get_db),
        user: models.User = Depends(dependencies.get_current_user),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.read_all_starred_instructors}")
    return controllers.user.read_all_starred_instructors(db, user)


@router.put(ENDPOINT.edit_instructor, response_model=schemas.Response)
def update_instructor(
        db: Session = Depends(dependencies.get_db),
        current_user: models.User = Depends(dependencies.get_current_user), *,
        instructor_update: schemas.InstructorUpdate,
) -> schemas.Response:
    logger.info(f"API call: [PUT] {ENDPOINT.edit_instructor}")
    return controllers.user.update_instructor(db, current_user, instructor_update)


@router.post(ENDPOINT.search_instructor, response_model=schemas.Response)
def search_instructor(
        db: Session = Depends(dependencies.get_db),
        search_str: List[str] = Body(default=[]),
        filter_tags: List[str] = Body(default=[])
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.search_instructor}")
    return controllers.user.search_instructor(db, search_str, filter_tags)


@router.post(ENDPOINT.star_instructor, response_model=schemas.Response)
def star_instructor(
        db: Session = Depends(dependencies.get_db),
        current_user: models.User = Depends(dependencies.get_current_user),
        instructor: models.User = Depends(dependencies.check_instructor_id),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.star_instructor}")
    return controllers.user.star_instructor(db, current_user, instructor)


@router.post(ENDPOINT.get_instructor_by_tag, response_model=schemas.Response)
def get_instructor_by_tag(
        db: Session = Depends(dependencies.get_db),
        filter_tags: List[str] = Body(default=[]),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.get_instructor_by_tag}")
    return controllers.user.get_instructor_by_tag(db, filter_tags)
