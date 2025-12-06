"use client";

interface SectorComparisonViewProps {
  data: any;
}

export function SectorComparisonView({ data }: SectorComparisonViewProps) {
  if (!data?.comparison) return null;

  const { sectors, summary } = data.comparison;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black border border-zinc-800 p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
            Total Delta
          </div>
          <div className={`text-2xl font-bold tabular-nums ${
            summary.totalDelta > 0 ? 'text-red-400' : 'text-green-400'
          }`}>
            {summary.totalDelta > 0 ? '+' : ''}{summary.totalDelta.toFixed(3)}s
          </div>
        </div>

        <div className="bg-black border border-zinc-800 p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
            Best Sector
          </div>
          <div className="text-2xl font-bold text-green-400">
            S{summary.bestSector}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {summary.bestSectorDelta.toFixed(3)}s faster
          </div>
        </div>

        <div className="bg-black border border-zinc-800 p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
            Worst Sector
          </div>
          <div className="text-2xl font-bold text-red-400">
            S{summary.worstSector}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            +{summary.worstSectorDelta.toFixed(3)}s slower
          </div>
        </div>
      </div>

      {/* Sector Details */}
      <div className="bg-black border border-zinc-800">
        <div className="border-b border-zinc-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Sector Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left px-4 py-2 text-[10px] uppercase tracking-wider">Sector</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Time (A)</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Time (B)</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Delta</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Avg Speed</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Throttle</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Brake</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {sectors?.map((sector: any, idx: number) => (
                <tr key={idx} className="hover:bg-zinc-900/50">
                  <td className="px-4 py-3 text-white font-medium">
                    Sector {idx + 1}
                  </td>
                  <td className="px-4 py-3 text-right text-white tabular-nums">
                    {sector.lapA.time.toFixed(3)}s
                  </td>
                  <td className="px-4 py-3 text-right text-white tabular-nums">
                    {sector.lapB.time.toFixed(3)}s
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div>
                      <span className={`font-bold ${sector.delta.time > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {sector.delta.time > 0 ? '+' : ''}{sector.delta.time.toFixed(3)}s
                      </span>
                    </div>
                    <div className={`text-xs ${sector.delta.percentage > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {sector.delta.percentage > 0 ? '+' : ''}{sector.delta.percentage.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="text-white">{Math.round(sector.lapA.avgSpeed)} km/h</div>
                    <div className={`text-xs ${sector.delta.avgSpeed > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {sector.delta.avgSpeed > 0 ? '+' : ''}{sector.delta.avgSpeed.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-white tabular-nums">
                    {(sector.lapA.avgThrottle * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-right text-white tabular-nums">
                    {(sector.lapA.avgBrake * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
