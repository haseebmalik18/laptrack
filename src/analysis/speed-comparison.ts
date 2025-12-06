import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';
import { AlignedLaps } from './lap-aligner';
import { CornerDatabase, CornerDatabaseEntry } from './corner-database';

export interface SpeedPoint {
  lapA: number;
  lapB: number;
  delta: number;
}

export interface BrakingComparison {
  brakingPoint: SpeedPoint;
  peakBrake: SpeedPoint;
  brakingDistance: { lapA: number; lapB: number; delta: number };
  avgBrakePressure: SpeedPoint;
}

export interface CornerSpeedComparison {
  cornerNumber: number;
  cornerName?: string;
  entryDistance: number;
  apexDistance: number;
  exitDistance: number;

  entrySpeed: SpeedPoint;
  apexSpeed: SpeedPoint;
  exitSpeed: SpeedPoint;
  minSpeed: SpeedPoint;

  entryTime: { lapA: number; lapB: number };
  exitTime: { lapA: number; lapB: number };
  timeDelta: number;

  cornerLength: number;
  avgThrottle: SpeedPoint;
  avgBrake: SpeedPoint;

  brakingComparison?: BrakingComparison;
}

export interface AccelerationZone {
  startDistance: number;
  endDistance: number;
  distance: number;

  startSpeed: SpeedPoint;
  endSpeed: SpeedPoint;

  avgAcceleration: SpeedPoint;
  avgThrottle: SpeedPoint;

  duration: { lapA: number; lapB: number };
  timeDelta: number;

  precedingCorner?: number;
  followingCorner?: number;
}

export interface SpeedComparisonSummary {
  totalTimeDelta: number;
  totalDistance: number;

  timeGainedInCorners: number;
  timeGainedInAccelZones: number;

  avgSpeedDelta: number;
  maxSpeedDelta: number;
  maxSpeedDeltaDistance: number;

  fastestCornerGain: { cornerNumber: number; timeDelta: number };
  slowestCornerLoss: { cornerNumber: number; timeDelta: number };

  bestAccelZone: { zoneIndex: number; timeDelta: number };
  worstAccelZone: { zoneIndex: number; timeDelta: number };
}

export interface SpeedComparison {
  corners: CornerSpeedComparison[];
  accelerationZones: AccelerationZone[];
  summary: SpeedComparisonSummary;
}

export interface SpeedComparisonConfig {
  accelThrottleThreshold: number;
  minAccelZoneLength: number;
  cornerSpeedTolerance: number;
  cornerDbPath?: string;
}

export class SpeedComparisonAnalyzer {
  private config: SpeedComparisonConfig;
  private cornerDb: CornerDatabase;

  constructor(config: Partial<SpeedComparisonConfig> = {}) {
    this.config = {
      accelThrottleThreshold: config.accelThrottleThreshold ?? 0.5,
      minAccelZoneLength: config.minAccelZoneLength ?? 50,
      cornerSpeedTolerance: config.cornerSpeedTolerance ?? 5,
    };
    this.cornerDb = new CornerDatabase(config.cornerDbPath);
  }

  compareSpeed(
    aligned: AlignedLaps,
    trackName: string,
    trackId?: number
  ): SpeedComparison {
    const corners = this.analyzeCorners(aligned, trackName, trackId);
    const accelZones = this.detectAccelerationZones(aligned, corners);
    const summary = this.calculateSummary(aligned, corners, accelZones);

    return {
      corners,
      accelerationZones: accelZones,
      summary,
    };
  }

  private analyzeCorners(
    aligned: AlignedLaps,
    trackName: string,
    trackId?: number
  ): CornerSpeedComparison[] {
    const trackData = this.cornerDb.loadTrackCorners(trackName, trackId);

    if (!trackData) {
      throw new Error(`No corner database found for track: ${trackName}`);
    }

    const { lapA, lapB } = aligned;
    const comparisons: CornerSpeedComparison[] = [];

    for (const corner of trackData.corners) {
      const comparison = this.analyzeCorner(lapA, lapB, corner);
      comparisons.push(comparison);
    }

    return comparisons;
  }

