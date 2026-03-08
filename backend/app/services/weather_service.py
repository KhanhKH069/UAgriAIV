import asyncio
import httpx
from datetime import datetime

# In-memory storage for weather data (since DB tables might not exist for this yet)
weather_state = {"current": None, "forecast": [], "last_updated": None}

# Default Location (Hanoi Capital)
LATITUDE = 21.0285
LONGITUDE = 105.8522


def calculate_pest_risk(temp: float, humidity: float) -> tuple[str, str]:
    """Calculate basic pest risk based on temp and humidity"""
    if humidity > 85 and 25 <= temp <= 30:
        return (
            "high",
            "Độ ẩm cao (>85%) và nhiệt độ ấm tạo điều kiện rất thuận lợi cho nấm Sương mai và Đạo ôn phát triển.",
        )
    elif humidity > 75:
        return "medium", "Độ ẩm trung bình cao, cần theo dõi sự cố nấm bệnh sớm."
    else:
        return (
            "low",
            "Điều kiện thời tiết hiện tại an toàn, ít nguy cơ bùng phát dịch bệnh.",
        )


async def fetch_weather_data():
    """Fetch current and hourly weather from Open-Meteo API"""
    url = f"https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m&timezone=Asia%2FBangkok"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            data = response.json()

            current = data.get("current", {})
            hourly = data.get("hourly", {})

            # 1. Update Current Weather
            temp = current.get("temperature_2m", 25.0)
            hum = current.get("relative_humidity_2m", 80)
            wind = current.get("wind_speed_10m", 10.0)

            risk_level, risk_reason = calculate_pest_risk(temp, hum)

            weather_state["current"] = {
                "temperature": temp,
                "humidity": hum,
                "wind_speed": wind,
                "condition": "Cloudy"
                if current.get("weather_code", 0) > 3
                else "Clear",
                "icon": "02d",  # Mock icon matching dashboard
                "timestamp": current.get("time", datetime.now().isoformat()),
                "pest_risk_level": risk_level,
                "pest_risk_reason": risk_reason,
                "soil_moisture": 68,  # Mocked sensor data
                "soil_ph": 6.2,  # Mocked sensor data
                "soil_temp": temp - 2.0,
            }

            # 2. Update Forecast (Next 3 hours)
            times = hourly.get("time", [])
            temps = hourly.get("temperature_2m", [])
            hums = hourly.get("relative_humidity_2m", [])

            now = datetime.now()
            forecast_list = []

            # Find the index for the current hour
            current_hour_str = now.strftime("%Y-%m-%dT%H:00")
            start_idx = 0
            if current_hour_str in times:
                start_idx = times.index(current_hour_str)

            # Get next 3 hours
            for i in range(start_idx + 1, min(start_idx + 4, len(times))):
                f_temp = temps[i]
                f_hum = hums[i]
                f_risk, _ = calculate_pest_risk(f_temp, f_hum)

                forecast_list.append(
                    {
                        "time": times[i],
                        "temperature": f_temp,
                        "humidity": f_hum,
                        "pest_risk_level": f_risk,
                    }
                )

            weather_state["forecast"] = forecast_list
            weather_state["last_updated"] = datetime.now().isoformat()

            print(
                f"[WeatherService] Successfully updated weather data at {weather_state['last_updated']}."
            )
            print(f"[WeatherService] Current Temp: {temp}°C, Risk: {risk_level}")

        except Exception as e:
            print(f"[WeatherService] Error fetching weather data: {e}")


async def weather_worker():
    """Background task to fetch weather every 3 hours"""
    while True:
        await fetch_weather_data()
        # Sleep for 3 hours
        await asyncio.sleep(3 * 3600)
