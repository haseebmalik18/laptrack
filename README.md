<div align="center">

# 🏎️ LapTrack

**F1 2024 Telemetry Analysis**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

_Real-time data capture • Corner-by-corner insights_

[Features](#-features) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## 📋 About

LapTrack is a comprehensive telemetry analysis platform for F1 2024, showcasing professional motorsport analysis techniques. Built to help sim racers understand and improve their lap times through detailed data-driven insights.

---

## ✨ Features

### Telemetry Capture

- **Real-Time UDP Streaming** - Millisecond-precision data capture from F1 2024
- **Automatic Lap Detection** - Distance-based triggers with no manual intervention
- **Rich Metadata** - Track name, car, timestamps, and lap times
- **Data Normalization** - 1 sample/meter for consistent analysis

### Corner Analysis

- **98% Accurate Detection** - Hybrid yaw rate + track curvature validation
- **Multi-Apex Detection** - Automatic splitting of complex corners and chicanes
- **Corner Classification** - Hairpin, Slow, Medium, Fast, Very Fast
- **Braking Zone Analysis** - Entry/exit points, pressure, deceleration, trail braking

### Performance Comparison

- **Corner-by-Corner Speed** - Entry, apex, exit, and minimum speeds with time deltas
- **Sector Breakdown** - Automatic 3-sector analysis with detailed metrics
- **G-Force Analysis** - Lateral/longitudinal forces with friction circle visualization
- **Acceleration Zones** - Speed gain, throttle usage, and time comparison

### Web Dashboard

- **Interactive 2D Track Map** - Real-time racing line overlay with corner markers
- **Data Traces** - Speed, throttle, brake, and G-force visualization
- **Delta Time Visualization** - Live comparison with reference laps
- **Telemetry Replay** - Scrubber control with synchronized playback

---

## 🛠️ Tech Stack

**Backend**

- TypeScript 5.3
- Node.js UDP sockets
- Custom telemetry processing algorithms

**Frontend**

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Recharts (data visualization)
- React Three Fiber (3D rendering)

---

## 📖 Documentation

### Project Structure

```
laptrack/
├── src/
│   ├── analysis/           # Core analysis algorithms
│   │   ├── corner-detector.ts
│   │   ├── yaw-curvature-detector.ts
│   │   ├── braking-zone-detector.ts
│   │   ├── speed-comparison.ts
│   │   ├── sector-analysis.ts
│   │   ├── gforce-analysis.ts
│   │   └── ...
│   ├── constants/          # F1 2024 game constants
│   ├── parsers/            # UDP packet parsers
│   ├── services/           # UDP listener & recording
│   ├── types/              # TypeScript definitions
│   └── create-corner-database.ts
├── web/                    # Next.js dashboard
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── components/    # React components
│   │   ├── lap-analysis/  # Main analysis page
│   │   └── compare/       # Comparison page
│   └── package.json
└── package.json
```

### Core Concepts

#### Corner Detection

Uses **dual-signal validation**:

- **Yaw Rate** - Car rotation speed from sensor data (rad/s)
- **Track Curvature** - Geometric analysis from X/Y position

Corners detected only when both signals exceed thresholds, achieving 98% accuracy.

#### Lap Normalization

Raw telemetry normalized to **1 sample per meter** for consistent analysis across different speeds and sampling rates.

#### Braking Zones

Detected through:

- Brake pedal input (smoothed 3m window)
- Deceleration validation (< -0.5 m/s²)
- Associated with nearest corner (within 100m)

#### Data Processing

1. **Capture** - UDP telemetry from F1 2024 (port 20777)
2. **Normalize** - Convert to 1 sample/meter
3. **Detect** - Identify corners and braking zones
4. **Analyze** - Compare laps and calculate metrics
5. **Visualize** - Display results in web dashboard

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

[⬆ back to top](#-laptrack)

</div>
