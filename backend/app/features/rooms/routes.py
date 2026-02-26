from fastapi import APIRouter, Depends, status

from app.features.rooms.schemas import RoomCreate, RoomUpdate, RoomResponse
from app.features.rooms.service import (
    create_room,
    get_all_rooms,
    get_room_by_id,
    update_room,
    update_room_status,
    get_rooms_by_hotel,
    delete_room,
)
from app.core.dependencies import require_role
from app.features.rooms.service import get_public_rooms

router = APIRouter(prefix="/rooms", tags=["Rooms"])


# 🔒 Admin only
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_room_api(data: RoomCreate, user=Depends(require_role("owner"))):
    return create_room(data, user["id"])


# 🔓 Admin + Staff
@router.get("/")
def get_rooms_api(
    user=Depends(require_role("admin", "owner")),  # staff
):
    return get_all_rooms()


# 🔒 Owner only
@router.get("/{room_id}")
def get_room_api(room_id: str, user=Depends(require_role("owner"))):
    return get_room_by_id(room_id, user["id"])


# 🔒 Owner only
@router.put("/{room_id}")
def update_room_api(
    room_id: str, room: RoomUpdate, user=Depends(require_role("owner"))
):
    return update_room(room_id, room)


# 🔒 Owner only
@router.delete("/{room_id}")
def delete_room_api(room_id: str, user=Depends(require_role("owner"))):
    return delete_room(room_id, user["id"])


# 🔓 Admin + Staff
@router.patch("/{room_id}/status")
def update_room_status_api(
    room_id: str, status: str, user=Depends(require_role("admin", "staff"))
):
    return update_room_status(room_id, status)


@router.get("/hotel/{hotel_id}")
def get_rooms_for_hotel_api(hotel_id: str, user=Depends(require_role("owner"))):
    return get_rooms_by_hotel(hotel_id, user["id"])


@router.get("/public/hotels/{hotel_id}/rooms", tags=["Public"])
def public_rooms_api(hotel_id: str):
    return get_public_rooms(hotel_id)


# @router.get("/public/hotels/{hotel_id}/rooms/availability", tags=["Public"])
# def public_room_availability_api(hotel_id: str, check_in: str, check_out: str):
#     return get_available_rooms(hotel_id, check_in, check_out)
