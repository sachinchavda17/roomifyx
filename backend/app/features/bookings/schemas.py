from pydantic import BaseModel
from typing import Literal, Optional
from datetime import date

BookingStatus = Literal["booked", "checked_in", "checked_out", "cancelled"]


class BookingCreate(BaseModel):
    room_id: str
    check_in: date
    check_out: date
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None


class BookingUpdateStatus(BaseModel):
    status: BookingStatus


class PublicBookingCreate(BaseModel):
    room_id: str
    customer_name: str
    customer_phone: str
    check_in: date
    check_out: date
