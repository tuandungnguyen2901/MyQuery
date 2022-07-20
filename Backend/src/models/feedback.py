from sqlalchemy import Column, ForeignKey, String, CHAR, Integer, func, TIMESTAMP

from .base_model import Base


class Feedback(Base):
    __tablename__ = "feedbacks"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    user_id = Column(ForeignKey('users.id', ondelete="CASCADE"))
    appointment_id = Column(ForeignKey('appointments.id', ondelete="CASCADE"))
    rating = Column(Integer, nullable=True, default=0)
    review = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
