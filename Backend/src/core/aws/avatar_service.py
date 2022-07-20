import os
from datetime import datetime

from fastapi import UploadFile

from src.core.aws import S3Events
from src.core.setting import settings


class Avatar:
    def __init__(self, avatar: UploadFile = None, s3_session: S3Events = None) -> None:
        self.s3_session = s3_session
        self.avatar_link = f"https://{settings.S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/avatar_default.jpeg"
        if avatar:
            self.create(avatar)

    def create(self, avatar: UploadFile) -> None:
        img_id = str(datetime.now().timestamp()).replace('.', '')
        file_extension = os.path.splitext(avatar.filename)[1]
        key = f"{settings.S3_KEY}{img_id}{file_extension}"
        if self.s3_session.upload_fileobj(avatar, key=key):  # type: ignore
            self.avatar_link = f"https://{settings.S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

    def delete(self, key: str = None) -> None:
        self.s3_session.delete_fileobj(key)  # type: ignore
