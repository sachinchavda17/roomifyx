from bson import ObjectId
from fastapi import HTTPException, status

from app.features.hotels.model import hotel_collection
from app.features.rooms.model import room_collection


def _serialize_hotel(hotel):
    data = {
        "id": str(hotel["_id"]),
        "name": hotel["name"],
        "hotel_type": hotel.get("hotel_type", ""),
        "contact_email": hotel.get("contact_email", ""),
        "contact_phone": hotel.get("contact_phone", ""),
        "country": hotel.get("country", ""),
        "state": hotel.get("state", ""),
        "district": hotel.get("district", ""),
        "address": hotel.get("address", ""),
        "description": hotel.get("description"),
        "owner_id": str(hotel["owner_id"]),
        "is_active": hotel.get("is_active", True),
        "images": hotel.get("images", []),
        # Guest house / single-property fields
        "price": hotel.get("price"),
        "amenities": hotel.get("amenities", []),
        "max_guests": hotel.get("max_guests"),
    }
    return data


def create_hotel(data, owner_id: str):
    hotel = {
        "name": data.name,
        "hotel_type": data.hotel_type,
        "contact_email": data.contact_email,
        "contact_phone": data.contact_phone,
        "country": data.country,
        "state": data.state,
        "district": data.district,
        "address": data.address,
        "description": data.description,
        "owner_id": ObjectId(owner_id),
        "is_active": True,
        "images": data.images,
        # Guest house / single-property fields
        "price": data.price,
        "amenities": data.amenities,
        "max_guests": data.max_guests,
    }

    result = hotel_collection.insert_one(hotel)
    hotel["_id"] = result.inserted_id

    return _serialize_hotel(hotel)


def update_hotel(hotel_id: str, data, owner_id: str):
    update_data = {k: v for k, v in data.dict(exclude_unset=True).items()}

    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")

    result = hotel_collection.update_one(
        {"_id": ObjectId(hotel_id), "owner_id": ObjectId(owner_id)},
        {"$set": update_data},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404, detail="Hotel not found or permission denied"
        )

    return {"msg": "Hotel updated successfully"}


def delete_hotel(hotel_id: str, owner_id: str):
    result = hotel_collection.delete_one(
        {"_id": ObjectId(hotel_id), "owner_id": ObjectId(owner_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404, detail="Hotel not found or permission denied"
        )

    # Cascade delete all rooms belonging to this hotel
    room_collection.delete_many({"hotel_id": ObjectId(hotel_id)})

    return {"msg": "Hotel deleted successfully"}


def get_my_hotels(owner_id: str):
    hotels = hotel_collection.find({"owner_id": ObjectId(owner_id)})
    return [_serialize_hotel(hotel) for hotel in hotels]


def get_public_hotels(district: str | None = None):
    query = {"is_active": True}

    if district:
        query["district"] = {"$regex": district, "$options": "i"}

    hotels = hotel_collection.find(query)

    return [
        {
            **_serialize_hotel(hotel),
            "rating": 4.5,  # Mock rating
            "price": 100,  # Mock price
        }
        for hotel in hotels
    ]


def get_public_hotel_by_id(hotel_id: str):
    hotel = hotel_collection.find_one({"_id": ObjectId(hotel_id), "is_active": True})

    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")

    return {
        **_serialize_hotel(hotel),
        "rating": 4.5,
        "price": 100,
    }
