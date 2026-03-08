import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
})

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CropDetection {
    id: string
    timestamp: string
    crop_type?: string
    pest_type: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    affected_count: number
    field_zone: string
    confidence: number
    image_url?: string
}

export interface WeatherData {
    temperature: number
    humidity: number
    wind_speed: number
    condition: string
    icon: string
    timestamp: string
    pest_risk_level: 'high' | 'medium' | 'low'
    pest_risk_reason: string
    soil_moisture: number
    soil_ph: number
    soil_temp: number
}

export interface WeatherForecast {
    date: string
    temp_min: number
    temp_max: number
    humidity: number
    condition: string
    pest_risk: 'high' | 'medium' | 'low'
}

export interface UAVStatus {
    id: string
    name: string
    status: 'active' | 'idle' | 'charging' | 'maintenance'
    battery: number
    last_flight: string
    remaining_flight_time: number  // minutes
    total_area_scanned: number     // hectares
    current_speed: number          // km/h
    scan_speed: number             // ha/h
}

export interface FlightHistory {
    id: string
    uav_id: string
    date: string
    duration: number     // minutes
    area_covered: number // hectares
    flight_type: 'surveillance' | 'spraying' | 'mapping'
    avg_speed: number    // km/h
    status: 'completed' | 'aborted' | 'scheduled'
}

export interface Alert {
    id: string
    type: 'pest' | 'weather' | 'disease' | 'irrigation'
    severity: 'critical' | 'high' | 'medium' | 'low'
    message: string
    timestamp: string
    resolved: boolean
}

export interface TreatmentPlan {
    pest_type: string
    severity: string
    recommended_pesticides: {
        name: string
        dosage: string
        frequency: string
        cost_per_ha: number
    }[]
    application_method: string
    target_zones: string[]
    estimated_effectiveness: number
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export const getCropDetections = () =>
    api.get<CropDetection[]>('/api/detections').then(r => r.data)

export const getWeatherCurrent = () =>
    api.get<WeatherData>('/api/weather/current').then(r => r.data)

export const getWeatherForecast = () =>
    api.get<WeatherForecast[]>('/api/weather/forecast').then(r => r.data)

export const getUAVStatus = () =>
    api.get<UAVStatus[]>('/api/uav/status').then(r => r.data)

export const getFlightHistory = () =>
    api.get<FlightHistory[]>('/api/flights').then(r => r.data)

export const getAlerts = () =>
    api.get<Alert[]>('/api/alerts').then(r => r.data)

export const getTreatmentPlan = (pestType: string, severity: string) =>
    api.get<TreatmentPlan>(`/api/treatments/plan?pest=${pestType}&severity=${severity}`).then(r => r.data)

export const triggerIrrigation = () =>
    api.post('/api/irrigation/trigger').then(r => r.data)
