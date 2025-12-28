from pydantic import BaseModel, EmailStr, Field

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6, max_length=64)
    role: str  # admin | staff

class UserLogin(BaseModel):
    email: EmailStr
    password: str
