from sqlalchemy import Column, CHAR, String, TIMESTAMP, func

from .base_model import Base


class Meeting(Base):
    __tablename__ = "meetings"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    name = Column(String, default="meeting")
    meeting_link = Column(String, nullable=False)
    record_link = Column(String, nullable=True)
    start_time = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    end_time = Column(TIMESTAMP, server_default=func.now(), nullable=False)
