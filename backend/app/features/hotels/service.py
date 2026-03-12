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


def get_public_hotels(
    district: str | None = None,
    search: str | None = None,
    hotel_type: str | None = None,
):
    query = {"is_active": True}

    if district:
        query["district"] = {"$regex": district, "$options": "i"}

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"address": {"$regex": search, "$options": "i"}},
            {"district": {"$regex": search, "$options": "i"}},
            {"state": {"$regex": search, "$options": "i"}},
        ]

    if hotel_type:
        query["hotel_type"] = hotel_type

    hotels = list(hotel_collection.find(query))

    # Get min room prices for multi-room hotels (hotel/resort)
    multi_room_ids = [
        hotel["_id"]
        for hotel in hotels
        if hotel.get("hotel_type") in ("hotel", "resort")
    ]

    min_prices = {}
    if multi_room_ids:
        pipeline = [
            {"$match": {"hotel_id": {"$in": multi_room_ids}, "status": "available"}},
            {"$group": {"_id": "$hotel_id", "min_price": {"$min": "$price"}}},
        ]
        for result in room_collection.aggregate(pipeline):
            min_prices[str(result["_id"])] = result["min_price"]

    return [
        {
            **_serialize_hotel(hotel),
            "rating": 4.5,  # Mock rating until rating system is built
            "price": hotel.get("price") or min_prices.get(str(hotel["_id"])),
        }
        for hotel in hotels
    ]


def get_public_hotel_by_id(hotel_id: str):
    hotel = hotel_collection.find_one({"_id": ObjectId(hotel_id), "is_active": True})

    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")

    # For multi-room hotels, get min room price
    price = hotel.get("price")
    if not price and hotel.get("hotel_type") in ("hotel", "resort"):
        pipeline = [
            {"$match": {"hotel_id": ObjectId(hotel_id), "status": "available"}},
            {"$group": {"_id": None, "min_price": {"$min": "$price"}}},
        ]
        result = list(room_collection.aggregate(pipeline))
        if result:
            price = result[0]["min_price"]

    return {
        **_serialize_hotel(hotel),
        "rating": 4.5,
        "price": price,
    }
