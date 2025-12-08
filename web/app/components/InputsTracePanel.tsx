"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { chartColors, chartMargins, axisConfig, tooltipConfig } from "../lib/chartConfig";

interface InputsTracePanelProps {
  currentLapData: any;
  referenceLapData: any;
  currentIndex: number;
}

export function InputsTracePanel({ currentLapData, referenceLapData, currentIndex }: InputsTracePanelProps) {
  const chartData = useMemo(() => {
    if (!currentLapData?.telemetry) return [];

    const current = currentLapData.telemetry;

    // Sample every 10 points for performance
    const sampledData = [];
    for (let i = 0; i < current.length; i += 10) {
      const point = current[i];

      sampledData.push({
        distance: Math.round(point.distance),
        throttle: Math.round(point.throttle * 100),
        brake: Math.round(point.brake * 100),
      });
    }

    return sampledData;
  }, [currentLapData]);

  const currentPoint = currentLapData?.telemetry?.[Math.floor(currentIndex)];

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
          Driver Inputs
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Throttle & Brake Application
        </p>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Throttle</div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData} margin={chartMargins.compact}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="distance" {...axisConfig} tick={{ fill: chartColors.tick, fontSize: 9 }} />
              <YAxis {...axisConfig} tick={{ fill: chartColors.tick, fontSize: 9 }} domain={[0, 100]} />
              <Tooltip {...tooltipConfig} labelStyle={{ color: '#a1a1aa', fontSize: 10 }} itemStyle={{ fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="throttle"
                stroke={chartColors.throttle}
                fill={chartColors.throttle}
                fillOpacity={0.3}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Brake</div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData} margin={chartMargins.compact}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis dataKey="distance" {...axisConfig} tick={{ fill: chartColors.tick, fontSize: 9 }} />
              <YAxis {...axisConfig} tick={{ fill: chartColors.tick, fontSize: 9 }} domain={[0, 100]} />
              <Tooltip {...tooltipConfig} labelStyle={{ color: '#a1a1aa', fontSize: 10 }} itemStyle={{ fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="brake"
                stroke={chartColors.brake}
                fill={chartColors.brake}
                fillOpacity={0.3}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Throttle</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold font-mono text-green-400">
                {Math.round((currentPoint?.throttle || 0) * 100)}
              </div>
              <span className="text-sm text-zinc-500">%</span>
              {/* Throttle bar */}
              <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-100"
                  style={{ width: `${(currentPoint?.throttle || 0) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-1">Brake</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold font-mono text-red-400">
                {Math.round((currentPoint?.brake || 0) * 100)}
              </div>
              <span className="text-sm text-zinc-500">%</span>
              {/* Brake bar */}
              <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-100"
                  style={{ width: `${(currentPoint?.brake || 0) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-1">Gear</div>
            <div className="text-2xl font-bold font-mono text-purple-400">
              {currentPoint?.gear || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
