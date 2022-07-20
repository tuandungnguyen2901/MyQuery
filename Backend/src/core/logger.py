import logging
import logging.config
from os import sep
from os.path import dirname, realpath
from typing import Dict, List, Any

from .setting import settings


def get_root_pj_path() -> str:
    return f"{dirname(realpath(__file__)).rsplit(sep, 2)[0]}/"


class FilterRootPath(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.pathname = record.pathname.replace(get_root_pj_path(), "")
        return True


def init_logger() -> None:
    filters: Dict[str, Dict[str, Any]] = {
        "filter_root_path": {
            "()": FilterRootPath,
        }
    }
    handlers: Dict[str, Dict[str, Any]] = {
        "console": {
            "level": settings.LOG_LEVEL or "INFO",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
            "filters": ["filter_root_path"]
        },
    }
    handlers_root: List[str] = ["console"]
    dct_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "verbose": {
                "format": (
                    ":\t".join(
                        f"%({x})s" for x in ["asctime", "levelname", "process", "pathname", "lineno", "message"]))
            },
        },
        'filters': filters,
        "handlers": handlers,
        "root": {
            "level": settings.LOG_LEVEL or "INFO",
            "handlers": handlers_root
        },
    }
    logging.config.dictConfig(dct_config)
