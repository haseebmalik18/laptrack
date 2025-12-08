/**
 * Lap Loader - Loads saved lap data from CSV/JSON files
 *
 * Reads telemetry from ./laps directory and parses into NormalizedTelemetryPoint arrays.
 */

import * as fs from 'fs';
import * as path from 'path';
import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';

export interface LapInfo {
  filePath: string;
  lapNumber: number;
  timestamp: string;
  pointCount: number;
}

export class LapLoader {
  private lapsDir: string;

  constructor(lapsDir: string = './laps') {
    this.lapsDir = lapsDir;
  }

  // List all available laps from JSON metadata
  listAvailableLaps(): LapInfo[] {
    if (!fs.existsSync(this.lapsDir)) {
      return [];
    }

    const files = fs.readdirSync(this.lapsDir)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const jsonPath = path.join(this.lapsDir, f);
        const metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        return {
          filePath: jsonPath.replace('.json', '.csv'),
          lapNumber: metadata.lapNumber,
          timestamp: metadata.timestamp,
          pointCount: metadata.pointCount,
        };
      })
      .sort((a, b) => a.lapNumber - b.lapNumber);

    return files;
  }

  // Load telemetry from CSV file (parses all columns including yaw)
  loadLap(csvPath: string): NormalizedTelemetryPoint[] {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').slice(1);

    const points: NormalizedTelemetryPoint[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      const parts = line.split(',').map(p => parseFloat(p));
      if (parts.length < 11) continue;

      points.push({
        time: parts[0],
        distance: parts[1],
        x: parts[2],
        y: parts[3],
        speed: parts[4],
        throttle: parts[5],
        brake: parts[6],
        steering: parts[7],
        gear: parts[8],
        rpm: parts[9] || 0,      // RPM column (index 9)
        gLat: parts[10] || 0,    // gLat column (index 10)
        gLong: parts[11] || 0,   // gLong column (index 11)
        yaw: parts[12] || 0,     // yaw column (index 12) - Backwards compatibility for old laps
        lapNum: 0,
      });
    }

    return points;
  }

  // Load lap by lap number (looks up CSV path from metadata)
  loadLapByNumber(lapNumber: number): NormalizedTelemetryPoint[] | null {
    const laps = this.listAvailableLaps();
    const lap = laps.find(l => l.lapNumber === lapNumber);

    if (!lap) {
      return null;
    }

    return this.loadLap(lap.filePath);
  }
}
