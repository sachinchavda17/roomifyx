from pydantic import BaseModel, EmailStr
from typing import Literal

UserRole = Literal["admin", "user", "owner"]


class UserPublic(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: EmailStr
    role: UserRole


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    role: UserRole | None = None
