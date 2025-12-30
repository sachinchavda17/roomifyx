from datetime import datetime, time
from bson import ObjectId
from fastapi import HTTPException, status

from app.features.bookings.model import booking_collection
from app.features.rooms.model import room_collection

def create_booking(data, user_id: str | None = None):
    room_id = ObjectId(data.room_id)

    room = room_collection.find_one({"_id": room_id})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if room["status"] != "available":
        raise HTTPException(status_code=400, detail="Room is not available")

    if data.check_in >= data.check_out:
        raise HTTPException(
            status_code=400,
            detail="Invalid check-in/check-out dates"
        )

    check_in_dt = datetime.combine(data.check_in, time.min)
    check_out_dt = datetime.combine(data.check_out, time.min)

    # 🔥 Overlap check
    overlap = booking_collection.find_one({
        "room_id": room_id,
        "status": {"$in": ["booked", "checked_in"]},
        "check_in": {"$lt": check_out_dt},
        "check_out": {"$gt": check_in_dt}
    })

    if overlap:
        raise HTTPException(
            status_code=409,
            detail="Room already booked for selected dates"
        )

    # 💰 PRICE CALCULATION
    nights = (data.check_out - data.check_in).days
    amount = nights * room["price"]

    booking = {
        "customer_name": data.customer_name,
        "customer_phone": data.customer_phone,
        "room_id": room_id,
        "check_in": check_in_dt,
        "check_out": check_out_dt,
        "nights": nights,
        "price_per_night": room["price"],
        "amount": amount,
        "status": "booked",
        "user_id": ObjectId(user_id) if user_id else None
    }

    booking_collection.insert_one(booking)

    return {
        "message": "Booking created successfully",
        "nights": nights,
        "amount": amount
    }


def get_all_bookings():
    bookings = []
    for b in booking_collection.find():
        b["_id"] = str(b["_id"])
        bookings.append(b)
    return [
        {
            "id": b["_id"],
            "customer_name": b["customer_name"],
            "customer_phone": b["customer_phone"],
            "room_id": str(b["room_id"]),
            "check_in": b["check_in"],
            "check_out": b["check_out"],
            "amount": b["amount"],
            "status": b["status"],
            "user_id": str(b["user_id"]) if b["user_id"] else None
        }
        for b in bookings
    ]


def update_booking_status(booking_id: str, new_status: str):
    booking = booking_collection.find_one(
        {"_id": ObjectId(booking_id)}
    )

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    room_id = booking["room_id"]

    if new_status == "checked_in":
        room_collection.update_one(
            {"_id": room_id},
            {"$set": {"status": "occupied"}}
        )

    if new_status == "checked_out":
        room_collection.update_one(
            {"_id": room_id},
            {"$set": {"status": "available"}}
        )

    booking_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": new_status}}
    )

    return {"message": f"Booking {new_status} successfully"}



def cancel_booking(booking_id: str):
    booking = booking_collection.find_one(
        {"_id": ObjectId(booking_id)}
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking["status"] in ["checked_out", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel booking with status '{booking['status']}'"
        )

    # free the room
    room_collection.update_one(
        {"_id": booking["room_id"]},
        {"$set": {"status": "available"}}
    )

    booking_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": "cancelled"}}
    )

    return {"message": "Booking cancelled successfully"}

def create_public_booking(data):
    # reuse the same logic
    return create_booking(data)


def get_my_bookings(user_id: str):
    bookings = booking_collection.find({"user_id": ObjectId(user_id)})

    return [
        {
            "id": str(b["_id"]),
            "room_id": str(b["room_id"]),
            "check_in": b["check_in"],
            "check_out": b["check_out"],
            "amount": b["amount"],
            "status": b["status"]
        }
        for b in bookings
    ]
