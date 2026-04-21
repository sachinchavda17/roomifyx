from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.features.rooms.model import room_collection
from app.features.hotels.model import hotel_collection


def _to_object_id(value: str, label: str = "id"):
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid {label}")


def _serialize_room(room, owner_id: str | None = None):
    data = {
        "id": str(room["_id"]),
        "hotel_id": str(room["hotel_id"]),
        "room_number": room.get("room_number", ""),
        "title": room.get("title", ""),
        "description": room.get("description", ""),
        "room_type": room.get("room_type", ""),
        "price": room.get("price"),
        "location": room.get("location", ""),
        "amenities": room.get("amenities", []),
        "images": room.get("images", []),
        "status": room.get("status", "available"),
    }
    if owner_id is not None:
        data["owner_id"] = owner_id
    return data


async def create_room(data, owner_id: str):
    hotel_oid = _to_object_id(data.hotel_id, "hotel_id")
    owner_oid = _to_object_id(owner_id, "owner_id")

    hotel = await hotel_collection.find_one(
        {"_id": hotel_oid, "owner_id": owner_oid, "is_active": True}
    )

    if not hotel:
        raise HTTPException(
            status_code=403, detail="You do not own this hotel or it does not exist"
        )

    room = {
        "hotel_id": hotel_oid,
        "room_number": data.room_number,
        "title": data.title,
        "description": data.description,
        "room_type": data.room_type,
        "price": data.price,
        "location": data.location,
        "amenities": data.amenities,
        "images": data.images,
        "status": "available",
    }

    result = await room_collection.insert_one(room)
    room["_id"] = result.inserted_id

    return _serialize_room(room)


async def get_all_rooms():
    rooms = []
    async for room in room_collection.find():
        rooms.append(
            {
                "id": str(room["_id"]),
                "room_number": room.get("room_number", ""),
                "room_type": room.get("room_type", ""),
                "hotel_id": str(room.get("hotel_id", "")),
                "price": room.get("price"),
                "status": room.get("status", "available"),
            }
        )
    return rooms


async def get_room_by_id(room_id: str, owner_id: str):
    room_oid = _to_object_id(room_id, "room_id")
    owner_oid = _to_object_id(owner_id, "owner_id")

    room = await room_collection.find_one({"_id": room_oid})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    hotel = await hotel_collection.find_one(
        {"_id": room["hotel_id"], "owner_id": owner_oid}
    )
    if not hotel:
        raise HTTPException(status_code=403, detail="Access denied")

    return _serialize_room(room)


async def update_room(room_id: str, room_data, owner_id: str):
    room_oid = _to_object_id(room_id, "room_id")
    owner_oid = _to_object_id(owner_id, "owner_id")

    room = await room_collection.find_one({"_id": room_oid})
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )

    hotel = await hotel_collection.find_one(
        {"_id": room["hotel_id"], "owner_id": owner_oid}
    )
    if not hotel:
        raise HTTPException(status_code=403, detail="Access denied")

    update_data = room_data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")

    await room_collection.update_one({"_id": room_oid}, {"$set": update_data})
    return {"message": "Room updated successfully"}


async def delete_room(room_id: str, owner_id: str):
    room_oid = _to_object_id(room_id, "room_id")
    owner_oid = _to_object_id(owner_id, "owner_id")

    room = await room_collection.find_one({"_id": room_oid})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    hotel = await hotel_collection.find_one(
        {"_id": room["hotel_id"], "owner_id": owner_oid}
    )
    if not hotel:
        raise HTTPException(status_code=403, detail="Access denied")

    await room_collection.delete_one({"_id": room_oid})
    return {"message": "Room deleted successfully"}


async def update_room_status(room_id: str, status_value: str):
    room_oid = _to_object_id(room_id, "room_id")

    allowed = {"available", "occupied", "maintenance"}
    if status_value not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed values: {sorted(allowed)}",
        )

    result = await room_collection.update_one(
        {"_id": room_oid}, {"$set": {"status": status_value}}
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    return {"message": "Room status updated"}


async def get_rooms_by_hotel(hotel_id: str, owner_id: str):
    hotel_oid = _to_object_id(hotel_id, "hotel_id")
    owner_oid = _to_object_id(owner_id, "owner_id")

    hotel = await hotel_collection.find_one(
        {"_id": hotel_oid, "owner_id": owner_oid}
    )

    if not hotel:
        raise HTTPException(status_code=403, detail="Access denied")

    rooms = []
    async for room in room_collection.find({"hotel_id": hotel_oid}):
        rooms.append(_serialize_room(room, owner_id=str(hotel["owner_id"])))
    return rooms


async def get_public_rooms(hotel_id: str):
    hotel_oid = _to_object_id(hotel_id, "hotel_id")

    hotel = await hotel_collection.find_one(
        {"_id": hotel_oid, "is_active": True}
    )

    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")

    rooms = []
    async for room in room_collection.find(
        {"hotel_id": hotel_oid, "status": {"$ne": "maintenance"}}
    ):
        rooms.append(
            {
                "id": str(room["_id"]),
                "room_number": room.get("room_number", ""),
                "room_type": room.get("room_type", ""),
                "title": room.get("title", ""),
                "description": room.get("description", ""),
                "price": room.get("price"),
                "location": room.get("location", ""),
                "amenities": room.get("amenities", []),
                "images": room.get("images", []),
                "status": room.get("status", "available"),
            }
        )
    return rooms
