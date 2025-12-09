# F1 2024 Telemetry Ingestion and Processing System

> MLH Fellowship Code Sample by Haseeb Malik

Real-time binary protocol parser that captures F1 2024 telemetry over UDP, decodes 5 packet types, and processes variable-rate data into normalized format for analysis.

**Tech Stack:** TypeScript · Node.js · UDP Sockets · Binary Parsing · Signal Processing

---

## What It Does

Captures F1 2024 telemetry at 60Hz, parses binary packets (Little Endian format), and transforms variable-spaced data into evenly-spaced samples (1 per meter) using linear interpolation. Handles real-time streaming, packet merging, and data alignment.

---

## Architecture

```
F1 2024 Game (UDP 20777)
        |
        | Binary packets (60Hz, variable spacing)
        v
UDP Listener
        |
        | Raw buffers
        v
Binary Parser
  • Session packets (track, weather)
  • Lap Data packets (timing, distance)
  • Car Telemetry packets (speed, throttle, brake)
  • Motion packets (position, G-forces, yaw)
  • Participants packets (driver names, teams)
        |
        | Typed objects (17,340 points/lap)
        v
Lap Recorder
  • Merges packet types
  • Saves raw telemetry
        |
        | Variable-rate data
        v
Interpolation Engine
  • Linear interpolation between points
  • Fills gaps in data
        |
        v
Normalizer
  • Converts to 1 sample/meter
  • Reduces 17,340 → 5,452 points
        |
        | Evenly-spaced data
        v
Aligner
  • Aligns multiple laps
  • Enables point-by-point comparison
        |
        v
JSON/CSV Output
```

---

## Technical Implementation

### 1. Binary Protocol Parsing

**File:** `src/parsers/f1-2024-parser.ts`

Manual byte-level parsing of F1 2024 UDP packets. No library available for this format.

```typescript
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

**Packet Types:**

| Type          | Frequency | Size    | Data                         |
| ------------- | --------- | ------- | ---------------------------- |
| Session       | 2 Hz      | 644 B   | Track, weather, time         |
| Lap Data      | Variable  | 1190 B  | Timing, sectors, distance    |
| Car Telemetry | 60 Hz     | 1352 B  | Speed, throttle, brake, gear |
| Motion        | 60 Hz     | 1349 B  | Position, G-forces, yaw      |
| Participants  | Once      | 1306 B  | Driver names, teams          |

### 2. Linear Interpolation

**File:** `src/analysis/interpolation.ts`

Standard linear interpolation for filling gaps between data points.

```typescript
// Interpolate value at x given two reference points
export function interpolateValue(
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number
): number {
  if (x1 === x0) return y0;
  const t = (x - x0) / (x1 - x0);
  return y0 + (y1 - y0) * t;
}

