import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, Optional

import emails
from emails.template import JinjaTemplate
from jose import jwt

from src.core.error_handler import WebException
from src.core.setting import settings


def send_email(
        environment: Dict[str, Any],
        email_to: str,
        subject_template: str = "",
        html_template: str = ""
) -> None:
    assert settings.EMAILS_ENABLED, "no provided configuration for email variables"
    message = emails.Message(
        subject=JinjaTemplate(subject_template),
        html=JinjaTemplate(html_template),
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD
    response = message.send(to=email_to, render=environment, smtp=smtp_options)
    logging.info(f"send email result: {response}")


def send_test_email(email_to: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Test email"
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "test_email.html") as f:
        template_str = f.read()
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={"project_name": settings.PROJECT_NAME, "email": email_to},
    )


def send_reset_password_email(email_to: str, email: str, token: str) -> None:
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "reset_password.html") as f:
        template_str = f.read()
    send_email(
        email_to=email_to,
        subject_template=f"{settings.PROJECT_NAME} - Password recovery for user {email}",
        html_template=template_str,
        environment={
            "project_name": settings.PROJECT_NAME,
            "username": email_to,
            "email": email_to,
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": f"{settings.CLIENT_HOST}/reset-password?token={token}",
        },
    )


def send_new_account_email(email_to: str, token: str) -> None:
    with open(Path(settings.EMAIL_TEMPLATES_DIR) / "new_account.html") as f:
        template_str = f.read()
    send_email(
        email_to=email_to,
        subject_template=f"{settings.PROJECT_NAME} - New account for user {email_to}",
        html_template=template_str,
        environment={
            "project_name": settings.PROJECT_NAME,
            "username": email_to,
            "email": email_to,
            "link": f"{settings.CLIENT_HOST}/confirm-email?token={token}",
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
        },
    )


def generate_token(email: str, expire_hour) -> str:
    now = datetime.utcnow()
    expires = now + timedelta(hours=expire_hour)
    encoded_jwt: str = jwt.encode({"exp": expires.timestamp(), "nbf": now, "sub": email}, settings.SECRET_KEY,
                                  algorithm="HS256")
    return encoded_jwt


def verify_password_reset_token(token: str) -> Optional[str]:
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.JWTError as e:
        raise WebException(err=str(e))
    return decoded_token["sub"]  # type: ignore
