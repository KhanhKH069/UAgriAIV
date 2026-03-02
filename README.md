# 🛸 UAgriAIV
> UAV × AI Edge System for Agricultural Disease Detection

**UAgriAIV** là hệ thống tích hợp UAV và Edge AI phát hiện sớm bệnh cây trồng, tự động khuyến nghị và thực thi phác đồ điều trị thời gian thực. Camera đa phổ trên UAV thu thập ảnh, xử lý trực tiếp bằng YOLOv8n TensorRT INT8 trên Jetson Orin NX (<80ms), kích hoạt phun thuốc tự động và cảnh báo nông dân qua app mobile.

---

## 🧑‍💻 Team
| # | Vai trò | Phụ trách |
|---|---|---|
| TV1 | Hardware | `/hardware/` |
| TV2 | AI #1 — Vision | `/ai/vision/` |
| TV3 | AI #2 — Treatment | `/ai/treatment/` |
| TV4 | Software | `/backend/` · `/mobile/` · `/dashboard/` |

---

## ⚡ Quick Setup (dùng uv)

### 1. Cài uv (nếu chưa có)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```
> Windows: `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`

### 2. Clone & setup tự động
```bash
git clone <repo-url>
cd UAgriAIV
bash scripts/setup.sh
```

### 3. Hoặc setup thủ công từng module
```bash
# Backend
cd backend && uv sync

# AI Vision
cd ai/vision && uv sync

# AI Treatment
cd ai/treatment && uv sync

# Edge (Jetson)
cd edge && uv sync

# Mobile + Dashboard
cd mobile    && npm install
cd dashboard && npm install
```

---

## 🚀 Chạy

```bash
# Backend API + DB + MQTT
cd backend
docker-compose up -d
uv run uvicorn app.main:app --reload --port 8000
# Docs: http://localhost:8000/docs

# Edge Pipeline (trên Jetson Orin)
cd edge
uv run python main.py

# AI Training
cd ai/vision
uv run python train/yolov8_finetune.py --epochs 100

# Mobile App
cd mobile
npx react-native run-android

# Web Dashboard
cd dashboard
npm run dev   # http://localhost:3000
```

---

## 🧪 Tests
```bash
# Unit test treatment engine
cd ai/treatment
uv run pytest ../../tests/test_treatment_engine.py -v

# E2E pipeline test (cần backend + MQTT đang chạy)
uv run pytest tests/test_pipeline_e2e.py -v
```

---

## 📁 Cấu trúc
```
UAgriAIV/
├── docs/                  Kiến trúc, API contracts, treatment DB
├── hardware/              Schematics, firmware, flight logs      [TV1]
├── ai/
│   ├── vision/            Dataset, YOLOv8, TensorRT             [TV2]
│   └── treatment/         Engine, GPS mapping, MQTT publisher   [TV3]
├── edge/                  Pipeline chạy trên Jetson Orin        [TV2+TV3]
├── backend/               FastAPI + PostgreSQL + MQTT           [TV4]
├── mobile/                React Native App                      [TV4]
├── dashboard/             Next.js Dashboard                     [TV4]
├── tests/                 E2E + Unit tests
├── scripts/               setup.sh và các script tiện ích
└── pyproject.toml         Workspace root (uv)
```

---

## 🛠 Tech Stack
**Edge AI** — Jetson Orin NX · YOLOv8n · TensorRT INT8 · OpenCV · Python  
**Backend** — FastAPI · PostgreSQL + PostGIS · Mosquitto MQTT · Docker  
**Mobile** — React Native · Firebase Push · TypeScript  
**Dashboard** — Next.js · Leaflet.js · Recharts  
**Hardware** — Pixhawk 6C · MicaSense RedEdge-P · Here3+ GNSS · relay pump
