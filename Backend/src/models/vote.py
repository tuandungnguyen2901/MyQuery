from sqlalchemy import Column, CHAR, String

from .base_model import Base


class Vote(Base):
    __tablename__ = "votes"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    type = Column(String, nullable=False, index=True, unique=True)
