from datetime import datetime
from typing import Optional

from fastapi import Body
from pydantic import BaseModel


def as_body_update(cls):
    cls.__signature__ = cls.__signature__.replace(
        parameters=[arg.replace(default=Body(...)) for arg in cls.__signature__.parameters.values()]
    )
    return cls


class Comment(BaseModel):
    id: str
    user_id: str
    post_id: str
    content: str
    created_at: datetime


@as_body_update
class CommentCreate(BaseModel):
    content: str
    created_at: str


@as_body_update
class CommentUpdate(BaseModel):
    content: Optional[str]
