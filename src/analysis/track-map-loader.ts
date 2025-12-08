/**
 * Track Map Loader - Loads track boundary maps from CSV files
 *
 * CSV format: x, y, widthRight, widthLeft (centerline + track edge distances)
 */

import * as fs from 'fs';
import * as path from 'path';

export interface TrackMapPoint {
  x: number;              // World X coordinate
  y: number;              // World Y coordinate
  widthRight: number;     // Distance to right track edge
  widthLeft: number;      // Distance to left track edge
}

export interface TrackMap {
  name: string;
  points: TrackMapPoint[];
  bounds: {               // Bounding box for canvas scaling
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export class TrackMapLoader {
  private mapsDir: string;

  constructor(mapsDir: string = './track-maps') {
    this.mapsDir = mapsDir;
  }

  /**
   * Load track map from CSV file
   * Returns null if file not found
   */
  loadTrackMap(trackName: string): TrackMap | null {
    const csvPath = path.join(this.mapsDir, `${trackName.toLowerCase()}.csv`);

    if (!fs.existsSync(csvPath)) {
      console.error(`Track map not found: ${csvPath}`);
      return null;
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').slice(1); // Skip header

    const points: TrackMapPoint[] = [];
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const line of lines) {
      if (!line.trim()) continue;

      // Parse CSV: x, y, widthRight, widthLeft
      const parts = line.split(',').map(p => parseFloat(p));
      if (parts.length < 4) continue;

      const point: TrackMapPoint = {
        x: parts[0],
        y: parts[1],
        widthRight: parts[2],
        widthLeft: parts[3],
      };

      points.push(point);

      // Calculate bounding box
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }

    return {
      name: trackName,
      points,
      bounds: { minX, maxX, minY, maxY },
    };
  }
}