  private analyzeCorner(
    lapA: NormalizedTelemetryPoint[],
    lapB: NormalizedTelemetryPoint[],
    corner: CornerDatabaseEntry
  ): CornerSpeedComparison {
    const tolerance = this.config.cornerSpeedTolerance;

    const entryA = this.findPointAtDistance(lapA, corner.entryDistance, tolerance);
    const entryB = this.findPointAtDistance(lapB, corner.entryDistance, tolerance);

    const apexA = this.findPointAtDistance(lapA, corner.apexDistance, tolerance);
    const apexB = this.findPointAtDistance(lapB, corner.apexDistance, tolerance);

    const exitA = this.findPointAtDistance(lapA, corner.exitDistance, tolerance);
    const exitB = this.findPointAtDistance(lapB, corner.exitDistance, tolerance);

    const cornerPointsA = this.getPointsInRange(lapA, corner.entryDistance, corner.exitDistance);
    const cornerPointsB = this.getPointsInRange(lapB, corner.entryDistance, corner.exitDistance);

    const minSpeedA = Math.min(...cornerPointsA.map(p => p.speed));
    const minSpeedB = Math.min(...cornerPointsB.map(p => p.speed));

    const avgThrottleA = this.average(cornerPointsA.map(p => p.throttle));
    const avgThrottleB = this.average(cornerPointsB.map(p => p.throttle));

    const avgBrakeA = this.average(cornerPointsA.map(p => p.brake));
    const avgBrakeB = this.average(cornerPointsB.map(p => p.brake));

    const timeOffsetA = lapA[0].time;
    const timeOffsetB = lapB[0].time;

    const entryTimeA = entryA.time - timeOffsetA;
    const entryTimeB = entryB.time - timeOffsetB;
    const exitTimeA = exitA.time - timeOffsetA;
    const exitTimeB = exitB.time - timeOffsetB;

    const cornerDurationA = exitTimeA - entryTimeA;
    const cornerDurationB = exitTimeB - entryTimeB;
    const timeDelta = cornerDurationA - cornerDurationB;

    let brakingComparison: BrakingComparison | undefined;
    if (corner.brakingZone) {
      brakingComparison = this.analyzeBraking(lapA, lapB, corner);
    }

    return {
      cornerNumber: corner.number,
      cornerName: corner.name,
      entryDistance: corner.entryDistance,
      apexDistance: corner.apexDistance,
      exitDistance: corner.exitDistance,

      entrySpeed: { lapA: entryA.speed, lapB: entryB.speed, delta: entryA.speed - entryB.speed },
      apexSpeed: { lapA: apexA.speed, lapB: apexB.speed, delta: apexA.speed - apexB.speed },
      exitSpeed: { lapA: exitA.speed, lapB: exitB.speed, delta: exitA.speed - exitB.speed },
      minSpeed: { lapA: minSpeedA, lapB: minSpeedB, delta: minSpeedA - minSpeedB },

      entryTime: { lapA: entryTimeA, lapB: entryTimeB },
      exitTime: { lapA: exitTimeA, lapB: exitTimeB },
      timeDelta,

      cornerLength: corner.exitDistance - corner.entryDistance,
      avgThrottle: { lapA: avgThrottleA, lapB: avgThrottleB, delta: avgThrottleA - avgThrottleB },
      avgBrake: { lapA: avgBrakeA, lapB: avgBrakeB, delta: avgBrakeA - avgBrakeB },

      brakingComparison,
    };
  }

