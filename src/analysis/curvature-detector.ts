import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';
import { Corner, CornerDirection, CornerType } from './corner-detector';

export interface CurvatureDetectionConfig {
  minCurvatureThreshold: number;
  curvatureSmoothingWindow: number;
  minCornerLength: number;
  minCornerDuration: number;
  cornerMergeDistance: number;
}

const DEFAULT_CURVATURE_CONFIG: CurvatureDetectionConfig = {
  minCurvatureThreshold: 0.02,
  curvatureSmoothingWindow: 10,
  minCornerLength: 30,
  minCornerDuration: 1.0,
  cornerMergeDistance: 50,
};

function calculateHeading(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

function calculateCurvature(points: NormalizedTelemetryPoint[]): number[] {
  const curvatures: number[] = [];

  if (points.length < 3) {
    return curvatures;
  }

  curvatures.push(0);

  for (let i = 1; i < points.length - 1; i++) {
    const heading1 = calculateHeading(
      points[i - 1].x,
      points[i - 1].y,
      points[i].x,
      points[i].y
    );

    const heading2 = calculateHeading(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    );

    let deltaHeading = normalizeAngle(heading2 - heading1);

    const segmentLength = Math.sqrt(
      Math.pow(points[i + 1].x - points[i].x, 2) +
      Math.pow(points[i + 1].y - points[i].y, 2)
    );

    const curvature = segmentLength > 0 ? Math.abs(deltaHeading) / segmentLength : 0;

    curvatures.push(curvature);
  }

  curvatures.push(0);

  return curvatures;
}

function smoothCurvature(curvatures: number[], windowSize: number): number[] {
  const smoothed: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < curvatures.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = Math.max(0, i - halfWindow); j <= Math.min(curvatures.length - 1, i + halfWindow); j++) {
      sum += curvatures[j];
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

function findCurvatureApex(curvatures: number[], startIdx: number, endIdx: number): number {
  let maxCurvature = 0;
  let apexIdx = startIdx;

  for (let i = startIdx; i <= endIdx; i++) {
    if (curvatures[i] > maxCurvature) {
      maxCurvature = curvatures[i];
      apexIdx = i;
    }
  }

  return apexIdx;
}

function calculateCornerDirection(
  points: NormalizedTelemetryPoint[],
  startIdx: number,
  endIdx: number
): CornerDirection {
  let totalTurn = 0;

  for (let i = startIdx; i < endIdx; i++) {
    if (i + 1 < points.length) {
      const heading1 = calculateHeading(
        points[i].x,
        points[i].y,
        points[i + 1].x,
        points[i + 1].y
      );

      const heading2 = calculateHeading(
        points[i + 1].x,
        points[i + 1].y,
        points[Math.min(i + 2, points.length - 1)].x,
        points[Math.min(i + 2, points.length - 1)].y
      );

      totalTurn += normalizeAngle(heading2 - heading1);
    }
  }

  return totalTurn > 0 ? CornerDirection.LEFT : CornerDirection.RIGHT;
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

function calculateAvgCurvature(curvatures: number[], startIdx: number, endIdx: number): number {
  let sum = 0;
  let count = 0;

  for (let i = startIdx; i <= endIdx; i++) {
    sum += curvatures[i];
    count++;
  }

  return count > 0 ? sum / count : 0;
}

export function detectCornersByCurvature(
  points: NormalizedTelemetryPoint[],
  config: Partial<CurvatureDetectionConfig> = {}
): Corner[] {
  const cfg = { ...DEFAULT_CURVATURE_CONFIG, ...config };
  const corners: Corner[] = [];

  if (points.length < 10) {
    return corners;
  }

  const curvatures = calculateCurvature(points);
  const smoothedCurvature = smoothCurvature(curvatures, cfg.curvatureSmoothingWindow);

  let inCorner = false;
  let cornerStartIdx = 0;
  let cornerId = 0;

  for (let i = 1; i < points.length; i++) {
    const curvature = smoothedCurvature[i];

    if (!inCorner && curvature > cfg.minCurvatureThreshold) {
      inCorner = true;
      cornerStartIdx = i;
    } else if (inCorner && curvature < cfg.minCurvatureThreshold) {
      const cornerEndIdx = i - 1;
      const cornerLength = points[cornerEndIdx].distance - points[cornerStartIdx].distance;
      const cornerDuration = points[cornerEndIdx].time - points[cornerStartIdx].time;

      if (cornerLength >= cfg.minCornerLength && cornerDuration >= cfg.minCornerDuration) {
        const apexIdx = findCurvatureApex(smoothedCurvature, cornerStartIdx, cornerEndIdx);
        const minSpeed = findMinSpeed(points, cornerStartIdx, cornerEndIdx);
        const avgCurvature = calculateAvgCurvature(smoothedCurvature, cornerStartIdx, cornerEndIdx);
        const direction = calculateCornerDirection(points, cornerStartIdx, cornerEndIdx);

        const corner: Corner = {
          id: ++cornerId,
          entryDistance: points[cornerStartIdx].distance,
          apexDistance: points[apexIdx].distance,
          exitDistance: points[cornerEndIdx].distance,
          entrySpeed: points[cornerStartIdx].speed,
          apexSpeed: points[apexIdx].speed,
          exitSpeed: points[cornerEndIdx].speed,
          minSpeed,
          maxGLat: smoothedCurvature[apexIdx] * 100,
          avgGLat: avgCurvature * 100,
          direction,
          type: classifyCornerType(points[apexIdx].speed),
          length: cornerLength,
          entryIndex: cornerStartIdx,
          apexIndex: apexIdx,
          exitIndex: cornerEndIdx,
        };

        corners.push(corner);
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

    if (gap < mergeDistance / 2) {
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
