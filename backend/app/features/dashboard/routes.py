from fastapi import APIRouter, Depends
from app.core.dependencies import require_role
from app.features.dashboard.service import get_dashboard_stats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# 🔒 Admin only
@router.get("/")
def dashboard_api(
    user=Depends(require_role("admin",'owner'))
):
    return get_dashboard_stats()
