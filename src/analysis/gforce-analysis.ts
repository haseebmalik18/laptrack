/**
 * G-Force Analysis - Analyzes lateral/longitudinal G-forces for lap comparison
 *
 * Calculates corner-by-corner G-force metrics and generates multi-metric insights.
 * Formula: combinedG = sqrt(lateralG² + longitudinalG²)
 */

import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';
import { AlignedLaps } from './lap-aligner';
import { CornerDatabase, CornerDatabaseEntry } from './corner-database';

export interface GForcePoint {
  distance: number;
  lateralG: number;
  longitudinalG: number;
  combinedG: number;
  speed: number;
  heading?: number;
}

export interface GForceComparison {
  distance: number;
  lapA: GForcePoint;
  lapB: GForcePoint;
  lateralGDelta: number;
  longitudinalGDelta: number;
  combinedGDelta: number;
}

export interface CornerGForceAnalysis {
  cornerNumber: number;
  cornerName?: string;
  entryDistance: number;
  apexDistance: number;
  exitDistance: number;

  peakLateralG: { lapA: number; lapB: number; delta: number };
  avgLateralG: { lapA: number; lapB: number; delta: number };
  peakLateralGDistance: { lapA: number; lapB: number };

  peakBrakingG: { lapA: number; lapB: number; delta: number };
  avgBrakingG: { lapA: number; lapB: number; delta: number };
  peakAccelG: { lapA: number; lapB: number; delta: number };
  avgAccelG: { lapA: number; lapB: number; delta: number };

  peakCombinedG: { lapA: number; lapB: number; delta: number };

  lateralGStdDev: { lapA: number; lapB: number };
  longitudinalGStdDev: { lapA: number; lapB: number };

  entrySpeed: { lapA: number; lapB: number; delta: number };
  apexSpeed: { lapA: number; lapB: number; delta: number };
  exitSpeed: { lapA: number; lapB: number; delta: number };
  minSpeed: { lapA: number; lapB: number; delta: number };

  insight?: CornerInsight;
}

export interface CornerInsight {
  type: 'under-braking' | 'over-braking' | 'not-using-grip' | 'better-previous-corner' | 'good-adaptation' | 'slower-overall' | 'faster-overall' | 'neutral';
  confidence: 'high' | 'medium' | 'low';
  message: string;
  recommendation?: string;
}

export interface FrictionCircleData {
  points: Array<{ lateral: number; longitudinal: number }>;
  maxRadius: number;
}

export interface GForceAnalysis {
  corners: CornerGForceAnalysis[];
  frictionCircle: {
    lapA: FrictionCircleData;
    lapB: FrictionCircleData;
  };
  summary: {
    peakLateralG: { lapA: number; lapB: number; delta: number };
    avgLateralG: { lapA: number; lapB: number; delta: number };
    peakBrakingG: { lapA: number; lapB: number; delta: number };
    avgBrakingG: { lapA: number; lapB: number; delta: number };
    peakAccelG: { lapA: number; lapB: number; delta: number };
    avgAccelG: { lapA: number; lapB: number; delta: number };
    bestCornerLateralG: { cornerNumber: number; lateralG: number };
    worstCornerLateralG: { cornerNumber: number; lateralG: number };
  };
}

export interface GForceConfig {
  smoothingWindow: number;
  minGForceThreshold: number;
  cornerDbPath?: string;
}

export class GForceAnalyzer {
  private config: GForceConfig;
  private cornerDb: CornerDatabase;

  constructor(config: Partial<GForceConfig> = {}) {
    this.config = {
      smoothingWindow: config.smoothingWindow ?? 3,
      minGForceThreshold: config.minGForceThreshold ?? 0.01,
    };
    this.cornerDb = new CornerDatabase(config.cornerDbPath);
  }

