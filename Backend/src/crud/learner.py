import logging.config

from src.crud.base import CRUDBase
from src.models.learner import Learner
from src.schemas.learner import Learner as LearnerCreateSchema

logger = logging.getLogger(__name__)


class CRUDLearner(CRUDBase[Learner, LearnerCreateSchema, LearnerCreateSchema]):
    pass


learner = CRUDLearner(Learner)
