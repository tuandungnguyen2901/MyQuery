"""
Define status
"""


class Status:
    code: int
    message: str


class SUCCESSFUL(Status):
    code = 1
    message = "SUCCESSFUL"


class ERR0001(Status):
    code = 1001
    message = "INTERNAL_SERVER_ERROR"


class ERR0002(Status):
    code = 1002
    message = "PERMISSION_DENIED"


class ERR0003(Status):
    code = 1003
    message = "NOT_FOUND"


class ERR0004(Status):
    code = 1004
    message = "EXISTS"


class ERR0005(Status):
    code = 1005
    message = "INVALID"


class ERR0006(Status):
    code = 1006
    message = "EXPIRED"


class ERR0007(Status):
    code = 1007
    message = "NOT_CONFIRM"


class ERR0008(Status):
    code = 1007
    message = "DEACTIVATED"
