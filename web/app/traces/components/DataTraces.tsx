"use client";

import { useMemo, useRef, useCallback } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DataTracesProps {
  lapData: any;
  referenceLapData: any;
  onHoverDistance?: (distance: number | null) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-700 px-3 py-2 shadow-lg">
      <div className="text-xs text-zinc-400 mb-1">{label}m</div>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="text-xs font-mono" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  );
};

export function DataTraces({ lapData, referenceLapData, onHoverDistance }: DataTracesProps) {
  // Prepare data for charts (sample every 2 points for smoother hover)
  const chartData = useMemo(() => {
    if (!lapData?.telemetry) return [];

    const current = lapData.telemetry;
    const reference = referenceLapData?.telemetry || [];

    // Sample every 2 points for much smoother hover tracking
    const sampledData = [];
    for (let i = 0; i < current.length; i += 2) {
      const point = current[i];

      // Find matching reference point
      let refPoint = null;
      if (reference.length > 0) {
        refPoint = reference.find((p: any) => Math.abs(p.distance - point.distance) < 3);
      }

      sampledData.push({
        distance: Math.round(point.distance),

        // Speed
        currentSpeed: Math.round(point.speed),
        referenceSpeed: refPoint ? Math.round(refPoint.speed) : null,

        // Throttle (0-100)
        currentThrottle: Math.round(point.throttle * 100),
        referenceThrottle: refPoint ? Math.round(refPoint.throttle * 100) : null,

        // Brake (0-100)
        currentBrake: Math.round(point.brake * 100),
        referenceBrake: refPoint ? Math.round(refPoint.brake * 100) : null,

        // Gear
        currentGear: point.gear,
        referenceGear: refPoint ? refPoint.gear : null,
      });
    }

    return sampledData;
  }, [lapData, referenceLapData]);

  const currentLapNum = lapData?.metadata?.lapNumber || "?";
  const referenceLapNum = referenceLapData?.metadata?.lapNumber || "?";

  // Use requestAnimationFrame for smooth 60fps updates
  const rafRef = useRef<number>();
  const pendingDistance = useRef<number | null>(null);

  // Handle mouse move on charts (smooth with RAF)
  const handleMouseMove = useCallback((state: any) => {
    if (!onHoverDistance || state?.activeLabel === undefined) return;

    pendingDistance.current = Number(state.activeLabel);

    // Cancel pending frame and schedule new one
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (pendingDistance.current !== null) {
        onHoverDistance(pendingDistance.current);
      }
    });
  }, [onHoverDistance]);

  const handleMouseLeave = useCallback(() => {
    if (onHoverDistance) {
      onHoverDistance(null);
    }
  }, [onHoverDistance]);

  if (!lapData?.telemetry) {
    return (
      <div className="text-center text-zinc-500 py-20">
        No telemetry data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Speed Trace */}
      <div className="bg-black border border-zinc-800">
        <div className="border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Speed
          </h3>
          <div className="flex items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-yellow-400"></div>
              <span className="text-zinc-400">Lap {currentLapNum}</span>
            </div>
            {referenceLapData && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-cyan-400"></div>
                <span className="text-zinc-400">Lap {referenceLapNum}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="distance"
                stroke="#52525b"
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
              />
              <YAxis
                stroke="#52525b"
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
                label={{ value: 'km/h', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="currentSpeed"
                stroke="#facc15"
                name={`Lap ${currentLapNum}`}
                dot={false}
                strokeWidth={2.5}
                isAnimationActive={false}
              />
              {referenceLapData && (
                <Line
                  type="monotone"
                  dataKey="referenceSpeed"
                  stroke="#22d3ee"
                  name={`Lap ${referenceLapNum}`}
                  dot={false}
                  strokeWidth={2}
                  opacity={0.7}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Throttle Trace */}
      <div className="bg-black border border-zinc-800">
        <div className="border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Throttle
          </h3>
          <div className="flex items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-green-400"></div>
              <span className="text-zinc-400">Lap {currentLapNum}</span>
            </div>
            {referenceLapData && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-green-600"></div>
                <span className="text-zinc-400">Lap {referenceLapNum}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="distance"
                stroke="#52525b"
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
              />
              <YAxis
                stroke="#52525b"
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
                domain={[0, 100]}
                label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              {referenceLapData && (
                <Area
                  type="monotone"
                  dataKey="referenceThrottle"
                  stroke="#16a34a"
                  fill="#16a34a"
                  fillOpacity={0.15}
                  name={`Lap ${referenceLapNum}`}
                  isAnimationActive={false}
                />
              )}
              <Area
                type="monotone"
                dataKey="currentThrottle"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.25}
                name={`Lap ${currentLapNum}`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Brake Trace */}
      <div className="bg-black border border-zinc-800">
        <div className="border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Brake
          </h3>
          <div className="flex items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-400"></div>
              <span className="text-zinc-400">Lap {currentLapNum}</span>
            </div>
            {referenceLapData && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-orange-500"></div>
                <span className="text-zinc-400">Lap {referenceLapNum}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="distance"
                stroke="#52525b"
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
              />
              <YAxis
                stroke="#52525b"
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
                domain={[0, 100]}
                label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              {referenceLapData && (
                <Area
                  type="monotone"
                  dataKey="referenceBrake"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.15}
                  name={`Lap ${referenceLapNum}`}
                  isAnimationActive={false}
                />
              )}
              <Area
                type="monotone"
                dataKey="currentBrake"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.25}
                name={`Lap ${currentLapNum}`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gear Trace */}
      <div className="bg-black border border-zinc-800">
        <div className="border-b border-zinc-800 px-4 py-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Gear
          </h3>
          <div className="flex items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-purple-400"></div>
              <span className="text-zinc-400">Lap {currentLapNum}</span>
            </div>
            {referenceLapData && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-purple-600"></div>
                <span className="text-zinc-400">Lap {referenceLapNum}</span>
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="distance"
                stroke="#52525b"
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
                label={{ value: 'Distance (m)', position: 'insideBottom', offset: -5, fill: '#71717a', fontSize: 11 }}
              />
              <YAxis
                stroke="#52525b"
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#3f3f46' }}
                domain={[1, 8]}
                ticks={[1, 2, 3, 4, 5, 6, 7, 8]}
              />
              <Tooltip content={<CustomTooltip />} />
              {referenceLapData && (
                <Line
                  type="stepAfter"
                  dataKey="referenceGear"
                  stroke="#9333ea"
                  name={`Lap ${referenceLapNum}`}
                  dot={false}
                  strokeWidth={2}
                  opacity={0.7}
                  isAnimationActive={false}
                />
              )}
              <Line
                type="stepAfter"
                dataKey="currentGear"
                stroke="#c084fc"
                name={`Lap ${currentLapNum}`}
                dot={false}
                strokeWidth={2.5}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
