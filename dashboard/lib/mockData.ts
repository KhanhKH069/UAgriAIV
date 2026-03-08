// Mock data for development (used when API is unavailable)
import type {
    CropDetection, WeatherData, WeatherForecast,
    UAVStatus, FlightHistory, Alert
} from './api'

export const mockDetections: CropDetection[] = [
    { id: '1', timestamp: '2026-03-07T14:30:00', crop_type: 'lua', pest_type: 'Đạo ôn', severity: 'critical', affected_count: 234, field_zone: 'Khu A (Lúa)', confidence: 0.94, image_url: '/images/rice_blast.png' },
    { id: '2', timestamp: '2026-03-07T13:10:00', crop_type: 'lua', pest_type: 'Sâu đục thân', severity: 'high', affected_count: 89, field_zone: 'Khu B (Lúa)', confidence: 0.88, image_url: '/images/rice_leaf_folder.png' },
    { id: '3', timestamp: '2026-03-07T11:50:00', crop_type: 'ca_chua', pest_type: 'Sương mai', severity: 'medium', affected_count: 45, field_zone: 'Khu C (Cà chua)', confidence: 0.79, image_url: '/images/tomato_late_blight.png' },
    { id: '4', timestamp: '2026-03-07T10:00:00', crop_type: 'ca_chua', pest_type: 'Khảm lá', severity: 'low', affected_count: 12, field_zone: 'Khu D (Cà chua)', confidence: 0.82, image_url: '/images/tomato_mosaic_virus.png' },
]

export const mockWeather: WeatherData = {
    temperature: 28.5,
    humidity: 85,
    wind_speed: 12,
    condition: 'Partly Cloudy',
    icon: '02d',
    timestamp: new Date().toISOString(),
    pest_risk_level: 'high',
    pest_risk_reason: 'Độ ẩm độ >85% tạo điều kiện thuận lợi cho bào tử nấm Sương mai (Cà chua) và Đạo ôn (Lúa) phát triển',
    soil_moisture: 68,
    soil_ph: 6.2,
    soil_temp: 26.3,
}

export const mockForecast: WeatherForecast[] = [
    { date: '2026-03-08', temp_min: 24, temp_max: 31, humidity: 78, condition: 'Sunny', pest_risk: 'medium' },
    { date: '2026-03-09', temp_min: 22, temp_max: 29, humidity: 85, condition: 'Rainy', pest_risk: 'high' },
    { date: '2026-03-10', temp_min: 23, temp_max: 30, humidity: 80, condition: 'Partly Cloudy', pest_risk: 'high' },
    { date: '2026-03-11', temp_min: 25, temp_max: 32, humidity: 72, condition: 'Sunny', pest_risk: 'medium' },
    { date: '2026-03-12', temp_min: 26, temp_max: 33, humidity: 65, condition: 'Clear', pest_risk: 'low' },
]

export const mockUAVs: UAVStatus[] = [
    { id: 'uav-1', name: 'Agri-Hawk 01', status: 'active', battery: 78, last_flight: '2026-03-07T09:00:00', remaining_flight_time: 42, total_area_scanned: 1240, current_speed: 24, scan_speed: 4.2 },
    { id: 'uav-2', name: 'Agri-Hawk 02', status: 'charging', battery: 35, last_flight: '2026-03-06T15:30:00', remaining_flight_time: 0, total_area_scanned: 980, current_speed: 0, scan_speed: 0 },
    { id: 'uav-3', name: 'Agri-Hawk 03', status: 'idle', battery: 95, last_flight: '2026-03-07T07:15:00', remaining_flight_time: 68, total_area_scanned: 1560, current_speed: 0, scan_speed: 0 },
]

export const mockFlights: FlightHistory[] = [
    { id: 'f1', uav_id: 'uav-1', date: '2026-03-07', duration: 87, area_covered: 36.4, flight_type: 'surveillance', avg_speed: 22, status: 'completed' },
    { id: 'f2', uav_id: 'uav-2', date: '2026-03-06', duration: 64, area_covered: 28.1, flight_type: 'spraying', avg_speed: 18, status: 'completed' },
    { id: 'f3', uav_id: 'uav-3', date: '2026-03-06', duration: 42, area_covered: 19.6, flight_type: 'mapping', avg_speed: 26, status: 'completed' },
    { id: 'f4', uav_id: 'uav-1', date: '2026-03-05', duration: 110, area_covered: 48.2, flight_type: 'surveillance', avg_speed: 24, status: 'completed' },
    { id: 'f5', uav_id: 'uav-2', date: '2026-03-05', duration: 22, area_covered: 8.3, flight_type: 'spraying', avg_speed: 16, status: 'aborted' },
    { id: 'f6', uav_id: 'uav-1', date: '2026-03-08', duration: 0, area_covered: 0, flight_type: 'mapping', avg_speed: 0, status: 'scheduled' },
]

export const mockAlerts: Alert[] = [
    { id: 'a1', type: 'pest', severity: 'critical', message: 'Phát hiện Đạo ôn lây lan nhanh tại ruộng Lúa Khu A – cần xử lý trong 24h', timestamp: '2026-03-07T14:30:00', resolved: false },
    { id: 'a2', type: 'weather', severity: 'high', message: 'Mưa ẩm kéo dài – thuận lợi bùng phát Sương mai trên Cà chua (Khu C, Khu D)', timestamp: '2026-03-07T12:00:00', resolved: false },
    { id: 'a3', type: 'disease', severity: 'medium', message: 'Nguy cơ Sâu đục thân lúa tăng cao ở giai đoạn đẻ nhánh (Khu B)', timestamp: '2026-03-07T08:00:00', resolved: false },
    { id: 'a4', type: 'irrigation', severity: 'low', message: 'Đất Khu D (Cà chua) đã đạt độ ẩm 70%, hệ thống tự động ngắt tưới', timestamp: '2026-03-07T06:05:00', resolved: true },
]
