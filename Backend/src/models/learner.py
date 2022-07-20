from sqlalchemy import Column, ForeignKey, Float

from .base_model import Base


class Learner(Base):
    __tablename__ = "learners"  # type: ignore
    id = Column(ForeignKey('users.id', ondelete="CASCADE"), primary_key=True)
    rate = Column(Float, nullable=True, default=0)
