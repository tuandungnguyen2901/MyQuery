from sqlalchemy import Column, CHAR, TIMESTAMP, func, ForeignKey
from sqlalchemy.orm import relationship

from .base_model import Base


class CommentVote(Base):
    __tablename__ = "comment_votes"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    user_id = Column(ForeignKey('users.id', ondelete="CASCADE"))
    vote_id = Column(ForeignKey('votes.id', ondelete="CASCADE"))
    comment_id = Column(ForeignKey('comments.id', ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    vote = relationship("Vote")
