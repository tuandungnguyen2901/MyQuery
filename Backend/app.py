import logging.config
import warnings

import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from src.api.v1 import api_router
from src.core.error_handler import WebException, unicorn_exception_handler
from src.core.logger import init_logger
from src.core.setting import settings

warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=UserWarning)
logger = logging.getLogger(__name__)


async def on_startup():
    init_logger()
    logger.debug("Execute FastAPI startup event handler.")
    # Initialize utilities for whole FastAPI application without passing object
    # instances within the logic.
    logger.info("init logger done")


async def on_shutdown():
    logger.debug("Execute FastAPI shutdown event handler.")


def get_application() -> FastAPI:
    application = FastAPI(on_startup=[on_startup], on_shutdown=[on_shutdown])

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )
    application.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)
    application.add_exception_handler(WebException, unicorn_exception_handler)
    application.include_router(api_router)
    return application


app = get_application()
if settings.STAGE != "local":
    if __name__ == "__main__":
        args = dict(host="0.0.0.0", port=settings.HTTP_PORT, root_path="", workers=settings.NUM_WORKER)
        uvicorn.run("app:app", **args)
else:
    if __name__ == "__main__":
        args = dict(host="localhost", port=settings.HTTP_PORT, root_path="", workers=settings.NUM_WORKER)
        uvicorn.run("app:app", **args)
