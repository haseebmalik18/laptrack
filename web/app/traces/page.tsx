"use client";

import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import dynamic from "next/dynamic";

const DataTraces = dynamic(() => import("./components/DataTraces").then(mod => ({ default: mod.DataTraces })), { ssr: false });
const MiniTrackMap = dynamic(() => import("./components/MiniTrackMap").then(mod => ({ default: mod.MiniTrackMap })), { ssr: false });

export default function TracesPage() {
  const [availableLaps, setAvailableLaps] = useState<any[]>([]);
  const [selectedLap, setSelectedLap] = useState<number | null>(null);
  const [referenceLap, setReferenceLap] = useState<number | null>(null);
  const [lapData, setLapData] = useState<any>(null);
  const [referenceLapData, setReferenceLapData] = useState<any>(null);
  const [corners, setCorners] = useState<any[]>([]);
  const [lapsLoading, setLapsLoading] = useState(true);
  const [lapDataLoading, setLapDataLoading] = useState(false);
  const [hoveredDistance, setHoveredDistance] = useState<number | null>(null);

  useEffect(() => {
    setLapsLoading(true);
    fetch("/api/laps")
      .then((res) => res.json())
      .then((data) => {
        setAvailableLaps(data.laps);
        if (data.laps.length > 0) {
          setSelectedLap(data.laps[0].lapNumber);

          // Auto-select fastest lap as reference (if we have multiple laps)
          if (data.laps.length >= 2) {
            const fastestLap = [...data.laps].sort((a, b) => {
              const parseTime = (timeStr: string) => {
                const [mins, secs] = timeStr.split(':');
                return parseFloat(mins) * 60 + parseFloat(secs);
              };
              return parseTime(a.lapTime) - parseTime(b.lapTime);
            })[0];

            if (fastestLap.lapNumber !== data.laps[0].lapNumber) {
              setReferenceLap(fastestLap.lapNumber);
            } else if (data.laps.length > 1) {
              setReferenceLap(data.laps[1].lapNumber);
            }
          }
        }
        setLapsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load laps:", err);
        setLapsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedLap === null) return;

    setLapDataLoading(true);
    fetch(`/api/laps/${selectedLap}`)
      .then((res) => res.json())
      .then((data) => {
        // Normalize time and distance to start from 0
        if (data.telemetry && data.telemetry.length > 0) {
          const startTime = data.telemetry[0].time;
          const startDistance = data.telemetry[0].distance;
          data.telemetry = data.telemetry.map((point: any) => ({
            ...point,
            time: point.time - startTime,
            distance: point.distance - startDistance
          }));
        }
        setLapData(data);
        setLapDataLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load lap:", err);
        setLapDataLoading(false);
      });
  }, [selectedLap]);

  useEffect(() => {
    if (referenceLap === null) {
      setReferenceLapData(null);
      return;
    }

    fetch(`/api/laps/${referenceLap}`)
      .then((res) => res.json())
      .then((data) => {
        // Normalize time and distance to start from 0
        if (data.telemetry && data.telemetry.length > 0) {
          const startTime = data.telemetry[0].time;
          const startDistance = data.telemetry[0].distance;
          data.telemetry = data.telemetry.map((point: any) => ({
            ...point,
            time: point.time - startTime,
            distance: point.distance - startDistance
          }));
        }
        setReferenceLapData(data);
      })
      .catch((err) => console.error("Failed to load reference lap:", err));
  }, [referenceLap]);

  useEffect(() => {
    if (!lapData?.metadata?.trackName) return;

    const trackName = lapData.metadata.trackName;
    const match = trackName.match(/\(([^)]+)\)/);
    const simpleName = match ? match[1].toLowerCase() : trackName.toLowerCase();

    fetch(`/api/corners/${simpleName}`)
      .then((res) => res.json())
      .then((data) => {
        setCorners(data.corners || []);
      })
      .catch((err) => console.error("Failed to load corners:", err));
  }, [lapData]);

  if (lapsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500"></div>
          </div>
          <div className="text-xl text-white font-semibold mb-2">Loading Laps</div>
          <div className="text-sm text-zinc-500">Scanning available lap data...</div>
        </div>
      </div>
    );
  }

  if (availableLaps.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-2 text-2xl text-white">No Laps Recorded</div>
          <div className="text-zinc-400">
            Start the UDP listener and drive some laps in F1 2024
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="border-b border-zinc-800 bg-black">
        <div className="mx-auto max-w-[1800px] px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Data Traces
              </h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-zinc-400">
                  {lapData?.metadata?.trackName || "Loading..."}
                </span>
                {lapData?.metadata?.carName && (
                  <>
                    <span className="text-zinc-700">•</span>
                    <span className="text-zinc-400">{lapData.metadata.carName}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                  Current Lap
                </label>
                <select
                  value={selectedLap || ""}
                  onChange={(e) => setSelectedLap(Number(e.target.value))}
                  className="bg-zinc-900 text-white border border-zinc-700 px-4 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none min-w-[180px]"
                >
                  {availableLaps.map((lap) => (
                    <option key={lap.lapNumber} value={lap.lapNumber}>
                      Lap {lap.lapNumber} - {lap.lapTime}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                  Reference
                </label>
                <select
                  value={referenceLap || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setReferenceLap(val ? Number(val) : null);
                  }}
                  className="bg-zinc-900 text-white border border-zinc-700 px-4 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none min-w-[180px]"
                >
                  <option value="">No Reference</option>
                  {availableLaps.filter(lap => lap.lapNumber !== selectedLap).map((lap) => (
                    <option key={lap.lapNumber} value={lap.lapNumber}>
                      Lap {lap.lapNumber} - {lap.lapTime}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-l border-zinc-800 pl-4 ml-2 self-end pb-2">
                <a
                  href="/lap-analysis"
                  className="inline-block px-4 py-2 bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider hover:bg-blue-600 transition-colors"
                >
                  ← Replay View
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-6 max-w-[1800px]">
        {lapDataLoading ? (
          <div className="flex items-center justify-center py-40">
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500"></div>
              </div>
              <div className="text-xl text-white font-semibold mb-2">Loading Telemetry</div>
              <div className="text-sm text-zinc-500">Fetching lap data and preparing graphs...</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            {/* Mini Track Map */}
            <div className="lg:sticky lg:top-6 h-fit">
              <MiniTrackMap
                lapData={lapData}
                referenceLapData={referenceLapData}
                corners={corners}
                hoveredDistance={hoveredDistance}
              />
            </div>

            {/* Data Traces */}
            <div>
              <DataTraces
                lapData={lapData}
                referenceLapData={referenceLapData}
                onHoverDistance={setHoveredDistance}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
