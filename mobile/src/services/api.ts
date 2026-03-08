// Using IP 10.0.2.2 to access localhost of the host machine from Android Emulator.
// Note: If testing on a physical device, update this to your machine's local IP address (e.g., 192.168.1.X).
const BASE_URL = 'http://10.0.2.2:8000/api'

export const fetchCurrentWeather = async () => {
    try {
        const response = await fetch(`${BASE_URL}/weather/current`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching current weather:', error)
        return null
    }
}

export const fetchWeatherForecast = async () => {
    try {
        const response = await fetch(`${BASE_URL}/weather/forecast`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching weather forecast:', error)
        return null
    }
}
