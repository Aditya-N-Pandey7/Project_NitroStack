import requests
from datetime import datetime

BASE_URL = "http://localhost:5000/api"


def register_device():

    payload = {
        "id": "ESP32_S3_001",
        "name": "Guardian Bridge"
    }

    try:
        response = requests.post(
            f"{BASE_URL}/device/register",
            json=payload,
            timeout=2
        )

        print("Device Registration:", response.json())

    except Exception as e:
        print("Register Error:", e)


def start_monitoring():

    payload = {
        "deviceId": "ESP32_S3_001"
    }

    try:
        response = requests.post(
            f"{BASE_URL}/monitoring/start",
            json=payload,
            timeout=2
        )

        print("Monitoring Started:", response.json())

    except Exception as e:
        print("Monitoring Error:", e)


def send_packet(packet):

    payload = {
        "deviceId": "ESP32_S3_001",
        "timestamp": datetime.utcnow().isoformat(),
        "rawPacket": packet
    }

    try:

        requests.post(
            f"{BASE_URL}/bridge",
            json=payload,
            timeout=1
        )

    except Exception:
        pass