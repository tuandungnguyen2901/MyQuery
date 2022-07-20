import logging.config

from src.crud.base import CRUDBase
from src.models.post import Post
from src.models.post_saved import PostSaved
from src.schemas.post import Post as PostCreateSchema, PostUpdate as PostUpdateSchema, \
    PostSaved as PostSavedCreateSchema

logger = logging.getLogger(__name__)


class CRUDPost(CRUDBase[Post, PostCreateSchema, PostUpdateSchema]):
    pass


class CRUDPostSaved(CRUDBase[PostSaved, PostSavedCreateSchema, PostSavedCreateSchema]):
    pass


post = CRUDPost(Post)
post_saved = CRUDPostSaved(PostSaved)
