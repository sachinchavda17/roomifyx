from bson import ObjectId
from fastapi import HTTPException, status

from app.features.users.model import user_collection


def get_user_by_id(user_id: str):
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user["id"] = str(user["_id"])
    user.pop("_id", None)
    user.pop("password", None)
    return user


def update_user(user_id: str, data: dict):
    # Remove None values
    update_data = {k: v for k, v in data.items() if v is not None}
    if not update_data:
        return get_user_by_id(user_id)

    result = user_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return get_user_by_id(user_id)


def delete_user(user_id: str):
    result = user_collection.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return {"message": "User deleted successfully"}
