from sqlalchemy import Column, CHAR, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from .base_model import Base


class Conversation(Base):
    __tablename__ = "conversations"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    learner_id = Column(ForeignKey('learners.id', ondelete="CASCADE"))
    instructor_id = Column(ForeignKey('instructors.id', ondelete="CASCADE"))
    status = Column(Boolean, nullable=False, default=False)

    learner = relationship("Learner", uselist=False)
    instructor = relationship("Instructor", uselist=False)
    messages = relationship("Message")
