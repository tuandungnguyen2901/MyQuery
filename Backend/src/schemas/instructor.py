from typing import Optional

from pydantic import BaseModel


class Instructor(BaseModel):
    id: str
    hour_price: float = 0
    lesson_price: float = 0
    rate: float = 0


class InstructorUpdate(BaseModel):
    hour_price: Optional[float] = 0
    lesson_price: Optional[float] = 0
    rate: Optional[float] = 0


class InstructorStarred(BaseModel):
    id: str
    user_id: str
    instructor_id: str
