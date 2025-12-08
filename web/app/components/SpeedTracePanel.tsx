"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { chartColors, chartMargins, axisConfig, tooltipConfig } from "../lib/chartConfig";

interface SpeedTracePanelProps {
  currentLapData: any;
  referenceLapData: any;
  currentIndex: number;
}

export function SpeedTracePanel({ currentLapData, referenceLapData, currentIndex }: SpeedTracePanelProps) {
  const chartData = useMemo(() => {
    if (!currentLapData?.telemetry) return [];

    const current = currentLapData.telemetry;
    const reference = referenceLapData?.telemetry || [];

    // Sample every 10 points for performance
    const sampledData = [];
    for (let i = 0; i < current.length; i += 10) {
      const point = current[i];
      let refPoint = null;
      if (reference.length > 0) {
        refPoint = reference.find((p: any) => Math.abs(p.distance - point.distance) < 5);
      }

      sampledData.push({
        distance: Math.round(point.distance),
        currentSpeed: Math.round(point.speed),
        referenceSpeed: refPoint ? Math.round(refPoint.speed) : null,
      });
    }

    return sampledData;
  }, [currentLapData, referenceLapData]);

  const currentPoint = currentLapData?.telemetry?.[Math.floor(currentIndex)];
  const currentDistance = currentPoint?.distance || 0;

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
          Speed Trace
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          vs Lap {referenceLapData?.metadata?.lapNumber || '?'}
        </p>
      </div>

      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={chartMargins.standard}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="distance"
              {...axisConfig}
              label={{ value: 'Distance (m)', position: 'insideBottom', offset: -15, fill: chartColors.tick, fontSize: 10 }}
            />
            <YAxis
              {...axisConfig}
              label={{ value: 'km/h', angle: -90, position: 'insideLeft', fill: chartColors.tick, fontSize: 10 }}
            />
            <Tooltip {...tooltipConfig} />
            <Line
              type="monotone"
              dataKey="currentSpeed"
              stroke={chartColors.current}
              name="Current"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
            {referenceLapData && (
              <Line
                type="monotone"
                dataKey="referenceSpeed"
                stroke={chartColors.reference}
                name="Reference"
                dot={false}
                strokeWidth={1.5}
                opacity={0.7}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="text-xs text-zinc-500 mb-2">Current Speed</div>
          <div className="text-3xl font-bold font-mono text-yellow-400">
            {Math.round(currentPoint?.speed || 0)} <span className="text-lg text-zinc-500">km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
