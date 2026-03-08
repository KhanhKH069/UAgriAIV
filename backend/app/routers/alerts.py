from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta

router = APIRouter()


class Alert(BaseModel):
    id: str
    type: str
    severity: str
    message: str
    timestamp: str
    resolved: bool


class WeatherData(BaseModel):
    temperature: float
    humidity: int
    wind_speed: float
    condition: str
    icon: str
    timestamp: str
    pest_risk_level: str
    pest_risk_reason: str
    soil_moisture: float
    soil_ph: float
    soil_temp: float


class WeatherForecast(BaseModel):
    date: str
    temp_min: float
    temp_max: float
    humidity: int
    condition: str
    pest_risk: str


ALERTS = [
    Alert(
        id="a1",
        type="pest",
        severity="critical",
        message="Phát hiện Đạo ôn lây lan nhanh tại ruộng Lúa Khu A – cần xử lý trong 24h",
        timestamp=(datetime.now() - timedelta(hours=2)).isoformat(),
        resolved=False,
    ),
    Alert(
        id="a2",
        type="weather",
        severity="high",
        message="Mưa ẩm kéo dài – thuận lợi bùng phát Sương mai trên Cà chua (Khu C, Khu D)",
        timestamp=(datetime.now() - timedelta(hours=5)).isoformat(),
        resolved=False,
    ),
    Alert(
        id="a3",
        type="disease",
        severity="medium",
        message="Nguy cơ Sâu đục thân lúa tăng cao ở giai đoạn đẻ nhánh (Khu B)",
        timestamp=(datetime.now() - timedelta(hours=9)).isoformat(),
        resolved=False,
    ),
    Alert(
        id="a4",
        type="irrigation",
        severity="low",
        message="Đất Khu D (Cà chua) đã đạt độ ẩm 70%, hệ thống tự động ngắt tưới",
        timestamp=(datetime.now() - timedelta(hours=11)).isoformat(),
        resolved=True,
    ),
]

WEATHER = WeatherData(
    temperature=28.5,
    humidity=85,
    wind_speed=12,
    condition="Partly Cloudy",
    icon="02d",
    timestamp=datetime.now().isoformat(),
    pest_risk_level="high",
    pest_risk_reason="Độ ẩm không khí duy trì >85% tạo điều kiện thuận lợi cho bào tử nấm Sương mai (Cà chua) và Đạo ôn (Lúa) phát triển",
    soil_moisture=68,
    soil_ph=6.2,
    soil_temp=26.3,
)

FORECAST = [
    WeatherForecast(
        date="2026-03-08",
        temp_min=24,
        temp_max=31,
        humidity=78,
        condition="Sunny",
        pest_risk="medium",
    ),
    WeatherForecast(
        date="2026-03-09",
        temp_min=22,
        temp_max=29,
        humidity=85,
        condition="Rainy",
        pest_risk="high",
    ),
    WeatherForecast(
        date="2026-03-10",
        temp_min=23,
        temp_max=30,
        humidity=80,
        condition="Partly Cloudy",
        pest_risk="high",
    ),
    WeatherForecast(
        date="2026-03-11",
        temp_min=25,
        temp_max=32,
        humidity=72,
        condition="Sunny",
        pest_risk="medium",
    ),
    WeatherForecast(
        date="2026-03-12",
        temp_min=26,
        temp_max=33,
        humidity=65,
        condition="Clear",
        pest_risk="low",
    ),
]


@router.get("/alerts", response_model=List[Alert])
def get_alerts():
    return ALERTS
