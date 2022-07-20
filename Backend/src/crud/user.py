import logging.config

from sqlalchemy.orm import Session

from src.core.error_handler import WebException
from src.crud.base import CRUDBase
from src.models.user import User
from src.schemas.user import UserCreate as UserCreateSchema, UserUpdate as UserUpdateSchema

logger = logging.getLogger(__name__)


class CRUDUser(CRUDBase[User, UserCreateSchema, UserUpdateSchema]):
    def get_user(self, db: Session, email: str, registry_type: str):
        try:
            obj = db.query(self.model).filter(self.model.email == email)\
                .filter(self.model.registry_type == registry_type) \
                .first()
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))
        return obj  # type: ignore


user = CRUDUser(User)
