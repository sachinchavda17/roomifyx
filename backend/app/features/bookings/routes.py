from fastapi import APIRouter, Depends, status
from app.features.bookings.schemas import (
    BookingCreate,
    BookingUpdateStatus,
    PublicBookingCreate,
)
from app.features.bookings.service import (
    create_booking,
    get_all_bookings,
    update_booking_status,
    cancel_booking,
    create_public_booking,
    get_my_bookings,
)
from app.core.dependencies import require_role, get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("/")
async def get_bookings_api(user=Depends(require_role("admin", "owner"))):
    return await get_all_bookings()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def booking_api(data: BookingCreate, user=Depends(get_current_user)):
    return await create_booking(data, user["id"])


@router.patch("/{booking_id}/status")
async def update_booking_status_api(
    booking_id: str,
    data: BookingUpdateStatus,
    user=Depends(require_role("admin", "owner")),
):
    return await update_booking_status(booking_id, data.status)


@router.patch("/{booking_id}/cancel")
async def cancel_booking_api(
    booking_id: str,
    user=Depends(get_current_user),
):
    return await cancel_booking(booking_id)


@router.post("/public", tags=["Public"])
async def public_booking_api(data: PublicBookingCreate):
    return await create_public_booking(data)


@router.get("/me")
async def my_bookings_api(user=Depends(get_current_user)):
    return await get_my_bookings(user["id"])
