import uuid

from pydantic.main import BaseModel


class Vote(BaseModel):
    id: str = uuid.uuid4()
    user_id: str
    vote_id: str


class PostVote(Vote):
    post_id: str


class PostUpvote(PostVote):
    vote_id = "e9bdd2db-7942-4ac7-a926-708df93eec2c"


class PostDownvote(PostVote):
    vote_id = "75c8a187-5308-448d-89f7-deecabbcaf94"


class CommentVote(Vote):
    comment_id: str


class CommentUpvote(CommentVote):
    vote_id = "e9bdd2db-7942-4ac7-a926-708df93eec2c"


class CommentDownvote(CommentVote):
    vote_id = "75c8a187-5308-448d-89f7-deecabbcaf94"
