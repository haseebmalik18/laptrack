"use client";

interface TelemetryOverlayProps {
  telemetryPoint: any;
}

export function TelemetryOverlay({ telemetryPoint }: TelemetryOverlayProps) {
  if (!telemetryPoint) return null;

  const speed = telemetryPoint.speed || 0;
  const throttle = (telemetryPoint.throttle || 0) * 100;
  const brake = (telemetryPoint.brake || 0) * 100;
  const gear = telemetryPoint.gear || 0;
  const rpm = telemetryPoint.rpm || 0;
  const distance = telemetryPoint.distance || 0;
  const time = telemetryPoint.time || 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top Bar - Professional Data Display */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/95 to-transparent p-4">
        <div className="flex justify-between items-start max-w-full">
          {/* Left - Speed & Gear */}
          <div className="flex gap-4">
            <div className="bg-black border-l-4 border-blue-500 px-4 py-2">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Speed</div>
              <div className="text-4xl font-bold text-white tabular-nums leading-none">
                {Math.round(speed)}
              </div>
              <div className="text-[10px] text-zinc-500 uppercase mt-1">km/h</div>
            </div>

            <div className="bg-black border-l-4 border-cyan-500 px-4 py-2 min-w-[80px]">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Gear</div>
              <div className="text-4xl font-bold text-white tabular-nums leading-none text-center">
                {gear}
              </div>
            </div>
          </div>

          {/* Center - Time & Distance */}
          <div className="flex gap-4">
            <div className="bg-black border-t-2 border-zinc-700 px-4 py-2">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Lap Time</div>
              <div className="text-xl font-mono text-white tabular-nums">
                {formatTime(time)}
              </div>
            </div>

            <div className="bg-black border-t-2 border-zinc-700 px-4 py-2">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Distance</div>
              <div className="text-xl font-mono text-white tabular-nums">
                {Math.round(distance)}m
              </div>
            </div>
          </div>

          {/* Right - RPM */}
          <div className="bg-black border-l-4 border-orange-500 px-4 py-2 min-w-[120px]">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">RPM</div>
            <div className="text-2xl font-bold text-white tabular-nums">
              {Math.round(rpm).toLocaleString()}
            </div>
            <div className="h-1 bg-zinc-900 mt-2 w-full">
              <div
                className="h-full transition-all duration-100"
                style={{
                  width: `${Math.min((rpm / 15000) * 100, 100)}%`,
                  backgroundColor:
                    rpm > 12000 ? "#ef4444" : rpm > 10000 ? "#f97316" : "#22c55e",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Input Bars */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-4">
        <div className="flex justify-center gap-6">
          {/* Throttle */}
          <div className="bg-black border border-zinc-800 px-6 py-3 min-w-[180px]">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Throttle</div>
              <div className="text-sm font-mono text-white tabular-nums">{Math.round(throttle)}%</div>
            </div>
            <div className="h-2 bg-zinc-900 w-full">
              <div
                className="h-full bg-green-500 transition-all duration-100"
                style={{ width: `${throttle}%` }}
              />
            </div>
          </div>

          {/* Brake */}
          <div className="bg-black border border-zinc-800 px-6 py-3 min-w-[180px]">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Brake</div>
              <div className="text-sm font-mono text-white tabular-nums">{Math.round(brake)}%</div>
            </div>
            <div className="h-2 bg-zinc-900 w-full">
              <div
                className="h-full bg-red-500 transition-all duration-100"
                style={{ width: `${brake}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
