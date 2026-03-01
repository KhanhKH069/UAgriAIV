"""
MQTT Subscriber — Nhận dữ liệu từ Jetson Edge → lưu DB + gửi alert
TV4: Software Lead
"""
import json
import paho.mqtt.client as mqtt
from datetime import datetime

BROKER  = "localhost"
PORT    = 1883
TOPICS  = [
    ("uav/+/detection", 0),
    ("uav/+/gps",       0),
    ("uav/+/status",    0),
]

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ MQTT Subscriber kết nối thành công")
        client.subscribe(TOPICS)
    else:
        print(f"[ERROR] MQTT connect failed: rc={rc}")

def handle_detection(payload: dict):
    """Xử lý kết quả phát hiện bệnh — lưu DB + trigger alert"""
    drone_id   = payload.get("drone_id")
    flight_id  = payload.get("flight_id")
    gps        = payload.get("gps", {})
    detection  = payload.get("detection", {})
    treatment  = payload.get("treatment", {})

    severity = detection.get("severity", "")
    disease  = detection.get("disease_name", "")

    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🛸 {drone_id} | {disease} | {severity.upper()}")

    # TODO: lưu vào PostgreSQL
    # await db.execute(insert_detection_query, payload)

    # Gửi alert nếu severity cao
    if severity in ("medium", "high") and detection.get("disease_id") != "healthy":
        send_alert(drone_id, disease, severity, gps, treatment)

def send_alert(drone_id, disease, severity, gps, treatment):
    """Gửi push notification / Zalo"""
    # TODO: gọi Firebase push + Zalo OA API
    emoji = "🔴" if severity == "high" else "🟡"
    msg = f"{emoji} [{severity.upper()}] UAV {drone_id} phát hiện {disease}\n"
    if treatment.get("medicine"):
        msg += f"Thuốc: {treatment['medicine']} — {treatment.get('dose', '')}\n"
    msg += f"GPS: {gps.get('lat', 0):.5f}, {gps.get('lng', 0):.5f}"
    print(f"[ALERT] {msg}")

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