  // Analyze G-forces across entire lap with corner-by-corner breakdown
  analyzeGForces(
    aligned: AlignedLaps,
    trackName: string,
    trackId?: number
  ): GForceAnalysis {
    const gforcesA = this.calculateGForces(aligned.lapA);
    const gforcesB = this.calculateGForces(aligned.lapB);

    const corners = this.analyzeCorners(gforcesA, gforcesB, trackName, trackId);
    const frictionCircle = {
      lapA: this.calculateFrictionCircle(gforcesA),
      lapB: this.calculateFrictionCircle(gforcesB),
    };
    const summary = this.calculateSummary(gforcesA, gforcesB, corners);

    return {
      corners,
      frictionCircle,
      summary,
    };
  }

  // Calculate G-force point from telemetry (uses F1 2024 gLat/gLong data)
  private calculateGForces(lap: NormalizedTelemetryPoint[]): GForcePoint[] {
    return lap.map(point => {
      const lateralG = Math.abs(point.gLat);
      const longitudinalG = point.gLong;
      const combinedG = Math.sqrt(lateralG ** 2 + longitudinalG ** 2);
      const heading = this.calculateHeading(lap, lap.indexOf(point));

      return {
        distance: point.distance,
        lateralG,
        longitudinalG,
        combinedG,
        speed: point.speed,
        heading,
      };
    });
  }

  // Calculate heading from X/Y position
  private calculateHeading(lap: NormalizedTelemetryPoint[], index: number): number | undefined {
    if (index === 0) return undefined;

    const current = lap[index];
    const previous = lap[index - 1];

    const dx = current.x - previous.x;
    const dy = current.y - previous.y;

    return Math.atan2(dy, dx);
  }

  private analyzeCorners(
    gforcesA: GForcePoint[],
    gforcesB: GForcePoint[],
    trackName: string,
    trackId?: number
  ): CornerGForceAnalysis[] {
    const trackData = this.cornerDb.loadTrackCorners(trackName, trackId);

    if (!trackData) {
      throw new Error(`No corner database found for track: ${trackName}`);
    }

    const analyses: CornerGForceAnalysis[] = [];

    for (const corner of trackData.corners) {
      const analysis = this.analyzeCorner(gforcesA, gforcesB, corner);
      analyses.push(analysis);
    }

    return analyses;
  }

