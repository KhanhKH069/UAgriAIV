# 🛸 UAgriAIV
> UAV × AI Edge System for Agricultural Disease Detection

**UAgriAIV** là hệ thống tích hợp UAV và Edge AI phát hiện sớm bệnh cây trồng, tự động khuyến nghị và thực thi phác đồ điều trị thời gian thực. Camera đa phổ trên UAV thu thập ảnh, xử lý trực tiếp bằng YOLOv8n TensorRT INT8 trên Jetson Orin NX (<80ms), kích hoạt phun thuốc tự động và cảnh báo nông dân qua app mobile.

---

## 🌟 Tiến độ hiện tại
- **Đa Ngôn Ngữ (i18n)**: Triển khai thành công hỗ trợ song ngữ (Tiếng Anh / Tiếng Việt) xuyên suốt hệ thống bằng `react-i18next`. Cả nền tảng Dashboard và ứng dụng Mobile đều cho phép chuyển đổi ngôn ngữ mượt mà theo thời gian thực với bộ tự điển chuyên ngành Nông nghiệp chuẩn xác.
- **Dashboard Frontend**: Đã hoàn thiện giao diện Next.js (Dark/Green theme) tối giản không sử dụng thư viện icon, tích hợp đầy đủ UI/UX Responsive, Recharts. Gồm 4 trang: Tổng quan, Tình trạng cây, Thời tiết, Quản lý UAV. Tích hợp Fetch API trực tiếp lấy dữ liệu thời tiết.
- **Mobile App**: Đã khởi tạo cấu trúc React Native, đồng bộ giao diện và Navigation (Bottom Tabs) với Dashboard, bao gồm 4 màn hình chính: Tổng quan, Tình trạng cây, Thời tiết & Đất, Quản lý UAV. Setup call API với backend.
- **Backend Mockup & Services**: Đã tích hợp FastAPI kết nối trực tiếp với Frontend. Cung cấp API mô phỏng (`/api/detections`, `/api/flights`, `/api/alerts`, `/api/treatments`) và **Service Thời tiết Thực tế** (`/api/weather/current`, `/api/weather/forecast`) dùng Open-Meteo API kèm Background Task tự làm mới mỗi 3H.

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

## 🚀 Chạy Hệ Thống Trực Tiếp (Tiêu chuẩn)

Hệ thống yêu cầu chạy đồng thời 3 service độc lập (Backend, Dashboard, Mobile) ở các cửa sổ Terminal khác nhau.

### Terminal 1: Chạy Backend (REST API + Background Tasks)
```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
# API Docs: http://localhost:8000/docs
```

### Terminal 2: Chạy Web Dashboard (Next.js)
```bash
cd dashboard
npm run dev   
# Mở trình duyệt tại: http://localhost:3000
```

### Terminal 3: Chạy Mobile App (React Native)
```bash
cd mobile
npm start
# Trong menu Metro Bundler, ấn `a` (Android) hoặc `i` (iOS) để chạy trên máy ảo tương ứng.
```

## 🔌 Chạy Edge AI & Drone Control (Dành cho Tester phần cứng)
```bash
# Edge Pipeline (trên Jetson Orin)
cd edge
uv run python main.py

# AI Training
cd ai/vision
uv run python train/yolov8_finetune.py --epochs 100
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
```text
UAgriAIV/
├── docs/                  Kiến trúc, API contracts, treatment DB
├── hardware/              Schematics, firmware, flight logs      [TV1]
├── ai/
│   ├── vision/            Dataset, YOLOv8, TensorRT             [TV2]
│   │   ├── train/         Script huấn luyện mô hình YOLO
│   │   └── export/        Script đóng gói mô hình (TensorRT)
│   └── treatment/         Engine, GPS mapping, MQTT publisher   [TV3]
│       ├── engine/        Logic phác đồ điều trị cốt lõi
│       └── mapping/       Xử lý toạ độ GPS và Bản đồ
├── edge/                  Pipeline chạy trên Jetson Orin        [TV2+TV3]
│   ├── main.py            Inference và Control Entrypoint
│   └── pipeline-config.yaml Cấu hình tham số Inference
├── backend/               FastAPI + PostgreSQL + MQTT           [TV4]
│   └── app/               Main Source Code của REST API 
├── mobile/                React Native App (i18n)               [TV4]
│   └── src/
│       ├── screens/       Các màn hình chính Mobile
│       └── locales/       Bộ từ điển đa ngôn ngữ (vi/en)
├── dashboard/             Next.js Dashboard (i18n)              [TV4]
│   ├── pages/             Next.js Routing Pages
│   └── locales/           Dữ liệu đa ngôn ngữ Web (vi/en)
├── tests/                 E2E + Unit tests tổng hợp
├── scripts/               setup.sh và các script tiện ích
└── pyproject.toml         Workspace root (uv)
```

---

## 🛠 Tech Stack
**Edge AI** — Jetson Orin NX · YOLOv8n · TensorRT INT8 · OpenCV · Python  
**Backend** — FastAPI · PostgreSQL + PostGIS · Mosquitto MQTT · Docker  
**Mobile** — React Native · Firebase Push · TypeScript · react-i18next  
**Dashboard** — Next.js · Leaflet.js · Recharts · react-i18next  
**Hardware** — Pixhawk 6C · MicaSense RedEdge-P · Here3+ GNSS · relay pump
