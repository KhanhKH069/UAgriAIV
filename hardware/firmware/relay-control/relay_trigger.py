"""
Relay Control — Kích hoạt phun thuốc từ GPIO Jetson Orin
TV1: Hardware Lead
"""
import time, json
import paho.mqtt.client as mqtt
from datetime import datetime

# ---- Cấu hình ----
RELAY_PIN       = 18        # GPIO pin kết nối relay
SPRAY_DURATION  = 3.0       # Giây phun mặc định
MQTT_BROKER     = "localhost"
MQTT_TOPIC      = "uav/+/spray_command"

try:
    import Jetson.GPIO as GPIO
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(RELAY_PIN, GPIO.OUT, initial=GPIO.LOW)
    HW_AVAILABLE = True
except ImportError:
    HW_AVAILABLE = False
    print("[WARN] Jetson.GPIO không có — chạy simulation mode")

def spray(duration: float = SPRAY_DURATION):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🌿 PHUN THUỐC bắt đầu — {duration}s")
    if HW_AVAILABLE:
        GPIO.output(RELAY_PIN, GPIO.HIGH)
    time.sleep(duration)
    if HW_AVAILABLE:
        GPIO.output(RELAY_PIN, GPIO.LOW)
    print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Kết thúc phun")

def on_message(client, userdata, msg):
    try:
        cmd = json.loads(msg.payload.decode())
        if cmd.get("action") == "spray":
            spray(cmd.get("duration", SPRAY_DURATION))
    except Exception as e:
        print(f"[ERROR] relay: {e}")

if __name__ == "__main__":
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(MQTT_BROKER)
    client.subscribe(MQTT_TOPIC)
    print("🛸 Relay Control lắng nghe lệnh phun...")
    try:
        client.loop_forever()
    finally:
        if HW_AVAILABLE:
            import Jetson.GPIO as GPIO
            GPIO.cleanup()
