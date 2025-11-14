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
  private lastLogTime: number = 0;
  private lapCounter: number = 0;

  constructor(outputDir: string = './laps') {
    this.outputDir = outputDir;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  addTelemetryPoint(point: NormalizedTelemetryPoint) {
    const now = Date.now();
    if (now - this.lastLogTime > 2000) {
      console.log(`DEBUG: F1_lapNum=${point.lapNum}, ourLap=${this.lapCounter}, points=${this.currentLapData.length}`);
      this.lastLogTime = now;
    }

    if (point.lapNum === 0) return;

    if (this.baseLapNumber === null && point.lapNum > 0) {
      this.baseLapNumber = point.lapNum;
      console.log(`Base lap set to ${this.baseLapNumber}`);
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

    const csvHeader = 'time,distance,x,y,speed,throttle,brake,steering,gear,gLat,gLong\n';
    const csvRows = this.currentLapData.map(p =>
      `${p.time},${p.distance},${p.x},${p.y},${p.speed},${p.throttle},${p.brake},${p.steering},${p.gear},${p.gLat},${p.gLong}`
    ).join('\n');

    fs.writeFileSync(csvPath, csvHeader + csvRows);

    const metadata: LapMetadata = {
      lapNumber: this.lapCounter,
      trackName: 'Unknown',
      carName: 'Unknown',
      timestamp: new Date().toISOString(),
      lapTimeMs: this.currentLapData[this.currentLapData.length - 1]?.time || 0,
      isValid: true,
      pointCount: this.currentLapData.length,
    };

    fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2));

    console.log(`Lap ${this.lapCounter} saved: ${this.currentLapData.length} points`);
  }

  getCurrentLapNumber(): number {
    return this.currentLapNumber;
  }

  getCurrentPointCount(): number {
    return this.currentLapData.length;
  }
}
