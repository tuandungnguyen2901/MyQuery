from src.crud.base import CRUDBase
from src.models import BlackListToken
from src.schemas.token import BlackListToken as BlackListTokenSchema


class CRUDBlackListToken(CRUDBase[BlackListToken, BlackListTokenSchema, BlackListToken]):
    pass


blacklist_token = CRUDBlackListToken(BlackListToken)
