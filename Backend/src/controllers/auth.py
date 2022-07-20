import logging.config
from datetime import timedelta, datetime
from typing import Any

from authlib.integrations.base_client import OAuthError
from jose import jwt
from sqlalchemy.orm import Session
from starlette.background import BackgroundTask
from starlette.requests import Request

from src import schemas, models, crud, controllers
from src.core.authlib.auth_services import oauth
from src.core.const import string, status
from src.core.error_handler import WebException
from src.core.security import verify_password, create_access_token, get_password_hash
from src.core.setting import settings
from src.core.utils import send_reset_password_email, verify_password_reset_token, send_new_account_email, \
    generate_token

logger = logging.getLogger(__name__)


def authenticate(db: Session, email: str, password: str, registry_by: str) -> models.User:
    user = crud.user.get_user(db, email, registry_by)
    if not user:
        logger.debug(f"Error: {string.USER_NOT_FOUND}")
        raise WebException(err=string.USER_NOT_FOUND, err_status=status.ERR0003)
    if not verify_password(password, user.password):
        logger.debug(f"Error: {string.INCORRECT_PASSWORD}")
        raise WebException(err=string.INCORRECT_PASSWORD, err_status=status.ERR0005)
    if not user.activated_at:
        logger.debug(f"Error: {string.EMAIL_NOT_CONFIRM}")
        raise WebException(err=string.EMAIL_NOT_CONFIRM, err_status=status.ERR0007)
    return user


def decode_auth_token(db: Session, auth_token: str) -> Any:
    try:
        payload = jwt.decode(auth_token, settings.SECRET_KEY)
        # check whether auth token has been blacklisted
        if crud.blacklist_token.get_by_attribute(db, auth_token, 'token'):
            logger.debug(f"Error: {string.BLACKLIST_TOKEN}")
            raise WebException(err=string.BLACKLIST_TOKEN, err_status=status.ERR0002)
    except jwt.ExpiredSignatureError:
        logger.error(f"Error: {string.EXPIRED_TOKEN}")
        raise WebException(err=string.EXPIRED_TOKEN, err_status=status.ERR0006)
    return payload['sub']


