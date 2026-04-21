from fastapi import APIRouter, status, Depends
from app.features.auth.schemas import UserRegister, UserLogin
from app.features.auth.service import register_user, login_user
from app.core.database import client
from app.core.dependencies import require_role

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    return await register_user(user)


@router.post("/login")
async def login(data: UserLogin):
    return await login_user(data)


@router.delete("/delete-db/{db_name}")
async def delete_database(db_name: str, user=Depends(require_role("admin"))):
    await client.drop_database(db_name)
    return {"message": f"Database '{db_name}' deleted successfully"}
