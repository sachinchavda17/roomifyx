from pydantic import BaseModel, Field
from typing import Optional

class HotelCreate(BaseModel):
    name: str
    description: Optional[str] = None
    city: str
    address: str

class HotelResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    city: str
    address: str
    owner_id: str
