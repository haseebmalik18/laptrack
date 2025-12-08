/**
 * Corner Types - Shared type definitions for corner detection
 */

export enum CornerDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum CornerType {
  HAIRPIN = 'hairpin',      // < 80 km/h
  SLOW = 'slow',            // 80-120 km/h
  MEDIUM = 'medium',        // 120-180 km/h
  FAST = 'fast',            // 180-250 km/h
  VERY_FAST = 'very_fast',  // > 250 km/h
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
