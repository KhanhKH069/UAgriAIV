-- PostgreSQL Schema — UAV AI Crop Disease System
-- TV4: Software Lead

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;  -- GPS / spatial queries

-- ─── Bảng flight session ───────────────────────────────────
CREATE TABLE IF NOT EXISTS flights (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    drone_id    VARCHAR(50) NOT NULL,
    pilot       VARCHAR(100),
    location    VARCHAR(255),
    status      VARCHAR(20) NOT NULL DEFAULT 'active',  -- active | completed | aborted
    started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at    TIMESTAMPTZ,
    area_m2     FLOAT,
    notes       TEXT
);

-- ─── Bảng disease detection ────────────────────────────────
CREATE TABLE IF NOT EXISTS detections (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id    UUID        REFERENCES flights(id) ON DELETE CASCADE,
    drone_id     VARCHAR(50) NOT NULL,
    timestamp    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    lat          DOUBLE PRECISION NOT NULL,
    lng          DOUBLE PRECISION NOT NULL,
    alt          FLOAT,
    disease_id   VARCHAR(100) NOT NULL,
    disease_name VARCHAR(200),
    confidence   FLOAT       NOT NULL,
    severity     VARCHAR(20),     -- watch | low | medium | high
    bbox_json    JSONB,
    raw_payload  JSONB
);

CREATE INDEX IF NOT EXISTS idx_detections_flight   ON detections(flight_id);
CREATE INDEX IF NOT EXISTS idx_detections_disease  ON detections(disease_id);
CREATE INDEX IF NOT EXISTS idx_detections_severity ON detections(severity);
CREATE INDEX IF NOT EXISTS idx_detections_time     ON detections(timestamp DESC);

-- ─── Bảng treatment plan ───────────────────────────────────
CREATE TABLE IF NOT EXISTS treatment_logs (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    detection_id UUID        REFERENCES detections(id),
    action       VARCHAR(20) NOT NULL,   -- spray | monitor | remove
    medicine     VARCHAR(200),
    dose         VARCHAR(100),
    timing       VARCHAR(100),
    spray_duration_sec FLOAT,
    executed_at  TIMESTAMPTZ DEFAULT NOW(),
    status       VARCHAR(20) DEFAULT 'pending'  -- pending | done | skipped
);

-- ─── Bảng alerts ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
    id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    detection_id UUID        REFERENCES detections(id),
    channel      VARCHAR(20) NOT NULL,   -- push | sms | zalo
    message      TEXT        NOT NULL,
    sent_at      TIMESTAMPTZ DEFAULT NOW(),
    status       VARCHAR(20) DEFAULT 'sent'
);
