from fastapi import APIRouter, Depends, status

from app.features.rooms.schemas import RoomCreate, RoomUpdate
from app.features.rooms.service import (
    create_room,
    get_all_rooms,
    get_room_by_id,
    update_room,
    update_room_status,
    get_rooms_by_hotel,
    delete_room,
    get_public_rooms,
)
from app.core.dependencies import require_role

router = APIRouter(prefix="/rooms", tags=["Rooms"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_room_api(data: RoomCreate, user=Depends(require_role("owner"))):
    return await create_room(data, user["id"])


@router.get("/")
async def get_rooms_api(user=Depends(require_role("admin", "owner"))):
    return await get_all_rooms()


@router.get("/hotel/{hotel_id}")
async def get_rooms_for_hotel_api(hotel_id: str, user=Depends(require_role("owner"))):
    return await get_rooms_by_hotel(hotel_id, user["id"])


@router.get("/public/hotels/{hotel_id}/rooms", tags=["Public"])
async def public_rooms_api(hotel_id: str):
    return await get_public_rooms(hotel_id)


@router.get("/{room_id}")
async def get_room_api(room_id: str, user=Depends(require_role("owner"))):
    return await get_room_by_id(room_id, user["id"])


@router.put("/{room_id}")
async def update_room_api(
    room_id: str, room: RoomUpdate, user=Depends(require_role("owner"))
):
    return await update_room(room_id, room, user["id"])


@router.delete("/{room_id}")
async def delete_room_api(room_id: str, user=Depends(require_role("owner"))):
    return await delete_room(room_id, user["id"])


@router.patch("/{room_id}/status")
async def update_room_status_api(
    room_id: str, status: str, user=Depends(require_role("admin", "owner"))
):
    return await update_room_status(room_id, status)
