from fastapi import APIRouter, HTTPException
from app.services.weather_service import weather_state

router = APIRouter()


@router.get("/current")
async def get_current_weather():
    """Returns the most recent weather data fetched by the background task."""
    if weather_state["current"] is None:
        raise HTTPException(
            status_code=503,
            detail="Weather data is initializing, try again in a few seconds.",
        )
    return weather_state["current"]


@router.get("/forecast")
async def get_weather_forecast():
    """Returns the weather forecast and pest risk prediction for the next 3 hours."""
    if not weather_state["forecast"]:
        raise HTTPException(
            status_code=503,
            detail="Forecast data is initializing, try again in a few seconds.",
        )
    return weather_state["forecast"]
