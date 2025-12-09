# F1 2024 Telemetry Ingestion System

> **MLH Fellowship Code Sample** by Haseeb Malik

A real-time binary protocol parser that captures F1 2024 game telemetry over UDP, decodes 5 different packet types, and saves structured lap data.

**Tech Stack:** TypeScript · Node.js · UDP Sockets · Binary Protocol Parsing

---

## What It Does

Captures F1 2024 telemetry at 60Hz, parses binary packets, and saves complete lap data as JSON/CSV. Handles 5 packet types with manual byte-level parsing (Little Endian format).

---

## Architecture

```
F1 2024 Game (UDP 20777)
        │
        │ Binary packets (60Hz)
        ▼
UDP Listener (dgram socket)
        │
        │ Raw buffers
        ▼
Parser (byte-level)
  • Session packets
  • Lap Data packets
  • Car Telemetry packets
  • Motion packets
  • Participants packets
        │
        │ Typed objects
        ▼
Lap Recorder
  • Merges packet data
  • Auto-saves laps
  • JSON + CSV output
```

---

## Technical Details

### Binary Protocol Parsing

**File:** `src/parsers/f1-2024-parser.ts`

```typescript
// Parsing lap data packet - manual byte offset handling
parseLapData(buffer: Buffer): PacketLapData | null {
  const header = this.parseHeader(buffer);
  if (header.packetId !== PacketType.LAP_DATA) return null;

  const lapData: LapData[] = [];
  let offset = 29; // After 29-byte header

  for (let i = 0; i < 22; i++) { // 22 cars
    lapData.push({
      lastLapTimeInMS: buffer.readUInt32LE(offset),
      currentLapTimeInMS: buffer.readUInt32LE(offset + 4),
      sector1TimeInMS: buffer.readUInt16LE(offset + 8),
      lapDistance: buffer.readFloatLE(offset + 20),
      totalDistance: buffer.readFloatLE(offset + 24),
      // ... 40+ more fields
    });
    offset += 63; // Each car = 63 bytes
  }
  return { header, lapData };
}
```

### Bug Fix: Byte Offset Corrections

F1 2024 changed packet structure from F1 2023. Documentation showed wrong offsets:

- `lapDistance`: byte 18 → **actually byte 20**
- `totalDistance`: byte 22 → **actually byte 24**

Debugged by hex-dumping packets and comparing with F1 2023 spec.

### Bug Fix: Grand Prix Mode Workaround

**Problem:** Grand Prix mode doesn't send `lapDistance` for player car (game bug).

**Solution:** Calculate from `worldPositionX/Z` using Euclidean distance.

**File:** `src/cli/udp-listener.ts:109-120`

```typescript
private calculateDistance(x: number, y: number): number {
  if (this.lastX === 0 && this.lastY === 0) {
    this.lastX = x;
    this.lastY = y;
    return 0;
  }

  const dx = x - this.lastX;
  const dy = y - this.lastY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  this.lastX = x;
  this.lastY = y;
  this.totalDistance += distance;

  return this.totalDistance;
}
```

### Packet Types

| Type          | Frequency | Data                         |
| ------------- | --------- | ---------------------------- |
| Session       | 2 Hz      | Track, weather, time         |
| Lap Data      | Variable  | Timing, sectors, distance    |
| Car Telemetry | 60 Hz     | Speed, throttle, brake, gear |
| Motion        | 60 Hz     | Position, G-forces, yaw      |
| Participants  | Once      | Driver names, teams          |

### Type Safety

**File:** `src/types/f1-2024-packets.ts`

```typescript
export interface PacketHeader {
  packetFormat: number;
  gameYear: number;
  packetId: PacketType;
  sessionUID: bigint;
  playerCarIndex: number;
}

export enum PacketType {
  MOTION = 0,
  SESSION = 1,
  LAP_DATA = 2,
  CAR_TELEMETRY = 6,
  PARTICIPANTS = 4,
}
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- F1 2024 with UDP telemetry enabled (port 20777)

### Installation

```bash
git clone https://github.com/haseebmalik18/laptrack.git
cd laptrack
git checkout mlh-code-sample
npm install
```

### Run

```bash
npm run dev
```

**Output:**

```
🎮 F1 2024 Telemetry Listener Started
📡 Listening on UDP port 20777...
✅ Session: Sakhir (Bahrain)
📍 Player car: Mercedes
📊 Lap 1 in progress... (1234m / 5412m)
💾 Lap 1 saved: laps/lap_1_bahrain_2024-12-08.json
```

### Sample Output

```bash
cat laps/lap_1_*.json | head -20
```

```json
{
  "lapNumber": 1,
  "track": "Sakhir (Bahrain)",
  "car": "Mercedes",
  "timestamp": "2024-12-08T15:30:45.123Z",
  "telemetry": [
    {
      "distance": 0,
      "speed": 45,
      "throttle": 0.85,
      "brake": 0.0,
      "gear": 2,
      "x": -234.5,
      "y": 156.2,
      "yaw": 1.234,
      "gLat": -0.5,
      "gLong": 1.2
    }
  ]
}
```

---

## Project Structure

```
laptrack/
├── src/
│   ├── cli/
│   │   └── udp-listener.ts          # UDP socket, packet routing
│   ├── parsers/
│   │   └── f1-2024-parser.ts         # Binary parsing, 5 packet types
│   ├── services/
│   │   └── lap-recorder.ts           # Data merging, persistence
│   ├── types/
│   │   └── f1-2024-packets.ts        # TypeScript interfaces
│   └── constants/
│       └── f1-2024-constants.ts      # Track/team mappings
├── package.json
└── tsconfig.json
```

---

## Implementation Highlights

### Real-Time State Management

- Packets arrive at 60Hz out of order
- Must merge 5 packet types to build complete telemetry
- State machine handles missing/corrupt packets

### Byte-Level Operations

- No library for F1 2024 format
- Manual `buffer.readUInt32LE()` / `readFloatLE()` for every field
- Little Endian format (x86 standard)

### Spec Reverse-Engineering

- F1 2024 changed byte offsets from F1 2023
- Used hex dumps to find correct positions
- Documented fixes for community

### Distance Calculation

- Grand Prix mode missing `lapDistance`
- Implemented Euclidean distance from X/Y position
- 99% accuracy vs official distance

---

## Results

- ✅ 5 packet types parsed correctly
- ✅ 60Hz real-time streaming
- ✅ Type-safe (100+ fields)
- ✅ Bug fixes for F1 2024 spec changes
- ✅ ~600 lines of code

---

## Links

- **Repo:** [github.com/haseebmalik18/laptrack](https://github.com/haseebmalik18/laptrack)
- **This Branch:** `mlh-code-sample` (focused ingestion/parsing)
- **Main Branch:** Full analysis pipeline (corner detection, sector analysis, G-force)

---

## License

MIT — Haseeb Malik 2025
