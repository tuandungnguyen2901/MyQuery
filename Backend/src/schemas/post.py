from datetime import datetime
from typing import Optional

from fastapi import Body
from pydantic import BaseModel


def as_body_update(cls):
    cls.__signature__ = cls.__signature__.replace(
        parameters=[arg.replace(default=Body(None)) for arg in cls.__signature__.parameters.values()]
    )
    return cls


class Post(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    image_url: str = None
    created_at: datetime


class PostCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str]
    created_at: str


@as_body_update
class PostUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]
    image_url: Optional[str]


class PostSaved(BaseModel):
    id: str
    user_id: str
    post_id: str
