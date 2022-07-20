from sqlalchemy import Column, CHAR, TIMESTAMP, func, ForeignKey, BOOLEAN
from sqlalchemy.orm import relationship

from .base_model import Base


class PostVote(Base):
    __tablename__ = "post_votes"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    user_id = Column(ForeignKey('users.id', ondelete="CASCADE"))
    vote_id = Column(ForeignKey('votes.id', ondelete="CASCADE"))
    post_id = Column(ForeignKey('posts.id', ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    vote = relationship("Vote")