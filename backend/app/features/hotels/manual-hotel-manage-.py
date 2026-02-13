from bson import ObjectId
from app.features.hotels.model import hotel_collection


def create_hotel(owner_id: str):
    hotel = {
        "name": "Goldy’s Forest : Luxe Apt Near Airport / Symbiosis",
        "description": "The place was exactly like the pictures 😊. This Apartment is located just 700 meters from Pune International Airport. No more Commuting Hassles to the Airport Also very close to Symbiosis University. Perfect for Business Travelers, Couples, Group of Tourists, or Families visiting relatives , who want a clean, cozy and central place :) Do book with us. We are looking forward to host you!",
        "city": "Pune City",
        "address": "Quiet Solitude: Comfortable 1BHK | Panoramic Golf & River View | WFH Paradise | All Amenities | Nr. Pune-Mumbai Expy Getaway",
        "owner_id": ObjectId(owner_id),
        "is_active": True,
        "images": [
            "https://a0.muscache.com/im/pictures/hosting/Hosting-1581232947495634576/original/4d09e8d1-690d-4270-8946-ea6bbcefe9c5.jpeg?im_w=1200"
        ],
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


if __name__ == "__main__":
    result = create_hotel("698d97160ed3c62493dddb20")
    print(f"Hotel created successfully: {result}")
