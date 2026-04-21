from fastapi import HTTPException, status
from pymongo.errors import PyMongoError

from app.features.users.model import user_collection
from app.core.security import hash_password, verify_password, create_access_token


async def register_user(user):
    try:
        existing_user = await user_collection.find_one(
            {"email": user.email.lower(), "is_active": {"$ne": False}}
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        role = user.role if user.role in ("user", "owner") else "user"

        new_user = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email.lower(),
            "password": hash_password(user.password),
            "role": role,
            "is_active": True,
        }

        result = await user_collection.insert_one(new_user)

        token = create_access_token(
            {"user_id": str(result.inserted_id), "role": role}
        )

        return {
            "message": "User registered successfully",
            "token": token,
            "role": role,
        }

    except HTTPException:
        raise
    except PyMongoError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while creating user",
        )


async def login_user(data):
    try:
        user = await user_collection.find_one(
            {"email": data.email.lower(), "is_active": {"$ne": False}}
        )

        if not user or not verify_password(data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        token = create_access_token({"user_id": str(user["_id"]), "role": user["role"]})

        return {
            "message": "User logged in successfully",
            "token": token,
            "role": user["role"],
        }

    except HTTPException:
        raise
    except PyMongoError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error during login",
        )
