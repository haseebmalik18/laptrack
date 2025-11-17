import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';

export enum CornerDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum CornerType {
  HAIRPIN = 'hairpin',
  SLOW = 'slow',
  MEDIUM = 'medium',
  FAST = 'fast',
  VERY_FAST = 'very_fast',
}

export interface Corner {
  id: number;
  entryDistance: number;
  apexDistance: number;
  exitDistance: number;
  entrySpeed: number;
  apexSpeed: number;
  exitSpeed: number;
  minSpeed: number;
  maxGLat: number;
  avgGLat: number;
  direction: CornerDirection;
  type: CornerType;
  length: number;
  entryIndex: number;
  apexIndex: number;
  exitIndex: number;
}

export interface CornerDetectionConfig {
  minGLatThreshold: number;
  gLatSmoothingWindow: number;
  minCornerLength: number;
  cornerMergeDistance: number;
  requireBraking: boolean;
  minBrakeThreshold: number;
  requireSpeedReduction: boolean;
  minSpeedReductionPercent: number;
  requireThrottleLift: boolean;
}

const DEFAULT_CONFIG: CornerDetectionConfig = {
  minGLatThreshold: 0.5,
  gLatSmoothingWindow: 5,
  minCornerLength: 20,
  cornerMergeDistance: 50,
  requireBraking: true,
  minBrakeThreshold: 0.1,
  requireSpeedReduction: true,
  minSpeedReductionPercent: 3,
  requireThrottleLift: true,
};

function smoothGForce(points: NormalizedTelemetryPoint[], windowSize: number): number[] {
  const smoothed: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < points.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = Math.max(0, i - halfWindow); j <= Math.min(points.length - 1, i + halfWindow); j++) {
      sum += Math.abs(points[j].gLat);
      count++;
    }

    smoothed.push(sum / count);
  }

  return smoothed;
}

function classifyCornerType(apexSpeed: number): CornerType {
  if (apexSpeed < 80) return CornerType.HAIRPIN;
  if (apexSpeed < 120) return CornerType.SLOW;
  if (apexSpeed < 180) return CornerType.MEDIUM;
  if (apexSpeed < 250) return CornerType.FAST;
  return CornerType.VERY_FAST;
}

function findApex(points: NormalizedTelemetryPoint[], startIdx: number, endIdx: number): number {
  let maxGLat = 0;
  let apexIdx = startIdx;

  for (let i = startIdx; i <= endIdx; i++) {
    const absGLat = Math.abs(points[i].gLat);
    if (absGLat > maxGLat) {
      maxGLat = absGLat;
      apexIdx = i;
    }
  }

  return apexIdx;
}

function findMinSpeed(points: NormalizedTelemetryPoint[], startIdx: number, endIdx: number): number {
  let minSpeed = Infinity;

  for (let i = startIdx; i <= endIdx; i++) {
    if (points[i].speed < minSpeed) {
      minSpeed = points[i].speed;
    }
  }

  return minSpeed;
}

function calculateAvgGLat(points: NormalizedTelemetryPoint[], startIdx: number, endIdx: number): number {
  let sum = 0;
  let count = 0;

  for (let i = startIdx; i <= endIdx; i++) {
    sum += Math.abs(points[i].gLat);
    count++;
  }

  return count > 0 ? sum / count : 0;
}

function hasBraking(points: NormalizedTelemetryPoint[], startIdx: number, endIdx: number, threshold: number): boolean {
  for (let i = startIdx; i <= endIdx; i++) {
    if (points[i].brake >= threshold) {
      return true;
    }
  }
  return false;
}

function hasSpeedReduction(points: NormalizedTelemetryPoint[], startIdx: number, endIdx: number, minPercent: number): boolean {
  const entrySpeed = points[startIdx].speed;
  const minSpeed = findMinSpeed(points, startIdx, endIdx);

  if (entrySpeed === 0) return false;

  const reductionPercent = ((entrySpeed - minSpeed) / entrySpeed) * 100;
  return reductionPercent >= minPercent;
}

function hasThrottleLift(points: NormalizedTelemetryPoint[], startIdx: number, endIdx: number): boolean {
  const entryThrottle = points[startIdx].throttle;

  for (let i = startIdx; i <= endIdx; i++) {
    if (points[i].throttle < entryThrottle * 0.8) {
      return true;
    }
  }
  return false;
}

