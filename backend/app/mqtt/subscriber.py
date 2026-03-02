"""
MQTT Subscriber — Nhận dữ liệu từ Jetson Edge → lưu DB + gửi alert
TV4: Software Lead
"""
import json
import os
import paho.mqtt.client as mqtt
from datetime import datetime

BROKER = os.getenv("MQTT_BROKER", "localhost")
PORT   = int(os.getenv("MQTT_PORT", "1883"))
TOPICS = [
    ("uav/+/detection", 0),
    ("uav/+/gps",       0),
    ("uav/+/status",    0),
]


def handle_detection(payload: dict):
    detection = payload.get("detection", {})
    severity  = detection.get("severity", "")
    disease   = detection.get("disease_name", "")
    drone_id  = payload.get("drone_id", "?")
    gps       = payload.get("gps", {})
    treatment = payload.get("treatment", {})

    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🛸 {drone_id} | {disease} | {severity.upper()}")

    # TODO: await db.execute(insert_detection, payload)

    if severity in ("medium", "high") and detection.get("disease_id") != "healthy":
        _send_alert(drone_id, disease, severity, gps, treatment)


def _send_alert(drone_id, disease, severity, gps, treatment):
    # TODO: Firebase push + Zalo OA API call
    emoji = "🔴" if severity == "high" else "🟡"
    msg = (
        f"{emoji} [{severity.upper()}] {drone_id} phát hiện {disease}\n"
        f"GPS: {gps.get('lat', 0):.5f}, {gps.get('lng', 0):.5f}"
    )
    if treatment.get("medicine"):
        msg += f"\nThuốc: {treatment['medicine']} — {treatment.get('dose', '')}"
    print(f"[ALERT] {msg}")


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ MQTT Subscriber kết nối thành công")
        client.subscribe(TOPICS)
    else:
        print(f"[ERROR] MQTT connect failed: rc={rc}")


def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode("utf-8"))
        if "/detection" in msg.topic:
            handle_detection(payload)
    except Exception as e:
        print(f"[ERROR] MQTT message: {e}")


def start_mqtt_subscriber():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER, PORT)
    client.loop_forever()


if __name__ == "__main__":
    start_mqtt_subscriber()
