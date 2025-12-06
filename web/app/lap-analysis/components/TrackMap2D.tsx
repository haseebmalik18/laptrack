"use client";

import { useEffect, useRef, useState } from "react";

interface TrackMap2DProps {
  lapData: any;
  corners: any[];
  hoveredDistance: number | null;
  currentIndex: number;
  onHoverDistance: (distance: number | null) => void;
}

export function TrackMap2D({
  lapData,
  corners,
  hoveredDistance,
  currentIndex,
  onHoverDistance,
}: TrackMap2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !lapData?.telemetry) {
      return;
    }

    const telemetry = lapData.telemetry;

    if (telemetry.length === 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    // Apply rotation: rx = y, ry = -x (270 degrees)
    const allX = telemetry.map((p: any) => p.y);
    const allY = telemetry.map((p: any) => -p.x);

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const scale = Math.min((width - padding * 2) / rangeX, (height - padding * 2) / rangeY);

    const toScreenX = (x: number, y: number) => {
      const rx = y;
      return padding + (rx - minX) * scale;
    };
    const toScreenY = (x: number, y: number) => {
      const ry = -x;
      return padding + (ry - minY) * scale;
    };

    // Fill background
    ctx.fillStyle = "#0f1419";
    ctx.fillRect(0, 0, width, height);

    // Draw braking zones
    corners.forEach((corner: any) => {
      if (corner.brakingZone) {
        const bz = corner.brakingZone;
        const startIdx = telemetry.findIndex((p: any) => p.distance >= bz.entryDistance);
        const endIdx = telemetry.findIndex((p: any) => p.distance >= bz.exitDistance);

        if (startIdx >= 0 && endIdx >= 0) {
          ctx.strokeStyle = "rgba(255, 60, 60, 0.7)";
          ctx.lineWidth = 8;
          ctx.lineCap = "square";
          ctx.lineJoin = "round";

          ctx.beginPath();
          for (let i = startIdx; i <= endIdx; i++) {
            const p = telemetry[i];
            const x = toScreenX(p.x, p.y);
            const y = toScreenY(p.x, p.y);
            if (i === startIdx) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      }
    });

    // Draw racing line (yellow line showing actual path)
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffff00";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    telemetry.forEach((p: any, i: number) => {
      const x = toScreenX(p.x, p.y);
      const y = toScreenY(p.x, p.y);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    corners.forEach((corner: any, idx: number) => {
      const apexPoint = telemetry.find(
        (p: any) => Math.abs(p.distance - corner.apexDistance) < 5
      );

      if (apexPoint) {
        const x = toScreenX(apexPoint.x, apexPoint.y);
        const y = toScreenY(apexPoint.x, apexPoint.y);

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${idx + 1}`, x, y);
      }
    });

    const startPoint = telemetry[0];
    const sx = toScreenX(startPoint.x, startPoint.y);
    const sy = toScreenY(startPoint.x, startPoint.y);

    ctx.fillStyle = "#00ff88";
    ctx.beginPath();
    ctx.arc(sx, sy, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    const currentPoint = telemetry[Math.floor(currentIndex)];
    const nextPoint = telemetry[Math.floor(currentIndex) + 1];

    if (currentPoint && nextPoint) {
      const cx = toScreenX(currentPoint.x, currentPoint.y);
      const cy = toScreenY(currentPoint.x, currentPoint.y);
      const nx = toScreenX(nextPoint.x, nextPoint.y);
      const ny = toScreenY(nextPoint.x, nextPoint.y);

      const angle = Math.atan2(ny - cy, nx - cx);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.shadowColor = "rgba(0, 255, 255, 0.6)";
      ctx.shadowBlur = 10;

      ctx.fillStyle = "#00ffff";
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-6, -5);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-6, 5);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

  }, [lapData, corners, hoveredDistance, currentIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !lapData?.telemetry) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    const telemetry = lapData.telemetry;

    const allX = telemetry.map((p: any) => p.y);
    const allY = telemetry.map((p: any) => -p.x);

    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const scale = Math.min((width - padding * 2) / rangeX, (height - padding * 2) / rangeY);

    let closestPoint: any = null;
    let closestDist = Infinity;

    telemetry.forEach((p: any) => {
      const rx = p.y;
      const ry = -p.x;
      const sx = padding + (rx - minX) * scale;
      const sy = padding + (ry - minY) * scale;
      const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);

      if (dist < closestDist && dist < 20) {
        closestDist = dist;
        closestPoint = p;
      }
    });

    if (closestPoint) {
      onHoverDistance(closestPoint.distance);
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        text: `${Math.round(closestPoint.distance)}m | ${Math.round(closestPoint.speed)} km/h`,
      });
    } else {
      onHoverDistance(null);
      setTooltip(null);
    }
  };

  const handleMouseLeave = () => {
    onHoverDistance(null);
    setTooltip(null);
  };

  return (
    <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Track Map</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 rounded bg-zinc-700 border border-zinc-800" />
            <span className="text-zinc-400">Asphalt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded bg-yellow-400" />
            <span className="text-zinc-400">Racing Line</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 rounded bg-red-500/70" />
            <span className="text-zinc-400">Braking Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-cyan-400 rounded-sm" style={{ clipPath: "polygon(100% 50%, 0 0, 0 100%)" }} />
            <span className="text-zinc-400">Your Car</span>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full rounded-lg cursor-crosshair"
        style={{ height: "700px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded bg-black px-3 py-2 text-sm text-white shadow-lg border border-zinc-700"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y + 10,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
