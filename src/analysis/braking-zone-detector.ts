/**
 * Braking Zone Detector - Detects braking zones using brake input + deceleration validation
 *
 * Combines brake pedal signal with actual deceleration to identify real braking zones.
 * Classifies intensity and detects trail braking (braking into corner entry).
 */

import { NormalizedTelemetryPoint } from '../types/f1-2024-packets';

export enum BrakingIntensity {
  LIGHT = 'light',          // <40% brake or <30 km/h loss
  MEDIUM = 'medium',        // 40-70% brake or 30-50 km/h loss
  HEAVY = 'heavy',          // 70-90% brake and 50-80 km/h loss
  EXTREME = 'extreme',      // >90% brake and >80 km/h loss OR >15 m/s² deceleration
}

export interface BrakingZone {
  id: number;
  entryDistance: number;       // Where braking begins
  peakDistance: number;        // Maximum brake pressure point
  exitDistance: number;        // Where braking ends
  entrySpeed: number;          // Speed at entry (km/h)
  minSpeed: number;            // Minimum speed in zone
  exitSpeed: number;           // Speed at exit (km/h)
  speedLoss: number;           // Total speed reduction (km/h)
  peakBrakePressure: number;   // Peak brake (0-1)
  avgBrakePressure: number;    // Average brake (0-1)
  peakDeceleration: number;    // Peak deceleration (m/s²)
  avgDeceleration: number;     // Average deceleration (m/s²)
  brakingDistance: number;     // Zone length (meters)
  brakingDuration: number;     // Duration (seconds)
  intensity: BrakingIntensity;
  isTrailBraking: boolean;     // Brake extends into corner
  entryIndex: number;
  peakIndex: number;
  exitIndex: number;
}

export interface BrakingZoneConfig {
  minBrakeThreshold: number;      // Min brake to detect (0-1, default: 0.15)
  minSpeedLoss: number;           // Min speed loss (km/h, default: 10)
  minBrakingDistance: number;     // Min distance (meters, default: 10)
  minBrakingDuration: number;     // Min duration (seconds, default: 0.2)
  brakeSmoothingWindow: number;   // Smoothing window (meters, default: 3)
  trailBrakingThreshold: number;  // Trail brake threshold (0-1, default: 0.3)
  ignoreDistanceStart: number;    // Ignore first N meters (default: 200)
}

const DEFAULT_BRAKING_CONFIG: BrakingZoneConfig = {
  minBrakeThreshold: 0.15,
  minSpeedLoss: 10,
  minBrakingDistance: 10,
  minBrakingDuration: 0.2,
  brakeSmoothingWindow: 3,
  trailBrakingThreshold: 0.3,
  ignoreDistanceStart: 200,
};

function smoothArray(data: number[], windowSize: number): number[] {
  const smoothed: number[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = Math.max(0, i - halfWindow); j <= Math.min(data.length - 1, i + halfWindow); j++) {
      sum += data[j];
      count++;
    }

    smoothed.push(sum / count);
  }

  return smoothed;
}

// Calculate deceleration from speed change
// Formula: (Δspeed / 3.6) / Δtime (negative = braking)
function calculateDeceleration(points: NormalizedTelemetryPoint[]): number[] {
  const decelerations: number[] = [];

  if (points.length < 2) return decelerations;

  decelerations.push(0);
  for (let i = 1; i < points.length; i++) {
    const deltaSpeed = points[i].speed - points[i - 1].speed;
    const deltaTime = points[i].time - points[i - 1].time;

    const deceleration = deltaTime > 0 ? (deltaSpeed / 3.6) / deltaTime : 0;
    decelerations.push(deceleration);
  }

  return decelerations;
}

