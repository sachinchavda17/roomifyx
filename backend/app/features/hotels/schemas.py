from pydantic import BaseModel, Field
from typing import Optional


class HotelCreate(BaseModel):
    name: str
    description: Optional[str] = None
    city: str
    address: str
    images: list[str]


class HotelUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    images: Optional[list[str]] = None
    is_active: Optional[bool] = None


class HotelResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    city: str
    address: str
    owner_id: str
