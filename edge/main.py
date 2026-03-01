"""
Edge Pipeline — Entry Point chạy trên Jetson Orin NX
Điều phối: Camera → Inference → Treatment → MQTT → Relay
TV2 + TV3
"""
import cv2
import json
import time
import threading
import yaml
import paho.mqtt.client as mqtt
from pathlib import Path
from datetime import datetime

# ── Import internal modules ──────────────────────────────
import sys
sys.path.append(str(Path(__file__).parent.parent / "ai"))
from treatment.engine.recommender import TreatmentEngine, DetectionResult
from treatment.mapping.heatmap_builder import GPSTagger, HeatmapBuilder

CFG_PATH = Path(__file__).parent / "pipeline-config.yaml"

class EdgePipeline:
    def __init__(self, cfg_path: str = CFG_PATH):
        with open(cfg_path) as f:
            self.cfg = yaml.safe_load(f)

        self.engine  = TreatmentEngine()
        self.tagger  = GPSTagger()
        self.heatmap = HeatmapBuilder()
        self.gps     = {"lat": 0.0, "lng": 0.0, "alt": 0.0}
        self.flight_id = f"flight_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        # MQTT
        self.mq = mqtt.Client()
        self.mq.connect(
            self.cfg["mqtt"]["broker"],
            self.cfg["mqtt"]["port"],
        )
        self.mq.loop_start()

        # Load TensorRT model
        self._load_model()
        print(f"✅ Edge pipeline sẵn sàng — Flight ID: {self.flight_id}")

    def _load_model(self):
        try:
            from ultralytics import YOLO
            model_path = self.cfg["model"]["engine_path"]
            self.model = YOLO(model_path)
            print(f"🧠 Model loaded: {model_path}")
        except Exception as e:
            print(f"[WARN] Không load được model: {e}")
            self.model = None

    def update_gps(self, lat: float, lng: float, alt: float = 0):
        self.gps = {"lat": lat, "lng": lng, "alt": alt}

    def process_frame(self, frame):
        if self.model is None:
            return []

        t0   = time.perf_counter()
        preds = self.model.predict(source=frame, verbose=False, conf=0.5)
        latency = (time.perf_counter() - t0) * 1000

        detections = []
        for box in preds[0].boxes:
            cls_id = int(box.cls[0])
            conf   = float(box.conf[0])
            cls_names = self.model.names
            disease_id = cls_names.get(cls_id, "unknown")

            det = DetectionResult(
                disease_id = disease_id,
                confidence = conf,
                bbox       = box.xyxy[0].tolist(),
            )
            plan = self.engine.recommend(det)

            payload = {
                "drone_id"  : self.cfg["drone"]["id"],
                "flight_id" : self.flight_id,
                "timestamp" : datetime.utcnow().isoformat() + "Z",
                "gps"       : self.gps,
                "latency_ms": round(latency, 1),
                "detection" : {
                    "disease_id"  : det.disease_id,
                    "disease_name": plan.disease_name,
                    "confidence"  : round(conf, 3),
                    "severity"    : plan.severity,
                },
                "treatment" : {
                    "action"  : plan.action,
                    "medicine": plan.medicine,
                    "dose"    : plan.dose,
                    "timing"  : plan.timing,
                }
            }

            # Publish MQTT
            topic = f"uav/{self.cfg['drone']['id']}/detection"
            self.mq.publish(topic, json.dumps(payload, ensure_ascii=False))

            # Trigger phun nếu cần
            if plan.action == "spray":
                spray_cmd = json.dumps({"action": "spray", "duration": 3.0})
                self.mq.publish(f"uav/{self.cfg['drone']['id']}/spray_command", spray_cmd)

            # Ghi heatmap
            geo_pt = self.tagger.tag(
                {"disease_id": det.disease_id, "confidence": conf, "disease_name": plan.disease_name},
                self.gps,
                {"severity": plan.severity, "action": plan.action}
            )
            self.heatmap.add(geo_pt)
            detections.append(payload)

        return detections

    def run(self):
        cam_idx = self.cfg["camera"]["index"]
        cap = cv2.VideoCapture(cam_idx)
        if not cap.isOpened():
            print(f"[ERROR] Không mở được camera index {cam_idx}")
            return

        print("🎥 Camera bắt đầu stream...")
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    continue
                self.process_frame(frame)
        except KeyboardInterrupt:
            print("\n🛑 Dừng pipeline")
        finally:
            cap.release()
            heatmap_out = f"ai/treatment/mapping/geojson/{self.flight_id}.geojson"
            self.heatmap.save(heatmap_out)
            self.mq.loop_stop()

if __name__ == "__main__":
    pipeline = EdgePipeline()
    pipeline.run()
