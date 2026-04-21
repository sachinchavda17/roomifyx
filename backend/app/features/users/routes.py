from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user

from app.features.users.schemas import UserUpdate, UserPublic
from app.features.users.service import get_user_by_id, update_user, delete_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserPublic)
async def get_me(current_user=Depends(get_current_user)):
    return await get_user_by_id(current_user["id"])


@router.put("/me", response_model=UserPublic)
async def update_me(data: UserUpdate, current_user=Depends(get_current_user)):
    return await update_user(current_user["id"], data.model_dump(exclude_unset=True))


@router.delete("/me")
async def delete_me(current_user=Depends(get_current_user)):
    return await delete_user(current_user["id"])
