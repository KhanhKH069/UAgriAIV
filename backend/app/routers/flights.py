from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

router = APIRouter()


class FlightRecord(BaseModel):
    id: str
    uav_id: str
    date: str
    duration: int
    area_covered: float
    flight_type: str
    avg_speed: float
    status: str


class UAVStatus(BaseModel):
    id: str
    name: str
    status: str
    battery: int
    last_flight: str
    remaining_flight_time: int
    total_area_scanned: float
    current_speed: float
    scan_speed: float


UAVS = [
    UAVStatus(
        id="uav-1",
        name="Agri-Hawk 01",
        status="active",
        battery=78,
        last_flight=(datetime.now() - timedelta(hours=5)).isoformat(),
        remaining_flight_time=42,
        total_area_scanned=1240,
        current_speed=24,
        scan_speed=4.2,
    ),
    UAVStatus(
        id="uav-2",
        name="Agri-Hawk 02",
        status="charging",
        battery=35,
        last_flight=(datetime.now() - timedelta(hours=18)).isoformat(),
        remaining_flight_time=0,
        total_area_scanned=980,
        current_speed=0,
        scan_speed=0,
    ),
    UAVStatus(
        id="uav-3",
        name="Agri-Hawk 03",
        status="idle",
        battery=95,
        last_flight=(datetime.now() - timedelta(hours=7)).isoformat(),
        remaining_flight_time=68,
        total_area_scanned=1560,
        current_speed=0,
        scan_speed=0,
    ),
]

FLIGHTS = [
    FlightRecord(
        id="f1",
        uav_id="uav-1",
        date="2026-03-07",
        duration=87,
        area_covered=36.4,
        flight_type="surveillance",
        avg_speed=22,
        status="completed",
    ),
    FlightRecord(
        id="f2",
        uav_id="uav-2",
        date="2026-03-06",
        duration=64,
        area_covered=28.1,
        flight_type="spraying",
        avg_speed=18,
        status="completed",
    ),
    FlightRecord(
        id="f3",
        uav_id="uav-3",
        date="2026-03-06",
        duration=42,
        area_covered=19.6,
        flight_type="mapping",
        avg_speed=26,
        status="completed",
    ),
    FlightRecord(
        id="f4",
        uav_id="uav-1",
        date="2026-03-05",
        duration=110,
        area_covered=48.2,
        flight_type="surveillance",
        avg_speed=24,
        status="completed",
    ),
    FlightRecord(
        id="f5",
        uav_id="uav-2",
        date="2026-03-05",
        duration=22,
        area_covered=8.3,
        flight_type="spraying",
        avg_speed=16,
        status="aborted",
    ),
    FlightRecord(
        id="f6",
        uav_id="uav-1",
        date="2026-03-08",
        duration=0,
        area_covered=0,
        flight_type="mapping",
        avg_speed=0,
        status="scheduled",
    ),
]


@router.get("/uav/status", response_model=List[UAVStatus])
def get_uav_status():
    return UAVS


@router.get("/flights", response_model=List[FlightRecord])
def get_flights(uav_id: Optional[str] = None):
    if uav_id:
        return [f for f in FLIGHTS if f.uav_id == uav_id]
    return FLIGHTS
