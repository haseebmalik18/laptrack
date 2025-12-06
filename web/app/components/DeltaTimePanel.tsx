"use client";

import { useEffect, useState } from "react";

interface DeltaTimePanelProps {
  currentLapData: any;
  referenceLapData: any;
  currentIndex: number;
  corners: any[];
}

export function DeltaTimePanel({
  currentLapData,
  referenceLapData,
  currentIndex,
  corners
}: DeltaTimePanelProps) {
  const [currentDelta, setCurrentDelta] = useState(0);
  const [smoothedDelta, setSmoothedDelta] = useState(0);
  const [sectorData, setSectorData] = useState<any>(null);

  // Load sector data
  useEffect(() => {
    if (!currentLapData?.metadata || !referenceLapData?.metadata) return;

    const currentLapNum = currentLapData.metadata.lapNumber;
    const refLapNum = referenceLapData.metadata.lapNumber;

    fetch(`/api/sectors?current=${currentLapNum}&reference=${refLapNum}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setSectorData(data);
        }
      })
      .catch(err => console.error('Failed to load sector data:', err));
  }, [currentLapData, referenceLapData]);

  useEffect(() => {
    if (!currentLapData?.telemetry || !referenceLapData?.telemetry || currentIndex === undefined) {
      return;
    }

    const currentPoint = currentLapData.telemetry[Math.floor(currentIndex)];
    if (!currentPoint) return;

    // Find matching point in reference lap by distance
    const refPoint = referenceLapData.telemetry.find((p: any) =>
      Math.abs(p.distance - currentPoint.distance) < 1
    );

    if (refPoint) {
      // Delta = reference time - current time
      // Positive = ahead, Negative = behind
      const delta = refPoint.time - currentPoint.time;
      setCurrentDelta(delta);

      // Smooth the delta with exponential moving average
      setSmoothedDelta(prev => prev + (delta - prev) * 0.15);
    }
  }, [currentIndex, currentLapData, referenceLapData, corners]);

  if (!referenceLapData) {
    return (
      <div className="bg-black border border-zinc-800 p-4 h-full">
        <div className="text-center text-zinc-500 py-8">
          <div className="text-sm">Select a reference lap to view delta time</div>
        </div>
      </div>
    );
  }

  const deltaColor = smoothedDelta > 0 ? 'text-green-500' : smoothedDelta < 0 ? 'text-red-500' : 'text-zinc-400';
  const deltaSign = smoothedDelta > 0 ? '+' : '';

  const currentPoint = currentLapData?.telemetry?.[Math.floor(currentIndex)];

  return (
    <div className="bg-black border border-zinc-800 h-full flex flex-col">
      <div className="border-b border-zinc-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Delta Time
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          vs Lap {referenceLapData.metadata?.lapNumber || '?'}
        </p>
      </div>

      <div className="flex-1 p-4">
        {/* Current Delta */}
        <div className="mb-3">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Current Delta</div>
          <div className={`text-3xl font-bold font-mono ${deltaColor}`}>
            {deltaSign}{smoothedDelta.toFixed(3)}s
          </div>
          <div className="mt-1 text-[10px] text-zinc-500">
            {smoothedDelta > 0 ? 'Ahead of reference' : smoothedDelta < 0 ? 'Behind reference' : 'Even'}
          </div>
        </div>

        {/* Delta Bar */}
        <div className="mb-3">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Visual Delta</div>
          <div className="relative h-6 bg-zinc-900 border border-zinc-800">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-700"></div>

            {/* Delta bar */}
            <div
              className={`absolute top-0 bottom-0 transition-all duration-200 ${smoothedDelta > 0 ? 'bg-green-500/30 border-r-2 border-green-500' : 'bg-red-500/30 border-l-2 border-red-500'}`}
              style={{
                [smoothedDelta > 0 ? 'right' : 'left']: '50%',
                width: `${Math.min(Math.abs(smoothedDelta) * 100, 50)}%`
              }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>-0.5s</span>
            <span>0.0s</span>
            <span>+0.5s</span>
          </div>
        </div>

        {/* Sector Times */}
        {sectorData && (
          <div className="border border-zinc-800 p-3 bg-zinc-900/50 mb-3">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Sector Times</div>
            <div className="space-y-2">
              {sectorData.sectors.map((sector: any) => {
                const deltaColor = sector.delta > 0 ? 'text-red-400' : sector.delta < 0 ? 'text-green-400' : 'text-zinc-400';
                const deltaSign = sector.delta > 0 ? '+' : '';

                return (
                  <div key={sector.sector}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-400">S{sector.sector}</span>
                      <span className={`text-[10px] ${deltaColor}`}>{deltaSign}{sector.delta.toFixed(3)}s</span>
                    </div>
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-yellow-400">{sector.current.toFixed(2)}s</span>
                      <span className="text-cyan-400">{sector.reference.toFixed(2)}s</span>
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div className="pt-2 border-t border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 font-bold">Total</span>
                  <span className={`text-[10px] font-bold ${sectorData.total.delta > 0 ? 'text-red-400' : sectorData.total.delta < 0 ? 'text-green-400' : 'text-zinc-400'}`}>
                    {sectorData.total.delta > 0 ? '+' : ''}{sectorData.total.delta.toFixed(3)}s
                  </span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-yellow-400 font-bold">
                    {Math.floor(sectorData.total.current / 60)}:{(sectorData.total.current % 60).toFixed(3).padStart(6, '0')}
                  </span>
                  <span className="text-cyan-400 font-bold">
                    {Math.floor(sectorData.total.reference / 60)}:{(sectorData.total.reference % 60).toFixed(3).padStart(6, '0')}
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="pt-1 border-t border-zinc-800 flex justify-between text-[9px] text-zinc-600">
                <span className="text-yellow-400">■ Lap {sectorData.metadata.currentLap}</span>
                <span className="text-cyan-400">■ Lap {sectorData.metadata.referenceLap}</span>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Telemetry */}
        {currentPoint && (() => {
          // Find matching reference point
          const refPoint = referenceLapData.telemetry.find((p: any) =>
            Math.abs(p.distance - currentPoint.distance) < 1
          );

          if (!refPoint) return null;

          const speedDiff = currentPoint.speed - refPoint.speed;
          const throttleDiff = (currentPoint.throttle - refPoint.throttle) * 100;
          const brakeDiff = (currentPoint.brake - refPoint.brake) * 100;

          return (
            <div className="border border-zinc-800 p-3 bg-zinc-900/50 mb-3">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Telemetry Comparison</div>
              <div className="space-y-2 text-[10px]">
                {/* Speed */}
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-zinc-500">Speed (km/h)</span>
                    <span className={`font-mono ${speedDiff > 0 ? 'text-green-400' : speedDiff < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                      {speedDiff > 0 ? '+' : ''}{speedDiff.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-yellow-400">{Math.round(currentPoint.speed)}</span>
                    <span className="text-cyan-400">{Math.round(refPoint.speed)}</span>
                  </div>
                </div>

                {/* Throttle */}
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-zinc-500">Throttle</span>
                    <span className={`font-mono ${throttleDiff > 0 ? 'text-green-400' : throttleDiff < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                      {throttleDiff > 0 ? '+' : ''}{throttleDiff.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-yellow-400">{Math.round(currentPoint.throttle * 100)}%</span>
                    <span className="text-cyan-400">{Math.round(refPoint.throttle * 100)}%</span>
                  </div>
                </div>

                {/* Brake */}
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-zinc-500">Brake</span>
                    <span className={`font-mono ${brakeDiff < 0 ? 'text-green-400' : brakeDiff > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
                      {brakeDiff > 0 ? '+' : ''}{brakeDiff.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-yellow-400">{Math.round(currentPoint.brake * 100)}%</span>
                    <span className="text-cyan-400">{Math.round(refPoint.brake * 100)}%</span>
                  </div>
                </div>

                {/* Gear */}
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-zinc-500">Gear</span>
                    <span className={`font-mono ${currentPoint.gear > refPoint.gear ? 'text-green-400' : currentPoint.gear < refPoint.gear ? 'text-red-400' : 'text-zinc-400'}`}>
                      {currentPoint.gear === refPoint.gear ? 'Same' : currentPoint.gear > refPoint.gear ? 'Higher' : 'Lower'}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-yellow-400">{currentPoint.gear}</span>
                    <span className="text-cyan-400">{refPoint.gear}</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="pt-1 border-t border-zinc-800 flex justify-between text-[9px] text-zinc-600">
                  <span className="text-yellow-400">■ Lap {sectorData?.metadata?.currentLap || currentLapData.metadata?.lapNumber}</span>
                  <span className="text-cyan-400">■ Lap {sectorData?.metadata?.referenceLap || referenceLapData.metadata?.lapNumber}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Summary */}
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <div className="text-[10px] text-zinc-500 mb-1">Session Info</div>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Current</span>
              <span className="text-white font-mono">Lap {currentLapData.metadata?.lapNumber || '?'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Reference</span>
              <span className="text-white font-mono">Lap {referenceLapData.metadata?.lapNumber || '?'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Track</span>
              <span className="text-white text-[9px]">{currentLapData.metadata?.trackName || 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
