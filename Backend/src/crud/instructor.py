import logging.config

from src.crud.base import CRUDBase
from src.models.instructor import Instructor
from src.models.instructor_starred import InstructorStarred
from src.schemas.instructor import Instructor as InstructorCreateSchema, InstructorUpdate as InstructorUpdateSchema, \
    InstructorStarred as InstructorStarredCreateSchema

logger = logging.getLogger(__name__)


class CRUDInstructor(CRUDBase[Instructor, InstructorCreateSchema, InstructorUpdateSchema]):
    pass


class CRUDInstructorStarred(CRUDBase[InstructorStarred, InstructorStarredCreateSchema, InstructorStarredCreateSchema]):
    pass


instructor = CRUDInstructor(Instructor)
instructor_starred = CRUDInstructorStarred(InstructorStarred)
