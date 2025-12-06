import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';
import { interpolatePoint } from './interpolation';

export interface NormalizerOptions {
  sampleRate: number;
}

export class LapNormalizer {
  private options: NormalizerOptions;

  constructor(options: Partial<NormalizerOptions> = {}) {
    this.options = {
      sampleRate: options.sampleRate || 1.0,
    };
  }

  normalize(points: NormalizedTelemetryPoint[], resetDistance: boolean = true): NormalizedTelemetryPoint[] {
    if (points.length < 2) {
      return points;
    }

    const sorted = [...points].sort((a, b) => a.distance - b.distance);

    const minDistance = Math.floor(sorted[0].distance);
    const maxDistance = Math.ceil(sorted[sorted.length - 1].distance);
    const distanceOffset = resetDistance ? minDistance : 0;

    const normalized: NormalizedTelemetryPoint[] = [];
    let pointIndex = 0;

    for (let d = minDistance; d <= maxDistance; d += this.options.sampleRate) {
      while (pointIndex < sorted.length - 1 && sorted[pointIndex + 1].distance < d) {
        pointIndex++;
      }

      if (pointIndex >= sorted.length - 1) {
        break;
      }

      const point0 = sorted[pointIndex];
      const point1 = sorted[pointIndex + 1];

      if (point1.distance < d) {
        continue;
      }

      const interpolated = interpolatePoint(d, point0, point1, 'distance');
      interpolated.distance = d - distanceOffset;

      normalized.push(interpolated);
    }

    return normalized;
  }

  getTrackLength(points: NormalizedTelemetryPoint[]): number {
    if (points.length === 0) return 0;
    const sorted = [...points].sort((a, b) => a.distance - b.distance);
    return sorted[sorted.length - 1].distance - sorted[0].distance;
  }
}
