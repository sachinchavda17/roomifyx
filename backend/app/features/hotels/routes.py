from fastapi import APIRouter, Depends
from app.core.dependencies import require_role
from app.features.hotels.schemas import HotelCreate, HotelUpdate
from app.features.hotels.service import (
    create_hotel,
    get_my_hotels,
    get_public_hotels,
    get_public_hotel_by_id,
    update_hotel,
    delete_hotel,
)

router = APIRouter(prefix="/hotels", tags=["Hotels"])


@router.post("/")
async def create_hotel_api(data: HotelCreate, user=Depends(require_role("owner"))):
    return await create_hotel(data, user["id"])


@router.put("/{hotel_id}")
async def update_hotel_api(
    hotel_id: str, data: HotelUpdate, user=Depends(require_role("owner"))
):
    return await update_hotel(hotel_id, data, user["id"])


@router.delete("/{hotel_id}")
async def delete_hotel_api(hotel_id: str, user=Depends(require_role("owner"))):
    return await delete_hotel(hotel_id, user["id"])


@router.get("/me")
async def my_hotels_api(user=Depends(require_role("owner"))):
    return await get_my_hotels(user["id"])


@router.get("/")
async def list_public_hotels(
    district: str | None = None,
    search: str | None = None,
    hotel_type: str | None = None,
):
    return await get_public_hotels(district, search, hotel_type)


@router.get("/{hotel_id}")
async def get_public_hotel_api(hotel_id: str):
    return await get_public_hotel_by_id(hotel_id)
