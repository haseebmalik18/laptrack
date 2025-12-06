"use client";

import { DeltaTimePanel } from "./DeltaTimePanel";

interface AnalysisSidePanelProps {
  currentLapData: any;
  referenceLapData: any;
  currentIndex: number;
  corners: any[];
}

export function AnalysisSidePanel({
  currentLapData,
  referenceLapData,
  currentIndex,
  corners
}: AnalysisSidePanelProps) {
  return (
    <div className="w-96 shrink-0">
      <div className="sticky top-6">
        <div className="bg-black border border-zinc-800 h-full flex flex-col">
          <DeltaTimePanel
            currentLapData={currentLapData}
            referenceLapData={referenceLapData}
            currentIndex={currentIndex}
            corners={corners}
          />
        </div>
      </div>
    </div>
  );
}
