"use client";

import { useEffect, useState } from "react";
import { TrackMapWithBoundaries } from "../components/TrackMapWithBoundaries";

export default function TrackViewerPage() {
  const [lapData, setLapData] = useState<any>(null);
  const [corners, setCorners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load lap 1 data
    Promise.all([
      fetch('/api/laps/1').then(res => res.json()),
      fetch('/api/corners/bahrain').then(res => res.json()).catch(() => [])
    ])
      .then(([lapDataRes, cornersRes]) => {
        setLapData(lapDataRes);
        setCorners(Array.isArray(cornersRes) ? cornersRes : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading track data...</div>
      </div>
    );
  }

  if (!lapData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">No lap data found. Record a lap first!</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Track Viewer
          </h1>
          <p className="text-zinc-400">
            2D track map with boundaries, racing line, and telemetry data
          </p>
        </div>

        {/* Track Map */}
        <TrackMapWithBoundaries
          lapData={lapData}
          corners={corners}
          currentIndex={currentIndex}
          trackName="sakhir-(bahrain)"
        />

        {/* Lap Info */}
        {lapData.metadata && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="text-zinc-500 text-sm mb-1">Track</div>
              <div className="text-white text-lg font-semibold">
                {lapData.metadata.trackName}
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="text-zinc-500 text-sm mb-1">Car</div>
              <div className="text-white text-lg font-semibold">
                {lapData.metadata.carName}
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="text-zinc-500 text-sm mb-1">Lap Time</div>
              <div className="text-white text-lg font-semibold">
                {(lapData.metadata.lapTimeMs / 1000).toFixed(3)}s
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="text-zinc-500 text-sm mb-1">Data Points</div>
              <div className="text-white text-lg font-semibold">
                {lapData.metadata.pointCount.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
