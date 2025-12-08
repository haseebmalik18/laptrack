// Shared utilities for lap data handling

// Normalize telemetry to start from 0 (time and distance)
export function normalizeTelemetry(telemetry: any[]) {
  if (!telemetry || telemetry.length === 0) return telemetry;

  const startTime = telemetry[0].time;
  const startDistance = telemetry[0].distance;

  return telemetry.map((point: any) => ({
    ...point,
    time: point.time - startTime,
    distance: point.distance - startDistance
  }));
}

// Parse lap time string (format: "1:32.456") to seconds
export function parseTimeString(timeStr: string): number {
  const [mins, secs] = timeStr.split(':');
  return parseFloat(mins) * 60 + parseFloat(secs);
}

// Extract simple track name from full name (e.g., "Sakhir (Bahrain)" -> "bahrain")
export function extractTrackSimpleName(trackName: string): string {
  const match = trackName.match(/\(([^)]+)\)/);
  return match ? match[1].toLowerCase() : trackName.toLowerCase();
}

// Find fastest lap from array of laps
export function findFastestLap(laps: any[]): any | null {
  if (!laps || laps.length === 0) return null;

  return [...laps].sort((a, b) => {
    const timeA = parseTimeString(a.lapTime);
    const timeB = parseTimeString(b.lapTime);
    return timeA - timeB;
  })[0];
}

// Select appropriate reference lap (fastest lap different from selected)
export function selectReferenceLap(laps: any[], selectedLapNumber: number): number | null {
  if (!laps || laps.length < 2) return null;

  const fastest = findFastestLap(laps);

  if (fastest && fastest.lapNumber !== selectedLapNumber) {
    return fastest.lapNumber;
  }

  // If fastest is selected, return first non-selected lap
  const alternative = laps.find(lap => lap.lapNumber !== selectedLapNumber);
  return alternative ? alternative.lapNumber : null;
}
