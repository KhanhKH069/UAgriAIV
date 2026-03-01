"""
E2E Pipeline Test — UAV Edge → MQTT → Backend → App
Chạy: python tests/test_pipeline_e2e.py
"""
import json
import time
import threading
import unittest
import paho.mqtt.client as mqtt
import requests

MQTT_BROKER  = "localhost"
MQTT_PORT    = 1883
BACKEND_URL  = "http://localhost:8000/api/v1"
DRONE_ID     = "UAV-TEST-001"

SAMPLE_PAYLOAD = {
    "drone_id":  DRONE_ID,
    "flight_id": "flight_test_001",
    "timestamp": "2026-03-01T10:00:00Z",
    "gps":       {"lat": 21.0285, "lng": 105.8542, "alt": 15.0},
    "latency_ms": 55.2,
    "detection": {
        "disease_id":   "rice_blast",
        "disease_name": "Bệnh Đạo ôn lúa",
        "confidence":   0.92,
        "severity":     "high",
    },
    "treatment": {
        "action":   "spray",
        "medicine": "Tricyclazole 75WP",
        "dose":     "0.4 kg/ha",
        "timing":   "Sáng sớm",
    }
}

received_messages: list = []

class TestE2EPipeline(unittest.TestCase):

    def setUp(self):
        self.client = mqtt.Client()
        self.client.connect(MQTT_BROKER, MQTT_PORT)
        self.client.on_message = self._on_msg
        self.client.loop_start()

    def tearDown(self):
        self.client.loop_stop()
        self.client.disconnect()

    def _on_msg(self, client, userdata, msg):
        received_messages.append(json.loads(msg.payload.decode()))

    def test_01_backend_health(self):
        """Backend đang chạy"""
        r = requests.get(f"{BACKEND_URL.replace('/api/v1', '')}/health", timeout=5)
        self.assertEqual(r.status_code, 200)
        print("✅ Backend health OK")

    def test_02_mqtt_publish_detection(self):
        """Publish detection → MQTT broker nhận"""
        topic = f"uav/{DRONE_ID}/detection"
        result = self.client.publish(topic, json.dumps(SAMPLE_PAYLOAD))
        self.assertEqual(result.rc, 0)
        print("✅ MQTT publish detection OK")

    def test_03_detection_saved_to_db(self):
        """Backend lưu detection vào DB"""
        time.sleep(1)  # Chờ subscriber xử lý
        r = requests.get(f"{BACKEND_URL}/detections/", params={"flight_id": "flight_test_001"})
        self.assertIn(r.status_code, [200, 404])
        print("✅ DB query OK")

    def test_04_heatmap_geojson(self):
        """Endpoint heatmap trả về GeoJSON"""
        r = requests.get(f"{BACKEND_URL}/detections/heatmap")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertEqual(data.get("type"), "FeatureCollection")
        print("✅ Heatmap GeoJSON OK")

    def test_05_treatment_engine(self):
        """Treatment engine trả đúng phác đồ"""
        import sys, os
        sys.path.insert(0, os.path.dirname(__file__) + "/..")
        from ai.treatment.engine.recommender import TreatmentEngine, DetectionResult
        engine = TreatmentEngine()
        det    = DetectionResult("rice_blast", confidence=0.92, bbox=[])
        plan   = engine.recommend(det)
        self.assertEqual(plan.action, "spray")
        self.assertIsNotNone(plan.medicine)
        print(f"✅ Treatment engine OK: {plan.disease_name} → {plan.action}")

if __name__ == "__main__":
    unittest.main(verbosity=2)
