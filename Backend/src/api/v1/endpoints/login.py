import logging.config

from fastapi import APIRouter, Depends, Body
from fastapi.security import HTTPAuthorizationCredentials
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session
from starlette.requests import Request

from src import schemas, controllers
from src.api import dependencies
from src.api.v1.router_config import ENDPOINT

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post(ENDPOINT.login)
def login(
        db: Session = Depends(dependencies.get_db),
        email: EmailStr = Body(...),
        password: str = Body(...),
        registry_by: schemas.RegistryType = Body(...),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.login}")
    return controllers.auth.login(db, email, password, registry_by)


@router.post(ENDPOINT.logout, response_model=schemas.Response)
def logout(
        db: Session = Depends(dependencies.get_db),
        auth_token: HTTPAuthorizationCredentials = Depends(dependencies.reusable_oauth2)  # type: ignore
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.logout}")
    return controllers.auth.logout(db, auth_token.credentials)


@router.get(ENDPOINT.password_recover, response_model=schemas.Response)
async def password_recover(
        *, db: Session = Depends(dependencies.get_db),
        email: str
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.password_recover}")
    return await controllers.auth.password_recover(email, db)


@router.post(ENDPOINT.reset_password, response_model=schemas.Response)
def reset_password(
        db: Session = Depends(dependencies.get_db),
        token: str = Body(...),
        new_password: str = Body(...),
) -> schemas.Response:
    logger.info(f"API call: [POST] {ENDPOINT.reset_password}")
    return controllers.auth.reset_password(db, token, new_password)


@router.post(ENDPOINT.confirm_email, response_model=schemas.Response)
def confirm_user(
        db: Session = Depends(dependencies.get_db),
        token: str = Body(...),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.confirm_email}")
    return controllers.auth.confirm_email(db, token)


@router.get(ENDPOINT.resend_confirm_token, response_model=schemas.Response)
async def resend_confirmation(
        *, db: Session = Depends(dependencies.get_db),
        email: str,
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.resend_confirm_token}")
    return await controllers.auth.resend_confirmation(db, email)


@router.get(ENDPOINT.oauth_login + "/{login_type}")
async def oauth_login(request: Request, login_type: schemas.RegistryType):  # type: ignore
    logger.info(f"API call: [GET] {ENDPOINT.oauth_login}/{login_type}")
    return await controllers.auth.oauth_login(request, login_type.value)


@router.get(ENDPOINT.auth + "/{login_type}")
async def auth(
        request: Request, login_type: schemas.RegistryType,
        db: Session = Depends(dependencies.get_db),
) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.auth}/{login_type}")
    return await controllers.auth.auth(request, login_type.value, db)


@router.get(ENDPOINT.oauth_logout)
async def oauth_logout(request: Request) -> schemas.Response:
    logger.info(f"API call: [GET] {ENDPOINT.auth}")
    return controllers.auth.oauth_logout(request)