  private analyzeCorner(
    gforcesA: GForcePoint[],
    gforcesB: GForcePoint[],
    corner: CornerDatabaseEntry
  ): CornerGForceAnalysis {
    const cornerGforcesA = this.getGForcesInRange(gforcesA, corner.entryDistance, corner.exitDistance);
    const cornerGforcesB = this.getGForcesInRange(gforcesB, corner.entryDistance, corner.exitDistance);

    const entryA = this.findPointAtDistance(gforcesA, corner.entryDistance);
    const entryB = this.findPointAtDistance(gforcesB, corner.entryDistance);
    const apexA = this.findPointAtDistance(gforcesA, corner.apexDistance);
    const apexB = this.findPointAtDistance(gforcesB, corner.apexDistance);
    const exitA = this.findPointAtDistance(gforcesA, corner.exitDistance);
    const exitB = this.findPointAtDistance(gforcesB, corner.exitDistance);

    const lateralGsA = cornerGforcesA.map(g => g.lateralG);
    const lateralGsB = cornerGforcesB.map(g => g.lateralG);

    const peakLateralGA = Math.max(...lateralGsA);
    const peakLateralGB = Math.max(...lateralGsB);
    const avgLateralGA = this.average(lateralGsA);
    const avgLateralGB = this.average(lateralGsB);

    const peakLateralGDistanceA = cornerGforcesA.find(g => g.lateralG === peakLateralGA)?.distance ?? corner.apexDistance;
    const peakLateralGDistanceB = cornerGforcesB.find(g => g.lateralG === peakLateralGB)?.distance ?? corner.apexDistance;

    const brakingGsA = cornerGforcesA.map(g => g.longitudinalG).filter(g => g < -this.config.minGForceThreshold);
    const brakingGsB = cornerGforcesB.map(g => g.longitudinalG).filter(g => g < -this.config.minGForceThreshold);
    const accelGsA = cornerGforcesA.map(g => g.longitudinalG).filter(g => g > this.config.minGForceThreshold);
    const accelGsB = cornerGforcesB.map(g => g.longitudinalG).filter(g => g > this.config.minGForceThreshold);

    const peakBrakingGA = brakingGsA.length > 0 ? Math.min(...brakingGsA) : 0;
    const peakBrakingGB = brakingGsB.length > 0 ? Math.min(...brakingGsB) : 0;
    const avgBrakingGA = brakingGsA.length > 0 ? this.average(brakingGsA) : 0;
    const avgBrakingGB = brakingGsB.length > 0 ? this.average(brakingGsB) : 0;

    const peakAccelGA = accelGsA.length > 0 ? Math.max(...accelGsA) : 0;
    const peakAccelGB = accelGsB.length > 0 ? Math.max(...accelGsB) : 0;
    const avgAccelGA = accelGsA.length > 0 ? this.average(accelGsA) : 0;
    const avgAccelGB = accelGsB.length > 0 ? this.average(accelGsB) : 0;

    const combinedGsA = cornerGforcesA.map(g => g.combinedG);
    const combinedGsB = cornerGforcesB.map(g => g.combinedG);
    const peakCombinedGA = Math.max(...combinedGsA);
    const peakCombinedGB = Math.max(...combinedGsB);

    const lateralGStdDevA = this.stdDev(lateralGsA);
    const lateralGStdDevB = this.stdDev(lateralGsB);
    const longitudinalGStdDevA = this.stdDev(cornerGforcesA.map(g => g.longitudinalG));
    const longitudinalGStdDevB = this.stdDev(cornerGforcesB.map(g => g.longitudinalG));

    const minSpeedA = Math.min(...cornerGforcesA.map(g => g.speed));
    const minSpeedB = Math.min(...cornerGforcesB.map(g => g.speed));

    const analysis: CornerGForceAnalysis = {
      cornerNumber: corner.number,
      cornerName: corner.name,
      entryDistance: corner.entryDistance,
      apexDistance: corner.apexDistance,
      exitDistance: corner.exitDistance,

      peakLateralG: { lapA: peakLateralGA, lapB: peakLateralGB, delta: peakLateralGA - peakLateralGB },
      avgLateralG: { lapA: avgLateralGA, lapB: avgLateralGB, delta: avgLateralGA - avgLateralGB },
      peakLateralGDistance: { lapA: peakLateralGDistanceA, lapB: peakLateralGDistanceB },

      peakBrakingG: { lapA: peakBrakingGA, lapB: peakBrakingGB, delta: peakBrakingGA - peakBrakingGB },
      avgBrakingG: { lapA: avgBrakingGA, lapB: avgBrakingGB, delta: avgBrakingGA - avgBrakingGB },
      peakAccelG: { lapA: peakAccelGA, lapB: peakAccelGB, delta: peakAccelGA - peakAccelGB },
      avgAccelG: { lapA: avgAccelGA, lapB: avgAccelGB, delta: avgAccelGA - avgAccelGB },

      peakCombinedG: { lapA: peakCombinedGA, lapB: peakCombinedGB, delta: peakCombinedGA - peakCombinedGB },

      lateralGStdDev: { lapA: lateralGStdDevA, lapB: lateralGStdDevB },
      longitudinalGStdDev: { lapA: longitudinalGStdDevA, lapB: longitudinalGStdDevB },

      entrySpeed: { lapA: entryA.speed, lapB: entryB.speed, delta: entryA.speed - entryB.speed },
      apexSpeed: { lapA: apexA.speed, lapB: apexB.speed, delta: apexA.speed - apexB.speed },
      exitSpeed: { lapA: exitA.speed, lapB: exitB.speed, delta: exitA.speed - exitB.speed },
      minSpeed: { lapA: minSpeedA, lapB: minSpeedB, delta: minSpeedA - minSpeedB },
    };

    analysis.insight = this.generateInsight(analysis);

    return analysis;
  }

