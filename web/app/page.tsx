"use client";

import { Navbar } from "./components/Navbar";
import Link from "next/link";
import { useState, useEffect } from "react";

// Home page - landing page with stats and feature overview
export default function Home() {
  const [stats, setStats] = useState([
    { label: "Laps Recorded", value: "0", change: "" },
    { label: "Tracks Analyzed", value: "0", change: "" },
    { label: "Corner Databases", value: "0", change: "" },
    { label: "Total Data Points", value: "0", change: "" },
  ]);

  // Load stats from lap data
  useEffect(() => {
    fetch("/api/laps")
      .then((res) => res.json())
      .then((data) => {
        const laps = data.laps || [];
        const totalPoints = laps.reduce((sum: number, lap: any) => sum + (lap.pointCount || 0), 0);
        const tracks = new Set(laps.map((lap: any) => lap.trackName)).size;

        setStats([
          { label: "Laps Recorded", value: laps.length.toString(), change: "" },
          { label: "Tracks Analyzed", value: tracks.toString(), change: "" },
          { label: "Corner Databases", value: tracks.toString(), change: "" },
          { label: "Total Data Points", value: totalPoints.toLocaleString(), change: "" },
        ]);
      })
      .catch(() => {
        // Keep default values on error
      });
  }, []);

  const features = [
    {
      title: "Real-Time Telemetry",
      description: "Live UDP data capture from F1 2024 with millisecond-precision sampling and automatic lap detection"
    },
    {
      title: "Corner Analysis",
      description: "Advanced corner detection system analyzing entry, apex, and exit speeds with braking zone identification"
    },
    {
      title: "G-Force Tracking",
      description: "Lateral and longitudinal G-force analysis with friction circle visualization for grip optimization"
    },
    {
      title: "Lap Comparison",
      description: "Side-by-side performance comparison with delta analysis and data-driven improvement recommendations"
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-black to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950"></div>

        <div className="relative mx-auto max-w-[1800px] px-6 py-24">
          <div className="text-center">
            <div className="mb-4 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 border border-blue-500/20">
              <span className="text-sm text-blue-400">Professional Telemetry Platform</span>
            </div>

            <h1 className="mb-6 text-6xl font-bold text-white">
              Professional Telemetry,
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Competitive Edge
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
              Advanced telemetry analysis for F1 2024. Real-time data capture, corner-by-corner insights,
              and professional-grade visualizations to extract every tenth from your lap times.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                href="/lap-analysis"
                className="px-6 py-3 bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
              >
                Start Analyzing
              </Link>
              <Link
                href="/compare"
                className="px-6 py-3 bg-zinc-900 text-white font-semibold border border-zinc-700 hover:bg-zinc-800 transition-colors"
              >
                Compare Laps
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="border-b border-zinc-800 bg-black/50">
        <div className="mx-auto max-w-[1800px] px-6 py-12">
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-6">
                <div className="text-sm text-zinc-500 uppercase tracking-wider mb-2">
                  {stat.label}
                </div>
                <div className="text-3xl font-bold text-white tabular-nums">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-[1800px] px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Professional Features
          </h2>
          <p className="text-zinc-400">
            Everything you need for professional-grade lap analysis
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-black border border-zinc-800 p-6 hover:border-zinc-700 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-zinc-800 bg-black">
        <div className="mx-auto max-w-[1800px] px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to improve your lap times?
          </h2>
          <p className="text-zinc-400 mb-8">
            Start analyzing your telemetry data and find those crucial improvements
          </p>
          <Link
            href="/lap-analysis"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Launch Analysis Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
