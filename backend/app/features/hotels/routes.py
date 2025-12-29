from fastapi import APIRouter, Depends
from app.core.dependencies import require_role, get_current_user
from app.features.hotels.schemas import HotelCreate
from app.features.hotels.service import create_hotel, get_my_hotels, get_public_hotels, get_public_hotel_by_id

router = APIRouter(prefix="/hotels", tags=["Hotels"])

@router.post("/")
def create_hotel_api(
    data: HotelCreate,
    user=Depends(require_role("owner"))
):
    return create_hotel(data, user["_id"])


@router.get("/me")
def my_hotels_api(
    user=Depends(require_role("owner"))
):
    return get_my_hotels(user["_id"])


@router.get("/public", tags=["Public"])
def list_public_hotels(city: str | None = None):
    return get_public_hotels(city)


@router.get("/public/{hotel_id}", tags=["Public"])
def get_public_hotel_api(hotel_id: str):
    return get_public_hotel_by_id(hotel_id)