// Interpolate all numeric fields of a point
export function interpolatePoint<T>(
  distance: number,
  point0: T,
  point1: T,
  distanceKey: string = "distance"
): T {
  // Applies interpolateValue() to all numeric properties
  // Returns new point with interpolated values
}
```

**Use case:** Raw telemetry arrives at 60Hz (time-based), creating variable spacing:
- At 300 km/h: ~1.4m between points
- At 100 km/h: ~0.5m between points

Interpolation fills gaps to create consistent 1m spacing.

### 3. Data Normalization

**File:** `src/analysis/lap-normalizer.ts`

Converts variable-rate telemetry to evenly-spaced samples.

```typescript
normalize(points: NormalizedTelemetryPoint[]): NormalizedTelemetryPoint[] {
  const sorted = [...points].sort((a, b) => a.distance - b.distance);

  const normalized: NormalizedTelemetryPoint[] = [];
  let pointIndex = 0;

  // Create sample every 1 meter
  for (let d = minDistance; d <= maxDistance; d += 1.0) {
    // Find surrounding points
    while (pointIndex < sorted.length - 1 &&
           sorted[pointIndex + 1].distance < d) {
      pointIndex++;
    }

    // Interpolate value at this distance
    const point0 = sorted[pointIndex];
    const point1 = sorted[pointIndex + 1];
    const interpolated = interpolatePoint(d, point0, point1, "distance");

    normalized.push(interpolated);
  }

  return normalized;
}
```

**Result:**
- Input: 17,340 points (variable spacing)
- Output: 5,452 points (exactly 1 per meter)

### 4. Lap Alignment

**File:** `src/analysis/lap-aligner.ts`

Aligns multiple laps to same distance scale for comparison.

**Problem:** Different laps have slight variations in length and starting point.

**Solution:** Find overlap region, trim to common length, reset distance to zero.

```typescript
align(lap1: Point[], lap2: Point[]): { lap1: Point[], lap2: Point[] } {
  // Find overlapping distance range
  const start = Math.max(lap1[0].distance, lap2[0].distance);
  const end = Math.min(
    lap1[lap1.length - 1].distance,
    lap2[lap2.length - 1].distance
  );

  // Trim and reset distance
  return {
    lap1: trimAndReset(lap1, start, end),
    lap2: trimAndReset(lap2, start, end)
  };
}
```

Now both laps have identical distance arrays, enabling direct comparison.

---

## Implementation Challenges

### Byte Offset Corrections

F1 2024 changed packet structure from F1 2023. Documentation was wrong:
- `lapDistance`: byte 18 → **actually byte 20**
- `totalDistance`: byte 22 → **actually byte 24**

Debugged by hex-dumping packets and comparing with F1 2023 spec.

### Grand Prix Mode Distance Calculation

**Problem:** Grand Prix mode doesn't send `lapDistance` for player car.

**Solution:** Calculate distance from `worldPositionX/Z` coordinates using Euclidean distance.

**File:** `src/cli/udp-listener.ts`

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

99% accuracy compared to official distance (validated in Time Trial mode).

---

## Quick Start

### Prerequisites

- Node.js 20+
- F1 2024 with UDP telemetry enabled (Settings → Telemetry → Port 20777)

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

Output:
```
F1 2024 Telemetry Listener Started
Listening on UDP port 20777...
Session: Sakhir (Bahrain)
Player car: Mercedes
Lap 1 in progress... (1234m / 5412m)
Lap 1 saved: laps/lap_1_bahrain_2024-12-08.json
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
│   │   └── udp-listener.ts          # UDP socket, packet routing, state management
│   ├── parsers/
│   │   └── f1-2024-parser.ts        # Binary parsing (5 packet types)
│   ├── services/
│   │   └── lap-recorder.ts          # Data merging, persistence
│   ├── analysis/
│   │   ├── interpolation.ts         # Linear interpolation algorithms
│   │   ├── lap-normalizer.ts        # Variable → evenly-spaced conversion
│   │   └── lap-aligner.ts           # Multi-lap alignment
│   ├── types/
│   │   └── f1-2024-packets.ts       # TypeScript interfaces (5 packet types)
│   └── constants/
│       └── f1-2024-constants.ts     # Track/team name mappings
├── package.json
└── tsconfig.json
```

**8 files, ~1000 lines**

---

## Implementation Details

### Real-Time State Management

Packets arrive at 60Hz out of order across 5 different types. System maintains state machine to merge partial updates:

- Telemetry packet: speed, throttle, brake, gear
- Lap Data packet: timing, distance, sectors
- Motion packet: position, G-forces, yaw
- Session packet: track name, weather
- Participants packet: driver names

Combined into single telemetry point with all fields.

### Byte-Level Operations

No library exists for F1 2024 binary format. Manual parsing required:

- Little Endian format (x86 standard)
- `buffer.readUInt32LE()` for 4-byte integers
- `buffer.readFloatLE()` for 4-byte floats
- Manual offset tracking (offset += fieldSize)

### Interpolation Algorithm

Linear interpolation between two points:

```
value = y0 + (y1 - y0) × ((x - x0) / (x1 - x0))
```

Applied to all numeric fields: speed, throttle, brake, position, G-forces, etc.

Complexity: O(n) where n = number of input points

### Normalization Process

1. Sort by distance (handles out-of-order UDP)
2. Create evenly-spaced distance array (0m, 1m, 2m, ...)
3. For each target distance, find surrounding points
4. Interpolate all fields at that distance
5. Return normalized array

Complexity: O(n) single pass through sorted data

### Distance Calculation

When `lapDistance` unavailable (Grand Prix mode):

```
distance = √((x - x_prev)² + (y - y_prev)²)
cumulative += distance
```

Updates every packet (60Hz), maintains running total.

---

## Results

- 5 packet types with complete binary parsing
- 60Hz real-time streaming (3600 packets/minute)
- Type-safe TypeScript interfaces across all packet types
- Linear interpolation for data gap filling
- Normalization: 17,340 → 5,452 samples per lap
- Multi-lap alignment for direct comparison

---

## Links

- **Repo:** [github.com/haseebmalik18/laptrack](https://github.com/haseebmalik18/laptrack)
- **This Branch:** `mlh-code-sample` (ingestion + processing)
- **Main Branch:** Full analysis pipeline (corner detection, sector analysis, G-force)

---

## License

MIT — Haseeb Malik 2025
