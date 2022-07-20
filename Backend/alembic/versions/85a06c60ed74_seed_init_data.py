"""Seed init data

Revision ID: 85a06c60ed74
Revises: 667b9fb9bead
Create Date: 2022-07-10 20:06:48.887181

"""
import uuid
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
from sqlalchemy import table, column, CHAR, String, TIMESTAMP, Boolean

from src.core.security import get_password_hash
from src.core.setting import settings
from src.schemas.user import RegistryType


# revision identifiers, used by Alembic.
revision = '85a06c60ed74'
down_revision = '667b9fb9bead'
branch_labels = None
depends_on = None


user_table = table(
    "users",
    column("id", CHAR(36)),
    column("first_name", String),
    column("last_name", String),
    column("email", String),
    column("phone", String),
    column("password", String),
    column("avatar", String),
    column("activated_at", TIMESTAMP),
    column("payment_status", Boolean),
    column("registry_type", String)
)


def upgrade():
    op.bulk_insert(
        user_table,
        [
            {"id": uuid.uuid4(), "first_name": "admin", "last_name": "super",
             "email": "tuandungnguyen29012000@gmail.com",
             "password": get_password_hash('a12345678X').decode('utf-8'), "phone": "0834290100",
             "avatar": f"https://{settings.S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/avatar_default.jpeg",
             "activated_at": datetime.now(), "payment_status": False, "registry_type": RegistryType.EMAIL.value}
        ],
    )


def downgrade():
    pass