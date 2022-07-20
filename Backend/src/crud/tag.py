import logging.config

from src.crud.base import CRUDBase
from src.models.instructor_tag import InstructorTag
from src.models.post_tag import PostTag
from src.models.tag import Tag
from src.schemas.tag import Tag as TagCreateSchema, \
    PostTag as PostTagCreateSchema, \
    InstructorTag as InstructorTagCreateSchema

logger = logging.getLogger(__name__)


class CRUDTag(CRUDBase[Tag, TagCreateSchema, TagCreateSchema]):
    pass


class CRUDPostTag(CRUDBase[PostTag, PostTagCreateSchema, PostTag]):
    pass


class CRUDInstructorTag(CRUDBase[InstructorTag, InstructorTagCreateSchema, InstructorTagCreateSchema]):
    pass


tag = CRUDTag(Tag)
post_tag = CRUDPostTag(PostTag)
instructor_tag = CRUDInstructorTag(InstructorTag)