  private analyzeBraking(
    lapA: NormalizedTelemetryPoint[],
    lapB: NormalizedTelemetryPoint[],
    corner: CornerDatabaseEntry
  ): BrakingComparison | undefined {
    if (!corner.brakingZone) return undefined;

    const tolerance = this.config.cornerSpeedTolerance;
    const zone = corner.brakingZone;

    const brakingPointA = this.findPointAtDistance(lapA, zone.entryDistance, tolerance);
    const brakingPointB = this.findPointAtDistance(lapB, zone.entryDistance, tolerance);

    const peakBrakeA = this.findPointAtDistance(lapA, zone.peakDistance, tolerance);
    const peakBrakeB = this.findPointAtDistance(lapB, zone.peakDistance, tolerance);

    const brakePointsA = this.getPointsInRange(lapA, zone.entryDistance, zone.exitDistance);
    const brakePointsB = this.getPointsInRange(lapB, zone.entryDistance, zone.exitDistance);

    const avgBrakeA = this.average(brakePointsA.map(p => p.brake));
    const avgBrakeB = this.average(brakePointsB.map(p => p.brake));

    return {
      brakingPoint: {
        lapA: brakingPointA.speed,
        lapB: brakingPointB.speed,
        delta: brakingPointA.speed - brakingPointB.speed
      },
      peakBrake: {
        lapA: peakBrakeA.brake,
        lapB: peakBrakeB.brake,
        delta: peakBrakeA.brake - peakBrakeB.brake
      },
      brakingDistance: {
        lapA: zone.brakingDistance,
        lapB: zone.brakingDistance,
        delta: 0
      },
      avgBrakePressure: {
        lapA: avgBrakeA,
        lapB: avgBrakeB,
        delta: avgBrakeA - avgBrakeB
      },
    };
  }

  private detectAccelerationZones(
    aligned: AlignedLaps,
    corners: CornerSpeedComparison[]
  ): AccelerationZone[] {
    const { lapA, lapB } = aligned;
    const zones: AccelerationZone[] = [];

    if (corners.length === 0) return zones;

    if (corners[0].entryDistance > this.config.minAccelZoneLength) {
      const zone = this.analyzeAccelerationZone(
        lapA, lapB,
        0,
        corners[0].entryDistance,
        undefined,
        corners[0].cornerNumber
      );
      if (zone) zones.push(zone);
    }

    for (let i = 0; i < corners.length - 1; i++) {
      const currentExit = corners[i].exitDistance;
      const nextEntry = corners[i + 1].entryDistance;
      const distance = nextEntry - currentExit;

      if (distance >= this.config.minAccelZoneLength) {
        const zone = this.analyzeAccelerationZone(
          lapA, lapB,
          currentExit,
          nextEntry,
          corners[i].cornerNumber,
          corners[i + 1].cornerNumber
        );
        if (zone) zones.push(zone);
      }
    }

    const lastCorner = corners[corners.length - 1];
    const trackEnd = lapA[lapA.length - 1].distance;
    if (trackEnd - lastCorner.exitDistance > this.config.minAccelZoneLength) {
      const zone = this.analyzeAccelerationZone(
        lapA, lapB,
        lastCorner.exitDistance,
        trackEnd,
        lastCorner.cornerNumber,
        undefined
      );
      if (zone) zones.push(zone);
    }

    return zones;
  }

  private analyzeAccelerationZone(
    lapA: NormalizedTelemetryPoint[],
    lapB: NormalizedTelemetryPoint[],
    startDistance: number,
    endDistance: number,
    precedingCorner?: number,
    followingCorner?: number
  ): AccelerationZone | null {
    const pointsA = this.getPointsInRange(lapA, startDistance, endDistance);
    const pointsB = this.getPointsInRange(lapB, startDistance, endDistance);

    if (pointsA.length < 2 || pointsB.length < 2) return null;

    const avgThrottleA = this.average(pointsA.map(p => p.throttle));
    const avgThrottleB = this.average(pointsB.map(p => p.throttle));

    if (avgThrottleA < this.config.accelThrottleThreshold &&
        avgThrottleB < this.config.accelThrottleThreshold) {
      return null;
    }

    const startSpeedA = pointsA[0].speed;
    const endSpeedA = pointsA[pointsA.length - 1].speed;
    const startSpeedB = pointsB[0].speed;
    const endSpeedB = pointsB[pointsB.length - 1].speed;

    const durationA = pointsA[pointsA.length - 1].time - pointsA[0].time;
    const durationB = pointsB[pointsB.length - 1].time - pointsB[0].time;

    const avgAccelA = durationA > 0 ? (endSpeedA - startSpeedA) / 3.6 / durationA : 0;
    const avgAccelB = durationB > 0 ? (endSpeedB - startSpeedB) / 3.6 / durationB : 0;

    const timeDelta = durationA - durationB;

    return {
      startDistance,
      endDistance,
      distance: endDistance - startDistance,

      startSpeed: { lapA: startSpeedA, lapB: startSpeedB, delta: startSpeedA - startSpeedB },
      endSpeed: { lapA: endSpeedA, lapB: endSpeedB, delta: endSpeedA - endSpeedB },

      avgAcceleration: { lapA: avgAccelA, lapB: avgAccelB, delta: avgAccelA - avgAccelB },
      avgThrottle: { lapA: avgThrottleA, lapB: avgThrottleB, delta: avgThrottleA - avgThrottleB },

      duration: { lapA: durationA, lapB: durationB },
      timeDelta,

      precedingCorner,
      followingCorner,
    };
  }

