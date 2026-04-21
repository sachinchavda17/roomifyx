from datetime import datetime, time
from app.features.rooms.model import room_collection
from app.features.bookings.model import booking_collection


async def get_dashboard_stats():
    today_start = datetime.combine(datetime.today(), time.min)
    today_end = datetime.combine(datetime.today(), time.max)

    total_rooms = await room_collection.count_documents({})
    available_rooms = await room_collection.count_documents({"status": "available"})
    occupied_rooms = await room_collection.count_documents({"status": "occupied"})

    todays_checkins = await booking_collection.count_documents(
        {
            "check_in": {"$gte": today_start, "$lte": today_end},
            "status": {"$in": ["booked", "checked_in"]},
        }
    )

    todays_checkouts = await booking_collection.count_documents(
        {
            "check_out": {"$gte": today_start, "$lte": today_end},
            "status": "checked_in",
        }
    )

    total_revenue = 0
    async for doc in booking_collection.aggregate(
        [
            {"$match": {"status": {"$ne": "cancelled"}}},
            {"$group": {"_id": None, "sum": {"$sum": "$amount"}}},
        ]
    ):
        total_revenue = doc.get("sum", 0)
        break

    active_bookings = await booking_collection.count_documents(
        {"status": {"$in": ["booked", "checked_in"]}}
    )

    return {
        "rooms": {
            "total": total_rooms,
            "available": available_rooms,
            "occupied": occupied_rooms,
        },
        "today": {
            "check_ins": todays_checkins,
            "check_outs": todays_checkouts,
        },
        "bookings": {"active": active_bookings},
        "revenue": {"total": total_revenue},
    }
