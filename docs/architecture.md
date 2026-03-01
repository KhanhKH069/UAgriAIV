# Kiến trúc Hệ thống UAV-AI Phát Hiện Bệnh Cây Trồng

## Tổng quan
```
[Multispectral Cam] ──► [Jetson Orin NX]
                              │
                    ┌─────────┴──────────┐
               [YOLOv8n]        [Treatment Engine]
               [TensorRT]       [GPS Tagger]
                    │                │
               [MQTT Publisher] ◄────┘
                    │
              [4G / WiFi]
                    │
           [Backend FastAPI]
           [PostgreSQL DB]
                    │
        ┌───────────┴──────────┐
  [Mobile App]          [Web Dashboard]
  [React Native]        [Next.js]
```

## Stack kỹ thuật
| Layer | Công nghệ |
|---|---|
| Edge AI | NVIDIA Jetson Orin NX 16GB |
| Vision Model | YOLOv8n → TensorRT INT8 |
| Treatment | Rule-based engine + JSON DB |
| Messaging | MQTT (Mosquitto broker) |
| Backend | FastAPI + PostgreSQL |
| Mobile | React Native (iOS + Android) |
| Dashboard | Next.js + Mapbox/Leaflet |
| Notifications | Firebase Push + Zalo OA |

## Luồng dữ liệu
1. UAV bay → Jetson Orin chụp ảnh liên tục
2. YOLOv8n detect bệnh trên ảnh (< 80ms)
3. Treatment Engine tra bảng → tạo phác đồ
4. GPS Tagger gắn tọa độ vào kết quả
5. MQTT publish → Cloud backend
6. Backend lưu DB + trigger notification
7. App/Dashboard hiển thị realtime cho nông dân
8. Nếu severity cao → trigger relay phun thuốc tự động
