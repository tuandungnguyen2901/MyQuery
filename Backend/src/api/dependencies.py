import logging.config
from typing import Generator

from fastapi import Depends, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from src import crud, models, schemas
from src.core import security
from src.core.const import string, status
from src.core.error_handler import WebException
from src.core.setting import settings
from src.database.db_init import SessionLocal

reusable_oauth2 = HTTPBearer(
    scheme_name='Authorization'
)
logger = logging.getLogger(__name__)


def get_db() -> Generator:  # type: ignore
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
        db: Session = Depends(get_db),
        token: HTTPAuthorizationCredentials = Depends(reusable_oauth2)
) -> models.User:
    try:
        if crud.blacklist_token.get_by_attribute(db, token.credentials, 'token'):
            raise WebException(err=string.BLACKLIST_TOKEN, err_status=status.ERR0002)
        payload = jwt.decode(token.credentials, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
    except (jwt.JWTError, ValidationError):
        logger.error("Token invalid")
        raise WebException(err=string.INVALID_TOKEN, err_status=status.ERR0005)

    user = crud.user.get(db, payload["sub"])
    if not user:
        logger.debug("User not found")
        raise WebException(err=string.USER_NOT_FOUND, err_status=status.ERR0003)

    return user


def check_user_id(
        user_id: str,
        db: Session = Depends(get_db),
) -> models.User:
    user = crud.user.get(db, user_id)
    if not user:
        raise WebException(err=string.USER_NOT_FOUND, err_status=status.ERR0003)
    return user


def check_instructor_id(
        instructor: models.User = Depends(check_user_id),
) -> models.User:
    if not instructor.account_type == schemas.AccountType.INSTRUCTOR.value:
        raise WebException(err=string.INVALID_USER, err_status=status.ERR0005)
    return instructor


def check_comment_id_get(
        comment_id: str,
        db: Session = Depends(get_db),
) -> models.Post:
    comment = crud.comment.get(db, comment_id)
    if not comment:
        raise WebException(err=string.COMMENT_NOT_FOUND, err_status=status.ERR0003)
    return comment


def check_comment_id(
        comment_id: str = Body(...),
        db: Session = Depends(get_db),
) -> models.Post:
    comment = crud.comment.get(db, comment_id)
    if not comment:
        raise WebException(err=string.COMMENT_NOT_FOUND, err_status=status.ERR0003)
    return comment


def check_user_comment_id(
        comment: models.Comment = Depends(check_comment_id),
        current_user: models.User = Depends(get_current_user),
) -> models.Comment:
    if comment.id not in [comment.id for comment in current_user.comments]:
        raise WebException(err=string.INVALID_COMMENT, err_status=status.ERR0005)
    return comment


def check_post_id_get(
        post_id: str,
        db: Session = Depends(get_db),
) -> models.Post:
    post = crud.post.get(db, post_id)
    if not post:
        raise WebException(err=string.POST_NOT_FOUND, err_status=status.ERR0003)
    return post


def check_post_id(
        post_id: str = Body(...),
        db: Session = Depends(get_db),
) -> models.Post:
    post = crud.post.get(db, post_id)
    if not post:
        raise WebException(err=string.POST_NOT_FOUND, err_status=status.ERR0003)
    return post


def check_user_post_id(
        current_user: models.User = Depends(get_current_user),
        post: models.Post = Depends(check_post_id),
) -> models.Post:
    if post.id not in [post.id for post in current_user.posts]:
        raise WebException(err=string.INVALID_POST, err_status=status.ERR0005)
    return post


def check_instructor_account(
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_user),
) -> models.Instructor:
    if current_user.account_type != schemas.AccountType.INSTRUCTOR.value:
        raise WebException(err=string.INVALID_ACCOUNT_TYPE, err_status=status.ERR0005)
    instructor = crud.instructor.get(db, current_user.id)
    return instructor
