from sqlalchemy import Column, CHAR, TIMESTAMP, func, ForeignKey
from sqlalchemy.orm import relationship

from .base_model import Base


class InstructorTag(Base):
    __tablename__ = "instructor_tags"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    tag_id = Column(ForeignKey('tags.id', ondelete="CASCADE"))
    instructor_id = Column(ForeignKey('instructors.id', ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    tag = relationship("Tag")
