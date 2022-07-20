from pydantic import BaseModel


class Learner(BaseModel):
    id: str
    rate: float = 0
