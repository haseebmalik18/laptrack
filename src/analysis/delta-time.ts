import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';
import { AlignedLaps } from './lap-aligner';

export interface DeltaPoint {
  distance: number;
  deltaTime: number;
  lapATime: number;
  lapBTime: number;
  lapASpeed: number;
  lapBSpeed: number;
  speedDelta: number;
}

export interface DeltaAnalysis {
  points: DeltaPoint[];
  summary: {
    maxGain: number;
    maxLoss: number;
    maxGainDistance: number;
    maxLossDistance: number;
    totalTimeDifference: number;
    averageDelta: number;
  };
}

export class DeltaTimeCalculator {
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

    const timeOffsetA = lapA[0].time;
    const timeOffsetB = lapB[0].time;

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

  formatDelta(seconds: number, decimals: number = 3): string {
    const sign = seconds >= 0 ? '+' : '';
    return `${sign}${seconds.toFixed(decimals)}s`;
  }

  getDeltaColor(delta: number): 'green' | 'red' | 'neutral' {
    if (delta < -0.01) return 'green';
    if (delta > 0.01) return 'red';
    return 'neutral';
  }
}
