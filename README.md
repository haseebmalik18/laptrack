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


https://github.com/user-attachments/assets/cf7fa27f-7a03-4138-bb43-81adb6f80d96



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

## 🔧 Technical Challenges

### 1. Achieving 98% Corner Detection Accuracy

**The Problem**: Initial approach using speed thresholds produced false positives on elevation changes and gear shifts. Yaw rate alone triggered on bumps and kerb impacts.

**The Solution**: Developed a dual-signal validation system combining yaw rate sensors with geometric track curvature analysis. Corners are detected only when both signals exceed thresholds simultaneously, eliminating false positives.

**Implementation**: Built angle normalization for wraparound handling (±π), implemented 5-10m moving average smoothing windows to filter sensor noise, and tuned dynamic thresholds through testing across multiple tracks.

**Code**: `src/analysis/yaw-curvature-detector.ts:214-346`

### 2. Splitting Multi-Apex Corners

**The Problem**: Complex corners like Maggots-Becketts (Silverstone) or Turn 8-9 (Bahrain) appeared as single corners, hiding critical performance differences between individual apexes.

**The Solution**: Implemented yaw rate peak detection for corners 155-240m in length. Algorithm identifies local maxima >0.10 rad/s separated by 60m+, then splits at the minimum yaw rate point between peaks.

**Implementation**: Created 15-meter neighborhood validation to ensure true local maxima, calculated separate apex points by finding minimum speeds in each segment, and validated split corners maintain minimum length requirements.

**Code**: `src/analysis/yaw-curvature-detector.ts:350-493`

### 3. Distance-Based Lap Normalization

**The Problem**: Raw 60Hz telemetry created variable spacing (0.5m gaps in slow corners vs 5m+ gaps at high speed). Direct lap comparison was mathematically invalid.

**The Solution**: Developed distance-based resampling to normalize all laps to exactly 1 sample per meter using linear interpolation across all telemetry channels.

**Implementation**: Handled out-of-order UDP packets via distance-based sorting, implemented binary search for surrounding points, and built multi-dimensional interpolation for speed, throttle, brake, and G-forces while preserving data integrity.

**Code**: `src/analysis/lap-normalizer.ts:28-68`

### 4. Real-Time UDP Processing with Packet Loss

**The Problem**: F1 2024 streams 60 packets/second over UDP with no delivery guarantees. Packets arrive out-of-order, can be duplicated, or dropped entirely during network congestion.

**The Solution**: Implemented robust packet handling with distance-based sorting, sequence validation, and graceful degradation for missing data.

**Key Challenges Solved**:
- Lap boundary detection when distance resets to 0
- Automatic lap segmentation without manual triggers
- Maintaining millisecond precision at 3,600 packets/minute
- Memory-efficient buffering during multi-hour sessions

**Result**: <1% data loss with automatic lap detection and recording.

---

<div align="center">

[⬆ back to top](#-laptrack)

</div>
