// Shared chart configuration for Recharts components
// Centralizes colors, margins, and styling for consistent charts across the app

export const chartColors = {
  current: "#facc15",    // yellow
  reference: "#22d3ee",  // cyan
  gLat: "#a855f7",       // purple
  gLong: "#f59e0b",      // amber
  throttle: "#22c55e",   // green
  brake: "#ef4444",      // red
  grid: "#27272a",       // zinc-800
  axis: "#3f3f46",       // zinc-700
  tick: "#71717a",       // zinc-500
  tooltip: "#18181b",    // zinc-950
};

export const chartMargins = {
  standard: { top: 5, right: 10, left: -20, bottom: 20 },
  compact: { top: 5, right: 10, left: -20, bottom: 5 },
};

export const axisConfig = {
  stroke: chartColors.axis,
  tick: { fill: chartColors.tick, fontSize: 10 },
  tickLine: false,
  axisLine: { stroke: chartColors.axis },
};

export const tooltipConfig = {
  contentStyle: {
    backgroundColor: chartColors.tooltip,
    border: `1px solid ${chartColors.axis}`,
    borderRadius: '4px'
  },
  labelStyle: { color: '#a1a1aa', fontSize: 11 },
  itemStyle: { fontSize: 11 },
};
