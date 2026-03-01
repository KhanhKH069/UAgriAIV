"""
Detections Router
TV4: Software Lead
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.db.database import get_db
from app.models.detection import Detection

router = APIRouter()

@router.get("/")
async def list_detections(
    flight_id:  Optional[str] = Query(None),
    disease_id: Optional[str] = Query(None),
    severity:   Optional[str] = Query(None),
    limit:      int = Query(100, le=500),
    db:         AsyncSession = Depends(get_db),
):
    """Lấy danh sách kết quả phát hiện bệnh"""
    # TODO: implement query with filters
    return {"detections": [], "total": 0}

@router.get("/heatmap")
async def get_heatmap(
    flight_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Lấy GeoJSON heatmap bệnh cây"""
    # TODO: trả về GeoJSON từ DB
    return {
        "type": "FeatureCollection",
        "features": []
    }

@router.get("/{detection_id}")
async def get_detection(detection_id: str, db: AsyncSession = Depends(get_db)):
    """Chi tiết 1 detection"""
    return {"detection_id": detection_id}
