import { NormalizedTelemetryPoint } from "../types/f1-2024-packets";
import { Corner, CornerDirection, CornerType } from "./corner-types";

export interface YawCurvatureConfig {
  minYawRateThreshold: number;       // Min yaw rate (rad/s, default: 0.08)
  minCurvatureThreshold: number;     // Min curvature (default: 0.003)
  yawSmoothingWindow: number;        // Yaw smoothing window (meters, default: 5)
  curvatureSmoothingWindow: number;  // Curvature smoothing window (meters, default: 10)
  minCornerLength: number;           // Min corner length (meters, default: 15)
  minCornerDuration: number;         // Min duration (seconds, default: 0.25)
  cornerMergeDistance: number;       // Max merge gap (meters, default: 50)
}

const DEFAULT_YAW_CURVATURE_CONFIG: YawCurvatureConfig = {
  minYawRateThreshold: 0.08,
  minCurvatureThreshold: 0.003,
  yawSmoothingWindow: 5,
  curvatureSmoothingWindow: 10,
  minCornerLength: 15,
  minCornerDuration: 0.25,
  cornerMergeDistance: 50,
};

// Calculate heading angle between two points
function calculateHeading(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

// Normalize angle to [-π, π] (handles wraparound)
function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

// Calculate track curvature from X/Y position
// Formula: curvature = |Δheading| / segment_length
function calculateCurvature(points: NormalizedTelemetryPoint[]): number[] {
  const curvatures: number[] = [];
  if (points.length < 3) return curvatures;

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
    const deltaHeading = normalizeAngle(heading2 - heading1);
    const segmentLength = Math.sqrt(
      Math.pow(points[i + 1].x - points[i].x, 2) +
        Math.pow(points[i + 1].y - points[i].y, 2)
    );
    const curvature =
      segmentLength > 0 ? Math.abs(deltaHeading) / segmentLength : 0;
    curvatures.push(curvature);
  }
  curvatures.push(0);
  return curvatures;
}

// Calculate yaw rate (car rotation speed in rad/s)
// Formula: yaw_rate = |Δyaw| / Δtime
function calculateYawRate(points: NormalizedTelemetryPoint[]): number[] {
  const yawRates: number[] = [];

  if (points.length < 2) return yawRates;

  yawRates.push(0);
  for (let i = 1; i < points.length; i++) {
    const deltaTime = points[i].time - points[i - 1].time;
    if (points[i].yaw !== 0 || points[i - 1].yaw !== 0) {
      const deltaYaw = normalizeAngle(points[i].yaw - points[i - 1].yaw);
      yawRates.push(deltaTime > 0 ? Math.abs(deltaYaw) / deltaTime : 0);
    } else {
      const heading1 = calculateHeading(
        points[i - 1].x,
        points[i - 1].y,
        points[i].x,
        points[i].y
      );
      const heading2 =
        i < points.length - 1
          ? calculateHeading(
              points[i].x,
              points[i].y,
              points[i + 1].x,
              points[i + 1].y
            )
          : heading1;
      const deltaHeading = normalizeAngle(heading2 - heading1);
      yawRates.push(deltaTime > 0 ? Math.abs(deltaHeading) / deltaTime : 0);
    }
  }

  return yawRates;
}

