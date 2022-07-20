import uuid

from pydantic.main import BaseModel


class Tag(BaseModel):
    id: str = uuid.uuid4()
    tag_id: str


class PostTag(Tag):
    post_id: str


class InstructorTag(Tag):
    instructor_id: str
