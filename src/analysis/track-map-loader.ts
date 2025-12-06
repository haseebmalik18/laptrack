import * as fs from 'fs';
import * as path from 'path';

export interface TrackMapPoint {
  x: number;
  y: number;
  widthRight: number;
  widthLeft: number;
}

export interface TrackMap {
  name: string;
  points: TrackMapPoint[];
  bounds: {
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

      const parts = line.split(',').map(p => parseFloat(p));
      if (parts.length < 4) continue;

      const point: TrackMapPoint = {
        x: parts[0],
        y: parts[1],
        widthRight: parts[2],
        widthLeft: parts[3],
      };

      points.push(point);

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