// Apply moving average smoothing to reduce sensor noise
function smoothArray(data: number[], windowSize: number): number[] {
  const smoothed: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    for (
      let j = Math.max(0, i - halfWindow);
      j <= Math.min(data.length - 1, i + halfWindow);
      j++
    ) {
      sum += data[j];
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

function findApex(
  curvatures: number[],
  yawRates: number[],
  startIdx: number,
  endIdx: number
): number {
  let maxScore = 0;
  let apexIdx = startIdx;

  for (let i = startIdx; i <= endIdx; i++) {
    // Combined score: curvature + yaw rate (both indicate cornering)
    const score = curvatures[i] + yawRates[i];
    if (score > maxScore) {
      maxScore = score;
      apexIdx = i;
    }
  }

  return apexIdx;
}

function findMinSpeed(
  points: NormalizedTelemetryPoint[],
  startIdx: number,
  endIdx: number
): number {
  let minSpeed = Infinity;
  for (let i = startIdx; i <= endIdx; i++) {
    if (points[i].speed < minSpeed) {
      minSpeed = points[i].speed;
    }
  }
  return minSpeed;
}

function calculateCornerDirection(
  yawRates: number[],
  points: NormalizedTelemetryPoint[],
  startIdx: number,
  endIdx: number
): CornerDirection {
  // Use actual yaw/heading change to determine direction
  let totalYawChange = 0;

  for (let i = startIdx; i < endIdx; i++) {
    if (i + 1 < points.length) {
      const deltaYaw =
        points[i].yaw !== 0
          ? normalizeAngle(points[i + 1].yaw - points[i].yaw)
          : normalizeAngle(
              calculateHeading(
                points[i + 1].x,
                points[i + 1].y,
                points[Math.min(i + 2, points.length - 1)].x,
                points[Math.min(i + 2, points.length - 1)].y
              ) -
                calculateHeading(
                  points[i].x,
                  points[i].y,
                  points[i + 1].x,
                  points[i + 1].y
                )
            );

      totalYawChange += deltaYaw;
    }
  }

  return totalYawChange > 0 ? CornerDirection.LEFT : CornerDirection.RIGHT;
}

// Dual-signal corner detection (yaw rate + track curvature)
// Corner detected when BOTH signals exceed thresholds (eliminates false positives)
// Features: direction reversal detection, multi-apex splitting, smart merging
export function detectCornersYawCurvature(
  points: NormalizedTelemetryPoint[],
  config: Partial<YawCurvatureConfig> = {}
): Corner[] {
  const cfg = { ...DEFAULT_YAW_CURVATURE_CONFIG, ...config };
  const corners: Corner[] = [];
  if (points.length < 10) return corners;

  const curvatures = calculateCurvature(points);
  const yawRates = calculateYawRate(points);
  const smoothedCurvature = smoothArray(
    curvatures,
    cfg.curvatureSmoothingWindow
  );
  const smoothedYawRate = smoothArray(yawRates, cfg.yawSmoothingWindow);

  let inCorner = false;
  let cornerStartIdx = 0;
  let cornerId = 0;
  let lastYawSign = 0;

  for (let i = 1; i < points.length; i++) {
    const curvature = smoothedCurvature[i];
    const yawRate = smoothedYawRate[i];
    const isCornerCondition =
      curvature > cfg.minCurvatureThreshold &&
      yawRate > cfg.minYawRateThreshold;

    let currentYawSign = 0;
    if (i < points.length - 1) {
      const deltaYaw =
        points[i].yaw !== 0
          ? normalizeAngle(points[i + 1].yaw - points[i].yaw)
          : normalizeAngle(
              calculateHeading(
                points[i + 1].x,
                points[i + 1].y,
                points[Math.min(i + 2, points.length - 1)].x,
                points[Math.min(i + 2, points.length - 1)].y
              ) -
                calculateHeading(
                  points[i].x,
                  points[i].y,
                  points[i + 1].x,
                  points[i + 1].y
                )
            );
      currentYawSign = Math.sign(deltaYaw);
    }

    const directionReversed =
      inCorner &&
      lastYawSign !== 0 &&
      currentYawSign !== 0 &&
      lastYawSign !== currentYawSign &&
      yawRate > cfg.minYawRateThreshold;

    if (!inCorner && isCornerCondition) {
      inCorner = true;
      cornerStartIdx = i;
      lastYawSign = currentYawSign;
    } else if (inCorner && (!isCornerCondition || directionReversed)) {
      const cornerEndIdx = i - 1;
      const cornerLength =
        points[cornerEndIdx].distance - points[cornerStartIdx].distance;
      const cornerDuration =
        points[cornerEndIdx].time - points[cornerStartIdx].time;

      if (
        cornerLength >= cfg.minCornerLength &&
        cornerDuration >= cfg.minCornerDuration
      ) {
        const apexIdx = findApex(
          smoothedCurvature,
          smoothedYawRate,
          cornerStartIdx,
          cornerEndIdx
        );
        const minSpeed = findMinSpeed(points, cornerStartIdx, cornerEndIdx);
        const direction = calculateCornerDirection(
          smoothedYawRate,
          points,
          cornerStartIdx,
          cornerEndIdx
        );

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
          avgGLat: smoothedYawRate[apexIdx] * 10,
          direction,
          type: classifyCornerType(points[apexIdx].speed),
          length: cornerLength,
          entryIndex: cornerStartIdx,
          apexIndex: apexIdx,
          exitIndex: cornerEndIdx,
        };

        corners.push(corner);
      }

      if (directionReversed && isCornerCondition) {
        inCorner = true;
        cornerStartIdx = i;
        lastYawSign = currentYawSign;
      } else {
        inCorner = false;
        lastYawSign = 0;
      }
    } else if (inCorner && currentYawSign !== 0) {
      lastYawSign = currentYawSign;
    }
  }

  const merged = mergeCloseCorners(corners, cfg.cornerMergeDistance);
  return splitMultiApexCorners(
    merged,
    points,
    smoothedCurvature,
    smoothedYawRate,
    cfg
  );
}

// Split long corners (155-240m) with multiple yaw rate peaks (>0.10 rad/s, 60m apart)
// Detects hairpins and chicanes that need separate analysis
function splitMultiApexCorners(
  corners: Corner[],
  points: NormalizedTelemetryPoint[],
  curvatures: number[],
  yawRates: number[],
  _cfg: YawCurvatureConfig
): Corner[] {
  const result: Corner[] = [];
  let cornerId = 0;

  for (const corner of corners) {
    if (corner.length < 155 || corner.length > 240) {
      result.push({ ...corner, id: ++cornerId });
      continue;
    }

    const cornerYawRates = yawRates.slice(
      corner.entryIndex,
      corner.exitIndex + 1
    );
    const yawPeaks: number[] = [];

    for (let i = 15; i < cornerYawRates.length - 15; i++) {
      const isLocalMax =
        cornerYawRates[i] > cornerYawRates[i - 1] &&
        cornerYawRates[i] > cornerYawRates[i + 1] &&
        cornerYawRates[i] > cornerYawRates[i - 5] &&
        cornerYawRates[i] > cornerYawRates[i + 5] &&
        cornerYawRates[i] > cornerYawRates[i - 10] &&
        cornerYawRates[i] > cornerYawRates[i + 10] &&
        cornerYawRates[i] > cornerYawRates[i - 15] &&
        cornerYawRates[i] > cornerYawRates[i + 15] &&
        cornerYawRates[i] > 0.1;
      if (isLocalMax) yawPeaks.push(i);
    }

    const significantPeaks: number[] = [];
    for (const peakIdx of yawPeaks) {
      const peakDistance = points[corner.entryIndex + peakIdx].distance;
      const isSignificant = significantPeaks.every((existingIdx) => {
        const existingDistance =
          points[corner.entryIndex + existingIdx].distance;
        return Math.abs(peakDistance - existingDistance) >= 60;
      });
      if (isSignificant) significantPeaks.push(peakIdx);
    }

    if (significantPeaks.length < 2) {
      result.push({ ...corner, id: ++cornerId });
      continue;
    }

    const [peak1, peak2] = significantPeaks.sort((a, b) => a - b);
    let splitIdx = peak1;
    let minYawRate = cornerYawRates[peak1];
    for (let i = peak1; i <= peak2; i++) {
      if (cornerYawRates[i] < minYawRate) {
        minYawRate = cornerYawRates[i];
        splitIdx = i;
      }
    }

    const globalSplitIdx = corner.entryIndex + splitIdx;

    // Find apex in first half
    let apex1Idx = corner.entryIndex;
    let minSpeed1 = points[corner.entryIndex].speed;
    for (let i = corner.entryIndex; i <= globalSplitIdx; i++) {
      if (points[i].speed < minSpeed1) {
        minSpeed1 = points[i].speed;
        apex1Idx = i;
      }
    }

    // Find apex in second half
    let apex2Idx = globalSplitIdx;
    let minSpeed2 = points[globalSplitIdx].speed;
    for (let i = globalSplitIdx; i <= corner.exitIndex; i++) {
      if (points[i].speed < minSpeed2) {
        minSpeed2 = points[i].speed;
        apex2Idx = i;
      }
    }

    // Create two corners
    const corner1: Corner = {
      id: ++cornerId,
      entryDistance: corner.entryDistance,
      apexDistance: points[apex1Idx].distance,
      exitDistance: points[globalSplitIdx].distance,
      entrySpeed: corner.entrySpeed,
      apexSpeed: points[apex1Idx].speed,
      exitSpeed: points[globalSplitIdx].speed,
      minSpeed: minSpeed1,
      maxGLat:
        Math.max(...curvatures.slice(corner.entryIndex, globalSplitIdx + 1)) *
        100,
      avgGLat:
        Math.max(...yawRates.slice(corner.entryIndex, globalSplitIdx + 1)) * 10,
      direction: calculateCornerDirection(
        yawRates,
        points,
        corner.entryIndex,
        globalSplitIdx
      ),
      type: classifyCornerType(points[apex1Idx].speed),
      length: points[globalSplitIdx].distance - corner.entryDistance,
      entryIndex: corner.entryIndex,
      apexIndex: apex1Idx,
      exitIndex: globalSplitIdx,
    };

    const corner2: Corner = {
      id: ++cornerId,
      entryDistance: points[globalSplitIdx].distance,
      apexDistance: points[apex2Idx].distance,
      exitDistance: corner.exitDistance,
      entrySpeed: points[globalSplitIdx].speed,
      apexSpeed: points[apex2Idx].speed,
      exitSpeed: corner.exitSpeed,
      minSpeed: minSpeed2,
      maxGLat:
        Math.max(...curvatures.slice(globalSplitIdx, corner.exitIndex + 1)) *
        100,
      avgGLat:
        Math.max(...yawRates.slice(globalSplitIdx, corner.exitIndex + 1)) * 10,
      direction: calculateCornerDirection(
        yawRates,
        points,
        globalSplitIdx,
        corner.exitIndex
      ),
      type: classifyCornerType(points[apex2Idx].speed),
      length: corner.exitDistance - points[globalSplitIdx].distance,
      entryIndex: globalSplitIdx,
      apexIndex: apex2Idx,
      exitIndex: corner.exitIndex,
    };

    result.push(corner1, corner2);
  }

  return result;
}

// Merge corners with gap < mergeDistance/2 (fixes fragmentation from signal drops)
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
        apexDistance:
          current.maxGLat > next.maxGLat
            ? current.apexDistance
            : next.apexDistance,
        apexSpeed:
          current.maxGLat > next.maxGLat ? current.apexSpeed : next.apexSpeed,
        apexIndex:
          current.maxGLat > next.maxGLat ? current.apexIndex : next.apexIndex,
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