  private calculateFrictionCircle(gforces: GForcePoint[]): FrictionCircleData {
    const points = gforces.map(g => ({
      lateral: g.lateralG,
      longitudinal: g.longitudinalG,
    }));

    const maxRadius = Math.max(...gforces.map(g => g.combinedG));

    return { points, maxRadius };
  }

  private calculateSummary(
    gforcesA: GForcePoint[],
    gforcesB: GForcePoint[],
    corners: CornerGForceAnalysis[]
  ) {
    const lateralGsA = gforcesA.map(g => g.lateralG);
    const lateralGsB = gforcesB.map(g => g.lateralG);

    const peakLateralGA = Math.max(...lateralGsA);
    const peakLateralGB = Math.max(...lateralGsB);
    const avgLateralGA = this.average(lateralGsA);
    const avgLateralGB = this.average(lateralGsB);

    const brakingGsA = gforcesA.map(g => g.longitudinalG).filter(g => g < -this.config.minGForceThreshold);
    const brakingGsB = gforcesB.map(g => g.longitudinalG).filter(g => g < -this.config.minGForceThreshold);
    const accelGsA = gforcesA.map(g => g.longitudinalG).filter(g => g > this.config.minGForceThreshold);
    const accelGsB = gforcesB.map(g => g.longitudinalG).filter(g => g > this.config.minGForceThreshold);

    const peakBrakingGA = brakingGsA.length > 0 ? Math.min(...brakingGsA) : 0;
    const peakBrakingGB = brakingGsB.length > 0 ? Math.min(...brakingGsB) : 0;
    const avgBrakingGA = brakingGsA.length > 0 ? this.average(brakingGsA) : 0;
    const avgBrakingGB = brakingGsB.length > 0 ? this.average(brakingGsB) : 0;

    const peakAccelGA = accelGsA.length > 0 ? Math.max(...accelGsA) : 0;
    const peakAccelGB = accelGsB.length > 0 ? Math.max(...accelGsB) : 0;
    const avgAccelGA = accelGsA.length > 0 ? this.average(accelGsA) : 0;
    const avgAccelGB = accelGsB.length > 0 ? this.average(accelGsB) : 0;

    const sortedCorners = [...corners].sort((a, b) => b.avgLateralG.lapA - a.avgLateralG.lapA);
    const bestCorner = sortedCorners[0];
    const worstCorner = sortedCorners[sortedCorners.length - 1];

    return {
      peakLateralG: { lapA: peakLateralGA, lapB: peakLateralGB, delta: peakLateralGA - peakLateralGB },
      avgLateralG: { lapA: avgLateralGA, lapB: avgLateralGB, delta: avgLateralGA - avgLateralGB },
      peakBrakingG: { lapA: peakBrakingGA, lapB: peakBrakingGB, delta: peakBrakingGA - peakBrakingGB },
      avgBrakingG: { lapA: avgBrakingGA, lapB: avgBrakingGB, delta: avgBrakingGA - avgBrakingGB },
      peakAccelG: { lapA: peakAccelGA, lapB: peakAccelGB, delta: peakAccelGA - peakAccelGB },
      avgAccelG: { lapA: avgAccelGA, lapB: avgAccelGB, delta: avgAccelGA - avgAccelGB },
      bestCornerLateralG: {
        cornerNumber: bestCorner?.cornerNumber ?? 0,
        lateralG: bestCorner?.avgLateralG.lapA ?? 0,
      },
      worstCornerLateralG: {
        cornerNumber: worstCorner?.cornerNumber ?? 0,
        lateralG: worstCorner?.avgLateralG.lapA ?? 0,
      },
    };
  }

