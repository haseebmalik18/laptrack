/**
 * Delta Time Calculator - Point-by-point time comparison between laps
 *
 * Shows where time is gained/lost by comparing elapsed time at each distance.
 * Negative delta = faster, positive = slower.
 */

import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';
import { AlignedLaps } from './lap-aligner';

export interface DeltaPoint {
  distance: number;            // Track distance (meters)
  deltaTime: number;           // Time diff (lapA - lapB, negative = faster)
  lapATime: number;            // Lap A elapsed time (seconds)
  lapBTime: number;            // Lap B elapsed time (seconds)
  lapASpeed: number;           // Lap A speed (km/h)
  lapBSpeed: number;           // Lap B speed (km/h)
  speedDelta: number;          // Speed diff (lapA - lapB)
}

export interface DeltaAnalysis {
  points: DeltaPoint[];
  summary: {
    maxGain: number;           // Max time gained (seconds)
    maxLoss: number;           // Max time lost (seconds)
    maxGainDistance: number;   // Where max gain occurred
    maxLossDistance: number;   // Where max loss occurred
    totalTimeDifference: number; // Total lap time diff
    averageDelta: number;      // Average delta
  };
}

export class DeltaTimeCalculator {
  /**
   * Calculate point-by-point delta time between aligned laps
   * Requires laps with identical distance points (use LapAligner first)
   */
  calculateDelta(aligned: AlignedLaps): DeltaAnalysis {
    const { lapA, lapB } = aligned;

    if (lapA.length !== lapB.length) {
      throw new Error(
        `Laps must have same length (lapA: ${lapA.length}, lapB: ${lapB.length})`
      );
    }

    if (lapA.length === 0) {
      throw new Error('Cannot calculate delta for empty laps');
    }

    // Normalize start times to 0
    const timeOffsetA = lapA[0].time;
    const timeOffsetB = lapB[0].time;

    // Calculate delta at each point
    const points: DeltaPoint[] = lapA.map((pointA, i) => {
      const pointB = lapB[i];

      const normalizedTimeA = pointA.time - timeOffsetA;
      const normalizedTimeB = pointB.time - timeOffsetB;

      const deltaTime = normalizedTimeA - normalizedTimeB;
      const speedDelta = pointA.speed - pointB.speed;

      return {
        distance: pointA.distance,
        deltaTime,
        lapATime: normalizedTimeA,
        lapBTime: normalizedTimeB,
        lapASpeed: pointA.speed,
        lapBSpeed: pointB.speed,
        speedDelta,
      };
    });

    // Find max gain/loss
    let maxGain = 0;
    let maxLoss = 0;
    let maxGainDistance = 0;
    let maxLossDistance = 0;
    let sumDelta = 0;

    points.forEach((p) => {
      sumDelta += p.deltaTime;

      if (p.deltaTime < maxGain) {
        maxGain = p.deltaTime;
        maxGainDistance = p.distance;
      }

      if (p.deltaTime > maxLoss) {
        maxLoss = p.deltaTime;
        maxLossDistance = p.distance;
      }
    });

    const totalTimeDifference = points[points.length - 1].deltaTime;
    const averageDelta = sumDelta / points.length;

    return {
      points,
      summary: {
        maxGain,
        maxLoss,
        maxGainDistance,
        maxLossDistance,
        totalTimeDifference,
        averageDelta,
      },
    };
  }

  /**
   * Format delta with sign (e.g., "+0.523s")
   */
  formatDelta(seconds: number, decimals: number = 3): string {
    const sign = seconds >= 0 ? '+' : '';
    return `${sign}${seconds.toFixed(decimals)}s`;
  }

  /**
   * Get color for delta (green = faster, red = slower)
   */
  getDeltaColor(delta: number): 'green' | 'red' | 'neutral' {
    if (delta < -0.01) return 'green';
    if (delta > 0.01) return 'red';
    return 'neutral';
  }
}
