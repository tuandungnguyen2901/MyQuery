from typing import Optional, Any, List

from pydantic import BaseModel


class Response(BaseModel):
    status_code: int = 1
    message: str = "SUCCESSFUL"
    data: Optional[List[Any]] = []
