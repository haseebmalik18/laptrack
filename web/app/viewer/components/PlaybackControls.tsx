"use client";

import { useEffect, Dispatch, SetStateAction } from "react";

interface PlaybackControlsProps {
  lapsData: any[];
  currentLapIndex: number;
  setCurrentLapIndex: Dispatch<SetStateAction<number>>;
  playbackIndex: number;
  setPlaybackIndex: Dispatch<SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  playbackSpeed: number;
  setPlaybackSpeed: Dispatch<SetStateAction<number>>;
}

export function PlaybackControls({
  lapsData,
  currentLapIndex,
  setCurrentLapIndex,
  playbackIndex,
  setPlaybackIndex,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  setPlaybackSpeed,
}: PlaybackControlsProps) {
  const currentLap = lapsData[currentLapIndex];
  if (!currentLap || !currentLap.points) return null;

  const maxIndex = currentLap.points.length - 1;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPlaybackIndex(prev => {
        if (prev >= maxIndex) {
          setIsPlaying(false);
          return maxIndex;
        }
        return prev + Math.max(1, Math.floor(playbackSpeed));
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, maxIndex, setPlaybackIndex, setIsPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const reset = () => {
    setPlaybackIndex(0);
    setIsPlaying(false);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPlaybackIndex(Math.floor((value / 1000) * maxIndex));
  };

  const speeds = [0.25, 0.5, 1, 2, 5];

  const currentTime = currentLap.points[playbackIndex].time;
  const totalTime = currentLap.points[maxIndex].time;

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 min-w-[600px]">
      <div className="rounded-xl border border-zinc-700 bg-black/80 p-5 backdrop-blur-lg">
        <div className="mb-4 flex gap-2">
          {lapsData.map((lap, index) => (
            <button
              key={index}
              onClick={() => setCurrentLapIndex(index)}
              className={`rounded-lg border px-4 py-2 transition-all ${
                index === currentLapIndex
                  ? "border-blue-500 bg-blue-500/20 text-white"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              Lap {lap.number}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2 text-white transition-colors hover:bg-zinc-700"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>

          <button
            onClick={reset}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2 text-white transition-colors hover:bg-zinc-700"
          >
            ↺ Reset
          </button>

          <input
            type="range"
            min="0"
            max="1000"
            value={(playbackIndex / maxIndex) * 1000}
            onChange={handleProgressChange}
            className="flex-1 accent-blue-500"
          />

          <span className="min-w-[100px] text-sm text-zinc-400">
            {currentTime.toFixed(1)}s / {totalTime.toFixed(1)}s
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="w-16 text-sm text-zinc-400">Speed:</span>
          {speeds.map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                speed === playbackSpeed
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
