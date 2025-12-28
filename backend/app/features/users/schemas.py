from pydantic import BaseModel, EmailStr
from typing import Literal

UserRole = Literal["admin", "staff"]

class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
