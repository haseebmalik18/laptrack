"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LapUploaderProps {
  onLapsLoaded: (data: any[]) => void;
}

export function LapUploader({ onLapsLoaded }: LapUploaderProps) {
  const [availableLaps, setAvailableLaps] = useState<any[]>([]);
  const [selectedLaps, setSelectedLaps] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingLaps, setLoadingLaps] = useState(false);

  useEffect(() => {
    fetchAvailableLaps();
  }, []);

  const fetchAvailableLaps = async () => {
    try {
      const res = await fetch("/api/laps");
      const data = await res.json();
      setAvailableLaps(data.laps);
    } catch (error) {
      console.error("Failed to fetch laps:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLapSelection = (lapNumber: number) => {
    const newSelection = new Set(selectedLaps);
    if (newSelection.has(lapNumber)) {
      newSelection.delete(lapNumber);
    } else {
      newSelection.add(lapNumber);
    }
    setSelectedLaps(newSelection);
  };

  const loadSelectedLaps = async () => {
    if (selectedLaps.size === 0) return;

    setLoadingLaps(true);
    const lapsData: any[] = [];

    for (const lapNumber of Array.from(selectedLaps)) {
      try {
        const res = await fetch(`/api/laps/${lapNumber}`);
        const data = await res.json();
        lapsData.push({
          number: lapNumber,
          points: data.points,
        });
      } catch (error) {
        console.error(`Failed to load lap ${lapNumber}:`, error);
      }
    }

    lapsData.sort((a, b) => a.number - b.number);
    onLapsLoaded(lapsData);
    setLoadingLaps(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <div className="text-white">Loading laps...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <div className="w-full max-w-3xl p-8">
        <Link
          href="/"
          className="mb-8 inline-block text-zinc-400 transition-colors hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            3D Track Viewer
          </h1>
          <p className="text-zinc-400">
            Select laps to visualize in 3D
          </p>
        </div>

        {availableLaps.length === 0 ? (
          <div className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-16 text-center">
            <h3 className="mb-2 text-xl font-semibold text-white">No laps found</h3>
            <p className="text-zinc-400">
              Record some laps using the UDP listener first
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Available Laps ({availableLaps.length})
              </h3>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {availableLaps.map((lap) => (
                  <button
                    key={lap.lapNumber}
                    onClick={() => toggleLapSelection(lap.lapNumber)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      selectedLaps.has(lap.lapNumber)
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <div className="mb-1 text-lg font-semibold text-white">
                      Lap {lap.lapNumber}
                    </div>
                    {lap.trackName && (
                      <div className="text-sm text-zinc-400">{lap.trackName}</div>
                    )}
                    {lap.carName && (
                      <div className="text-xs text-zinc-500">{lap.carName}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={loadSelectedLaps}
              disabled={selectedLaps.size === 0 || loadingLaps}
              className="w-full rounded-lg bg-blue-500 px-6 py-4 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingLaps
                ? "Loading..."
                : `Load ${selectedLaps.size} Lap${selectedLaps.size !== 1 ? "s" : ""}`}
            </button>
          </>
        )}

        <div className="mt-8 rounded-xl border border-zinc-700 bg-zinc-800/30 p-6">
          <h4 className="mb-3 font-semibold text-white">Quick Tips</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>• Select one or more laps to visualize</li>
            <li>• Use playback controls to replay laps</li>
            <li>• Compare multiple laps side-by-side</li>
            <li>• View real-time telemetry data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
