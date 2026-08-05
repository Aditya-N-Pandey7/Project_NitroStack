# GuardianSense AI

GuardianSense AI is an ambient, contactless wellness monitoring system built on
**WiFi Channel State Information (CSI)**. Two ESP32 boards form a sender/receiver
pair; variations in the wireless channel caused by a person's movement and
breathing are captured, parsed, and processed into motion detection and
respiration signals — no wearables, no cameras.

The project is a full monorepo spanning firmware, a hardware bridge, a backend
MCP server, and a live dashboard.

## Architecture

```
ESP32 (Sender)                 ESP32-S3 (Receiver)
      │  WiFi packets                 │
      └───────────────────────────────┘
                      │  CSI over Serial (USB)
                      ▼
            guardian_bridge (Python)
   serial read → validate → parse → record
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
 datasets/raw/*.jsonl      POST /api/bridge
  (training data)                  │
                                    ▼
                    GuardianSenseBackend (TypeScript / NitroStack MCP)
              DSP engine → feature extraction → decision engine
                          → alert state → websocket
                                    │
                                    ▼
                         frontend (Next.js dashboard)
              live monitoring, device list, CSI/respiration charts, alerts
```

## Repository layout

```
firmware/
  esp32-sender/            ESP-IDF firmware, sends WiFi CSI-inducing traffic
  esp32-s3-receiver/        ESP-IDF firmware, captures CSI packets
backend/
  guardian_bridge/          Python bridge: serial → validate → parse → forward/record
  GuardianSenseBackend/     TypeScript MCP server (NitroStack): DSP, decision engine, websocket API
frontend/                   Next.js dashboard: live monitoring, devices, charts, alerts
datasets/raw/                Recorded CSI sessions (JSONL) for offline analysis / model training
ai/                          (planned) model training and inference
architecture/                (planned) system design docs / diagrams
docs/                        (planned) additional documentation
hardware/                    (planned) wiring diagrams, BOM
```

## Current status

| Component | Status |
|---|---|
| ESP32 CSI sender/receiver firmware | ✅ Working, live packets verified |
| Guardian Bridge (serial → parse → dataset/API) | ✅ Stable (v1.1) — auto reconnect, auto port detection, unit + integration tests |
| Backend MCP server (DSP, decision engine, websocket) | 🟡 Core services implemented, decision logic still evolving |
| Frontend dashboard | 🟡 Monitoring, devices, and Guardian AI pages scaffolded |
| CSI dataset collection | ✅ Walking sessions recorded |
| Motion detection / respiration models | 🔜 Not yet trained |
| `ai/`, `architecture/`, `docs/`, `hardware/` | 🔜 Placeholders, not yet populated |

## Hardware

- ESP32 DevKit V1 — CSI Sender
- ESP32-S3 — CSI Receiver
- USB cables, Windows/Linux/macOS host, Python 3.11+, Node.js 18+

## Getting started

### 1. Flash the firmware
```bash
cd firmware/esp32-sender
idf.py build flash monitor

cd firmware/esp32-s3-receiver
idf.py build flash monitor
```

### 2. Run Guardian Bridge
```bash
cd backend/guardian_bridge
pip install -r requirements.txt
python main.py          # auto-detects the receiver's COM port
# or
python recorder.py      # to record a labeled dataset session
```

### 3. Run the backend (MCP server)
```bash
cd backend/GuardianSenseBackend
npm install
npm run dev
```

### 4. Run the dashboard
```bash
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

Or, from the repo root, use the monorepo launcher:
```bash
npm install
npm run dev        # starts backend + frontend together
npm run backend     # backend only
npm run frontend    # frontend only
```

## Data format

Each recorded packet is one JSON object per line (JSONL):
```json
{"packet_type": "CSI_DATA", "timestamp": 107635, "mac": "1a:00:00:00:00:00", "rssi": -26, "channel": 11, "csi": [0, 0, -5, 7, ...]}
```

## Roadmap

- [ ] CSI feature engineering + motion/respiration model training (`ai/`)
- [ ] Fall detection logic in the decision engine
- [ ] Multi-device support in the dashboard
- [ ] System architecture write-up (`architecture/`)
- [ ] Hardware wiring guide + BOM (`hardware/`)

## Known housekeeping items

- Large raw dataset files are currently committed directly to git; migrating to
  Git LFS or an external data store is planned.
- A few early recording sessions (`walking_001`–`walking_004.jsonl`) are empty
  and will be cleaned up.

## License

Not yet specified.
