# Kiến trúc Hệ thống UAgriAIV

## Luồng dữ liệu
```
[Multispectral Cam + RGB] ──► [Jetson Orin NX]
                                      │
                          ┌───────────┴──────────────┐
                    [YOLOv8n TRT]         [Treatment Engine]
                    < 80ms latency        [GPS Tagger]
                          │                     │
                    [MQTT Publisher] ◄───────────┘
                          │  (4G / WiFi)
                   [Mosquitto Broker]
                          │
                  [FastAPI Backend]
                  [PostgreSQL + PostGIS]
                          │
             ┌────────────┴─────────────┐
       [Mobile App]             [Web Dashboard]
       [React Native]           [Next.js + Leaflet]
       [Firebase Push]          [Recharts]
```

## Tech Stack
| Layer | Công nghệ |
|---|---|
| Edge Compute | NVIDIA Jetson Orin NX 16GB |
| Vision Model | YOLOv8n → TensorRT INT8 |
| Treatment | Rule-based engine + JSON DB |
| Messaging | MQTT (Eclipse Mosquitto) |
| Backend | FastAPI + PostgreSQL + PostGIS |
| Mobile | React Native (iOS + Android) |
| Dashboard | Next.js + Leaflet.js |
| Notifications | Firebase Push + Zalo OA |
| Package Mgr | uv (Python) · npm (JS) |

## Phân công thư mục
| Người | Vai trò | Thư mục |
|---|---|---|
| TV1 | Hardware | `/hardware/` |
| TV2 | AI Vision | `/ai/vision/` · `/edge/` |
| TV3 | AI Treatment | `/ai/treatment/` · `/edge/` |
| TV4 | Software | `/backend/` · `/mobile/` · `/dashboard/` |
