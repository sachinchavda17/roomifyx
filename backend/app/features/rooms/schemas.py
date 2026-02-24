from pydantic import BaseModel, Field
from typing import Literal, Optional

RoomStatus = Literal["available", "occupied", "maintenance"]
RoomType = Literal["standard", "premium", "deluxe", "suite"]


class RoomCreate(BaseModel):
    hotel_id: str
    room_number: str = Field(..., example="101")
    title: str = Field(..., min_length=5)
    description: str = Field(..., min_length=20)
    room_type: RoomType
    price: float = Field(..., gt=0)
    location: str = Field(..., example="Mumbai, India")
    images: list[str] = Field(default_factory=list)
    amenities: list[str] = Field(default_factory=list)


class RoomUpdate(BaseModel):
    type: Optional[RoomType] = None
    price: Optional[float] = Field(default=None, gt=0)
