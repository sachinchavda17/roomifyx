from datetime import datetime, time
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.features.bookings.model import booking_collection
from app.features.rooms.model import room_collection


def _to_object_id(value: str, label: str = "id"):
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail=f"Invalid {label}")


async def create_booking(data, user_id: str | None = None):
    room_id = _to_object_id(data.room_id, "room_id")

    room = await room_collection.find_one({"_id": room_id})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if room.get("status") == "maintenance":
        raise HTTPException(status_code=400, detail="Room is not available")

    if data.check_in >= data.check_out:
        raise HTTPException(
            status_code=400,
            detail="Invalid check-in/check-out dates",
        )

    check_in_dt = datetime.combine(data.check_in, time.min)
    check_out_dt = datetime.combine(data.check_out, time.min)

    overlap = await booking_collection.find_one(
        {
            "room_id": room_id,
            "status": {"$in": ["booked", "checked_in"]},
            "check_in": {"$lt": check_out_dt},
            "check_out": {"$gt": check_in_dt},
        }
    )

    if overlap:
        raise HTTPException(
            status_code=409,
            detail="Room already booked for selected dates",
        )

    nights = (data.check_out - data.check_in).days
    amount = nights * room["price"]

    booking = {
        "customer_name": getattr(data, "customer_name", None),
        "customer_phone": getattr(data, "customer_phone", None),
        "room_id": room_id,
        "check_in": check_in_dt,
        "check_out": check_out_dt,
        "nights": nights,
        "price_per_night": room["price"],
        "amount": amount,
        "status": "booked",
        "user_id": _to_object_id(user_id, "user_id") if user_id else None,
    }

    result = await booking_collection.insert_one(booking)

    return {
        "id": str(result.inserted_id),
        "message": "Booking created successfully",
        "nights": nights,
        "amount": amount,
    }


async def get_all_bookings():
    bookings = []
    async for b in booking_collection.find():
        bookings.append(
            {
                "id": str(b["_id"]),
                "customer_name": b.get("customer_name"),
                "customer_phone": b.get("customer_phone"),
                "room_id": str(b["room_id"]),
                "check_in": b["check_in"],
                "check_out": b["check_out"],
                "amount": b.get("amount"),
                "status": b.get("status"),
                "user_id": str(b["user_id"]) if b.get("user_id") else None,
            }
        )
    return bookings


async def update_booking_status(booking_id: str, new_status: str):
    booking_oid = _to_object_id(booking_id, "booking_id")

    booking = await booking_collection.find_one({"_id": booking_oid})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    room_id = booking["room_id"]

    if new_status == "checked_in":
        await room_collection.update_one(
            {"_id": room_id}, {"$set": {"status": "occupied"}}
        )

    if new_status == "checked_out":
        await room_collection.update_one(
            {"_id": room_id}, {"$set": {"status": "available"}}
        )

    await booking_collection.update_one(
        {"_id": booking_oid}, {"$set": {"status": new_status}}
    )

    return {"message": f"Booking {new_status} successfully"}


async def cancel_booking(booking_id: str):
    booking_oid = _to_object_id(booking_id, "booking_id")

    booking = await booking_collection.find_one({"_id": booking_oid})
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if booking["status"] in ("checked_out", "cancelled"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel booking with status '{booking['status']}'",
        )

    if booking["status"] == "checked_in":
        await room_collection.update_one(
            {"_id": booking["room_id"]}, {"$set": {"status": "available"}}
        )

    await booking_collection.update_one(
        {"_id": booking_oid}, {"$set": {"status": "cancelled"}}
    )

    return {"message": "Booking cancelled successfully"}


async def create_public_booking(data):
    return await create_booking(data)


async def get_my_bookings(user_id: str):
    user_oid = _to_object_id(user_id, "user_id")
    bookings = []
    async for b in booking_collection.find({"user_id": user_oid}):
        bookings.append(
            {
                "id": str(b["_id"]),
                "room_id": str(b["room_id"]),
                "check_in": b["check_in"],
                "check_out": b["check_out"],
                "amount": b.get("amount"),
                "status": b.get("status"),
            }
        )
    return bookings
