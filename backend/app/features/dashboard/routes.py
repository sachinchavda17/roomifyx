from fastapi import APIRouter, Depends
from app.core.dependencies import require_role
from app.features.dashboard.service import get_dashboard_stats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
async def dashboard_api(user=Depends(require_role("admin", "owner"))):
    return await get_dashboard_stats()
