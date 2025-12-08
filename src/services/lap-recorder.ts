/**
 * Lap Recorder - Accumulates telemetry points and saves completed laps to CSV/JSON
 *
 * Detects lap completion via distance reset (50% drop), validates minimum point count (>100),
 * and auto-saves to ./laps directory. Does NOT normalize data - stores raw points.
 */

import * as fs from "fs";
import * as path from "path";
import { NormalizedTelemetryPoint } from "../types/f1-2024-packets";

export interface LapMetadata {
  lapNumber: number;
  trackName: string;
  trackId: number;          // F1 2024 track ID
  carName: string;
  timestamp: string;        // ISO timestamp when saved
  lapTimeMs: number;        // Calculated from telemetry
  isValid: boolean;
  pointCount: number;
}

export class LapRecorder {
  private currentLapData: NormalizedTelemetryPoint[] = [];
  private currentLapNumber: number = 0;
  private outputDir: string;
  private lapCounter: number = 0;   // Sequential lap counter
  private trackName: string = "Unknown";
  private trackId: number = -1;
  private carName: string = "Unknown";
  private lastDistance: number = 0; // For lap completion detection

  constructor(outputDir: string = "./laps") {
    this.outputDir = outputDir;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  addTelemetryPoint(point: NormalizedTelemetryPoint) {
    // Detect lap completion via distance reset (50% drop)
    let lapComplete = false;
    if (this.lastDistance > 0 && point.distance < this.lastDistance * 0.5) {
      console.log(
        `Lap complete detected! Distance reset: ${this.lastDistance.toFixed(
          1
        )}m → ${point.distance.toFixed(1)}m`
      );
      lapComplete = this.currentLapData.length > 100;
    }

    this.lastDistance = point.distance;

    // Save completed lap
    if (lapComplete && this.currentLapData.length > 100) {
      this.lapCounter++;
      this.saveLap();
      this.currentLapData = [];
    }

    this.currentLapData.push(point);
  }

  private saveLap() {
    if (this.currentLapData.length === 0) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const baseName = `lap_${this.lapCounter}_${timestamp}`;

    const csvPath = path.join(this.outputDir, `${baseName}.csv`);
    const jsonPath = path.join(this.outputDir, `${baseName}.json`);

    // Write CSV telemetry data
    const csvHeader =
      "time,distance,x,y,speed,throttle,brake,steering,gear,rpm,gLat,gLong,yaw\n";
    const csvRows = this.currentLapData
      .map(
        (p) =>
          `${p.time},${p.distance},${p.x},${p.y},${p.speed},${p.throttle},${p.brake},${p.steering},${p.gear},${p.rpm},${p.gLat},${p.gLong},${p.yaw}`
      )
      .join("\n");

    fs.writeFileSync(csvPath, csvHeader + csvRows);

    // Calculate lap time from telemetry
    const lapStartTime = this.currentLapData[0]?.time || 0;
    const lapEndTime =
      this.currentLapData[this.currentLapData.length - 1]?.time || 0;
    const actualLapTime = lapEndTime - lapStartTime;

    // Write JSON metadata
    const metadata: LapMetadata = {
      lapNumber: this.lapCounter,
      trackName: this.trackName,
      trackId: this.trackId,
      carName: this.carName,
      timestamp: new Date().toISOString(),
      lapTimeMs: actualLapTime,
      isValid: true,
      pointCount: this.currentLapData.length,
    };

    fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2));

    console.log(
      `Lap ${this.lapCounter} saved: ${this.currentLapData.length} points`
    );
  }

  setTrackName(trackName: string) {
    this.trackName = trackName;
  }

  setTrackId(trackId: number) {
    this.trackId = trackId;
  }

  setCarName(carName: string) {
    this.carName = carName;
  }

  getCurrentLapNumber(): number {
    return this.currentLapNumber;
  }

  getCurrentPointCount(): number {
    return this.currentLapData.length;
  }
}
