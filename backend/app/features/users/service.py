from bson import ObjectId
from fastapi import HTTPException, status
from bson.errors import InvalidId

from app.features.users.model import user_collection


async def get_user_by_id(user_id: str):
    try:
        obj_id = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = await user_collection.find_one(
        {"_id": obj_id, "is_active": {"$ne": False}}
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return {
        "id": str(user["_id"]),
        "first_name": user.get("first_name", ""),
        "last_name": user.get("last_name", ""),
        "email": user["email"],
        "role": user.get("role", "user"),
    }


async def update_user(user_id: str, data: dict):
    try:
        obj_id = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    update_data = {k: v for k, v in data.items() if v is not None}

    # Prevent role escalation
    update_data.pop("role", None)

    if not update_data:
        return await get_user_by_id(user_id)

    result = await user_collection.update_one({"_id": obj_id}, {"$set": update_data})

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return await get_user_by_id(user_id)


async def delete_user(user_id: str):
    try:
        obj_id = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = await user_collection.update_one(
        {"_id": obj_id, "is_active": True}, {"$set": {"is_active": False}}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found or already deleted",
        )

    return {"message": "User deleted successfully", "user_id": user_id}
