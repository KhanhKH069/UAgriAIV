from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
from app.routers import detections, flights, treatments, alerts, weather
from app.services.weather_service import weather_worker


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start weather background task
    task = asyncio.create_task(weather_worker())
    yield
    # Shutdown
    task.cancel()


app = FastAPI(
    title="UAgriAIV API",
    description="Smart Agricultural UAV Management API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detections.router, prefix="/api", tags=["detections"])
app.include_router(flights.router, prefix="/api", tags=["flights"])
app.include_router(treatments.router, prefix="/api", tags=["treatments"])
app.include_router(alerts.router, prefix="/api", tags=["alerts"])
app.include_router(weather.router, prefix="/api/weather", tags=["weather"])


@app.get("/")
def root():
    return {"status": "ok", "service": "UAgriAIV API v1.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
