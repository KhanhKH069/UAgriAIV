from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

@router.get("/")
async def list_alerts(limit: int = Query(20, le=100), severity: Optional[str] = None):
    return {"alerts": [], "total": 0}
