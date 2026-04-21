# from pymongo import MongoClient
from app.core.config import MONGO_URI, DB_NAME
from motor.motor_asyncio import AsyncIOMotorClient

# client = MongoClient(
#     MONGO_URI,
#     tls=True,
#     # tlsAllowInvalidCertificates=True
# )


client = AsyncIOMotorClient(MONGO_URI) 

db = client[DB_NAME]
