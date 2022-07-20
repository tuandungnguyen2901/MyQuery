from sqlalchemy import Column, CHAR, TIMESTAMP, func, ForeignKey

from .base_model import Base


class InstructorStarred(Base):
    __tablename__ = "starred_instructors"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    user_id = Column(ForeignKey('users.id', ondelete="CASCADE"))
    instructor_id = Column(ForeignKey('users.id', ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
