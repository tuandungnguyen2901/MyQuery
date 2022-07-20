from pydantic import BaseModel


class Appointment(BaseModel):
    id: str
    learner_id: str
    instructor_id: str
    meeting_id: str
    name: str = "appointment"
