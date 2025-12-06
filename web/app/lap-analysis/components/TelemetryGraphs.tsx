"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface TelemetryGraphsProps {
  lapData: any;
  corners: any[];
  hoveredDistance: number | null;
  currentIndex: number;
  onHoverDistance: (distance: number | null) => void;
}

export function TelemetryGraphs({
  lapData,
  corners,
  hoveredDistance,
  currentIndex,
  onHoverDistance,
}: TelemetryGraphsProps) {
  if (!lapData?.telemetry) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <p className="text-zinc-400">No telemetry data available</p>
      </div>
    );
  }

  const telemetry = lapData.telemetry;

  const speedData = telemetry.map((p: any) => ({
    distance: Math.round(p.distance),
    speed: Math.round(p.speed),
  }));

  const inputsData = telemetry.map((p: any) => ({
    distance: Math.round(p.distance),
    throttle: p.throttle * 100,
    brake: p.brake * 100,
  }));

  const gforceData = telemetry.map((p: any) => ({
    distance: Math.round(p.distance),
    lateral: Math.abs(p.gLat || 0).toFixed(2),
    longitudinal: (p.gLong || 0).toFixed(2),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-lg">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleMouseMove = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      onHoverDistance(data.activePayload[0].payload.distance);
    }
  };

  const handleMouseLeave = () => {
    onHoverDistance(null);
  };

  const currentDistance = lapData.telemetry[Math.floor(currentIndex)]?.distance;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Speed Trace</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={speedData}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="distance"
              stroke="#888"
              label={{ value: "Distance (m)", position: "insideBottom", offset: -5, fill: "#888" }}
            />
            <YAxis
              stroke="#888"
              label={{ value: "Speed (km/h)", angle: -90, position: "insideLeft", fill: "#888" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {corners.map((corner: any, idx: number) => (
              <ReferenceLine
                key={idx}
                x={Math.round(corner.apexDistance)}
                stroke="#666"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            ))}
            {currentDistance && (
              <ReferenceLine
                x={Math.round(currentDistance)}
                stroke="#00ffff"
                strokeWidth={3}
                strokeDasharray="0"
              />
            )}
            {hoveredDistance && (
              <ReferenceLine
                x={hoveredDistance}
                stroke="#00ff88"
                strokeWidth={2}
              />
            )}
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#00ccff"
              strokeWidth={3}
              dot={false}
              name="Speed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Throttle & Brake Input</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={inputsData}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="distance"
              stroke="#888"
              label={{ value: "Distance (m)", position: "insideBottom", offset: -5, fill: "#888" }}
            />
            <YAxis
              stroke="#888"
              label={{ value: "Input (%)", angle: -90, position: "insideLeft", fill: "#888" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {currentDistance && (
              <ReferenceLine
                x={Math.round(currentDistance)}
                stroke="#00ffff"
                strokeWidth={3}
                strokeDasharray="0"
              />
            )}
            {hoveredDistance && (
              <ReferenceLine
                x={hoveredDistance}
                stroke="#00ff88"
                strokeWidth={2}
              />
            )}
            <Area
              type="monotone"
              dataKey="throttle"
              stackId="1"
              stroke="#00ff88"
              fill="#00ff88"
              fillOpacity={0.7}
              name="Throttle"
            />
            <Area
              type="monotone"
              dataKey="brake"
              stackId="2"
              stroke="#ff4444"
              fill="#ff4444"
              fillOpacity={0.7}
              name="Brake"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Lateral G-Force</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={gforceData}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="distance" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {currentDistance && (
                <ReferenceLine
                  x={Math.round(currentDistance)}
                  stroke="#00ffff"
                  strokeWidth={3}
                  strokeDasharray="0"
                />
              )}
              {hoveredDistance && (
                <ReferenceLine
                  x={hoveredDistance}
                  stroke="#00ff88"
                  strokeWidth={2}
                />
              )}
              <Line
                type="monotone"
                dataKey="lateral"
                stroke="#ff66ff"
                strokeWidth={3}
                dot={false}
                name="Lateral G"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Longitudinal G-Force</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={gforceData}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="distance" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {currentDistance && (
                <ReferenceLine
                  x={Math.round(currentDistance)}
                  stroke="#00ffff"
                  strokeWidth={3}
                  strokeDasharray="0"
                />
              )}
              {hoveredDistance && (
                <ReferenceLine
                  x={hoveredDistance}
                  stroke="#00ff88"
                  strokeWidth={2}
                />
              )}
              <Line
                type="monotone"
                dataKey="longitudinal"
                stroke="#ffaa00"
                strokeWidth={3}
                dot={false}
                name="Longitudinal G"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
