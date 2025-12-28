from bson import ObjectId
from fastapi import HTTPException, status

from app.features.rooms.model import room_collection

def create_room(room):
    if room_collection.find_one({"room_number": room.room_number}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Room already exists"
        )
    room_collection.insert_one(room.dict())
    return {"message": "Room created successfully"}

def get_all_rooms():
    rooms = []
    for room in room_collection.find():
        room["_id"] = str(room["_id"])
        rooms.append(room)
    return rooms

def update_room(room_id: str, room_data):
    result = room_collection.update_one(
        {"_id": ObjectId(room_id)},
        {"$set": room_data.dict(exclude_unset=True)}
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    return {"message": "Room updated successfully"}

def update_room_status(room_id: str, status_value: str):
    result = room_collection.update_one(
        {"_id": ObjectId(room_id)},
        {"$set": {"status": status_value}}
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room not found"
        )
    return {"message": "Room status updated"}
