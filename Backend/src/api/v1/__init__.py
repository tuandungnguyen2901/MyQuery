from fastapi import APIRouter

from src.api.v1.endpoints import users, login, posts, comments, tags

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, tags=["users"])
api_router.include_router(posts.router, tags=["posts"])
api_router.include_router(comments.router, tags=["comments"])
api_router.include_router(tags.router, tags=["tags"])
