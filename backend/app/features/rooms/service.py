from bson import ObjectId
from fastapi import HTTPException, status

from app.features.rooms.model import room_collection
from app.features.hotels.model import hotel_collection
from app.features.bookings.model import booking_collection

def create_room(data, owner_id: str):
    try:
        hotel = hotel_collection.find_one({
            "_id": ObjectId(data.hotel_id),
            "owner_id": ObjectId(owner_id),
            "is_active": True
        })

        if not hotel:
            raise HTTPException(
                status_code=403,
                detail="You do not own this hotel or it does not exist"
            )

        room = {
            "hotel_id": ObjectId(data.hotel_id),
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

        result = room_collection.insert_one(room)

        return {
            "id": str(result.inserted_id),
            "hotel_id": str(room["hotel_id"]),
            "room_number": room["room_number"],
            "title": room["title"],
            "description": room["description"],
            "room_type": room["room_type"],
            "price": room["price"],
            "location": room["location"],
            "amenities": room["amenities"],
            "images": room["images"],
            "status": room["status"],
        }
    except Exception as e:
        print("\nerror create room ", e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


def get_all_rooms():
    rooms = []
    for room in room_collection.find():
        room["_id"] = str(room["_id"])
        rooms.append(room)
    return [
        {
            "id": str(room["_id"]),
            "room_number": room["room_number"],
            "room_type": str(room.get("room_type")) if room.get("room_type") else "",
            "type": str(room.get("type")) if room.get("type") else "",
            "hotel_id": str(room.get("hotel_id")) if room.get("hotel_id") else "",
            "price": room["price"],
            "status": room["status"]
        }
        for room in rooms
    ]

def get_room_by_id(room_id: str, owner_id: str):
    try:
        room = room_collection.find_one({"_id": ObjectId(room_id)})
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")

        hotel = hotel_collection.find_one({
            "_id": room["hotel_id"],
            "owner_id": ObjectId(owner_id)
        })
        if not hotel:
            raise HTTPException(status_code=403, detail="Access denied")

        return {
            "id": str(room["_id"]),
            "hotel_id": str(room["hotel_id"]),
            "room_number": room["room_number"],
            "title": room["title"],
            "description": room["description"],
            "room_type": room["room_type"],
            "price": room["price"],
            "location": room["location"],
            "amenities": room.get("amenities", []),
            "images": room.get("images", []),
            "status": room["status"],
        }
    except Exception as e:
        print("\nerror get_room_by_id", e)
        raise HTTPException(status_code=500, detail=str(e))


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

def delete_room(room_id: str, owner_id: str):
    try:
        room = room_collection.find_one({"_id": ObjectId(room_id)})
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")

        hotel = hotel_collection.find_one({
            "_id": room["hotel_id"],
            "owner_id": ObjectId(owner_id)
        })
        if not hotel:
            raise HTTPException(status_code=403, detail="Access denied")

        room_collection.delete_one({"_id": ObjectId(room_id)})
        return {"message": "Room deleted successfully"}
    except Exception as e:
        print("\nerror delete_room", e)
        raise HTTPException(status_code=500, detail=str(e))

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

def get_rooms_by_hotel(hotel_id: str, owner_id: str):
    try:
        hotel = hotel_collection.find_one({
            "_id": ObjectId(hotel_id),
            "owner_id": ObjectId(owner_id)
        })

        if not hotel:
            raise HTTPException(status_code=403, detail="Access denied")

        rooms = room_collection.find({"hotel_id": ObjectId(hotel_id)})
        print("all roooms", rooms)

        return [
            {
                "id": str(room["_id"]),
                "room_number": room["room_number"],
                "room_type": room["room_type"],
                "title": room["title"], # later change to name
                "description": room["description"],
                "price": room["price"],
                "location": room["location"],
                "amenities": room["amenities"],
                "status": room["status"],
                "images": room["images"],
                # "is_active": hotel["is_active"],
                "owner_id": str(hotel["owner_id"]),
            }
            for room in rooms
        ]
    except Exception as e:
        print("\nerror get rooms by hotel ", e)
        raise HTTPException(status_code=500, detail=str(e))

def get_public_rooms(hotel_id: str):
    hotel = hotel_collection.find_one({
        "_id": ObjectId(hotel_id),
        "is_active": True
    })

    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")

    rooms = room_collection.find({
        "hotel_id": ObjectId(hotel_id),
        "status": {"$ne": "maintenance"}
    })

    return [
        {
            "id": str(room["_id"]),
            "room_number": room["room_number"],
            "room_type": room["room_type"],
            "price": room["price"],
            "status": room["status"]
        }
        for room in rooms
    ]

    
    