# 🛸 UAV-AI-CROP-DISEASE
> Hệ thống UAV kết hợp AI tại biên để phát hiện sớm bệnh cây trồng và tự động khuyến nghị + thực hiện phác đồ điều trị thời gian thực.

## Nhóm phát triển
| # | Vai trò | Phụ trách |
|---|---|---|
| TV1 | **Hardware Lead** | `/hardware/` · UAV, Jetson, camera, relay |
| TV2 | **AI #1 — Vision** | `/ai/vision/` · Dataset, YOLOv8, TensorRT |
| TV3 | **AI #2 — Treatment** | `/ai/treatment/` · Engine, GPS heatmap |
| TV4 | **Software Lead** | `/backend/` · `/mobile/` · `/dashboard/` |

## Timeline: 4.5 tháng (18 tuần)
```
W1-3   Kiến trúc + Order linh kiện + Setup môi trường
W3-8   Hardware lắp ráp // AI train model // Backend skeleton
W7-14  Tích hợp E2E + App + Dashboard
W13-18 Pilot thực địa + Fix + Demo day
```

## Quick Start

### 1. Clone & setup
```bash
git clone <repo-url>
cd UAV-AI-CROP-DISEASE
```

### 2. Backend (TV4)
```bash
cd backend
cp .env.example .env
docker-compose up -d
# API chạy tại http://localhost:8000
# Docs: http://localhost:8000/docs
```

### 3. AI Vision — Train model (TV2)
```bash
cd ai/vision
pip install ultralytics torch
python train/yolov8_finetune.py --mode train --data train/config.yaml --epochs 100
python export/export_tensorrt.py --weights models/best.pt --benchmark
```

### 4. Edge Pipeline — Jetson Orin (TV2 + TV3)
```bash
cd edge
pip install ultralytics paho-mqtt opencv-python pyyaml
# Cập nhật pipeline-config.yaml
python main.py
```

### 5. Mobile App (TV4)
```bash
cd mobile
npm install
npx react-native run-android   # hoặc run-ios
```

### 6. Chạy E2E Tests
```bash
pip install pytest paho-mqtt requests
python tests/test_pipeline_e2e.py
```

## Kiến trúc
```
[UAV + Jetson Orin NX]
   │  Camera → YOLOv8n TRT → Treatment Engine → GPS Tag
   │  MQTT publish
   ▼
[Backend FastAPI + PostgreSQL]
   │  Subscribe MQTT → lưu DB → push alert
   ▼
[Mobile App / Web Dashboard]
   Realtime map · Cảnh báo · Phác đồ điều trị
```

## Cấu trúc thư mục
```
UAV-AI-CROP-DISEASE/
├── docs/           Kiến trúc, API contracts, treatment DB
├── hardware/       Schematics, firmware, flight logs       [TV1]
├── ai/
│   ├── vision/     Dataset, YOLOv8, TensorRT              [TV2]
│   └── treatment/  Engine, GPS mapping, MQTT publish      [TV3]
├── edge/           Pipeline chạy trên Jetson Orin         [TV2+TV3]
├── backend/        FastAPI + PostgreSQL + MQTT subscriber  [TV4]
├── mobile/         React Native App                       [TV4]
├── dashboard/      Next.js Web Dashboard                  [TV4]
└── tests/          E2E + Unit tests
```
