import * as fs from 'fs';
import * as path from 'path';
import { Corner, CornerDirection, CornerType } from './corner-detector';
import { BrakingZone, BrakingIntensity } from './braking-zone-detector';

export interface BrakingZoneEntry {
  entryDistance: number;
  peakDistance: number;
  exitDistance: number;
  entrySpeed: number;
  minSpeed: number;
  exitSpeed: number;
  speedLoss: number;
  peakBrakePressure: number;
  avgBrakePressure: number;
  peakDeceleration: number;
  avgDeceleration: number;
  brakingDistance: number;
  brakingDuration: number;
  intensity: BrakingIntensity;
  isTrailBraking: boolean;
}

export interface CornerDatabaseEntry {
  number: number;
  name?: string;
  entryDistance: number;
  apexDistance: number;
  exitDistance: number;
  type: CornerType;
  direction: CornerDirection;
  brakingZone?: BrakingZoneEntry;
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

  private sanitizeTrackName(trackName: string): string {
    const match = trackName.match(/\(([^)]+)\)/);
    const baseName = match ? match[1] : trackName;

    return baseName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  private getFilePath(trackName: string): string {
    const sanitized = this.sanitizeTrackName(trackName);
    return path.join(this.databaseDir, `${sanitized}.json`);
  }

  private getLegacyFilePath(trackId: number): string {
    return path.join(this.databaseDir, `track_${trackId}.json`);
  }

  hasTrackData(trackName: string, trackId?: number): boolean {
    const filePath = this.getFilePath(trackName);
    if (fs.existsSync(filePath)) return true;

    if (trackId !== undefined) {
      const legacyPath = this.getLegacyFilePath(trackId);
      return fs.existsSync(legacyPath);
    }

    return false;
  }

  loadTrackCorners(trackName: string, trackId?: number): TrackCornerDatabase | null {
    let filePath = this.getFilePath(trackName);

    if (!fs.existsSync(filePath) && trackId !== undefined) {
      const legacyPath = this.getLegacyFilePath(trackId);
      if (fs.existsSync(legacyPath)) {
        filePath = legacyPath;
      }
    }

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as TrackCornerDatabase;
    } catch (error) {
      console.error(`Failed to load corner database for track ${trackName}:`, error);
      return null;
    }
  }

  saveTrackCorners(
    trackName: string,
    trackId: number,
    trackLength: number,
    corners: Corner[],
    brakingZones?: BrakingZone[]
  ): void {
    const filePath = this.getFilePath(trackName);
    const isUpdate = fs.existsSync(filePath);

    let createdAt = new Date().toISOString();
    if (isUpdate) {
      const existing = this.loadTrackCorners(trackName, trackId);
      if (existing) {
        createdAt = existing.createdAt;
      }
    }

    const brakingZoneMap = new Map<number, BrakingZone>();
    if (brakingZones) {
      for (const corner of corners) {
        const cornerNumber = corners.indexOf(corner) + 1;
        const candidateZones = brakingZones.filter((zone) => {
          const distanceToCorner = corner.entryDistance - zone.exitDistance;
          return distanceToCorner >= -100 && distanceToCorner <= 50;
        });

        if (candidateZones.length > 0) {
          const primaryZone = candidateZones.reduce((best, current) => {
            const bestDistance = Math.abs(corner.entryDistance - best.exitDistance);
            const currentDistance = Math.abs(corner.entryDistance - current.exitDistance);
            return currentDistance < bestDistance ? current : best;
          });
          brakingZoneMap.set(cornerNumber, primaryZone);
        }
      }
    }

    const databaseEntries: CornerDatabaseEntry[] = corners.map((corner, index) => {
      const cornerNumber = index + 1;
      const entry: CornerDatabaseEntry = {
        number: cornerNumber,
        entryDistance: Math.round(corner.entryDistance),
        apexDistance: Math.round(corner.apexDistance),
        exitDistance: Math.round(corner.exitDistance),
        type: corner.type,
        direction: corner.direction,
      };

      const brakingZone = brakingZoneMap.get(cornerNumber);
      if (brakingZone) {
        entry.brakingZone = {
          entryDistance: Math.round(brakingZone.entryDistance),
          peakDistance: Math.round(brakingZone.peakDistance),
          exitDistance: Math.round(brakingZone.exitDistance),
          entrySpeed: Math.round(brakingZone.entrySpeed),
          minSpeed: Math.round(brakingZone.minSpeed),
          exitSpeed: Math.round(brakingZone.exitSpeed),
          speedLoss: Math.round(brakingZone.speedLoss),
          peakBrakePressure: Math.round(brakingZone.peakBrakePressure * 100) / 100,
          avgBrakePressure: Math.round(brakingZone.avgBrakePressure * 100) / 100,
          peakDeceleration: Math.round(brakingZone.peakDeceleration * 100) / 100,
          avgDeceleration: Math.round(brakingZone.avgDeceleration * 100) / 100,
          brakingDistance: Math.round(brakingZone.brakingDistance),
          brakingDuration: Math.round(brakingZone.brakingDuration * 100) / 100,
          intensity: brakingZone.intensity,
          isTrailBraking: brakingZone.isTrailBraking,
        };
      }

      return entry;
    });

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

  findCornerAtDistance(trackName: string, distance: number, trackId?: number, tolerance: number = 10): CornerDatabaseEntry | null {
    const trackData = this.loadTrackCorners(trackName, trackId);

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

  getCornerPhase(trackName: string, distance: number, trackId?: number, tolerance: number = 10): 'entry' | 'apex' | 'exit' | null {
    const corner = this.findCornerAtDistance(trackName, distance, trackId, tolerance);

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

  listAvailableTracks(): string[] {
    if (!fs.existsSync(this.databaseDir)) {
      return [];
    }

    const files = fs.readdirSync(this.databaseDir)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));

    return files.sort();
  }

  deleteTrackCorners(trackName: string, trackId?: number): boolean {
    const filePath = this.getFilePath(trackName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }

    if (trackId !== undefined) {
      const legacyPath = this.getLegacyFilePath(trackId);
      if (fs.existsSync(legacyPath)) {
        fs.unlinkSync(legacyPath);
        return true;
      }
    }

    return false;
  }

  getAllTrackData(): TrackCornerDatabase[] {
    const trackNames = this.listAvailableTracks();
    const allData: TrackCornerDatabase[] = [];

    for (const trackName of trackNames) {
      const data = this.loadTrackCorners(trackName);
      if (data) {
        allData.push(data);
      }
    }

    return allData;
  }
}
