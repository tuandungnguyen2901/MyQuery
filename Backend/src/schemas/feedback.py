from pydantic import BaseModel


class Feedback(BaseModel):
    id: str
    user_id: str
    rating: str
    review: str
    appointment_id: str
