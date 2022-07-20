import logging.config

from src.crud.base import CRUDBase
from src.models.feedback import Feedback
from src.schemas.feedback import Feedback as FeedbackCreateSchema

logger = logging.getLogger(__name__)


class CRUDFeedback(CRUDBase[Feedback, FeedbackCreateSchema, FeedbackCreateSchema]):
    pass


feedback = CRUDFeedback(Feedback)
