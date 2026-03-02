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
    district: Optional[str] = None
    address: str
    description: Optional[str] = None
    images: list[str] = Field(default_factory=list)

    # Guest house / single-property fields (used when hotel_type is not multi-room)
    price: Optional[float] = Field(default=None, gt=0)
    amenities: list[str] = Field(default_factory=list)
    max_guests: Optional[int] = Field(default=None, gt=0)


class HotelUpdate(BaseModel):
    name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    description: Optional[str] = None
    images: Optional[list[str]] = None
    is_active: Optional[bool] = None

    # Guest house / single-property fields
    price: Optional[float] = Field(default=None, gt=0)
    amenities: Optional[list[str]] = None
    max_guests: Optional[int] = Field(default=None, gt=0)


class HotelResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    address: str
    owner_id: str
