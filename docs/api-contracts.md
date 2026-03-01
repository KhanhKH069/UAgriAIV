# API Contracts

## MQTT Topics (Jetson → Backend)
```
uav/{drone_id}/detection        # Kết quả phát hiện bệnh
uav/{drone_id}/gps              # GPS position realtime
uav/{drone_id}/treatment        # Phác đồ điều trị đề xuất
uav/{drone_id}/status           # Trạng thái UAV (battery, speed)
uav/{drone_id}/spray            # Trạng thái relay phun thuốc
```

## REST API Endpoints (Backend)
```
POST /api/v1/flights/           # Tạo flight session mới
GET  /api/v1/flights/           # Danh sách flight sessions
GET  /api/v1/flights/{id}       # Chi tiết 1 flight session

GET  /api/v1/detections/        # Danh sách detection results
GET  /api/v1/detections/{id}    # Chi tiết 1 detection
GET  /api/v1/detections/heatmap # GeoJSON heatmap bệnh

GET  /api/v1/treatments/        # Danh sách phác đồ
GET  /api/v1/treatments/{disease_id} # Phác đồ theo bệnh

POST /api/v1/alerts/            # Tạo alert mới
GET  /api/v1/alerts/            # Danh sách alerts
```

## Payload Mẫu - Detection
```json
{
  "drone_id": "UAV-001",
  "timestamp": "2026-03-01T10:30:00Z",
  "flight_id": "flight_20260301_001",
  "gps": { "lat": 21.0285, "lng": 105.8542, "alt": 15.5 },
  "detections": [
    {
      "disease_id": "rice_blast",
      "disease_name": "Bệnh Đạo ôn lúa",
      "confidence": 0.92,
      "bbox": [120, 85, 340, 210],
      "severity": "high"
    }
  ]
}
```
