from sqlalchemy import Column, ForeignKey, String, Float
from sqlalchemy.orm import relationship, backref

from .base_model import Base


class Instructor(Base):
    __tablename__ = "instructors"  # type: ignore
    id = Column(ForeignKey('users.id', ondelete="CASCADE"), primary_key=True)
    rate = Column(Float, nullable=True, default=0)
    hour_price = Column(Float, nullable=True, default=0)
    lesson_price = Column(Float, nullable=True, default=0)

    tags = relationship("InstructorTag")
    user = relationship("User", backref=backref("instructors", uselist=False))