  private calculateSummary(
    aligned: AlignedLaps,
    corners: CornerSpeedComparison[],
    accelZones: AccelerationZone[]
  ): SpeedComparisonSummary {
    const { lapA } = aligned;
    const totalDistance = lapA[lapA.length - 1].distance - lapA[0].distance;

    const timeGainedInCorners = corners.reduce((sum, c) => sum + c.timeDelta, 0);
    const timeGainedInAccelZones = accelZones.reduce((sum, z) => sum + z.timeDelta, 0);

    const timeOffsetA = lapA[0].time;
    const timeOffsetB = aligned.lapB[0].time;
    const finalTimeA = lapA[lapA.length - 1].time - timeOffsetA;
    const finalTimeB = aligned.lapB[lapA.length - 1].time - timeOffsetB;
    const totalTimeDelta = finalTimeA - finalTimeB;

    const speedDeltas = lapA.map((p, i) => p.speed - aligned.lapB[i].speed);
    const avgSpeedDelta = this.average(speedDeltas);
    const maxSpeedDelta = Math.max(...speedDeltas.map(Math.abs));
    const maxSpeedDeltaIdx = speedDeltas.findIndex(d => Math.abs(d) === maxSpeedDelta);
    const maxSpeedDeltaDistance = lapA[maxSpeedDeltaIdx].distance;

    const sortedCorners = [...corners].sort((a, b) => a.timeDelta - b.timeDelta);
    const fastestCornerGain = sortedCorners[0];
    const slowestCornerLoss = sortedCorners[sortedCorners.length - 1];

    const sortedZones = [...accelZones].sort((a, b) => a.timeDelta - b.timeDelta);
    const bestAccelZone = sortedZones[0];
    const worstAccelZone = sortedZones[sortedZones.length - 1];

    return {
      totalTimeDelta,
      totalDistance,

      timeGainedInCorners,
      timeGainedInAccelZones,

      avgSpeedDelta,
      maxSpeedDelta,
      maxSpeedDeltaDistance,

      fastestCornerGain: {
        cornerNumber: fastestCornerGain?.cornerNumber ?? 0,
        timeDelta: fastestCornerGain?.timeDelta ?? 0
      },
      slowestCornerLoss: {
        cornerNumber: slowestCornerLoss?.cornerNumber ?? 0,
        timeDelta: slowestCornerLoss?.timeDelta ?? 0
      },

      bestAccelZone: {
        zoneIndex: bestAccelZone ? accelZones.indexOf(bestAccelZone) : 0,
        timeDelta: bestAccelZone?.timeDelta ?? 0
      },
      worstAccelZone: {
        zoneIndex: worstAccelZone ? accelZones.indexOf(worstAccelZone) : 0,
        timeDelta: worstAccelZone?.timeDelta ?? 0
      },
    };
  }

  private findPointAtDistance(
    points: NormalizedTelemetryPoint[],
    distance: number,
    tolerance: number = 5
  ): NormalizedTelemetryPoint {
    const closest = points.reduce((best, current) => {
      const bestDist = Math.abs(best.distance - distance);
      const currentDist = Math.abs(current.distance - distance);
      return currentDist < bestDist ? current : best;
    });

    if (Math.abs(closest.distance - distance) > tolerance) {
      console.warn(`Point at distance ${distance}m not found within ${tolerance}m tolerance`);
    }

    return closest;
  }

  private getPointsInRange(
    points: NormalizedTelemetryPoint[],
    startDistance: number,
    endDistance: number
  ): NormalizedTelemetryPoint[] {
    return points.filter(p => p.distance >= startDistance && p.distance <= endDistance);
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
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
