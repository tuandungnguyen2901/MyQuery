from sqlalchemy import Column, CHAR, TIMESTAMP, func, ForeignKey, String
from sqlalchemy.orm import relationship

from .base_model import Base


class Comment(Base):
    __tablename__ = "comments"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    user_id = Column(ForeignKey('users.id', ondelete="CASCADE"))
    post_id = Column(ForeignKey('posts.id', ondelete="CASCADE"))
    content = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    votes = relationship("CommentVote")
