from fastapi import APIRouter
from datetime import datetime
from app.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.VERSION,
        "phase": settings.PHASE,
        "timestamp": datetime.utcnow().isoformat(),
        "scaffold": True
    }
