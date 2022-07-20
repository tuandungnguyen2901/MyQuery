from sqlalchemy import Column, String, TIMESTAMP, func, Boolean, CHAR
from sqlalchemy.orm import relationship

from .base_model import Base
from ..schemas.user import RegistryType


class User(Base):
    __tablename__ = "users"  # type: ignore
    id = Column(CHAR(36), primary_key=True, index=True, unique=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    dob = Column(TIMESTAMP, nullable=True)
    gender = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)
    password = Column(String, nullable=False)
    activated_at = Column(TIMESTAMP, nullable=True)
    deactivated_at = Column(TIMESTAMP, nullable=True)
    payment_status = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp(), nullable=False)
    registry_type = Column(String, nullable=False, default=RegistryType.EMAIL)
    account_type = Column(String, nullable=True, default="Learner")
    description = Column(String, nullable=True)
    location = Column(String, nullable=True)
    job_title = Column(String, nullable=True)

    comments = relationship("Comment")
    posts = relationship("Post")
