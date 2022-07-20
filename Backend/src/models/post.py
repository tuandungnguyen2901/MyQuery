from sqlalchemy import Column, CHAR, TIMESTAMP, func, ForeignKey, String
from sqlalchemy.orm import relationship

from .base_model import Base


class Post(Base):
    __tablename__ = "posts"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    user_id = Column(ForeignKey('users.id', ondelete="CASCADE"))
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="posts")
    comments = relationship("Comment")
    votes = relationship("PostVote")
    tags = relationship("PostTag")
    saved_users = relationship("PostSaved")
