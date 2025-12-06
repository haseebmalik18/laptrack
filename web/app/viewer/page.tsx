"use client";

import { useState, useRef } from "react";
import { TrackViewer } from "./components/TrackViewer";
import { PlaybackControls } from "./components/PlaybackControls";
import { TelemetryPanel } from "./components/TelemetryPanel";
import { LapUploader } from "./components/LapUploader";

export default function ViewerPage() {
  const [lapsData, setLapsData] = useState<any[]>([]);
  const [currentLapIndex, setCurrentLapIndex] = useState(0);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const smoothPlaybackRef = useRef(0);

  const handleLapsLoaded = (data: any[]) => {
    setLapsData(data);
    setPlaybackIndex(0);
    setCurrentLapIndex(0);
  };

  const currentLap = lapsData[currentLapIndex];
  const currentPoint = currentLap?.points?.[playbackIndex];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {lapsData.length === 0 ? (
        <LapUploader onLapsLoaded={handleLapsLoaded} />
      ) : (
        <>
          <TrackViewer
            lapsData={lapsData}
            currentLapIndex={currentLapIndex}
            playbackIndex={playbackIndex}
            smoothPlaybackRef={smoothPlaybackRef}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
          />

          {currentLap && (
            <TelemetryPanel
              lapNumber={currentLap.number}
              point={currentPoint}
            />
          )}

          <PlaybackControls
            lapsData={lapsData}
            currentLapIndex={currentLapIndex}
            setCurrentLapIndex={setCurrentLapIndex}
            playbackIndex={playbackIndex}
            setPlaybackIndex={setPlaybackIndex}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
          />
        </>
      )}
    </div>
  );
}
