from fastapi import APIRouter, Depends, status

from app.features.rooms.schemas import RoomCreate, RoomUpdate
from app.features.rooms.service import (
    create_room,
    get_all_rooms,
    update_room,
    update_room_status
)
from app.core.dependencies import require_role

router = APIRouter(prefix="/rooms", tags=["Rooms"])

# 🔒 Admin only
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_room_api(
    room: RoomCreate,
    user=Depends(require_role("admin"))
):
    return create_room(room)

# 🔓 Admin + Staff
@router.get("/")
def get_rooms_api(
    user=Depends(require_role("admin", "staff"))
):
    return get_all_rooms()

# 🔒 Admin only
@router.put("/{room_id}")
def update_room_api(
    room_id: str,
    room: RoomUpdate,
    user=Depends(require_role("admin"))
):
    return update_room(room_id, room)

# 🔓 Admin + Staff
@router.patch("/{room_id}/status")
def update_room_status_api(
    room_id: str,
    status: str,
    user=Depends(require_role("admin", "staff"))
):
    return update_room_status(room_id, status)
