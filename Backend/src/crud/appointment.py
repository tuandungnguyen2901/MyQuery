import logging.config

from src.crud.base import CRUDBase
from src.models.appointment import Appointment
from src.schemas.appointment import Appointment as AppointmentCreateSchema

logger = logging.getLogger(__name__)


class CRUDAppointment(CRUDBase[Appointment, AppointmentCreateSchema, AppointmentCreateSchema]):
    pass


appointment = CRUDAppointment(Appointment)
