import os
from dotenv import load_dotenv

load_dotenv()

def must_get_env(key: str) -> str:
    value = os.getenv(key)
    if not value:
        raise RuntimeError(f"Missing environment variable: {key}")
    return value

MONGO_URI = must_get_env("MONGO_URI")
DB_NAME = must_get_env("DB_NAME")

JWT_SECRET = must_get_env("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 3600))

