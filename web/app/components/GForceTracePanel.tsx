"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { chartColors, chartMargins, axisConfig, tooltipConfig } from "../lib/chartConfig";

interface GForceTracePanelProps {
  currentLapData: any;
  referenceLapData: any;
  currentIndex: number;
}

export function GForceTracePanel({ currentLapData, referenceLapData, currentIndex }: GForceTracePanelProps) {
  const chartData = useMemo(() => {
    if (!currentLapData?.telemetry) return [];

    const current = currentLapData.telemetry;

    // Sample every 10 points for performance
    const sampledData = [];
    for (let i = 0; i < current.length; i += 10) {
      const point = current[i];

      sampledData.push({
        distance: Math.round(point.distance),
        gLat: Number((point.gForceLateral || 0).toFixed(2)),
        gLong: Number((point.gForceLongitudinal || 0).toFixed(2)),
      });
    }

    return sampledData;
  }, [currentLapData]);

  const currentPoint = currentLapData?.telemetry?.[Math.floor(currentIndex)];
  const currentGLat = currentPoint?.gForceLateral || 0;
  const currentGLong = currentPoint?.gForceLongitudinal || 0;
  const combinedG = Math.sqrt(currentGLat * currentGLat + currentGLong * currentGLong);

  if (!currentLapData?.telemetry) {
    return (
      <div className="p-6 text-center text-zinc-500">
        No telemetry data available
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-zinc-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          G-Force
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Lateral & Longitudinal Forces
        </p>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Lateral G (Cornering)</div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={chartData} margin={chartMargins.compact}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="distance" {...axisConfig} tick={{ fill: chartColors.tick, fontSize: 9 }} />
              <YAxis {...axisConfig} tick={{ fill: chartColors.tick, fontSize: 9 }} />
              <Tooltip {...tooltipConfig} labelStyle={{ color: '#a1a1aa', fontSize: 10 }} itemStyle={{ fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="gLat"
                stroke={chartColors.gLat}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Longitudinal G (Braking/Accel)</div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={chartData} margin={chartMargins.compact}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="distance" {...axisConfig} tick={{ fill: chartColors.tick, fontSize: 9 }} />
              <YAxis {...axisConfig} tick={{ fill: chartColors.tick, fontSize: 9 }} />
              <Tooltip {...tooltipConfig} labelStyle={{ color: '#a1a1aa', fontSize: 10 }} itemStyle={{ fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="gLong"
                stroke={chartColors.gLong}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Lateral G</div>
            <div className="text-2xl font-bold font-mono text-purple-400">
              {currentGLat.toFixed(2)} <span className="text-sm text-zinc-500">G</span>
            </div>
            <div className="text-xs text-zinc-600 mt-1">
              {Math.abs(currentGLat) > 0.1 ? (currentGLat > 0 ? 'Right turn' : 'Left turn') : 'Straight'}
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-1">Longitudinal G</div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {currentGLong.toFixed(2)} <span className="text-sm text-zinc-500">G</span>
            </div>
            <div className="text-xs text-zinc-600 mt-1">
              {Math.abs(currentGLong) > 0.1 ? (currentGLong > 0 ? 'Accelerating' : 'Braking') : 'Coasting'}
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-1">Combined G</div>
            <div className="text-2xl font-bold font-mono text-blue-400">
              {combinedG.toFixed(2)} <span className="text-sm text-zinc-500">G</span>
            </div>
            <div className="text-xs text-zinc-600 mt-1">Total tire load</div>
          </div>
        </div>
      </div>
    </div>
  );
}
