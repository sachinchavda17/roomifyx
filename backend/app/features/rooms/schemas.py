from pydantic import BaseModel, Field
from typing import Literal, Optional

RoomStatus = Literal["available", "occupied", "maintenance"]
RoomType = Literal["standard", "premium", "deluxe", "suite"]

class RoomCreate(BaseModel):
    hotel_id: str
    room_number: str = Field(..., example="101")
    room_type: RoomType
    price: float = Field(..., gt=0)
    # status: RoomStatus = "available"

class RoomUpdate(BaseModel):
    type: Optional[RoomType] = None
    price: Optional[float] = Field(default=None, gt=0)
    # status: Optional[RoomStatus] = None
