from sqlalchemy import Column, CHAR, String, TIMESTAMP, func

from .base_model import Base


class BlackListToken(Base):
    __tablename__ = "blacklist_tokens"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    token = Column(String, nullable=False, index=True, unique=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
