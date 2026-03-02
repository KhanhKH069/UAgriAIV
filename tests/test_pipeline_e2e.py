"""
E2E Pipeline Test — UAV Edge → MQTT → Backend → App
Run: uv run pytest tests/test_pipeline_e2e.py -v
Yêu cầu: backend + MQTT đang chạy (docker-compose up -d)
"""
import json, time, sys, os
sys.path.insert(0, os.path.dirname(__file__) + "/..")

import pytest
import paho.mqtt.client as mqtt
import requests

MQTT_BROKER = "localhost"
BACKEND_URL = "http://localhost:8000"
DRONE_ID    = "UAV-TEST-001"

SAMPLE = {
    "drone_id":  DRONE_ID,
    "flight_id": "flight_test_001",
    "timestamp": "2026-03-01T10:00:00Z",
    "gps":       {"lat": 21.0285, "lng": 105.8542, "alt": 15.0},
    "latency_ms": 55.2,
    "detection": {"disease_id": "rice_blast", "disease_name": "Đạo ôn", "confidence": 0.92, "severity": "high"},
    "treatment": {"action": "spray", "medicine": "Tricyclazole 75WP", "dose": "0.4 kg/ha"},
}


def test_backend_health():
    r = requests.get(f"{BACKEND_URL}/health", timeout=5)
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_mqtt_publish():
    client = mqtt.Client()
    client.connect(MQTT_BROKER, 1883)
    result = client.publish(f"uav/{DRONE_ID}/detection", json.dumps(SAMPLE))
    client.disconnect()
    assert result.rc == 0


def test_heatmap_geojson():
    r = requests.get(f"{BACKEND_URL}/api/v1/detections/heatmap")
    assert r.status_code == 200
    assert r.json()["type"] == "FeatureCollection"


def test_treatment_endpoint():
    r = requests.get(f"{BACKEND_URL}/api/v1/treatments/rice_blast")
    assert r.status_code == 200
    data = r.json()
    assert "treatment" in data
    assert data["id"] == "rice_blast"
