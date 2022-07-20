from typing import Type

from fastapi import Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from starlette.status import HTTP_200_OK

from src import schemas
from .const.status import Status, ERR0001
from .setting import settings


class WebException(Exception):
    def __init__(self, debug: str = None,
                 http_code: int = HTTP_200_OK,
                 err_status: Type[Status] = ERR0001,
                 err: str = None) -> None:
        self.debug = debug
        self.http_code = http_code
        self.err_status = err_status
        self.err = err


async def unicorn_exception_handler(_: Request, exc: WebException) -> JSONResponse:
    response = jsonable_encoder(schemas.Response(
        status_code=exc.err_status.code,
        message=exc.err,
        debug=f"{exc.err_status.message} ------ {exc.debug}",
    ))
    if not settings.IS_DEBUG:
        del response["debug"]
    return JSONResponse(
        status_code=exc.http_code,
        content=response
    )
