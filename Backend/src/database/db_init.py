from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.core.setting import settings

engine = create_engine(
    f"postgresql://{settings.USERNAME_DB}:{settings.PASSWORD_DB}@{settings.HOST_DB}/{settings.NAME_DB}",
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
