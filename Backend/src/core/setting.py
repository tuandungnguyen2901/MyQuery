from os.path import join, dirname
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, BaseSettings, EmailStr, validator
from starlette.config import Config


class Settings(BaseSettings):
    config = Config(join(dirname(__file__), "../../.env.backend"))

    # PROJECT CONFIG
    STAGE: str = config("STAGE", cast=str, default="local")
    PROJECT_NAME: str = config("APP_NAME", cast=str, default="web_programming")
    HTTP_PORT: int = config("HTTP_PORT", cast=int, default=5000)
    SERVER_NAME: str = "web_programming"
    CLIENT_HOST: AnyHttpUrl = config("CLIENT_HOST", cast=str, default=f"http://localhost:{HTTP_PORT}")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 60 minutes * 24 hours * 8 days = 8 days
    SECRET_KEY: str = config("SECRET_KEY", cast=str, default="web_programming@123")
    LOG_LEVEL: str = config("LOG_LEVEL", cast=str, default="INFO")

    NUM_WORKER: int = config("NUM_WORKER", cast=int, default=1)
    IS_DEBUG: bool = config("IS_DEBUG", cast=bool, default=True)

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # EMAIL
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = config("SMTP_PORT", cast=int, default=25)
    SMTP_HOST: Optional[str] = config("SMTP_HOST", cast=str, default=None)
    SMTP_USER: Optional[str] = config("SMTP_USER", cast=str, default=None)
    SMTP_PASSWORD: Optional[str] = config("SMTP_PASSWORD", cast=str, default=None)
    EMAILS_FROM_EMAIL: Optional[EmailStr] = config("EMAILS_FROM_EMAIL", cast=EmailStr, default=None)
    EMAILS_FROM_NAME: Optional[str] = config("EMAILS_FROM_NAME", cast=str, default=None)

    @validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if not v:
            return values["PROJECT_NAME"]
        return v

    EMAIL_CONFIRMATION_TOKEN_EXPIRE_HOURS: int = 24
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = join(dirname(__file__), "../templates/email-templates/build")
    EMAILS_ENABLED: bool = True

    @validator("EMAILS_ENABLED", pre=True)
    def get_emails_enabled(cls, v: bool, values: Dict[str, Any]) -> bool:
        return bool(
            values.get("SMTP_HOST") and values.get("SMTP_PORT") and values.get("EMAILS_FROM_EMAIL")
        )

    # STORAGE
    AWS_ACCESS_KEY_ID: Optional[str] = config("AWS_ACCESS_KEY_ID", cast=str, default=None)
    AWS_SECRET_ACCESS_KEY: Optional[str] = config("AWS_SECRET_ACCESS_KEY", cast=str, default=None)
    AWS_REGION: Optional[str] = config("AWS_REGION", cast=str, default=None)
    S3_BUCKET: Optional[str] = config("S3_BUCKET", cast=str, default=None)
    S3_KEY: Optional[str] = config("S3_KEY", cast=str, default=None)

    # DATABASE
    USERNAME_DB: str = config("USERNAME_DB", cast=str, default="web_programming")
    PASSWORD_DB: str = config("PASSWORD_DB", cast=str, default="web_programming")
    HOST_DB: str = config("HOST_DB", cast=str, default="postgres")
    PORT_DB: str = config("PORT_DB", cast=int, default=5432)
    NAME_DB: str = config("NAME_DB", cast=str, default="web_programming")

    # GOOGLE_AUTH
    GOOGLE_CLIENT_ID: str = config("GOOGLE_CLIENT_ID", cast=str, default=None)
    GOOGLE_CLIENT_SECRET: str = config("GOOGLE_CLIENT_SECRET", cast=str, default=None)

    # FACEBOOK_AUTH
    FACEBOOK_CLIENT_ID: str = config("FACEBOOK_CLIENT_ID", cast=str, default=None)
    FACEBOOK_CLIENT_SECRET: str = config("FACEBOOK_CLIENT_SECRET", cast=str, default=None)

    class Config:
        case_sensitive = True


settings = Settings()
