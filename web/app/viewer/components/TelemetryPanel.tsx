"use client";

interface TelemetryPanelProps {
  lapNumber: number;
  point: any;
}

export function TelemetryPanel({ lapNumber, point }: TelemetryPanelProps) {
  if (!point) return null;

  return (
    <div className="absolute right-5 top-5 min-w-[250px]">
      <div className="rounded-xl border border-zinc-700 bg-black/80 p-5 backdrop-blur-lg">
        <h3 className="mb-4 text-lg font-semibold text-blue-500">
          Lap {lapNumber}
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Speed</span>
            <span className="font-mono font-bold text-blue-500">
              {Math.round(point.speed)} km/h
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Distance</span>
            <span className="font-mono font-bold text-white">
              {Math.round(point.distance)} m
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Lateral G</span>
            <span className="font-mono font-bold text-orange-500">
              {point.gLat.toFixed(2)}G
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Longitudinal G</span>
            <span className="font-mono font-bold text-orange-500">
              {point.gLong.toFixed(2)}G
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Throttle</span>
            <span className="font-mono font-bold text-green-500">
              {Math.round(point.throttle * 100)}%
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Brake</span>
            <span className="font-mono font-bold text-red-500">
              {Math.round(point.brake * 100)}%
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Gear</span>
            <span className="font-mono font-bold text-white">
              {point.gear || "N"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
