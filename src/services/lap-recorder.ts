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
  private relativeLapNumber: number = 0;
  private outputDir: string;

  constructor(outputDir: string = './laps') {
    this.outputDir = outputDir;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  addTelemetryPoint(point: NormalizedTelemetryPoint) {
    if (this.baseLapNumber === null) {
      this.baseLapNumber = point.lapNum;
    }

    if (point.lapNum !== this.currentLapNumber) {
      if (this.currentLapData.length > 0 && this.currentLapNumber > 0) {
        this.saveLap();
      }
      this.currentLapNumber = point.lapNum;
      this.relativeLapNumber = point.lapNum - this.baseLapNumber + 1;
      this.currentLapData = [];
    }
    this.currentLapData.push(point);
  }

  private saveLap() {
    if (this.currentLapData.length === 0) return;

    const relativeLap = this.currentLapNumber - (this.baseLapNumber || 0) + 1;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseName = `lap_${relativeLap}_${timestamp}`;

    const csvPath = path.join(this.outputDir, `${baseName}.csv`);
    const jsonPath = path.join(this.outputDir, `${baseName}.json`);

    const csvHeader = 'time,distance,x,y,speed,throttle,brake,steering,gear,gLat,gLong\n';
    const csvRows = this.currentLapData.map(p =>
      `${p.time},${p.distance},${p.x},${p.y},${p.speed},${p.throttle},${p.brake},${p.steering},${p.gear},${p.gLat},${p.gLong}`
    ).join('\n');

    fs.writeFileSync(csvPath, csvHeader + csvRows);

    const metadata: LapMetadata = {
      lapNumber: relativeLap,
      trackName: 'Unknown',
      carName: 'Unknown',
      timestamp: new Date().toISOString(),
      lapTimeMs: this.currentLapData[this.currentLapData.length - 1]?.time || 0,
      isValid: true,
      pointCount: this.currentLapData.length,
    };

    fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2));

    console.log(`Lap ${relativeLap} saved: ${this.currentLapData.length} points`);
  }

  getCurrentLapNumber(): number {
    return this.currentLapNumber;
  }

  getCurrentPointCount(): number {
    return this.currentLapData.length;
  }
}
