from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user

from app.features.users.schemas import UserUpdate, UserPublic
from app.features.users.service import update_user, delete_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserPublic)
def get_me(current_user=Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserPublic)
def update_me(data: UserUpdate, current_user=Depends(get_current_user)):
    return update_user(current_user["id"], data.dict())


@router.delete("/me")
def delete_me(current_user=Depends(get_current_user)):
    return delete_user(current_user["id"])
