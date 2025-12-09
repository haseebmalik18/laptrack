/**
 * Lap Aligner - Aligns two laps by distance for comparison
 *
 * Finds overlapping distance range between laps and trims to matching segments.
 */

import { NormalizedTelemetryPoint } from "../types/f1-2024-packets";

export interface AlignedLaps {
  lapA: NormalizedTelemetryPoint[];
  lapB: NormalizedTelemetryPoint[];
  startDistance: number;
  endDistance: number;
  length: number;
}

export class LapAligner {
  // Align laps by finding overlapping distance range
  alignLaps(
    lapA: NormalizedTelemetryPoint[],
    lapB: NormalizedTelemetryPoint[]
  ): AlignedLaps {
    if (lapA.length === 0 || lapB.length === 0) {
      throw new Error("Cannot align empty laps");
    }

    const startA = lapA[0].distance;
    const endA = lapA[lapA.length - 1].distance;

    const startB = lapB[0].distance;
    const endB = lapB[lapB.length - 1].distance;

    const startDistance = Math.max(startA, startB);
    const endDistance = Math.min(endA, endB);

    if (endDistance <= startDistance) {
      throw new Error("Laps do not overlap");
    }

    const alignedA = lapA.filter(
      (p) => p.distance >= startDistance && p.distance <= endDistance
    );
    const alignedB = lapB.filter(
      (p) => p.distance >= startDistance && p.distance <= endDistance
    );

    return {
      lapA: alignedA,
      lapB: alignedB,
      startDistance,
      endDistance,
      length: endDistance - startDistance,
    };
  }

  // Trim laps to same point count (alternative to distance-based alignment)
  trimToSameLength(
    lapA: NormalizedTelemetryPoint[],
    lapB: NormalizedTelemetryPoint[]
  ): AlignedLaps {
    const minLength = Math.min(lapA.length, lapB.length);

    return {
      lapA: lapA.slice(0, minLength),
      lapB: lapB.slice(0, minLength),
      startDistance: lapA[0].distance,
      endDistance: lapA[minLength - 1].distance,
      length: lapA[minLength - 1].distance - lapA[0].distance,
    };
  }
}
