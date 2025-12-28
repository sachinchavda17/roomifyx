from fastapi import APIRouter, status
from app.features.auth.schemas import UserRegister, UserLogin
from app.features.auth.service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserRegister):
    return register_user(user)

@router.post("/login")
def login(data: UserLogin):
    return login_user(data)
