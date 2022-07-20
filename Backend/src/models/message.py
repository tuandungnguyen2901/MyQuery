from sqlalchemy import Column, ForeignKey, String, CHAR, func, TIMESTAMP, Boolean

from .base_model import Base


class Message(Base):
    __tablename__ = "messages"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    user_id = Column(ForeignKey('users.id', ondelete="CASCADE"))
    conversation_id = Column(ForeignKey('conversations.id', ondelete="CASCADE"))
    status = Column(Boolean, nullable=False, default=False)
    content = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
