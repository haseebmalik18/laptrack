"use client";

import { useEffect, useState } from "react";

interface ImprovementInsightsPanelProps {
  currentLapNumber: number;
  referenceLapNumber?: number;
  currentIndex?: number;
  lapData?: any;
}

interface Insight {
  corner: number;
  distance: number; // Apex distance
  brakingDistance: number; // Braking zone entry distance
  type: string;
  title: string;
  description: string;
  potentialGain: string;
  confidence: 'high' | 'medium' | 'low';
}

export function ImprovementInsightsPanel({
  currentLapNumber,
  referenceLapNumber,
  currentIndex = 0,
  lapData
}: ImprovementInsightsPanelProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState<Insight | null>(null);

  useEffect(() => {
    if (!referenceLapNumber) return;

    setLoading(true);

    // Fetch real insights from API
    fetch(`/api/insights?current=${currentLapNumber}&reference=${referenceLapNumber}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('Failed to load insights:', data.error);
          setInsights([]);
        } else {
          setInsights(data.insights || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch insights:', err);
        setInsights([]);
        setLoading(false);
      });
  }, [currentLapNumber, referenceLapNumber]);

  // Determine which insight to show based on current position
  useEffect(() => {
    if (!lapData?.telemetry || !insights.length || currentIndex === undefined) {
      setActiveInsight(null);
      return;
    }

    const currentPoint = lapData.telemetry[Math.floor(currentIndex)];
    if (!currentPoint) {
      setActiveInsight(null);
      return;
    }

    // Check if we're at the braking zone entry for any insight
    // Show tip when within 30m of the braking point (where the mistake happens)
    let nearbyInsight: Insight | null = null;
    for (const insight of insights) {
      const distToCorner = currentPoint.distance - insight.brakingDistance;
      // Show when approaching and at the braking zone (-10m to +30m window)
      if (distToCorner >= -10 && distToCorner <= 30) {
        nearbyInsight = insight;
        break;
      }
    }

    setActiveInsight(nearbyInsight);
  }, [currentIndex, lapData, insights]);

  if (!referenceLapNumber) {
    return (
      <div className="bg-black border border-zinc-800 p-4 h-full">
        <div className="text-center text-zinc-500 py-8">
          <div className="text-sm">Select a reference lap to view performance analysis and improvement recommendations</div>
        </div>
      </div>
    );
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-500/20 text-green-400 border-green-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'low': return 'bg-orange-500/20 text-orange-400 border-orange-500';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'braking': return 'bg-red-500/10 border-red-500/30';
      case 'apex': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'exit': return 'bg-blue-500/10 border-blue-500/30';
      case 'gforce': return 'bg-purple-500/10 border-purple-500/30';
      default: return 'bg-zinc-500/10 border-zinc-500/30';
    }
  };

  return (
    <div className="bg-black border border-zinc-800 h-full flex flex-col">
      <div className="border-b border-zinc-800 px-4 py-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Improvement Tips
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Based on comparison with Lap {referenceLapNumber}
        </p>
        <div className="mt-2 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-[10px] text-yellow-400">
          WIP: Feature in development
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center text-zinc-500 py-8">
            <div className="text-sm">Analyzing...</div>
          </div>
        ) : !activeInsight ? (
          <div className="text-center text-zinc-500 py-8">
            <div className="mb-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                <span className="text-3xl">!</span>
              </div>
            </div>
            <div className="text-sm font-medium text-white mb-1">No Active Tips</div>
            <div className="text-xs">Tips will appear as you reach improvement zones on track</div>
          </div>
        ) : (
          <div className={`border p-4 ${getTypeColor(activeInsight.type)} animate-pulse-slow`}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 font-bold text-lg">Turn {activeInsight.corner}</span>
                  <span className={`text-[10px] px-2 py-0.5 border uppercase tracking-wider ${getConfidenceColor(activeInsight.confidence)}`}>
                    {activeInsight.confidence}
                  </span>
                </div>
                <div className="text-sm font-semibold text-white mb-2">{activeInsight.title}</div>
                <div className="text-xs text-zinc-300 leading-relaxed">{activeInsight.description}</div>
                <div className="text-[10px] text-zinc-500 mt-3">
                  Estimated gain: <span className="text-green-400 font-mono font-bold">{activeInsight.potentialGain}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
