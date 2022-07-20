from sqlalchemy import Column, CHAR, TIMESTAMP, func, String

from .base_model import Base


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    token = Column(String(255), nullable=False, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp(), nullable=False)
