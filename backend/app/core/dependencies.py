from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from bson import ObjectId

from app.core.config import JWT_SECRET, JWT_ALGORITHM
from app.features.users.model import user_collection

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# -------- AUTH --------
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str | None = payload.get("user_id")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        user["_id"] = str(user["_id"])
        user.pop("password", None)
        return user

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

# -------- ROLE --------
def require_role(*roles: str):
    def checker(current_user=Depends(get_current_user)):
        if current_user["role"] not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied"
            )
        return current_user
    return checker
