from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr


class RegistryType(str, Enum):
    EMAIL = "email"
    FACEBOOK = "facebook"
    GOOGLE = "google"


class AccountType(str, Enum):
    INSTRUCTOR = "Instructor"
    LEARNER = "Learner"


class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    registry_by: RegistryType


class UserUpdate(BaseModel):
    account_type: Optional[AccountType]
    first_name: Optional[str]
    last_name: Optional[str]
    phone: Optional[str]
    payment_status: Optional[bool]
    avatar: Optional[str]
    dob: Optional[str]
    gender: Optional[Gender]
    location: Optional[str]
    job_title: Optional[str]
    description: Optional[str]


class UserDB(BaseModel):
    id: str
    email: EmailStr
    password: str
    registry_type: str
