"""
MQTT Publisher — Gửi kết quả từ Edge lên Cloud
TV3: AI/ML #2
"""
import json
import paho.mqtt.client as mqtt
from datetime import datetime, timezone


class MQTTPublisher:
    def __init__(self, broker: str, port: int, drone_id: str):
        self.drone_id = drone_id
        self.client   = mqtt.Client()
        self.client.connect(broker, port)
        self.client.loop_start()

    def publish_detection(self, flight_id: str, gps: dict, detection: dict, treatment: dict, latency_ms: float):
        payload = {
            "drone_id":   self.drone_id,
            "flight_id":  flight_id,
            "timestamp":  datetime.now(timezone.utc).isoformat(),
            "gps":        gps,
            "latency_ms": round(latency_ms, 1),
            "detection":  detection,
            "treatment":  treatment,
        }
        topic = f"uav/{self.drone_id}/detection"
        self.client.publish(topic, json.dumps(payload, ensure_ascii=False))

    def publish_spray_command(self, duration: float = 3.0):
        topic   = f"uav/{self.drone_id}/spray_command"
        payload = json.dumps({"action": "spray", "duration": duration})
        self.client.publish(topic, payload)

    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()
