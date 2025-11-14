export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function interpolateValue(
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number
): number {
  if (x1 === x0) return y0;
  const t = (x - x0) / (x1 - x0);
  return lerp(y0, y1, t);
}

export interface InterpolatePoint {
  [key: string]: number;
}

export function interpolatePoint<T extends InterpolatePoint>(
  distance: number,
  point0: T,
  point1: T,
  distanceKey: string = 'distance'
): T {
  const d0 = point0[distanceKey];
  const d1 = point1[distanceKey];

  const result: any = {};

  for (const key in point0) {
    if (typeof point0[key] === 'number') {
      result[key] = interpolateValue(distance, d0, d1, point0[key], point1[key]);
    } else {
      result[key] = point0[key];
    }
  }

  return result as T;
}
