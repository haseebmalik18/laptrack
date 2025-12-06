import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';
import { TrackMap } from './track-map-loader';

export interface AlignmentTransform {
  scale: number;
  rotation: number;
  translateX: number;
  translateY: number;
}

export class TelemetryAligner {
  /**
   * Aligns telemetry data to a reference track map
   * This implements the Track Titan approach: transform telemetry to match track outline
   */
  alignToTrackMap(
    telemetry: NormalizedTelemetryPoint[],
    trackMap: TrackMap
  ): { aligned: NormalizedTelemetryPoint[]; transform: AlignmentTransform } {
    // Step 1: Calculate bounds of telemetry (using rotated coordinates)
    const telemetryPoints = telemetry.map(p => ({
      x: p.y!,  // Rotate: rx = y
      y: -p.x!, // ry = -x
    }));

    const telBounds = this.getBounds(telemetryPoints);
    const trackBounds = trackMap.bounds;

    // Step 2: Calculate scale factor to match track length
    const telRangeX = telBounds.maxX - telBounds.minX;
    const telRangeY = telBounds.maxY - telBounds.minY;
    const trackRangeX = trackBounds.maxX - trackBounds.minX;
    const trackRangeY = trackBounds.maxY - trackBounds.minY;

    const scaleX = trackRangeX / telRangeX;
    const scaleY = trackRangeY / telRangeY;
    const scale = (scaleX + scaleY) / 2; // Average scale

    // Step 3: Calculate translation to center
    const telCenterX = (telBounds.minX + telBounds.maxX) / 2;
    const telCenterY = (telBounds.minY + telBounds.maxY) / 2;
    const trackCenterX = (trackBounds.minX + trackBounds.maxX) / 2;
    const trackCenterY = (trackBounds.minY + trackBounds.maxY) / 2;

    const translateX = trackCenterX - telCenterX * scale;
    const translateY = trackCenterY - telCenterY * scale;

    // Step 4: Apply transformation
    const aligned = telemetry.map(p => ({
      ...p,
      // Transform: rotate, scale, translate
      x: (p.y! * scale + translateX),
      y: (-p.x! * scale + translateY),
    }));

    return {
      aligned,
      transform: {
        scale,
        rotation: 270, // We applied 270-degree rotation
        translateX,
        translateY,
      },
    };
  }

  private getBounds(points: { x: number; y: number }[]): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const p of points) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }

    return { minX, maxX, minY, maxY };
  }
}
