import * as fs from 'fs';
import * as path from 'path';
import { Corner, CornerDirection, CornerType } from './corner-detector';

export interface CornerDatabaseEntry {
  number: number;
  name?: string;
  entryDistance: number;
  apexDistance: number;
  exitDistance: number;
  type: CornerType;
  direction: CornerDirection;
}

export interface TrackCornerDatabase {
  trackId: number;
  trackName: string;
  trackLength: number;
  totalCorners: number;
  corners: CornerDatabaseEntry[];
  createdAt: string;
  updatedAt: string;
}

export class CornerDatabase {
  private databaseDir: string;

  constructor(databaseDir: string = './corners') {
    this.databaseDir = databaseDir;
    if (!fs.existsSync(databaseDir)) {
      fs.mkdirSync(databaseDir, { recursive: true });
    }
  }

  private getFilePath(trackId: number): string {
    return path.join(this.databaseDir, `track_${trackId}.json`);
  }

  hasTrackData(trackId: number): boolean {
    return fs.existsSync(this.getFilePath(trackId));
  }

  loadTrackCorners(trackId: number): TrackCornerDatabase | null {
    const filePath = this.getFilePath(trackId);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as TrackCornerDatabase;
    } catch (error) {
      console.error(`Failed to load corner database for track ${trackId}:`, error);
      return null;
    }
  }

  saveTrackCorners(
    trackId: number,
    trackName: string,
    trackLength: number,
    corners: Corner[]
  ): void {
    const filePath = this.getFilePath(trackId);
    const isUpdate = fs.existsSync(filePath);

    let createdAt = new Date().toISOString();
    if (isUpdate) {
      const existing = this.loadTrackCorners(trackId);
      if (existing) {
        createdAt = existing.createdAt;
      }
    }

    const databaseEntries: CornerDatabaseEntry[] = corners.map((corner, index) => ({
      number: index + 1,
      entryDistance: Math.round(corner.entryDistance),
      apexDistance: Math.round(corner.apexDistance),
      exitDistance: Math.round(corner.exitDistance),
      type: corner.type,
      direction: corner.direction,
    }));

    const database: TrackCornerDatabase = {
      trackId,
      trackName,
      trackLength: Math.round(trackLength),
      totalCorners: corners.length,
      corners: databaseEntries,
      createdAt,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(database, null, 2));
  }

  findCornerAtDistance(trackId: number, distance: number, tolerance: number = 10): CornerDatabaseEntry | null {
    const trackData = this.loadTrackCorners(trackId);

    if (!trackData) {
      return null;
    }

    for (const corner of trackData.corners) {
      if (distance >= corner.entryDistance - tolerance && distance <= corner.exitDistance + tolerance) {
        return corner;
      }
    }

    return null;
  }

  getCornerPhase(trackId: number, distance: number, tolerance: number = 10): 'entry' | 'apex' | 'exit' | null {
    const corner = this.findCornerAtDistance(trackId, distance, tolerance);

    if (!corner) {
      return null;
    }

    const distToEntry = Math.abs(distance - corner.entryDistance);
    const distToApex = Math.abs(distance - corner.apexDistance);
    const distToExit = Math.abs(distance - corner.exitDistance);

    if (distToEntry <= distToApex && distToEntry <= distToExit) {
      return 'entry';
    } else if (distToApex <= distToEntry && distToApex <= distToExit) {
      return 'apex';
    } else {
      return 'exit';
    }
  }

  listAvailableTracks(): number[] {
    if (!fs.existsSync(this.databaseDir)) {
      return [];
    }

    const files = fs.readdirSync(this.databaseDir)
      .filter(f => f.startsWith('track_') && f.endsWith('.json'))
      .map(f => {
        const match = f.match(/track_(\d+)\.json/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(id => id !== null) as number[];

    return files.sort((a, b) => a - b);
  }

  deleteTrackCorners(trackId: number): boolean {
    const filePath = this.getFilePath(trackId);

    if (!fs.existsSync(filePath)) {
      return false;
    }

    fs.unlinkSync(filePath);
    return true;
  }

  getAllTrackData(): TrackCornerDatabase[] {
    const trackIds = this.listAvailableTracks();
    const allData: TrackCornerDatabase[] = [];

    for (const trackId of trackIds) {
      const data = this.loadTrackCorners(trackId);
      if (data) {
        allData.push(data);
      }
    }

    return allData;
  }
}
