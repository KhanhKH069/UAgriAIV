"""
Backend API — UAV AI Crop Disease System
TV4: Software Lead
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio

from app.routers import flights, detections, treatments, alerts
from app.mqtt.subscriber import start_mqtt_subscriber
from app.db.database import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, start_mqtt_subscriber)
    yield

app = FastAPI(
    title       = "UAV AI Crop Disease API",
    description = "Backend API cho hệ thống UAV phát hiện bệnh cây trồng",
    version     = "1.0.0",
    lifespan    = lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins  = ["*"],
    allow_methods  = ["*"],
    allow_headers  = ["*"],
)

app.include_router(flights.router,    prefix="/api/v1/flights",    tags=["Flights"])
app.include_router(detections.router, prefix="/api/v1/detections", tags=["Detections"])
app.include_router(treatments.router, prefix="/api/v1/treatments", tags=["Treatments"])
app.include_router(alerts.router,     prefix="/api/v1/alerts",     tags=["Alerts"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "uav-ai-backend"}
