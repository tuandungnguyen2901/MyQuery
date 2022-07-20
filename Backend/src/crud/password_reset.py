from src.crud.base import CRUDBase
from src.models import PasswordResetToken
from src.schemas.token import PasswordResetToken as PasswordResetTokenSchema


class CRUDPasswordResetToken(CRUDBase[PasswordResetToken, PasswordResetTokenSchema, PasswordResetToken]):
    pass


password_reset = CRUDPasswordResetToken(PasswordResetToken)
