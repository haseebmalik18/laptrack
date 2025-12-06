"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";

interface MiniTrackMapProps {
  lapData: any;
  referenceLapData: any;
  corners: any[];
  hoveredDistance?: number | null;
}

export function MiniTrackMap({ lapData, referenceLapData, corners, hoveredDistance }: MiniTrackMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const fullTelemetryRef = useRef<any[]>([]);
  const lastDrawnDistance = useRef<number | null>(null);

  const { normalizedPoints, bounds } = useMemo(() => {
    if (!lapData?.telemetry) return { normalizedPoints: [], bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0 } };

    const telemetry = lapData.telemetry;

    // Store full telemetry with rotation for hover lookup
    const fullRotated = telemetry.map((p: any) => ({
      ...p,
      x: -p.x,
      y: -p.y
    }));
    fullTelemetryRef.current = fullRotated;

    // Sample every 20 points for much faster rendering (reduces ~5000 points to ~250)
    const sampledTelemetry = telemetry.filter((_: any, i: number) => i % 20 === 0);

    // Rotate sampled points
    const rotatedPoints = sampledTelemetry.map((p: any) => ({
      ...p,
      x: -p.x,
      y: -p.y
    }));

    const xs = rotatedPoints.map((p: any) => p.x);
    const ys = rotatedPoints.map((p: any) => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      normalizedPoints: rotatedPoints,
      bounds: { minX, maxX, minY, maxY }
    };
  }, [lapData]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || normalizedPoints.length === 0) return;

    // Skip redraw if distance hasn't changed
    if (lastDrawnDistance.current === hoveredDistance && hoveredDistance !== null) {
      return;
    }
    lastDrawnDistance.current = hoveredDistance;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true // Better performance
    });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, width, height);

    const padding = 30;
    const drawWidth = width - padding * 2;
    const drawHeight = height - padding * 2;

    const { minX, maxX, minY, maxY } = bounds;
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;

    // Scale to fit canvas (maintain aspect ratio)
    const scaleX = drawWidth / rangeX;
    const scaleY = drawHeight / rangeY;
    const scale = Math.min(scaleX, scaleY);

    // Center the track
    const offsetX = padding + (drawWidth - rangeX * scale) / 2;
    const offsetY = padding + (drawHeight - rangeY * scale) / 2;

    const toCanvasX = (x: number) => offsetX + (x - minX) * scale;
    const toCanvasY = (y: number) => height - (offsetY + (y - minY) * scale);

    // Draw racing line (current lap only) - simplified rendering
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    for (let i = 0; i < normalizedPoints.length; i++) {
      const point = normalizedPoints[i];
      const x = toCanvasX(point.x);
      const y = toCanvasY(point.y);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw corner markers
    if (corners && corners.length > 0) {
      corners.forEach((corner: any) => {
        if (!corner || corner.apexDistance === undefined || corner.cornerNumber === undefined) return;

        const apexPoint = normalizedPoints.find(
          (p: any) => Math.abs(p.distance - corner.apexDistance) < 5
        );
        if (apexPoint) {
          const x = toCanvasX(apexPoint.x);
          const y = toCanvasY(apexPoint.y);

          // Corner dot
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Corner number
          ctx.fillStyle = "#fff";
          ctx.font = "10px monospace";
          ctx.textAlign = "center";
          ctx.fillText(String(corner.cornerNumber), x, y - 8);
        }
      });
    }

    // Draw start/finish line
    const startPoint = normalizedPoints[0];
    if (startPoint) {
      const x = toCanvasX(startPoint.x);
      const y = toCanvasY(startPoint.y);

      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 6);
      ctx.lineTo(x + 6, y + 6);
      ctx.moveTo(x - 6, y + 6);
      ctx.lineTo(x + 6, y - 6);
      ctx.stroke();
    }

    // Draw hovered position marker (use full telemetry for accuracy)
    if (hoveredDistance !== null && hoveredDistance !== undefined && fullTelemetryRef.current.length > 0) {
      // Fast lookup - since distance is sequential, we can estimate the index
      const maxDist = fullTelemetryRef.current[fullTelemetryRef.current.length - 1].distance;
      const estimatedIndex = Math.floor((hoveredDistance / maxDist) * fullTelemetryRef.current.length);

      let closestPoint = null;
      let minDiff = Infinity;

      // Search around estimated position (much faster than full search)
      const searchRange = 100;
      const start = Math.max(0, estimatedIndex - searchRange);
      const end = Math.min(fullTelemetryRef.current.length, estimatedIndex + searchRange);

      for (let i = start; i < end; i++) {
        const p = fullTelemetryRef.current[i];
        const diff = Math.abs(p.distance - hoveredDistance);
        if (diff < minDiff) {
          minDiff = diff;
          closestPoint = p;
        }
      }

      if (closestPoint) {
        const x = toCanvasX(closestPoint.x);
        const y = toCanvasY(closestPoint.y);

        // Simple circle marker
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();

        // Outer glow
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Distance label
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.round(hoveredDistance)}m`, x, y - 13);
      }
    }
  }, [normalizedPoints, bounds, corners, referenceLapData, hoveredDistance]);

  useEffect(() => {
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Schedule the draw on next animation frame
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [draw]);

  return (
    <div className="bg-black border border-zinc-800">
      <div className="border-b border-zinc-800 px-4 py-2">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          Track Map
        </h3>
      </div>
      <div className="p-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-auto"
        />
        <div className="mt-3 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-yellow-400"></div>
            <span className="text-zinc-400">Lap {lapData?.metadata?.lapNumber || "?"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-zinc-400">Corners</span>
          </div>
        </div>
      </div>
    </div>
  );
}
