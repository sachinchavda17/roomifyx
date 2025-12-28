from fastapi import APIRouter, Depends, status

from app.features.bookings.schemas import (
    BookingCreate,
    BookingUpdateStatus
)
from app.features.bookings.service import (
    create_booking,
    get_all_bookings,
    update_booking_status,
    cancel_booking
)
from app.core.dependencies import require_role

router = APIRouter(prefix="/bookings", tags=["Bookings"])

# 🔓 Staff + Admin
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_booking_api(
    data: BookingCreate,
    user=Depends(require_role("admin", "staff"))
):
    return create_booking(data)

# 🔓 Staff + Admin
@router.get("/")
def get_bookings_api(
    user=Depends(require_role("admin", "staff"))
):
    return get_all_bookings()

# 🔓 Staff + Admin
@router.patch("/{booking_id}/status")
def update_booking_status_api(
    booking_id: str,
    data: BookingUpdateStatus,
    user=Depends(require_role("admin", "staff"))
):
    return update_booking_status(booking_id, data.status)


@router.patch("/{booking_id}/cancel")
def cancel_booking_api(
    booking_id: str,
    user=Depends(require_role("admin", "staff"))
):
    return cancel_booking(booking_id)