class AuthController:
    @staticmethod
    def login(db: Session, email: str, password: str, registry_by: str) -> schemas.Response:
        user = authenticate(db, email, password, registry_by)
        if user.deactivated_at:
            logger.debug(f"Error: {string.USER_DEACTIVATED}")
            raise WebException(err=string.USER_DEACTIVATED, err_status=status.ERR0008)
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        while True:
            access_token = create_access_token(user.id, expires_delta=access_token_expires)
            if not crud.blacklist_token.get_by_attribute(db, access_token, 'token'):
                break
        return schemas.Response(data=[schemas.Token(access_token=access_token, token_type="bearer", user_id=user.id)])

    @staticmethod
    def logout(db: Session, auth_token: str) -> schemas.Response:
        if not auth_token:
            logger.debug(f"Error: {string.INVALID_TOKEN}")
            raise WebException(err=string.INVALID_TOKEN, err_status=status.ERR0005)
        decode_auth_token(db, auth_token)
        crud.blacklist_token.create(db, schemas.BlackListToken(token=auth_token))
        return schemas.Response()

    @staticmethod
    async def password_recover(email: str, db: Session) -> schemas.Response:
        user = crud.user.get_user(db, email, 'email')
        if not user:
            logger.debug(f"Error: {string.USER_NOT_FOUND}")
            raise WebException(err=string.USER_NOT_FOUND, err_status=status.ERR0003)

        password_reset_token = generate_token(user.id, settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
        crud.password_reset.create(db, schemas.PasswordResetToken(token=password_reset_token))
        task = BackgroundTask(send_reset_password_email, user.email, settings.EMAILS_FROM_EMAIL, password_reset_token)
        await task()
        return schemas.Response(message=string.PASSWORD_RESET_EMAIL_SENT)

    @staticmethod
    def reset_password(db: Session, token: str, new_password: str) -> schemas.Response:
        if not crud.password_reset.get_by_attribute(db, token, 'token'):
            logger.debug(f"Error: {string.TOKEN_NOT_FOUND}")
            raise WebException(err=string.TOKEN_NOT_FOUND, err_status=status.ERR0003)
        crud.password_reset.remove_by_attribute(db, token, 'token')
        user_id = verify_password_reset_token(token)
        if not user_id:
            logger.debug(f"Error: {string.INVALID_TOKEN}")
            raise WebException(err=string.INVALID_TOKEN, err_status=status.ERR0005)
        user = crud.user.get(db, user_id)
        if not user:
            logger.debug(f"Error: {string.USER_NOT_FOUND}")
            raise WebException(err=string.USER_NOT_FOUND, err_status=status.ERR0003)
        crud.user.update(db, user, {"password": get_password_hash(new_password).decode('utf-8')})
        return schemas.Response(data=[user.id])

    @staticmethod
    def change_password(db: Session, user: models.User, new_password: str) -> schemas.Response:
        crud.user.update(db, user, {"password": get_password_hash(new_password).decode('utf-8')})
        return schemas.Response(data=[user.id])

    @staticmethod
    def confirm_email(db: Session, token: str) -> schemas.Response:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
        except jwt.ExpiredSignatureError:
            logger.error(f"Error: {string.EXPIRED_TOKEN}")
            raise WebException(err=string.EXPIRED_TOKEN, err_status=status.ERR0006)

        user = crud.user.get(db, payload['sub'])
        if not user:
            logger.debug(f"Error: {string.INVALID_TOKEN}")
            raise WebException(err=string.INVALID_TOKEN, err_status=status.ERR0005)
        if user.activated_at:
            logger.debug(f"Error: {string.EMAIL_CONFIRM}")
            return schemas.Response(message=string.EMAIL_CONFIRM)
        crud.user.update(db, user, {'activated_at': datetime.now()})
        return schemas.Response(message=string.EMAIL_CONFIRM)

    @staticmethod
    async def resend_confirmation(db: Session, email: str) -> schemas.Response:
        user = crud.user.get(db, email, 'email')
        if not user:
            logger.debug(f"Error: {string.USER_NOT_FOUND}")
            raise WebException(err=string.USER_NOT_FOUND, err_status=status.ERR0003)
        if user.activated_at:
            logger.debug(f"Error: {string.EMAIL_CONFIRM}")
            raise WebException(err=string.EMAIL_CONFIRM, err_status=status.ERR0004)
        confirmation_token = generate_token(email, settings.EMAIL_CONFIRMATION_TOKEN_EXPIRE_HOURS)
        task = BackgroundTask(send_new_account_email, email, settings.EMAILS_FROM_EMAIL, confirmation_token)
        await task()
        return schemas.Response(message=string.EMAIL_RESEND)

    @staticmethod
    async def oauth_login(request: Request, login_type: str) -> Any:
        redirect_uri = request.url_for("auth", **{"login_type": login_type})
        return await getattr(oauth, login_type).authorize_redirect(request, redirect_uri)

    async def auth(self, request: Request, login_type: str, db: Session) -> schemas.Response:
        try:
            token = await getattr(oauth, login_type).authorize_access_token(request)
        except OAuthError as error:
            raise WebException(err=error.error)
        data = token.get('userinfo')
        if login_type == schemas.RegistryType.GOOGLE.value:
            data = dict(data)
            request.session['user'] = data
            password = data["sub"]
            email = data["email"]
            name = data["name"]

        user = crud.user.get_user(db, email, login_type)
        if not user:
            last_name = " ".join(name.split(" ")[1:])
            first_name = name.split(" ")[0]
            user_base = schemas.UserCreate(first_name=first_name, last_name=last_name, email=email)
            await controllers.user.create_user(db, user_base, password, login_type, None)

        return self.login(db, email, password, login_type)

    @staticmethod
    def oauth_logout(request: Request) -> schemas.Response:
        request.session.pop('user', None)
        return schemas.Response()


auth_controller = AuthController()
