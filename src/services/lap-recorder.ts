import * as fs from 'fs';
import * as path from 'path';
import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';

export interface LapMetadata {
  lapNumber: number;
  trackName: string;
  carName: string;
  timestamp: string;
  lapTimeMs: number;
  isValid: boolean;
  pointCount: number;
}

export class LapRecorder {
  private currentLapData: NormalizedTelemetryPoint[] = [];
  private currentLapNumber: number = 0;
  private baseLapNumber: number | null = null;
  private outputDir: string;
  private lapCounter: number = 0;
  private trackName: string = "Unknown";
  private carName: string = "Unknown";

  constructor(outputDir: string = './laps') {
    this.outputDir = outputDir;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  addTelemetryPoint(point: NormalizedTelemetryPoint) {
    if (point.lapNum === 0) return;

    if (this.baseLapNumber === null && point.lapNum > 0) {
      this.baseLapNumber = point.lapNum;
    }

    if (point.lapNum !== this.currentLapNumber) {
      if (this.currentLapData.length > 100 && this.currentLapNumber > 0) {
        this.lapCounter++;
        this.saveLap();
        this.currentLapData = [];
      }
      this.currentLapNumber = point.lapNum;
    }

    this.currentLapData.push(point);
  }

  private saveLap() {
    if (this.currentLapData.length === 0) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseName = `lap_${this.lapCounter}_${timestamp}`;

    const csvPath = path.join(this.outputDir, `${baseName}.csv`);
    const jsonPath = path.join(this.outputDir, `${baseName}.json`);

    const csvHeader = 'time,distance,x,y,speed,throttle,brake,steering,gear,gLat,gLong,yaw\n';
    const csvRows = this.currentLapData.map(p =>
      `${p.time},${p.distance},${p.x},${p.y},${p.speed},${p.throttle},${p.brake},${p.steering},${p.gear},${p.gLat},${p.gLong},${p.yaw}`
    ).join('\n');

    fs.writeFileSync(csvPath, csvHeader + csvRows);

    const metadata: LapMetadata = {
      lapNumber: this.lapCounter,
      trackName: this.trackName,
      carName: this.carName,
      timestamp: new Date().toISOString(),
      lapTimeMs: this.currentLapData[this.currentLapData.length - 1]?.time || 0,
      isValid: true,
      pointCount: this.currentLapData.length,
    };

    fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2));

    console.log(`Lap ${this.lapCounter} saved: ${this.currentLapData.length} points`);
  }

  setTrackName(trackName: string) {
    this.trackName = trackName;
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
