import logging.config
from typing import Any, Dict, Generic, Type, TypeVar, List, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.core.error_handler import WebException
from src.models.base_model import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
logger = logging.getLogger(__name__)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db: Session, id_value: int) -> ModelType:
        try:
            obj = db.query(self.model).filter(self.model.id == id_value).first()
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))
        return obj  # type: ignore

    def get_by_attribute(self, db: Session, value: Any, attribute: str) -> ModelType:
        try:
            obj = db.query(self.model).filter(getattr(self.model, attribute) == value).first()
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))
        return obj  # type: ignore

    def get_by_multi_attribute(self, db: Session, values: List[Any], attributes: List[Any]):
        try:
            obj = db.query(self.model)
            for index, value in enumerate(values):
                obj = obj.filter(getattr(self.model, attributes[index]) == value)
            obj = obj.first()
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))
        return obj

    def get_multi_by_attribute(self, db: Session, value: Any, attribute: str, *, skip: int = 0,
                               limit: int = 10000) -> List[ModelType]:
        try:
            obj = db.query(self.model).filter(getattr(self.model, attribute) == value).offset(skip).limit(limit).all()
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))
        return obj  # type: ignore

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 10000) -> List[ModelType]:
        try:
            obj = db.query(self.model).offset(skip).limit(limit).all()
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))
        return obj  # type: ignore

    def create(self, db: Session, obj_in: CreateSchemaType) -> ModelType:
        try:
            obj_in_data = jsonable_encoder(obj_in)
            db_obj = self.model(**obj_in_data)  # type: ignore
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))
        return db_obj  # type: ignore

    def commit(self, db: Session) -> None:
        try:
            db.commit()
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))

    def update(self, db: Session, db_obj: ModelType, obj_in: Union[UpdateSchemaType, Dict[str, Any]]) -> ModelType:
        try:
            obj_data = jsonable_encoder(db_obj)
            if isinstance(obj_in, dict):
                update_data = obj_in
            else:
                update_data = obj_in.dict(exclude_none=True)
            for field in obj_data:
                if field in update_data:
                    setattr(db_obj, field, update_data[field])
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))
        return db_obj  # type: ignore

    def remove(self, db: Session, db_obj: ModelType) -> ModelType:
        try:
            db.delete(db_obj)
            db.commit()
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))
        return db_obj  # type: ignore

    def remove_by_attribute(self, db: Session, value: Any, attribute: str) -> ModelType:
        try:
            obj = db.query(self.model).filter(getattr(self.model, attribute) == value).first()
            db.delete(obj)
            db.commit()
        except Exception as ex:
            logger.error(f"Error: {ex}")
            raise WebException(err=str(ex))
        return obj  # type: ignore
