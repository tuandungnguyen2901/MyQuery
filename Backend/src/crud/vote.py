import logging.config

from src.crud.base import CRUDBase
from src.models.comment_vote import CommentVote
from src.models.post_vote import PostVote
from src.schemas.vote import CommentVote as CommentVoteCreateSchema
from src.schemas.vote import PostVote as PostVoteCreateSchema

logger = logging.getLogger(__name__)


class CRUDPostVote(CRUDBase[PostVote, PostVoteCreateSchema, PostVoteCreateSchema]):
    pass


class CRUDCommentVote(CRUDBase[CommentVote, CommentVoteCreateSchema, CommentVoteCreateSchema]):
    pass


post_vote = CRUDPostVote(PostVote)
comment_vote = CRUDCommentVote(CommentVote)
