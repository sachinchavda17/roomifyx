from bson import ObjectId
from fastapi import HTTPException, status

from app.features.hotels.model import hotel_collection


def create_hotel(data, owner_id: str):
    hotel = {
        "name": data.name,
        "description": data.description,
        "city": data.city,
        "address": data.address,
        "owner_id": ObjectId(owner_id),
        "is_active": True,
        "images": data.images,
    }

    result = hotel_collection.insert_one(hotel)

    return {
        "id": str(result.inserted_id),
        "name": hotel["name"],
        "description": hotel["description"],
        "city": hotel["city"],
        "address": hotel["address"],
        "owner_id": str(hotel["owner_id"]),
        "is_active": hotel["is_active"],
        "images": hotel["images"],
    }


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

    return {"msg": "Hotel deleted successfully"}


def get_my_hotels(owner_id: str):
    hotels = hotel_collection.find({"owner_id": ObjectId(owner_id)})

    response = []
    for hotel in hotels:
        response.append(
            {
                "id": str(hotel["_id"]),
                "name": hotel["name"],
                "description": hotel.get("description"),
                "city": hotel["city"],
                "address": hotel["address"],
                "owner_id": str(hotel["owner_id"]),
                "is_active": hotel["is_active"],
                "images": hotel.get("images", []),
            }
        )

    return response


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
            "address": hotel["address"],
            "images": hotel.get("images", []),
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
        "id": str(hotel["_id"]),
        "name": hotel["name"],
        "description": hotel.get("description"),
        "city": hotel["city"],
        "address": hotel["address"],
        "images": hotel.get("images", []),
        "rating": 4.5,
        "price": 100,
    }
