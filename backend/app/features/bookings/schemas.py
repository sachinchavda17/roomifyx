from pydantic import BaseModel, Field
from typing import Literal
from datetime import date

BookingStatus = Literal[
    "booked",
    "checked_in",
    "checked_out",
    "cancelled"
]

class BookingCreate(BaseModel):
    customer_name: str
    customer_phone: str
    room_id: str
    check_in: date
    check_out: date

class BookingUpdateStatus(BaseModel):
    status: BookingStatus

class PublicBookingCreate(BaseModel):
    room_id: str
    customer_name: str
    customer_phone: str
    check_in: date
    check_out: date
