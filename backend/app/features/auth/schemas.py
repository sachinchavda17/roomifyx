from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str = Field(min_length=6, max_length=64)
    role: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str
