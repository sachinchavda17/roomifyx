from pydantic import BaseModel, Field
from typing import Optional, Literal

HotelType = Literal["hotel", "resort", "guest_house", "apartment"]


class HotelCreate(BaseModel):
    name: str
    hotel_type: HotelType
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: str
    district: Optional[str] = None
    address: str
    description: Optional[str] = None
    images: list[str] = Field(default_factory=list)


class HotelUpdate(BaseModel):
    name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None
    images: Optional[list[str]] = None
    is_active: Optional[bool] = None


class HotelResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    city: str
    address: str
    owner_id: str
