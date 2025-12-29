from bson import ObjectId
from fastapi import HTTPException, status

from app.features.hotels.model import hotel_collection

from bson import ObjectId

def create_hotel(data, owner_id: str):
    hotel = {
        "name": data.name,
        "description": data.description,
        "city": data.city,
        "address": data.address,
        "owner_id": ObjectId(owner_id),
        "is_active": True
    }

    result = hotel_collection.insert_one(hotel)

    return {
        "id": str(result.inserted_id),
        "name": hotel["name"],
        "description": hotel["description"],
        "city": hotel["city"],
        "address": hotel["address"],
        "owner_id": str(hotel["owner_id"]),
        "is_active": hotel["is_active"]
    }

def get_my_hotels(owner_id: str):
    hotels = hotel_collection.find({"owner_id": ObjectId(owner_id)})

    response = []
    for hotel in hotels:
        response.append({
            "id": str(hotel["_id"]),
            "name": hotel["name"],
            "description": hotel.get("description"),
            "city": hotel["city"],
            "address": hotel["address"],
            "owner_id": str(hotel["owner_id"]),
            "is_active": hotel["is_active"]
        })

    return response

from bson import ObjectId
from fastapi import HTTPException

def get_public_hotels(city: str | None = None):
    query = {"is_active": True}

    if city:
        query["city"] = {"$regex": city, "$options": "i"}

    hotels = hotel_collection.find(query)

    return [
        {
            "id": str(hotel["_id"]),
            "name": hotel["name"],
            "description": hotel.get("description"),
            "city": hotel["city"],
            "address": hotel["address"]
        }
        for hotel in hotels
    ]


def get_public_hotel_by_id(hotel_id: str):
    hotel = hotel_collection.find_one({
        "_id": ObjectId(hotel_id),
        "is_active": True
    })

    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")

    return {
        "id": str(hotel["_id"]),
        "name": hotel["name"],
        "description": hotel.get("description"),
        "city": hotel["city"],
        "address": hotel["address"]
    }