  // Generate multi-metric insight by correlating G-forces + speeds (WIP - tuning thresholds)
  private generateInsight(corner: CornerGForceAnalysis): CornerInsight {
    const entrySpeedSimilar = Math.abs(corner.entrySpeed.delta) < 10;
    const largeLateralGDiff = Math.abs(corner.avgLateralG.delta) > 0.3;
    const largeBrakingGDiff = Math.abs(corner.peakBrakingG.delta) > 0.5;
    const largeEntrySpeedDiff = Math.abs(corner.entrySpeed.delta) > 15;
    const apexSpeedDelta = corner.apexSpeed.delta;
    const exitSpeedDelta = corner.exitSpeed.delta;

    // Under-braking: Same entry, weaker braking, slower apex/exit
    if (entrySpeedSimilar && corner.peakBrakingG.delta > 0.5 && apexSpeedDelta < -5 && exitSpeedDelta < -5) {
      return {
        type: 'under-braking',
        confidence: 'high',
        message: `Same entry speed but weaker braking (${corner.peakBrakingG.delta.toFixed(1)}G) led to slower apex/exit`,
        recommendation: 'Brake harder - you have more grip available'
      };
    }

    // Over-braking: Same entry, harder braking, still slower apex
    if (entrySpeedSimilar && corner.peakBrakingG.delta < -0.5 && apexSpeedDelta < -3) {
      return {
        type: 'over-braking',
        confidence: 'medium',
        message: `Braked harder but still slower apex - may be scrubbing too much speed`,
        recommendation: 'Try lighter braking or different line'
      };
    }

    // Not using grip: Significantly lower lateral G
    if (largeLateralGDiff && corner.avgLateralG.delta < -0.3) {
      return {
        type: 'not-using-grip',
        confidence: 'high',
        message: `Significantly lower lateral G (${corner.avgLateralG.delta.toFixed(1)}G) - not using available grip`,
        recommendation: 'Push harder through this corner - carry more speed'
      };
    }

    // Better previous corner: Faster entry, similar apex
    if (largeEntrySpeedDiff && corner.entrySpeed.delta > 15 && Math.abs(corner.apexSpeed.delta) < 8) {
      return {
        type: 'better-previous-corner',
        confidence: 'medium',
        message: `Entered ${corner.entrySpeed.delta.toFixed(0)} km/h faster from better previous corner/straight`,
        recommendation: 'Good exit from previous section - adapted well'
      };
    }

    // Faster overall: Higher G + faster speeds
    if (largeLateralGDiff && corner.avgLateralG.delta > 0.3 && apexSpeedDelta > 3 && exitSpeedDelta > 3) {
      return {
        type: 'faster-overall',
        confidence: 'high',
        message: `Higher lateral G (+${corner.avgLateralG.delta.toFixed(1)}G) with faster speeds throughout`,
        recommendation: 'Excellent corner - using more grip effectively'
      };
    }

    // Slower overall: Significantly slower apex AND exit
    if (apexSpeedDelta < -8 || exitSpeedDelta < -8) {
      return {
        type: 'slower-overall',
        confidence: 'medium',
        message: `Slower apex/exit - check braking point and throttle application`,
        recommendation: 'Analyze full corner trace - multiple factors at play'
      };
    }

    return {
      type: 'neutral',
      confidence: 'low',
      message: 'Similar performance - small variations',
    };
  }

  private findPointAtDistance(gforces: GForcePoint[], distance: number): GForcePoint {
    return gforces.reduce((closest, current) => {
      const closestDist = Math.abs(closest.distance - distance);
      const currentDist = Math.abs(current.distance - distance);
      return currentDist < closestDist ? current : closest;
    });
  }

  private getGForcesInRange(gforces: GForcePoint[], start: number, end: number): GForcePoint[] {
    return gforces.filter(g => g.distance >= start && g.distance <= end);
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  private stdDev(values: number[]): number {
    if (values.length === 0) return 0;
    const avg = this.average(values);
    const squareDiffs = values.map(v => (v - avg) ** 2);
    const avgSquareDiff = this.average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  formatG(g: number): string {
    return `${g.toFixed(2)}G`;
  }

  getDeltaColor(delta: number): 'green' | 'red' | 'neutral' {
    if (delta > 0.05) return 'green';
    if (delta < -0.05) return 'red';
    return 'neutral';
  }
}
