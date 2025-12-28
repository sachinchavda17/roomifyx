from fastapi import HTTPException, status
from pymongo.errors import PyMongoError

from app.features.users.model import user_collection
from app.core.security import hash_password, verify_password, create_access_token

def register_user(user):
    try:
        if user_collection.find_one({"email": user.email}):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        user_collection.insert_one({
            "name": user.name,
            "email": user.email,
            "password": hash_password(user.password),
            "role": user.role
        })

        return {"message": "User registered successfully"}

    except PyMongoError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while creating user"
        )

def login_user(data):
    try:
        user = user_collection.find_one({"email": data.email})

        if not user or not verify_password(data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        token = create_access_token({
            "user_id": str(user["_id"]),
            "role": user["role"]
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user["role"]
        }

    except PyMongoError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error during login"
        )
