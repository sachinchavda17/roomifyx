from bson import ObjectId
from fastapi import HTTPException, status

from app.features.users.model import user_collection

def get_user_by_id(user_id: str):
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user["_id"] = str(user["_id"])
    user.pop("password", None)
    return user


def get_all_users():
    users = []
    for user in user_collection.find():
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        users.append(user)
    return users
