"""
Edge Pipeline — Entry Point chạy trên Jetson Orin NX
Camera → YOLOv8 Inference → Treatment Engine → MQTT → Relay
TV2 + TV3
Run: uv run python main.py
"""
import cv2
import json
import sys
import time
from pathlib import Path
from datetime import datetime, timezone

import yaml

sys.path.append(str(Path(__file__).parent.parent))
from ai.treatment.engine.recommender import TreatmentEngine, DetectionResult
from ai.treatment.mapping.heatmap_builder import GPSTagger, HeatmapBuilder
from ai.treatment.edge_publisher.mqtt_publisher import MQTTPublisher

CFG_PATH = Path(__file__).parent / "pipeline-config.yaml"


class EdgePipeline:
    def __init__(self, cfg_path: str = CFG_PATH):
        with open(cfg_path) as f:
            self.cfg = yaml.safe_load(f)

        self.flight_id = f"flight_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.gps       = {"lat": 0.0, "lng": 0.0, "alt": 0.0}

        self.engine    = TreatmentEngine()
        self.tagger    = GPSTagger()
        self.heatmap   = HeatmapBuilder()
        self.mqtt      = MQTTPublisher(
            broker   = self.cfg["mqtt"]["broker"],
            port     = self.cfg["mqtt"]["port"],
            drone_id = self.cfg["drone"]["id"],
        )
        self._load_model()
        print(f"✅ Edge pipeline sẵn sàng — {self.flight_id}")

    def _load_model(self):
        try:
            from ultralytics import YOLO
            self.model = YOLO(self.cfg["model"]["engine_path"])
            print(f"🧠 Model loaded: {self.cfg['model']['engine_path']}")
        except Exception as e:
            print(f"[WARN] Không load được model: {e} — simulation mode")
            self.model = None

    def _init_relay(self):
        try:
            import Jetson.GPIO as GPIO
            self.gpio = GPIO
            GPIO.setmode(GPIO.BOARD)
            GPIO.setup(self.cfg["spray"]["gpio_pin"], GPIO.OUT, initial=GPIO.LOW)
        except ImportError:
            self.gpio = None

    def update_gps(self, lat: float, lng: float, alt: float = 0.0):
        self.gps = {"lat": lat, "lng": lng, "alt": alt}

    def process_frame(self, frame):
        if self.model is None:
            return

        t0    = time.perf_counter()
        preds = self.model.predict(source=frame, verbose=False,
                                   conf=self.cfg["model"]["conf_threshold"])
        latency = (time.perf_counter() - t0) * 1000

        for box in preds[0].boxes:
            cls_id     = int(box.cls[0])
            confidence = float(box.conf[0])
            disease_id = self.model.names.get(cls_id, "unknown")

            det  = DetectionResult(disease_id=disease_id, confidence=confidence, bbox=box.xyxy[0].tolist())
            plan = self.engine.recommend(det)

            detection_payload = {
                "disease_id":   det.disease_id,
                "disease_name": plan.disease_name,
                "confidence":   round(confidence, 3),
                "severity":     plan.severity,
            }
            treatment_payload = {
                "action":   plan.action,
                "medicine": plan.medicine,
                "dose":     plan.dose,
                "timing":   plan.timing,
            }

            self.mqtt.publish_detection(
                self.flight_id, self.gps,
                detection_payload, treatment_payload, latency,
            )

            if plan.action == "spray":
                self.mqtt.publish_spray_command(self.cfg["spray"]["default_duration_sec"])

            geo_pt = self.tagger.tag(
                {"disease_id": det.disease_id, "confidence": confidence, "disease_name": plan.disease_name},
                self.gps,
                {"severity": plan.severity, "action": plan.action},
            )
            self.heatmap.add(geo_pt)

    def run(self):
        cap = cv2.VideoCapture(self.cfg["camera"]["index"])
        if not cap.isOpened():
            print("[ERROR] Không mở được camera")
            return

        print("🎥 Camera stream bắt đầu...")
        try:
            while True:
                ret, frame = cap.read()
                if ret:
                    self.process_frame(frame)
        except KeyboardInterrupt:
            print("\n🛑 Dừng pipeline")
        finally:
            cap.release()
            out = f"ai/treatment/mapping/geojson/{self.flight_id}.geojson"
            self.heatmap.save(out)
            self.mqtt.disconnect()


if __name__ == "__main__":
    EdgePipeline().run()
