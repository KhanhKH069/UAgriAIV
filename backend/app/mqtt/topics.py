"""MQTT Topic definitions"""

DETECTION  = "uav/{drone_id}/detection"
GPS        = "uav/{drone_id}/gps"
STATUS     = "uav/{drone_id}/status"
SPRAY_CMD  = "uav/{drone_id}/spray_command"
TREATMENT  = "uav/{drone_id}/treatment"


def fmt(template: str, drone_id: str) -> str:
    return template.format(drone_id=drone_id)
