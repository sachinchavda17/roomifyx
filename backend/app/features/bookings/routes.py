from fastapi import APIRouter, Depends, status
from app.features.bookings.schemas import (
    BookingCreate,
    BookingUpdateStatus,
    PublicBookingCreate
)
from app.features.bookings.service import (
    create_booking,
    get_all_bookings,
    update_booking_status,
    cancel_booking,
    create_public_booking,
    get_my_bookings
)
from app.core.dependencies import require_role, get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

# 🔓 Staff + Admin
# @router.post("/", status_code=status.HTTP_201_CREATED)
# def create_booking_api(
#     data: BookingCreate,
#     user=Depends(require_role("admin", "owner"))
# ):
#     return create_booking(data)

# 🔓 Staff + Admin
@router.get("/")
def get_bookings_api(
    user=Depends(require_role("admin", "owner"))
):
    return get_all_bookings()

@router.post("/", tags=["Bookings"])
def booking_api(
    data: BookingCreate,
    user=Depends(get_current_user)
):
    return create_booking(data, user["_id"])

# 🔓 Staff + Admin
@router.patch("/{booking_id}/status")
def update_booking_status_api(
    booking_id: str,
    data: BookingUpdateStatus,
    user=Depends(require_role("admin", "owner"))
):
    return update_booking_status(booking_id, data.status)


@router.patch("/{booking_id}/cancel")
def cancel_booking_api(
    booking_id: str,
    user=Depends(require_role("admin", "owner"))
):
    return cancel_booking(booking_id)



@router.post("/public", tags=["Public"])
def public_booking_api(data: PublicBookingCreate):
    return create_public_booking(data)

@router.get("/me")
def my_bookings_api(
    user=Depends(get_current_user)
):
    return get_my_bookings(user["_id"])
