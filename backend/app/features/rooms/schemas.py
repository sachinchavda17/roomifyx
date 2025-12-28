from pydantic import BaseModel, Field
from typing import Literal, Optional

RoomStatus = Literal["available", "occupied", "maintenance"]
RoomType = Literal["standard", "deluxe", "suite"]

class RoomCreate(BaseModel):
    room_number: str = Field(..., example="101")
    type: RoomType
    price: float = Field(..., gt=0)
    status: RoomStatus = "available"

class RoomUpdate(BaseModel):
    type: Optional[RoomType] = None
    price: Optional[float] = Field(default=None, gt=0)
    status: Optional[RoomStatus] = None
