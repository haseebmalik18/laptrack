interface LapSelectorProps {
  availableLaps: any[];
  selectedLapA: number | null;
  selectedLapB: number | null;
  onSelectLapA: (lapNumber: number) => void;
  onSelectLapB: (lapNumber: number | null) => void;
}

export function LapSelector({
  availableLaps,
  selectedLapA,
  selectedLapB,
  onSelectLapA,
  onSelectLapB,
}: LapSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-zinc-400">Lap A</label>
        <select
          value={selectedLapA || ""}
          onChange={(e) => onSelectLapA(Number(e.target.value))}
          className="rounded-lg bg-zinc-800 px-3 py-2 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
        >
          {availableLaps.map((lap) => (
            <option key={lap.lapNumber} value={lap.lapNumber}>
              Lap {lap.lapNumber} ({lap.lapTime})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-zinc-400">Lap B</label>
        <select
          value={selectedLapB || ""}
          onChange={(e) =>
            onSelectLapB(e.target.value ? Number(e.target.value) : null)
          }
          className="rounded-lg bg-zinc-800 px-3 py-2 text-white border border-zinc-700 focus:border-orange-500 focus:outline-none"
        >
          <option value="">None</option>
          {availableLaps.map((lap) => (
            <option key={lap.lapNumber} value={lap.lapNumber}>
              Lap {lap.lapNumber} ({lap.lapTime})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
