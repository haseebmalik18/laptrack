"use client";

interface SpeedComparisonViewProps {
  data: any;
}

export function SpeedComparisonView({ data }: SpeedComparisonViewProps) {
  if (!data?.comparison) return null;

  const { cornerComparison, accelerationZones, summary } = data.comparison;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-black border border-zinc-800 p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
            Total Delta
          </div>
          <div className={`text-2xl font-bold tabular-nums ${
            summary.totalTimeDelta > 0 ? 'text-red-400' : 'text-green-400'
          }`}>
            {summary.totalTimeDelta > 0 ? '+' : ''}{summary.totalTimeDelta.toFixed(3)}s
          </div>
        </div>

        <div className="bg-black border border-zinc-800 p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
            Avg Speed Delta
          </div>
          <div className={`text-2xl font-bold tabular-nums ${
            summary.avgSpeedDelta > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {summary.avgSpeedDelta > 0 ? '+' : ''}{summary.avgSpeedDelta.toFixed(1)} km/h
          </div>
        </div>

        <div className="bg-black border border-zinc-800 p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
            Corners Analyzed
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {cornerComparison?.length || 0}
          </div>
        </div>

        <div className="bg-black border border-zinc-800 p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
            Accel Zones
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {accelerationZones?.length || 0}
          </div>
        </div>
      </div>

      {/* Corner-by-Corner Comparison */}
      <div className="bg-black border border-zinc-800">
        <div className="border-b border-zinc-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Corner Speed Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left px-4 py-2 text-[10px] uppercase tracking-wider">Corner</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Entry Speed</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Apex Speed</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Exit Speed</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Min Speed</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Time Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {cornerComparison?.map((corner: any, idx: number) => (
                <tr key={idx} className="hover:bg-zinc-900/50">
                  <td className="px-4 py-3 text-white font-medium">
                    Turn {idx + 1}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="text-white">{Math.round(corner.lapA.entry)} km/h</div>
                    <div className={`text-xs ${corner.delta.entry > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {corner.delta.entry > 0 ? '+' : ''}{corner.delta.entry.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="text-white">{Math.round(corner.lapA.apex)} km/h</div>
                    <div className={`text-xs ${corner.delta.apex > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {corner.delta.apex > 0 ? '+' : ''}{corner.delta.apex.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="text-white">{Math.round(corner.lapA.exit)} km/h</div>
                    <div className={`text-xs ${corner.delta.exit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {corner.delta.exit > 0 ? '+' : ''}{corner.delta.exit.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="text-white">{Math.round(corner.lapA.min)} km/h</div>
                    <div className={`text-xs ${corner.delta.min > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {corner.delta.min > 0 ? '+' : ''}{corner.delta.min.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className={`font-bold ${corner.delta.time > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {corner.delta.time > 0 ? '+' : ''}{corner.delta.time.toFixed(3)}s
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acceleration Zones */}
      {accelerationZones && accelerationZones.length > 0 && (
        <div className="bg-black border border-zinc-800">
          <div className="border-b border-zinc-800 px-4 py-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Acceleration Zones
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900 text-zinc-400">
                <tr>
                  <th className="text-left px-4 py-2 text-[10px] uppercase tracking-wider">Zone</th>
                  <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Entry Speed</th>
                  <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Exit Speed</th>
                  <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Gain</th>
                  <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Time Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {accelerationZones.map((zone: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-900/50">
                    <td className="px-4 py-3 text-white font-medium">
                      Zone {idx + 1}
                    </td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">
                      {Math.round(zone.lapA.entrySpeed)} km/h
                    </td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">
                      {Math.round(zone.lapA.exitSpeed)} km/h
                    </td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">
                      +{Math.round(zone.lapA.speedGain)} km/h
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={`font-bold ${zone.delta.time > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {zone.delta.time > 0 ? '+' : ''}{zone.delta.time.toFixed(3)}s
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
