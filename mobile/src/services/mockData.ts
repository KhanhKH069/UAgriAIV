export interface CropDetection {
    id: string; timestamp: string; crop_type: string; pest_type: string;
    severity: string; affected_count: number; field_zone: string;
    confidence: number; image_url: string;
}
export interface WeatherData {
    temperature: number; humidity: number; wind_speed: number;
    condition: string; icon: string; timestamp: string;
    pest_risk_level: string; pest_risk_reason: string;
    soil_moisture: number; soil_ph: number; soil_temp: number;
}
export interface UAVStatus {
    id: string; name: string; status: string; battery: number;
    last_flight: string; remaining_flight_time: number;
    total_area_scanned: number; current_speed: number; scan_speed: number;
}
export interface Alert {
    id: string; type: string; severity: string; message: string;
    timestamp: string; resolved: boolean;
}

export const mockDetections: CropDetection[] = [
    { id: '1', timestamp: '2026-03-07T14:30:00', crop_type: 'lua', pest_type: 'Đạo ôn', severity: 'critical', affected_count: 234, field_zone: 'Khu A (Lúa)', confidence: 0.94, image_url: '' },
    { id: '2', timestamp: '2026-03-07T13:10:00', crop_type: 'lua', pest_type: 'Sâu đục thân', severity: 'high', affected_count: 89, field_zone: 'Khu B (Lúa)', confidence: 0.88, image_url: '' },
    { id: '3', timestamp: '2026-03-07T11:50:00', crop_type: 'ca_chua', pest_type: 'Sương mai', severity: 'medium', affected_count: 45, field_zone: 'Khu C (Cà chua)', confidence: 0.79, image_url: '' },
    { id: '4', timestamp: '2026-03-07T10:00:00', crop_type: 'ca_chua', pest_type: 'Khảm lá', severity: 'low', affected_count: 12, field_zone: 'Khu D (Cà chua)', confidence: 0.82, image_url: '' },
];

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
};

export const mockUAVs: UAVStatus[] = [
    { id: 'uav-1', name: 'Agri-Hawk 01', status: 'active', battery: 78, last_flight: '2026-03-07T09:00:00', remaining_flight_time: 42, total_area_scanned: 1240, current_speed: 24, scan_speed: 4.2 },
    { id: 'uav-2', name: 'Agri-Hawk 02', status: 'charging', battery: 35, last_flight: '2026-03-06T15:30:00', remaining_flight_time: 0, total_area_scanned: 980, current_speed: 0, scan_speed: 0 },
    { id: 'uav-3', name: 'Agri-Hawk 03', status: 'idle', battery: 95, last_flight: '2026-03-07T07:15:00', remaining_flight_time: 68, total_area_scanned: 1560, current_speed: 0, scan_speed: 0 },
];

export const mockAlerts: Alert[] = [
    { id: 'a1', type: 'pest', severity: 'critical', message: 'Phát hiện Đạo ôn lây lan nhanh tại ruộng Lúa Khu A – cần xử lý trong 24h', timestamp: '2026-03-07T14:30:00', resolved: false },
    { id: 'a2', type: 'weather', severity: 'high', message: 'Mưa ẩm kéo dài – thuận lợi bùng phát Sương mai trên Cà chua (Khu C, Khu D)', timestamp: '2026-03-07T12:00:00', resolved: false },
    { id: 'a3', type: 'disease', severity: 'medium', message: 'Nguy cơ Sâu đục thân lúa tăng cao ở giai đoạn đẻ nhánh (Khu B)', timestamp: '2026-03-07T08:00:00', resolved: false },
];
