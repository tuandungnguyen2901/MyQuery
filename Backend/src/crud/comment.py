import logging.config

from src.crud.base import CRUDBase
from src.models.comment import Comment
from src.schemas.comment import Comment as CommentCreateSchema, CommentUpdate as CommentUpdateSchema

logger = logging.getLogger(__name__)


class CRUDComment(CRUDBase[Comment, CommentCreateSchema, CommentUpdateSchema]):
    pass


comment = CRUDComment(Comment)