export function detectCorners(
  points: NormalizedTelemetryPoint[],
  config: Partial<CornerDetectionConfig> = {}
): Corner[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const corners: Corner[] = [];

  if (points.length < 10) {
    return corners;
  }

  const smoothedGLat = smoothGForce(points, cfg.gLatSmoothingWindow);

  let inCorner = false;
  let cornerStartIdx = 0;
  let cornerId = 0;

  for (let i = 1; i < points.length; i++) {
    const absGLat = smoothedGLat[i];

    if (!inCorner && absGLat > cfg.minGLatThreshold) {
      inCorner = true;
      cornerStartIdx = i;
    } else if (inCorner && absGLat < cfg.minGLatThreshold) {
      const cornerEndIdx = i - 1;
      const cornerLength = points[cornerEndIdx].distance - points[cornerStartIdx].distance;

      if (cornerLength >= cfg.minCornerLength) {
        let isValidCorner = true;

        if (cfg.requireBraking && !hasBraking(points, cornerStartIdx, cornerEndIdx, cfg.minBrakeThreshold)) {
          isValidCorner = false;
        }

        if (cfg.requireSpeedReduction && !hasSpeedReduction(points, cornerStartIdx, cornerEndIdx, cfg.minSpeedReductionPercent)) {
          isValidCorner = false;
        }

        if (cfg.requireThrottleLift && !hasThrottleLift(points, cornerStartIdx, cornerEndIdx)) {
          isValidCorner = false;
        }

        if (isValidCorner) {
          const apexIdx = findApex(points, cornerStartIdx, cornerEndIdx);
          const minSpeed = findMinSpeed(points, cornerStartIdx, cornerEndIdx);
          const avgGLat = calculateAvgGLat(points, cornerStartIdx, cornerEndIdx);

          const direction = points[apexIdx].gLat > 0 ? CornerDirection.LEFT : CornerDirection.RIGHT;

          const corner: Corner = {
            id: ++cornerId,
            entryDistance: points[cornerStartIdx].distance,
            apexDistance: points[apexIdx].distance,
            exitDistance: points[cornerEndIdx].distance,
            entrySpeed: points[cornerStartIdx].speed,
            apexSpeed: points[apexIdx].speed,
            exitSpeed: points[cornerEndIdx].speed,
            minSpeed,
            maxGLat: Math.abs(points[apexIdx].gLat),
            avgGLat,
            direction,
            type: classifyCornerType(points[apexIdx].speed),
            length: cornerLength,
            entryIndex: cornerStartIdx,
            apexIndex: apexIdx,
            exitIndex: cornerEndIdx,
          };

          corners.push(corner);
        }
      }

      inCorner = false;
    }
  }

  return mergeCloseCorners(corners, cfg.cornerMergeDistance);
}

function mergeCloseCorners(corners: Corner[], mergeDistance: number): Corner[] {
  if (corners.length <= 1) return corners;

  const merged: Corner[] = [];
  let current = corners[0];

  for (let i = 1; i < corners.length; i++) {
    const next = corners[i];
    const gap = next.entryDistance - current.exitDistance;

    if (gap < 0 || gap < mergeDistance / 2) {
      current = {
        ...current,
        exitDistance: next.exitDistance,
        exitSpeed: next.exitSpeed,
        exitIndex: next.exitIndex,
        length: next.exitDistance - current.entryDistance,
        maxGLat: Math.max(current.maxGLat, next.maxGLat),
        minSpeed: Math.min(current.minSpeed, next.minSpeed),
        apexDistance: current.maxGLat > next.maxGLat ? current.apexDistance : next.apexDistance,
        apexSpeed: current.maxGLat > next.maxGLat ? current.apexSpeed : next.apexSpeed,
        apexIndex: current.maxGLat > next.maxGLat ? current.apexIndex : next.apexIndex,
        type: classifyCornerType(Math.min(current.minSpeed, next.minSpeed)),
      };
    } else {
      merged.push(current);
      current = next;
    }
  }

  merged.push(current);
  return merged;
}

export function findCornerAtDistance(corners: Corner[], distance: number): Corner | null {
  for (const corner of corners) {
    if (distance >= corner.entryDistance && distance <= corner.exitDistance) {
      return corner;
    }
  }
  return null;
}

export interface CornerStats {
  totalCorners: number;
  byType: Record<CornerType, number>;
  byDirection: Record<CornerDirection, number>;
  avgCornerSpeed: number;
  avgGLat: number;
  slowestCorner: Corner | null;
  fastestCorner: Corner | null;
  highestGLatCorner: Corner | null;
}

export function getCornerStats(corners: Corner[]): CornerStats {
  if (corners.length === 0) {
    return {
      totalCorners: 0,
      byType: {
        [CornerType.HAIRPIN]: 0,
        [CornerType.SLOW]: 0,
        [CornerType.MEDIUM]: 0,
        [CornerType.FAST]: 0,
        [CornerType.VERY_FAST]: 0,
      },
      byDirection: {
        [CornerDirection.LEFT]: 0,
        [CornerDirection.RIGHT]: 0,
      },
      avgCornerSpeed: 0,
      avgGLat: 0,
      slowestCorner: null,
      fastestCorner: null,
      highestGLatCorner: null,
    };
  }

  const byType: Record<CornerType, number> = {
    [CornerType.HAIRPIN]: 0,
    [CornerType.SLOW]: 0,
    [CornerType.MEDIUM]: 0,
    [CornerType.FAST]: 0,
    [CornerType.VERY_FAST]: 0,
  };

  const byDirection: Record<CornerDirection, number> = {
    [CornerDirection.LEFT]: 0,
    [CornerDirection.RIGHT]: 0,
  };

  let totalSpeed = 0;
  let totalGLat = 0;
  let slowest = corners[0];
  let fastest = corners[0];
  let highestGLat = corners[0];

  for (const corner of corners) {
    byType[corner.type]++;
    byDirection[corner.direction]++;
    totalSpeed += corner.apexSpeed;
    totalGLat += corner.avgGLat;

    if (corner.minSpeed < slowest.minSpeed) slowest = corner;
    if (corner.apexSpeed > fastest.apexSpeed) fastest = corner;
    if (corner.maxGLat > highestGLat.maxGLat) highestGLat = corner;
  }

  return {
    totalCorners: corners.length,
    byType,
    byDirection,
    avgCornerSpeed: totalSpeed / corners.length,
    avgGLat: totalGLat / corners.length,
    slowestCorner: slowest,
    fastestCorner: fastest,
    highestGLatCorner: highestGLat,
  };
}
