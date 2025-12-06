"use client";

import { useEffect, useRef } from "react";

interface ReplayScrubberProps {
  lapData: any;
  currentIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onIndexChange: (index: number) => void;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
}

export function ReplayScrubber({
  lapData,
  currentIndex,
  isPlaying,
  playbackSpeed,
  onIndexChange,
  onPlayPause,
  onSpeedChange,
}: ReplayScrubberProps) {
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying || !lapData?.telemetry) return;

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds

      if (deltaTime >= 0.016) { // ~60fps
        onIndexChange((prev: number) => {
          if (prev >= lapData.telemetry.length - 1) {
            return 0;
          }

          // Calculate how many points to advance based on real time
          // Each telemetry point represents ~1 meter, car speed in km/h
          const currentPoint = lapData.telemetry[Math.floor(prev)];

          // Use actual speed but with a minimum of 60 km/h to prevent crawling in braking zones
          const speed = Math.max(currentPoint?.speed || 150, 60);
          const metersPerSecond = (speed * 1000) / 3600; // Convert km/h to m/s

          // Smooth interpolation between points for fluid animation
          const pointsToAdvance = metersPerSecond * deltaTime * playbackSpeed * 2.5; // 2.5x multiplier for smoother visual flow

          return Math.min(prev + pointsToAdvance, lapData.telemetry.length - 1);
        });
        lastTimeRef.current = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [isPlaying, playbackSpeed, lapData, onIndexChange]);

  if (!lapData?.telemetry) return null;

  const totalPoints = lapData.telemetry.length;
  const currentPoint = lapData.telemetry[Math.floor(currentIndex)];
  const progress = (currentIndex / totalPoints) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
  };

  return (
    <div className="border border-zinc-800 bg-black mx-auto" style={{ maxWidth: "1200px" }}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800">
        {/* Left - Playback Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={onPlayPause}
            className="flex h-9 w-9 items-center justify-center bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition-colors"
          >
            {isPlaying ? (
              <svg className="h-4 w-4" fill="white" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Playback</span>
            {[0.5, 1, 2, 4].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-3 py-1 text-xs font-mono transition-colors border ${
                  playbackSpeed === speed
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:bg-zinc-800"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Right - Current Position Info */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Time</div>
            <div className="text-sm font-mono text-white tabular-nums">
              {formatTime(currentPoint?.time || 0)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Distance</div>
            <div className="text-sm font-mono text-white tabular-nums">
              {Math.round(currentPoint?.distance || 0)}m
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Progress</div>
            <div className="text-sm font-mono text-white tabular-nums">
              {progress.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="px-6 py-4 bg-zinc-950">
        <div className="relative">
          <input
            type="range"
            min="0"
            max={totalPoints - 1}
            value={currentIndex}
            onChange={(e) => onIndexChange(Number(e.target.value))}
            className="w-full h-1 bg-zinc-800 appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:bg-blue-500
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-white
              [&::-moz-range-thumb]:w-3
              [&::-moz-range-thumb]:h-3
              [&::-moz-range-thumb]:bg-blue-500
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-white
              [&::-moz-range-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #27272a ${progress}%, #27272a 100%)`
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-zinc-600 font-mono">
          <span>0:00.000</span>
          <span>{formatTime(lapData.telemetry[totalPoints - 1]?.time || 0)}</span>
        </div>
      </div>
    </div>
  );
}
