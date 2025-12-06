"use client";

interface GForceComparisonViewProps {
  data: any;
}

export function GForceComparisonView({ data }: GForceComparisonViewProps) {
  if (!data?.comparison) return null;

  const { cornerComparison, insights, summary } = data.comparison;

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-orange-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black border border-zinc-800 p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
            Avg Lateral G (A)
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {summary.avgLateralGA.toFixed(2)}g
          </div>
        </div>

        <div className="bg-black border border-zinc-800 p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
            Avg Longitudinal G (A)
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {summary.avgLongitudinalGA.toFixed(2)}g
          </div>
        </div>

        <div className="bg-black border border-zinc-800 p-4">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
            Peak Combined G (A)
          </div>
          <div className="text-2xl font-bold text-white tabular-nums">
            {summary.peakCombinedGA.toFixed(2)}g
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="bg-black border border-zinc-800">
          <div className="border-b border-zinc-800 px-4 py-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Performance Insights
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {insights.map((insight: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3 bg-zinc-900/50 p-3 border border-zinc-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">Turn {insight.corner}</span>
                    <span className={`text-xs uppercase tracking-wider ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence} confidence
                    </span>
                  </div>
                  <div className="text-sm text-zinc-300">{insight.insight}</div>
                  <div className="text-xs text-cyan-400 mt-1">→ {insight.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Corner G-Force Comparison */}
      <div className="bg-black border border-zinc-800">
        <div className="border-b border-zinc-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Corner G-Force Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="text-left px-4 py-2 text-[10px] uppercase tracking-wider">Corner</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Peak Lateral G</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Peak Long G</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Peak Combined</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Avg Lateral G</th>
                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider">Consistency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {cornerComparison?.map((corner: any, idx: number) => (
                <tr key={idx} className="hover:bg-zinc-900/50">
                  <td className="px-4 py-3 text-white font-medium">
                    Turn {idx + 1}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="text-white">{corner.lapA.peakLateral.toFixed(2)}g</div>
                    <div className={`text-xs ${corner.delta.peakLateral > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {corner.delta.peakLateral > 0 ? '+' : ''}{corner.delta.peakLateral.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="text-white">{corner.lapA.peakLongitudinal.toFixed(2)}g</div>
                    <div className={`text-xs ${corner.delta.peakLongitudinal > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {corner.delta.peakLongitudinal > 0 ? '+' : ''}{corner.delta.peakLongitudinal.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="text-white">{corner.lapA.peakCombined.toFixed(2)}g</div>
                    <div className={`text-xs ${corner.delta.peakCombined > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {corner.delta.peakCombined > 0 ? '+' : ''}{corner.delta.peakCombined.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="text-white">{corner.lapA.avgLateral.toFixed(2)}g</div>
                    <div className={`text-xs ${corner.delta.avgLateral > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {corner.delta.avgLateral > 0 ? '+' : ''}{corner.delta.avgLateral.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-white tabular-nums">
                    {corner.lapA.consistency.toFixed(2)}
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
