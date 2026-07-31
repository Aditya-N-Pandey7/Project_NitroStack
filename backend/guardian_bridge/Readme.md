# Guardian Bridge

Guardian Bridge is the hardware communication layer of the GuardianSense project. It is responsible for receiving CSI (Channel State Information) packets from the ESP32-S3 receiver, validating and parsing them, and saving them as structured JSON datasets for AI training or forwarding them to the GuardianSense backend.

---

# Responsibilities

Guardian Bridge is responsible for:

- Connecting to the ESP32-S3 Receiver
- Reading CSI packets over Serial
- Validating incoming packets
- Parsing CSI data
- Recording datasets
- Writing structured JSONL files
- Automatically reconnecting to the receiver if disconnected

Guardian Bridge **does not** perform:

- AI inference
- Fall detection logic
- Backend state management
- Dashboard rendering
- Device management

Those responsibilities belong to the GuardianSense backend.

---

# Project Structure

```
guardian_bridge/

├── config.py              # Configuration (COM port, baud rate)
├── serial_manager.py      # Serial communication with ESP32-S3
├── packet_validator.py    # Filters valid CSI packets
├── csi_parser.py          # Converts raw CSI into structured Python objects
├── dataset_writer.py      # Writes packets into JSONL datasets
├── runtime.py             # Main Guardian Runtime
├── recorder.py            # Dataset recording tool
├── main.py                # Runtime entry point
├── requirements.txt       # Python dependencies
└── README.md
```

---

# Hardware Required

- ESP32 Sender
- ESP32-S3 Receiver
- USB Cable(s)
- Windows / Linux / macOS
- Python 3.11+

---

# Installation

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# Configuration

Edit `config.py` if necessary.

Example:

```python
SERIAL_PORT = "COM5"
BAUD_RATE = 921600
```

---

# Recording a Dataset

Run:

```bash
python recorder.py
```

The recorder will ask for:

- Activity
- Recording duration

Example:

```
1. Walking
2. Sitting
3. Standing
4. Breathing
5. Fall
6. Empty Room
```

Recorded datasets are automatically saved to:

```
datasets/raw/
```

Example:

```
datasets/raw/
    walking/
        walking_001.jsonl
        walking_002.jsonl

    sitting/
        sitting_001.jsonl
```

---

# Running Guardian Runtime

Run:

```bash
python main.py
```

Guardian Runtime will:

- Search for ESP32-S3 Receiver
- Connect automatically
- Receive CSI packets
- Validate packets
- Parse packets
- Save packets
- Continue until stopped

---

# Data Flow

```
ESP32 Sender
        │
        ▼
ESP32-S3 Receiver
        │
        ▼
SerialManager
        │
        ▼
PacketValidator
        │
        ▼
CSIParser
        │
        ▼
DatasetWriter
        │
        ▼
JSONL Dataset
```

---

# Output Format

Each packet is stored as one JSON object per line.

Example:

```json
{
  "packet_type": "CSI_DATA",
  "timestamp": 107635,
  "mac": "1a:00:00:00:00:00",
  "rssi": -26,
  "channel": 11,
  "csi": [0, 0, -5, 7, ...]
}
```

---

# Future Integration

Guardian Bridge is designed to integrate with the GuardianSense backend through REST APIs.

Future pipeline:

```
ESP32
    │
    ▼
Guardian Bridge
    │
POST /api/guardian/data
    │
Guardian Core
    │
Guardian Agent
    │
Frontend Dashboard
```

Guardian Bridge will remain responsible only for hardware communication and dataset generation.

---

# Version

Current Version:

**Guardian Bridge v1.0**

Status:

✅ Stable

Completed Features:

- Serial Communication
- Auto Reconnect
- Runtime Manager
- Dataset Recorder
- Packet Validation
- CSI Parsing
- JSONL Dataset Generation