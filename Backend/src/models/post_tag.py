from sqlalchemy import Column, CHAR, TIMESTAMP, func, ForeignKey
from sqlalchemy.orm import relationship

from .base_model import Base


class PostTag(Base):
    __tablename__ = "post_tags"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    tag_id = Column(ForeignKey('tags.id', ondelete="CASCADE"))
    post_id = Column(ForeignKey('posts.id', ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    tag = relationship("Tag")