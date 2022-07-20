import uuid
from datetime import datetime
from typing import List

from sqlalchemy.orm import Session

from src import schemas, models, crud
from src.controllers.auth import authenticate
from src.core.const import string, status
from src.core.error_handler import WebException
from src.core.security import get_password_hash


class UserController:
    async def create_user(self, db: Session, user_create: schemas.UserCreate) -> schemas.Response:
        if crud.user.get_by_multi_attribute(db, [user_create.email, user_create.registry_by],
                                            ['email', 'registry_type']):
            raise WebException(err_status=status.ERR0004, err=string.USER_EXISTS)
        password = get_password_hash(user_create.password).decode('utf-8')

        user = crud.user.create(db, schemas.UserDB(id=str(uuid.uuid4()), email=user_create.email,
                                                   password=password, registry_type=user_create.registry_by))
        user_db = crud.user.update(db, user, {'activated_at': datetime.now()})

        return schemas.Response(data=[user_db.id])

    @staticmethod
    def deactivate_user(db: Session, current_user: models.User) -> schemas.Response:
        crud.user.update(db, current_user, {'deactivated_at': datetime.now()})
        return schemas.Response(data=[current_user.id])

    def update_user(self, db: Session, current_user: models.User, user_update: schemas.UserUpdate) -> schemas.Response:
        current_account_type = current_user.account_type
        if user_update.dob:
            user_update.dob = datetime.fromtimestamp(int(user_update.dob))
        user = crud.user.update(db, current_user, user_update)

        if current_account_type != user.account_type:
            if current_account_type == schemas.AccountType.INSTRUCTOR.value:
                instructor = crud.instructor.get(db, current_user.id)
                if instructor:
                    crud.instructor.remove(db, instructor)
            if current_account_type == schemas.AccountType.LEARNER.value:
                learner = crud.learner.get(db, current_user.id)
                if learner:
                    crud.learner.remove(db, learner)

        if user_update.account_type == schemas.AccountType.INSTRUCTOR.value and not crud.instructor.get(db, user.id):
            crud.instructor.create(db, schemas.Instructor(id=user.id))
        if user_update.account_type == schemas.AccountType.LEARNER.value and not crud.learner.get(db, user.id):
            crud.learner.create(db, schemas.Learner(id=user.id))
        data = self.read_user(db, user).data
        return schemas.Response(data=data)

    @staticmethod
    def update_instructor(db: Session, current_user: models.User, instructor_update: schemas.InstructorUpdate) \
            -> schemas.Response:
        if current_user.account_type != schemas.AccountType.INSTRUCTOR.value:
            return schemas.Response(message=string.INVALID_ACCOUNT_TYPE)
        instructor = crud.instructor.get(db, current_user.id)
        updated_instructor = crud.instructor.update(db, instructor, instructor_update)
        return schemas.Response(data=[updated_instructor])

    @staticmethod
    def read_user(db: Session, user: models.user) -> schemas.Response:
        del user.password
        if user.account_type == schemas.AccountType.INSTRUCTOR.value:
            instructor = crud.instructor.get(db, user.id)
            if not instructor:
                raise WebException(err_status=status.ERR0003, err=f"user_id: {user.id} " + string.USER_NOT_FOUND)
            starred_user_list = crud.instructor_starred.get_multi_by_attribute(db, user.id, "instructor_id")
            starred_time = len(starred_user_list) if starred_user_list else 0
            starred_user_id_list = [user.user_id for user in starred_user_list]

            tags = [t.tag.type for t in instructor.tags]
            data = {**user.__dict__, **instructor.__dict__, "tags": tags, "starred_time": starred_time,
                    "starred_user_list": starred_user_id_list}
            del instructor.tags
            return schemas.Response(data=[data])
        else:
            learner = crud.learner.get(db, user.id)
            if not learner:
                raise WebException(err_status=status.ERR0003, err=string.USER_NOT_FOUND)
            data = {**user.__dict__, **learner.__dict__}
            return schemas.Response(data=[data])

    @staticmethod
    def reactivate_user(db: Session, email: str, password: str, registry_by: str) -> schemas.Response:
        user = authenticate(db, email, password, registry_by)
        crud.user.update(db, user, {'deactivated_at': None})
        return schemas.Response(data=[user.id])

    @staticmethod
    def delete_user(db: Session, current_user: models.User):
        user = crud.user.remove(db, current_user)
        return schemas.Response(data=[user.id])

    def read_all_instructors(self, db: Session):
        instructors = crud.user.get_multi_by_attribute(db, schemas.AccountType.INSTRUCTOR.value, "account_type")
        data = [self.read_user(db, instructor).data[0] for instructor in instructors]
        return schemas.Response(data=data)

    def read_all_starred_instructors(self, db: Session, user: models.User) -> schemas.Response:
        starred_instructors = crud.instructor_starred.get_multi_by_attribute(db, user.id, "user_id")
        data = []
        for starred_instructor in starred_instructors:
            data.append(self.read_user(db, crud.user.get(db, starred_instructor.instructor_id)).data[0])
        return schemas.Response(data=data)

    def search_instructor(self, db: Session, search_str: List[str], filter_tags: List[str]) -> schemas.Response:
        data = self.read_all_instructors(db).data
        output = []
        all_tags = crud.tag.get_multi(db)
        all_tags_dict = {tag.type: tag.id for tag in all_tags}
        for instructor in data:
            is_tagged = False
            if not filter_tags:
                is_tagged = True
                output.append(instructor)
            for tag in filter_tags:
                if tag not in all_tags_dict.keys():
                    raise WebException(err=tag + ": " + string.TAG_NOT_FOUND, err_status=status.ERR0003)
                if tag in instructor["tags"]:
                    is_tagged = True
                    output.append(instructor)
                    break
            if is_tagged:
                is_searched = False
                if not search_str:
                    is_searched = True
                for s in search_str:
                    if [i for i in [instructor["first_name"], instructor["last_name"], instructor["email"]] if s in i]:
                        is_searched = True
                        break
                if not is_searched:
                    output.pop()

        return schemas.Response(data=output)

    @staticmethod
    def star_instructor(db: Session, user: models.User, instructor: models.User):
        if instructor.id == user.id:
            raise WebException(err_status=status.ERR0005, err=string.INVALID_USER)
        starred_instructor = crud.instructor_starred.get_by_multi_attribute(db, [user.id, instructor.id],
                                                                            ["user_id", "instructor_id"])
        if starred_instructor:
            obj = crud.instructor_starred.remove(db, starred_instructor)
        else:
            obj = crud.instructor_starred.create(db, schemas.InstructorStarred(id=str(uuid.uuid4()), user_id=user.id,
                                                                               instructor_id=instructor.id))

        return schemas.Response(data=[obj.id])

    def get_instructor_by_tag(self, db: Session, filter_tags: List[str]) -> schemas.Response:
        data = self.search_instructor(db=db, search_str=[], filter_tags=filter_tags).data
        return schemas.Response(data=data)


user_controller = UserController()
