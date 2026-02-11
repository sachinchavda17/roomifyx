from pydantic import BaseModel, EmailStr
from typing import Literal

UserRole = Literal["admin", "staff", "guest"]

class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
