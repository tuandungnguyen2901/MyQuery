from sqlalchemy import Column, CHAR, TIMESTAMP, func, ForeignKey, String
from sqlalchemy.orm import relationship

from .base_model import Base


class Appointment(Base):
    __tablename__ = "appointments"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    learner_id = Column(ForeignKey('learners.id', ondelete="CASCADE"))
    instructor_id = Column(ForeignKey('instructors.id', ondelete="CASCADE"))
    meeting_id = Column(ForeignKey('meetings.id', ondelete="CASCADE"))
    name = Column(String, nullable=False, default="appointment")
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    meeting = relationship("Meeting", uselist=False)
    learner = relationship("Learner", uselist=False)
    instructor = relationship("Instructor", uselist=False)
