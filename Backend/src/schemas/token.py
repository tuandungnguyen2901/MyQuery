import uuid

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str


class BlackListToken(BaseModel):
    id: str = uuid.uuid4()
    token: str


class PasswordResetToken(BaseModel):
    id: str = uuid.uuid4()
    token: str
