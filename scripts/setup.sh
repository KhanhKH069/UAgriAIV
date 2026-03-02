#!/usr/bin/env bash
# =============================================================
#  UAgriAIV — Setup Script
#  Cài đặt toàn bộ dependencies bằng uv
#  Dùng: bash scripts/setup.sh
# =============================================================
set -e

GREEN='\033[0;32m'
AMBER='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[✅]${NC} $1"; }
warn()  { echo -e "${AMBER}[⚠️ ]${NC} $1"; }
error() { echo -e "${RED}[❌]${NC} $1"; exit 1; }

echo ""
echo "  🛸 UAgriAIV — Setup"
echo "  =================================="
echo ""

# ── 1. Kiểm tra uv ───────────────────────────────────────
if ! command -v uv &> /dev/null; then
    warn "uv chưa được cài. Đang cài uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
    info "uv đã cài xong: $(uv --version)"
else
    info "uv đã có: $(uv --version)"
fi

# ── 2. Python version check ───────────────────────────────
if ! command -v python3 &> /dev/null; then
    warn "Python3 chưa có — uv sẽ tự quản lý Python"
fi

# ── 3. Backend ────────────────────────────────────────────
echo ""
echo "  📦 Cài backend dependencies..."
cd backend
uv sync
cd ..
info "Backend OK"

# ── 4. AI Vision ─────────────────────────────────────────
echo ""
echo "  🧠 Cài AI/Vision dependencies..."
cd ai/vision
uv sync
cd ../..
info "AI Vision OK"

# ── 5. AI Treatment ──────────────────────────────────────
echo ""
echo "  💊 Cài AI/Treatment dependencies..."
cd ai/treatment
uv sync
cd ../..
info "AI Treatment OK"

# ── 6. Edge ──────────────────────────────────────────────
echo ""
echo "  ⚡ Cài Edge dependencies..."
cd edge
uv sync
cd ..
info "Edge OK"

# ── 7. Mobile ────────────────────────────────────────────
echo ""
echo "  📱 Cài Mobile dependencies (npm)..."
if command -v npm &> /dev/null; then
    cd mobile && npm install && cd ..
    info "Mobile OK"
else
    warn "npm không tìm thấy — bỏ qua mobile. Cài Node.js để setup mobile."
fi

# ── 8. Dashboard ─────────────────────────────────────────
echo ""
echo "  🖥️  Cài Dashboard dependencies (npm)..."
if command -v npm &> /dev/null; then
    cd dashboard && npm install && cd ..
    info "Dashboard OK"
else
    warn "npm không tìm thấy — bỏ qua dashboard."
fi

# ── 9. Copy .env ─────────────────────────────────────────
echo ""
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    warn "Đã tạo backend/.env từ .env.example — nhớ cập nhật các giá trị!"
else
    info "backend/.env đã tồn tại"
fi

echo ""
echo "  =================================="
echo "  🎉 Setup hoàn tất!"
echo ""
echo "  Tiếp theo:"
echo "    Backend  : cd backend && docker-compose up -d"
echo "    Backend  : cd backend && uv run uvicorn app.main:app --reload"
echo "    Edge     : cd edge    && uv run python main.py"
echo "    AI Train : cd ai/vision && uv run python train/yolov8_finetune.py"
echo "    Mobile   : cd mobile  && npx react-native run-android"
echo "    Dashboard: cd dashboard && npm run dev"
echo "  =================================="
echo ""
