"""
Flights Router
TV4: Software Lead
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from datetime import datetime
from app.db.database import get_db

router = APIRouter()

class FlightCreate(BaseModel):
    drone_id: str
    location: str
    pilot: str

@router.post("/")
async def create_flight(body: FlightCreate, db: AsyncSession = Depends(get_db)):
    """Tạo flight session mới"""
    flight_id = f"flight_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    return {"flight_id": flight_id, "status": "active", **body.dict()}

@router.get("/")
async def list_flights(db: AsyncSession = Depends(get_db)):
    """Danh sách tất cả flight sessions"""
    return {"flights": [], "total": 0}

@router.get("/{flight_id}")
async def get_flight(flight_id: str, db: AsyncSession = Depends(get_db)):
    """Chi tiết 1 flight session"""
    return {"flight_id": flight_id}

@router.patch("/{flight_id}/end")
async def end_flight(flight_id: str, db: AsyncSession = Depends(get_db)):
    """Kết thúc flight session"""
    return {"flight_id": flight_id, "status": "completed", "ended_at": datetime.utcnow()}
