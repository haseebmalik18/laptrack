import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';
import { AlignedLaps } from './lap-aligner';
import { CornerDatabase } from './corner-database';

export interface SectorBoundary {
  sectorNumber: number;
  startDistance: number;
  endDistance: number;
}

export interface SectorTime {
  sectorNumber: number;
  startDistance: number;
  endDistance: number;
  distance: number;
  time: number;
  avgSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  avgThrottle: number;
  avgBrake: number;
  cornerCount: number;
}

export interface SectorComparison {
  sectorNumber: number;
  startDistance: number;
  endDistance: number;
  distance: number;

  lapA: SectorTime;
  lapB: SectorTime;

  timeDelta: number;
  avgSpeedDelta: number;

  timeGainPercentage: number;
}

export interface SectorAnalysis {
  sectors: SectorComparison[];
  summary: {
    totalTimeDelta: number;
    fastestSector: { sectorNumber: number; timeDelta: number };
    slowestSector: { sectorNumber: number; timeDelta: number };
  };
}

export interface SectorConfig {
  trackName: string;
  sectors: SectorBoundary[];
}

export class SectorAnalyzer {
  private cornerDb: CornerDatabase;
  private sectorConfigs: Map<string, SectorBoundary[]>;

  constructor(cornerDbPath?: string) {
    this.cornerDb = new CornerDatabase(cornerDbPath);
    this.sectorConfigs = new Map();
    this.initializeDefaultConfigs();
  }

  private initializeDefaultConfigs(): void {
    this.sectorConfigs.set('bahrain', [
      { sectorNumber: 1, startDistance: 0, endDistance: 1900 },
      { sectorNumber: 2, startDistance: 1900, endDistance: 3700 },
      { sectorNumber: 3, startDistance: 3700, endDistance: 999999 },
    ]);
  }

  analyzeSectors(
    aligned: AlignedLaps,
    trackName: string,
    trackId?: number
  ): SectorAnalysis {
    const boundaries = this.getSectorBoundaries(trackName, aligned.lapA);
    const sectors: SectorComparison[] = [];

    for (const boundary of boundaries) {
      const sectorA = this.calculateSectorTime(aligned.lapA, boundary, trackName, trackId);
      const sectorB = this.calculateSectorTime(aligned.lapB, boundary, trackName, trackId);

      const timeDelta = sectorA.time - sectorB.time;
      const avgSpeedDelta = sectorA.avgSpeed - sectorB.avgSpeed;
      const timeGainPercentage = sectorB.time > 0 ? (timeDelta / sectorB.time) * 100 : 0;

      sectors.push({
        sectorNumber: boundary.sectorNumber,
        startDistance: boundary.startDistance,
        endDistance: Math.min(boundary.endDistance, aligned.endDistance),
        distance: sectorA.distance,
        lapA: sectorA,
        lapB: sectorB,
        timeDelta,
        avgSpeedDelta,
        timeGainPercentage,
      });
    }

    const sortedSectors = [...sectors].sort((a, b) => a.timeDelta - b.timeDelta);
    const fastestSector = sortedSectors[0];
    const slowestSector = sortedSectors[sortedSectors.length - 1];

    const totalTimeDelta = sectors.reduce((sum, s) => sum + s.timeDelta, 0);

    return {
      sectors,
      summary: {
        totalTimeDelta,
        fastestSector: {
          sectorNumber: fastestSector?.sectorNumber ?? 0,
          timeDelta: fastestSector?.timeDelta ?? 0,
        },
        slowestSector: {
          sectorNumber: slowestSector?.sectorNumber ?? 0,
          timeDelta: slowestSector?.timeDelta ?? 0,
        },
      },
    };
  }

  private getSectorBoundaries(
    trackName: string,
    lap: NormalizedTelemetryPoint[]
  ): SectorBoundary[] {
    const sanitizedName = this.sanitizeTrackName(trackName);
    const configured = this.sectorConfigs.get(sanitizedName);

    if (configured) {
      return configured;
    }

    return this.autoDetectSectors(lap);
  }

  private autoDetectSectors(lap: NormalizedTelemetryPoint[]): SectorBoundary[] {
    if (lap.length === 0) {
      return [];
    }

    const trackLength = lap[lap.length - 1].distance - lap[0].distance;
    const sectorLength = trackLength / 3;

    return [
      {
        sectorNumber: 1,
        startDistance: lap[0].distance,
        endDistance: lap[0].distance + sectorLength,
      },
      {
        sectorNumber: 2,
        startDistance: lap[0].distance + sectorLength,
        endDistance: lap[0].distance + sectorLength * 2,
      },
      {
        sectorNumber: 3,
        startDistance: lap[0].distance + sectorLength * 2,
        endDistance: lap[lap.length - 1].distance,
      },
    ];
  }

  private calculateSectorTime(
    lap: NormalizedTelemetryPoint[],
    boundary: SectorBoundary,
    trackName: string,
    trackId?: number
  ): SectorTime {
    const sectorPoints = lap.filter(
      p => p.distance >= boundary.startDistance && p.distance <= boundary.endDistance
    );

    if (sectorPoints.length === 0) {
      return {
        sectorNumber: boundary.sectorNumber,
        startDistance: boundary.startDistance,
        endDistance: boundary.endDistance,
        distance: 0,
        time: 0,
        avgSpeed: 0,
        minSpeed: 0,
        maxSpeed: 0,
        avgThrottle: 0,
        avgBrake: 0,
        cornerCount: 0,
      };
    }

    const startTime = sectorPoints[0].time;
    const endTime = sectorPoints[sectorPoints.length - 1].time;
    const time = endTime - startTime;

    const distance = sectorPoints[sectorPoints.length - 1].distance - sectorPoints[0].distance;

    const speeds = sectorPoints.map(p => p.speed);
    const avgSpeed = this.average(speeds);
    const minSpeed = Math.min(...speeds);
    const maxSpeed = Math.max(...speeds);

    const avgThrottle = this.average(sectorPoints.map(p => p.throttle));
    const avgBrake = this.average(sectorPoints.map(p => p.brake));

    const cornerCount = this.countCornersInSector(
      trackName,
      trackId,
      boundary.startDistance,
      boundary.endDistance
    );

    return {
      sectorNumber: boundary.sectorNumber,
      startDistance: boundary.startDistance,
      endDistance: boundary.endDistance,
      distance,
      time,
      avgSpeed,
      minSpeed,
      maxSpeed,
      avgThrottle,
      avgBrake,
      cornerCount,
    };
  }

  private countCornersInSector(
    trackName: string,
    trackId: number | undefined,
    startDistance: number,
    endDistance: number
  ): number {
    const trackData = this.cornerDb.loadTrackCorners(trackName, trackId);

    if (!trackData) {
      return 0;
    }

    return trackData.corners.filter(
      c => c.apexDistance >= startDistance && c.apexDistance <= endDistance
    ).length;
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
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

  addSectorConfig(config: SectorConfig): void {
    const sanitizedName = this.sanitizeTrackName(config.trackName);
    this.sectorConfigs.set(sanitizedName, config.sectors);
  }

  formatTimeDelta(seconds: number): string {
    const sign = seconds >= 0 ? '+' : '';
    return `${sign}${seconds.toFixed(3)}s`;
  }

  getDeltaColor(delta: number): 'green' | 'red' | 'neutral' {
    if (delta < -0.01) return 'green';
    if (delta > 0.01) return 'red';
    return 'neutral';
  }
}