function findPeakBraking(
  brakes: number[],
  decelerations: number[],
  startIdx: number,
  endIdx: number
): number {
  let maxScore = 0;
  let peakIdx = startIdx;

  for (let i = startIdx; i <= endIdx; i++) {
    const score = brakes[i] + Math.abs(decelerations[i]) * 0.1;
    if (score > maxScore) {
      maxScore = score;
      peakIdx = i;
    }
  }

  return peakIdx;
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

function calculateAverageBrake(points: NormalizedTelemetryPoint[], startIdx: number, endIdx: number): number {
  let sum = 0;
  let count = 0;
  for (let i = startIdx; i <= endIdx; i++) {
    sum += points[i].brake;
    count++;
  }
  return count > 0 ? sum / count : 0;
}

function calculateAverageDeceleration(decelerations: number[], startIdx: number, endIdx: number): number {
  let sum = 0;
  let count = 0;
  for (let i = startIdx; i <= endIdx; i++) {
    if (decelerations[i] < 0) {
      sum += Math.abs(decelerations[i]);
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

function classifyBrakingIntensity(
  peakBrake: number,
  speedLoss: number,
  avgDeceleration: number
): BrakingIntensity {
  if ((peakBrake > 0.9 && speedLoss > 80) || avgDeceleration > 15) {
    return BrakingIntensity.EXTREME;
  }
  if (peakBrake > 0.7 && speedLoss > 50) {
    return BrakingIntensity.HEAVY;
  }
  if (peakBrake > 0.4 || speedLoss > 30) {
    return BrakingIntensity.MEDIUM;
  }
  return BrakingIntensity.LIGHT;
}

// Dual-signal braking zone detection (brake pedal + deceleration validation)
// Zones detected when BOTH brake > threshold AND decel < -0.5 m/s²
// Classifies intensity, detects trail braking, ignores first 200m (standing start)
export function detectBrakingZones(
  points: NormalizedTelemetryPoint[],
  config: Partial<BrakingZoneConfig> = {}
): BrakingZone[] {
  const cfg = { ...DEFAULT_BRAKING_CONFIG, ...config };
  const zones: BrakingZone[] = [];

  if (points.length < 10) return zones;

  const brakes = points.map(p => p.brake);
  const smoothedBrakes = smoothArray(brakes, cfg.brakeSmoothingWindow);
  const decelerations = calculateDeceleration(points);

  let inBrakingZone = false;
  let zoneStartIdx = 0;
  let zoneId = 0;

  for (let i = 1; i < points.length; i++) {
    const brake = smoothedBrakes[i];
    const decel = decelerations[i];

    const isBraking = brake > cfg.minBrakeThreshold && decel < -0.5;

    if (!inBrakingZone && isBraking) {
      inBrakingZone = true;
      zoneStartIdx = i;
    } else if (inBrakingZone && !isBraking) {
      const zoneEndIdx = i - 1;

      const brakingDistance = points[zoneEndIdx].distance - points[zoneStartIdx].distance;
      const brakingDuration = points[zoneEndIdx].time - points[zoneStartIdx].time;
      const speedLoss = points[zoneStartIdx].speed - findMinSpeed(points, zoneStartIdx, zoneEndIdx);

      if (
        points[zoneStartIdx].distance >= cfg.ignoreDistanceStart &&
        brakingDistance >= cfg.minBrakingDistance &&
        brakingDuration >= cfg.minBrakingDuration &&
        speedLoss >= cfg.minSpeedLoss
      ) {
        const peakIdx = findPeakBraking(smoothedBrakes, decelerations, zoneStartIdx, zoneEndIdx);

        const minSpeed = findMinSpeed(points, zoneStartIdx, zoneEndIdx);
        const peakBrake = smoothedBrakes[peakIdx];
        const avgBrake = calculateAverageBrake(points, zoneStartIdx, zoneEndIdx);
        const avgDecel = calculateAverageDeceleration(decelerations, zoneStartIdx, zoneEndIdx);
        const peakDecel = Math.abs(Math.min(...decelerations.slice(zoneStartIdx, zoneEndIdx + 1)));

        const distanceAfterPeak = points[zoneEndIdx].distance - points[peakIdx].distance;
        const isTrailBraking = distanceAfterPeak > 15 && avgBrake > cfg.trailBrakingThreshold;

        const zone: BrakingZone = {
          id: ++zoneId,
          entryDistance: points[zoneStartIdx].distance,
          peakDistance: points[peakIdx].distance,
          exitDistance: points[zoneEndIdx].distance,
          entrySpeed: points[zoneStartIdx].speed,
          minSpeed,
          exitSpeed: points[zoneEndIdx].speed,
          speedLoss,
          peakBrakePressure: peakBrake,
          avgBrakePressure: avgBrake,
          peakDeceleration: peakDecel,
          avgDeceleration: avgDecel,
          brakingDistance,
          brakingDuration,
          intensity: classifyBrakingIntensity(peakBrake, speedLoss, avgDecel),
          isTrailBraking,
          entryIndex: zoneStartIdx,
          peakIndex: peakIdx,
          exitIndex: zoneEndIdx,
        };

        zones.push(zone);
      }

      inBrakingZone = false;
    }
  }

  return zones;
}

// Associate braking zones with corners (finds zone within 50m before corner entry)
export function associateBrakingZonesWithCorners(
  brakingZones: BrakingZone[],
  corners: any[]
): Map<number, BrakingZone> {
  const cornerToBraking = new Map<number, BrakingZone>();

  for (const corner of corners) {
    const matchingZone = brakingZones.find(zone => {
      const distanceToCorner = corner.entryDistance - zone.exitDistance;
      return distanceToCorner >= 0 && distanceToCorner <= 50;
    });

    if (matchingZone) {
      cornerToBraking.set(corner.id || corner.number, matchingZone);
    }
  }

  return cornerToBraking;
}

// Calculate aggregate statistics for all braking zones
export function getBrakingStatistics(zones: BrakingZone[]): {
  totalZones: number;
  avgBrakingDistance: number;
  avgSpeedLoss: number;
  avgPeakBrake: number;
  avgDeceleration: number;
  trailBrakingCount: number;
  intensityBreakdown: Record<BrakingIntensity, number>;
} {
  if (zones.length === 0) {
    return {
      totalZones: 0,
      avgBrakingDistance: 0,
      avgSpeedLoss: 0,
      avgPeakBrake: 0,
      avgDeceleration: 0,
      trailBrakingCount: 0,
      intensityBreakdown: {
        [BrakingIntensity.LIGHT]: 0,
        [BrakingIntensity.MEDIUM]: 0,
        [BrakingIntensity.HEAVY]: 0,
        [BrakingIntensity.EXTREME]: 0,
      },
    };
  }

  const intensityBreakdown: Record<BrakingIntensity, number> = {
    [BrakingIntensity.LIGHT]: 0,
    [BrakingIntensity.MEDIUM]: 0,
    [BrakingIntensity.HEAVY]: 0,
    [BrakingIntensity.EXTREME]: 0,
  };

  let totalDistance = 0;
  let totalSpeedLoss = 0;
  let totalPeakBrake = 0;
  let totalDecel = 0;
  let trailBrakingCount = 0;

  for (const zone of zones) {
    totalDistance += zone.brakingDistance;
    totalSpeedLoss += zone.speedLoss;
    totalPeakBrake += zone.peakBrakePressure;
    totalDecel += zone.avgDeceleration;
    if (zone.isTrailBraking) trailBrakingCount++;
    intensityBreakdown[zone.intensity]++;
  }

  return {
    totalZones: zones.length,
    avgBrakingDistance: totalDistance / zones.length,
    avgSpeedLoss: totalSpeedLoss / zones.length,
    avgPeakBrake: totalPeakBrake / zones.length,
    avgDeceleration: totalDecel / zones.length,
    trailBrakingCount,
    intensityBreakdown,
  };
}
