from sqlalchemy import Column, CHAR, TIMESTAMP, func, ForeignKey

from .base_model import Base


class PostSaved(Base):
    __tablename__ = "saved_posts"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    user_id = Column(ForeignKey('users.id', ondelete="CASCADE"))
    post_id = Column(ForeignKey('posts.id', ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
