"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "../components/Navbar";

// Lazy load comparison components for better performance
const SpeedComparisonView = dynamic(() => import("./components/SpeedComparisonView").then(mod => ({ default: mod.SpeedComparisonView })), { ssr: false });
const SectorComparisonView = dynamic(() => import("./components/SectorComparisonView").then(mod => ({ default: mod.SectorComparisonView })), { ssr: false });
const GForceComparisonView = dynamic(() => import("./components/GForceComparisonView").then(mod => ({ default: mod.GForceComparisonView })), { ssr: false });

// Compare page - side-by-side lap comparison with speed, sector, and g-force analysis
export default function ComparePage() {
  const [availableLaps, setAvailableLaps] = useState<any[]>([]);
  const [lapA, setLapA] = useState<number | null>(null);
  const [lapB, setLapB] = useState<number | null>(null);
  const [analysisType, setAnalysisType] = useState<'speed' | 'sector' | 'gforce'>('speed');
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load available laps and auto-select first two
  useEffect(() => {
    fetch("/api/laps")
      .then((res) => res.json())
      .then((data) => {
        setAvailableLaps(data.laps);
        if (data.laps.length >= 2) {
          setLapA(data.laps[0].lapNumber);
          setLapB(data.laps[1].lapNumber);
        }
      })
      .catch((err) => console.error("Failed to load laps:", err));
  }, []);

  // Fetch comparison data when laps or analysis type changes
  useEffect(() => {
    if (lapA === null || lapB === null) return;

    setLoading(true);
    fetch(`/api/analysis/compare?lapA=${lapA}&lapB=${lapB}&type=${analysisType}`)
      .then((res) => res.json())
      .then((data) => {
        setComparisonData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load comparison:", err);
        setLoading(false);
      });
  }, [lapA, lapB, analysisType]);

  if (availableLaps.length < 2) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-2 text-2xl text-white">Not Enough Laps</div>
          <div className="text-zinc-400">
            Record at least 2 laps to compare performance
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Header */}
      <div className="border-b border-zinc-800 bg-black">
        <div className="mx-auto max-w-[1800px] px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Lap Comparison</h1>
              <p className="text-sm text-zinc-400">
                Analyze performance differences between laps
              </p>
            </div>

            {/* Lap Selectors */}
            <div className="flex items-center gap-4">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                  Lap A
                </label>
                <select
                  value={lapA || ""}
                  onChange={(e) => setLapA(Number(e.target.value))}
                  className="bg-zinc-900 text-white border border-zinc-700 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
                >
                  {availableLaps.map((lap) => (
                    <option key={lap.lapNumber} value={lap.lapNumber}>
                      Lap {lap.lapNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-zinc-600 mt-5">VS</div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                  Lap B
                </label>
                <select
                  value={lapB || ""}
                  onChange={(e) => setLapB(Number(e.target.value))}
                  className="bg-zinc-900 text-white border border-zinc-700 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
                >
                  {availableLaps.map((lap) => (
                    <option key={lap.lapNumber} value={lap.lapNumber}>
                      Lap {lap.lapNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Analysis Type Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setAnalysisType('speed')}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors border-b-2 ${
                analysisType === 'speed'
                  ? 'text-white border-blue-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              Speed Analysis
            </button>
            <button
              onClick={() => setAnalysisType('sector')}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors border-b-2 ${
                analysisType === 'sector'
                  ? 'text-white border-blue-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              Sector Analysis
            </button>
            <button
              onClick={() => setAnalysisType('gforce')}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors border-b-2 ${
                analysisType === 'gforce'
                  ? 'text-white border-blue-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              G-Force Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1800px] px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-zinc-400">Analyzing...</div>
          </div>
        ) : comparisonData ? (
          <>
            {analysisType === 'speed' && <SpeedComparisonView data={comparisonData} />}
            {analysisType === 'sector' && <SectorComparisonView data={comparisonData} />}
            {analysisType === 'gforce' && <GForceComparisonView data={comparisonData} />}
          </>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-zinc-500">Select laps to compare</div>
          </div>
        )}
      </div>
    </div>
  );
}
