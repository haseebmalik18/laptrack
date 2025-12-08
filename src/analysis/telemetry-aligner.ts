/**
 * Telemetry Aligner - Transforms telemetry coordinates to match track map
 *
 * Applies rotation, scaling, and translation to align raw telemetry with pre-defined track maps
 */

import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';
import { TrackMap } from './track-map-loader';

export interface AlignmentTransform {
  scale: number;          // Scale factor to match track size
  rotation: number;       // Rotation angle in degrees
  translateX: number;     // X translation offset
  translateY: number;     // Y translation offset
}

export class TelemetryAligner {
  /**
   * Aligns telemetry to track map using rotation, scaling, and translation
   * Process: rotate 270° → scale to match track size → translate to center
   */
  alignToTrackMap(
    telemetry: NormalizedTelemetryPoint[],
    trackMap: TrackMap
  ): { aligned: NormalizedTelemetryPoint[]; transform: AlignmentTransform } {
    // Rotate telemetry 270° (rx = y, ry = -x)
    const telemetryPoints = telemetry.map(p => ({
      x: p.y!,
      y: -p.x!,
    }));

    const telBounds = this.getBounds(telemetryPoints);
    const trackBounds = trackMap.bounds;

    // Calculate scale factor to match track dimensions
    const telRangeX = telBounds.maxX - telBounds.minX;
    const telRangeY = telBounds.maxY - telBounds.minY;
    const trackRangeX = trackBounds.maxX - trackBounds.minX;
    const trackRangeY = trackBounds.maxY - trackBounds.minY;

    const scaleX = trackRangeX / telRangeX;
    const scaleY = trackRangeY / telRangeY;
    const scale = (scaleX + scaleY) / 2; // Average scale

    // Calculate translation to center telemetry on track
    const telCenterX = (telBounds.minX + telBounds.maxX) / 2;
    const telCenterY = (telBounds.minY + telBounds.maxY) / 2;
    const trackCenterX = (trackBounds.minX + trackBounds.maxX) / 2;
    const trackCenterY = (trackBounds.minY + trackBounds.maxY) / 2;

    const translateX = trackCenterX - telCenterX * scale;
    const translateY = trackCenterY - telCenterY * scale;

    // Apply full transformation: rotate → scale → translate
    const aligned = telemetry.map(p => ({
      ...p,
      x: (p.y! * scale + translateX),
      y: (-p.x! * scale + translateY),
    }));

    return {
      aligned,
      transform: {
        scale,
        rotation: 270,
        translateX,
        translateY,
      },
    };
  }

  /**
   * Calculate bounding box for a set of points
   */
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
