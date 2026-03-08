from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List

router = APIRouter()


class CropDetection(BaseModel):
    id: str
    timestamp: str
    crop_type: str
    pest_type: str
    severity: str
    affected_count: int
    field_zone: str
    confidence: float
    image_url: str = ""


DETECTIONS = [
    CropDetection(
        id="1",
        timestamp=(datetime.now() - timedelta(hours=2)).isoformat(),
        crop_type="lua",
        pest_type="Đạo ôn",
        severity="critical",
        affected_count=234,
        field_zone="Khu A",
        confidence=0.94,
    ),
    CropDetection(
        id="2",
        timestamp=(datetime.now() - timedelta(hours=3)).isoformat(),
        crop_type="lua",
        pest_type="Sâu đục thân",
        severity="high",
        affected_count=89,
        field_zone="Khu B",
        confidence=0.88,
    ),
    CropDetection(
        id="3",
        timestamp=(datetime.now() - timedelta(hours=4)).isoformat(),
        crop_type="ca_chua",
        pest_type="Sương mai",
        severity="medium",
        affected_count=45,
        field_zone="Khu C",
        confidence=0.82,
    ),
    CropDetection(
        id="4",
        timestamp=(datetime.now() - timedelta(hours=6)).isoformat(),
        crop_type="ca_chua",
        pest_type="Khảm lá",
        severity="low",
        affected_count=12,
        field_zone="Khu D",
        confidence=0.79,
    ),
]


@router.get("/detections", response_model=List[CropDetection])
def get_detections():
    return DETECTIONS


@router.get("/detections/{detection_id}", response_model=CropDetection)
def get_detection(detection_id: str):
    return next((d for d in DETECTIONS if d.id == detection_id), DETECTIONS[0])
