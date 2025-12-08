"use client";

import { useEffect, useRef, useState } from "react";
import { TelemetryOverlay } from "./TelemetryOverlay";

interface BoundaryPoint {
  distance: number;
  x: number;
  z: number;
}

interface TrackBoundaries {
  track: {
    id: number;
    name: string;
  };
  left: BoundaryPoint[];
  right: BoundaryPoint[];
  originalPointCount: {
    left: number;
    right: number;
  };
  processedPointCount: {
    left: number;
    right: number;
  };
}

interface TrackMapWithBoundariesProps {
  lapData: any;
  corners?: any[];
  currentIndex?: number;
  trackName?: string;
  referenceLapData?: any; // For comparison
}

export function TrackMapWithBoundaries({
  lapData,
  corners = [],
  currentIndex = 0,
  trackName = "sakhir-(bahrain)",
  referenceLapData,
}: TrackMapWithBoundariesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothedRefIndexRef = useRef<number | null>(null);
  const [boundaries, setBoundaries] = useState<TrackBoundaries | null>(null);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showRacingLine, setShowRacingLine] = useState(true);
  const [showBrakingZones, setShowBrakingZones] = useState(true);
  const [showCornerMarkers, setShowCornerMarkers] = useState(true);
  const [showImprovements, setShowImprovements] = useState(true);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [hoveredImprovement, setHoveredImprovement] = useState<number | null>(null);

  // Load boundaries
  useEffect(() => {
    fetch(`/api/boundaries/${trackName}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setBoundaries(null);
        } else {
          setBoundaries(data);
        }
      })
      .catch(err => {
        setBoundaries(null);
      });
  }, [trackName]);

  useEffect(() => {
    if (!canvasRef.current || !lapData?.telemetry) {
      return;
    }

    const telemetry = lapData.telemetry;

    if (referenceLapData?.telemetry) {
      // Reset smoothed index when reference lap changes
      smoothedRefIndexRef.current = null;
    }
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

    // Get current car position for camera follow with interpolation
    const floorIndex = Math.floor(currentIndex);
    const ceilIndex = Math.min(Math.ceil(currentIndex), telemetry.length - 1);
    const fraction = currentIndex - floorIndex;

    const currentPoint = telemetry[floorIndex];
    const nextPoint = telemetry[ceilIndex];

    // Interpolate position for smooth movement
    const interpolatedX = currentPoint && nextPoint
      ? currentPoint.x + (nextPoint.x - currentPoint.x) * fraction
      : currentPoint?.x || 0;
    const interpolatedY = currentPoint && nextPoint
      ? currentPoint.y + (nextPoint.y - currentPoint.y) * fraction
      : currentPoint?.y || 0;

    const centerX = interpolatedY;
    const centerY = -interpolatedX;

    // Camera zoom level (higher = more zoomed in)
    const zoomScale = 1.0;

    // View range around car (in meters)
    const viewRange = 80;

    const minX = centerX - viewRange;
    const maxX = centerX + viewRange;
    const minY = centerY - viewRange;
    const maxY = centerY + viewRange;

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const scale = Math.min(width / rangeX, height / rangeY) * zoomScale;

    const toScreenX = (x: number, y: number) => {
      const rx = y;
      return (width / 2) + (rx - centerX) * scale;
    };
    const toScreenY = (x: number, y: number) => {
      const ry = -x;
      return (height / 2) + (ry - centerY) * scale;
    };

    // Clear background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);

    // Draw track boundaries
    if (boundaries && showBoundaries) {
      // Draw track surface (filled area between boundaries)
      ctx.fillStyle = "#2a2a2a";
      ctx.beginPath();

      // Draw along left boundary
      boundaries.left.forEach((p, i) => {
        const x = toScreenX(p.x, p.z);
        const y = toScreenY(p.x, p.z);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      // Draw along right boundary in REVERSE to close the polygon
      for (let i = boundaries.right.length - 1; i >= 0; i--) {
        const p = boundaries.right[i];
        const x = toScreenX(p.x, p.z);
        const y = toScreenY(p.x, p.z);
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fill();

      const getBahrainKerbConfig = (cornerIndex: number) => {
        const configs = [
          { inside: true, outside: true, outsideStart: 0.5, outsideEnd: 1.0 },  // T1
          { inside: true, outside: true, outsideStart: 0.3, outsideEnd: 1.0 },  // T2
          { inside: true, outside: false },  // T3
          { inside: true, outside: true, outsideStart: 0.4, outsideEnd: 1.0 },  // T4
          { inside: true, outside: false },  // T5
          { inside: true, outside: true, outsideStart: 0.5, outsideEnd: 1.0 },  // T6
          { inside: true, outside: false },  // T7
          { inside: true, outside: true, outsideStart: 0.4, outsideEnd: 1.0 },  // T8
          { inside: true, outside: false },  // T9
          { inside: true, outside: true, outsideStart: 0.3, outsideEnd: 1.0 },  // T10
          { inside: true, outside: true, outsideStart: 0.6, outsideEnd: 1.0 },  // T11
          { inside: true, outside: false },  // T12
          { inside: true, outside: true, outsideStart: 0.5, outsideEnd: 1.0 },  // T13
          { inside: true, outside: true, outsideStart: 0.4, outsideEnd: 1.0 },  // T14
          { inside: true, outside: false },  // T15
        ];
        return configs[cornerIndex] || { inside: true, outside: false };
      };

      const drawKerbsAtCorners = () => {
        ctx.lineWidth = 5;
        ctx.lineCap = "butt";

        corners.forEach((corner: any, idx: number) => {
          const isLeftTurn = corner.direction === 'left';
          const insideBoundary = isLeftTurn ? boundaries.left : boundaries.right;
          const outsideBoundary = isLeftTurn ? boundaries.right : boundaries.left;
          const kerbConfig = getBahrainKerbConfig(idx);

          const drawKerbOnBoundary = (boundary: BoundaryPoint[], start: number, end: number) => {
            for (let i = 0; i < boundary.length - 1; i++) {
              const p1 = boundary[i];
              const p2 = boundary[i + 1];

              if (p1.distance >= start && p1.distance <= end) {
                const segmentStart = Math.floor(p1.distance / 3);
                const color = segmentStart % 2 === 0 ? "#cc0000" : "#d8d8d8";

                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(toScreenX(p1.x, p1.z), toScreenY(p1.x, p1.z));
                ctx.lineTo(toScreenX(p2.x, p2.z), toScreenY(p2.x, p2.z));
                ctx.stroke();
              }
            }
          };

          if (kerbConfig.inside) {
            drawKerbOnBoundary(insideBoundary, corner.entryDistance, corner.exitDistance);
          }

          if (kerbConfig.outside) {
            const cornerLength = corner.exitDistance - corner.entryDistance;
            const exitStart = corner.entryDistance + cornerLength * (kerbConfig.outsideStart || 0.5);
            const exitEnd = corner.entryDistance + cornerLength * (kerbConfig.outsideEnd || 1.0);
            drawKerbOnBoundary(outsideBoundary, exitStart, exitEnd);
          }
        });
      };

      // Draw kerbs at corners
      drawKerbsAtCorners();

      // Draw white track boundary lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([]);

      // Helper function to draw smooth boundary line using quadratic curves
      const drawSmoothBoundary = (boundary: BoundaryPoint[]) => {
        if (boundary.length < 2) return;

        const points = boundary.map(p => ({
          x: toScreenX(p.x, p.z),
          y: toScreenY(p.x, p.z)
        }));

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        // Use quadratic curves for smooth lines
        for (let i = 1; i < points.length - 1; i++) {
          const currentPoint = points[i];
          const nextPoint = points[i + 1];

          // Calculate midpoint for smooth curve
          const midX = (currentPoint.x + nextPoint.x) / 2;
          const midY = (currentPoint.y + nextPoint.y) / 2;

          ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, midX, midY);
        }

        // Last segment
        const lastPoint = points[points.length - 1];
        ctx.lineTo(lastPoint.x, lastPoint.y);
        ctx.stroke();
      };

      // Left boundary white line (smooth)
      drawSmoothBoundary(boundaries.left);

      // Right boundary white line (smooth)
      drawSmoothBoundary(boundaries.right);

      // Draw start/finish line
      if (boundaries.left.length > 0 && boundaries.right.length > 0) {
        const leftStart = boundaries.left[0];
        const rightStart = boundaries.right[0];
        ctx.strokeStyle = "rgba(0, 255, 136, 0.8)";
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(toScreenX(leftStart.x, leftStart.z), toScreenY(leftStart.x, leftStart.z));
        ctx.lineTo(toScreenX(rightStart.x, rightStart.z), toScreenY(rightStart.x, rightStart.z));
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw braking zones - DISABLED (showing in wrong spots)
    // if (showBrakingZones) {
    //   corners.forEach((corner: any) => {
    //     if (corner.brakingZone) {
    //       const bz = corner.brakingZone;
    //       const startIdx = telemetry.findIndex((p: any) => p.distance >= bz.entryDistance);
    //       const endIdx = telemetry.findIndex((p: any) => p.distance >= bz.exitDistance);

    //       if (startIdx >= 0 && endIdx >= 0) {
    //         ctx.strokeStyle = "rgba(255, 60, 60, 0.7)";
    //         ctx.lineWidth = 8;
    //         ctx.lineCap = "round";
    //         ctx.lineJoin = "round";

    //         ctx.beginPath();
    //         for (let i = startIdx; i <= endIdx; i++) {
    //           const p = telemetry[i];
    //           const x = toScreenX(p.x, p.y);
    //           const y = toScreenY(p.x, p.y);
    //           if (i === startIdx) ctx.moveTo(x, y);
    //           else ctx.lineTo(x, y);
    //         }
    //         ctx.stroke();
    //       }
    //     }
    //   });
    // }

    // Draw reference lap racing line (if available)
    if (showRacingLine && referenceLapData?.telemetry) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(0, 200, 255, 0.5)"; // Cyan/blue for reference
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      referenceLapData.telemetry.forEach((p: any, i: number) => {
        const x = toScreenX(p.x, p.y);
        const y = toScreenY(p.x, p.y);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevP = referenceLapData.telemetry[i - 1];
          const dx = p.x - prevP.x;
          const dy = p.y - prevP.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 50) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    // Draw current lap racing line
    if (showRacingLine) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffff00";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      telemetry.forEach((p: any, i: number) => {
        const x = toScreenX(p.x, p.y);
        const y = toScreenY(p.x, p.y);

        // Check for large gaps (discontinuities)
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevP = telemetry[i - 1];
          const dx = p.x - prevP.x;
          const dy = p.y - prevP.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // If gap is too large (> 50m), start new path
          if (dist > 50) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    // Draw corner markers - DISABLED (WIP)
    // if (showCornerMarkers) {
    //   corners.forEach((corner: any, idx: number) => {
    //     // Find closest telemetry point to apex distance (not just within 5m)
    //     let apexPoint = null;
    //     let minDist = Infinity;

    //     for (const p of telemetry) {
    //       const dist = Math.abs(p.distance - corner.apexDistance);
    //       if (dist < minDist) {
    //         minDist = dist;
    //         apexPoint = p;
    //       }
    //     }

    //     if (apexPoint) {
    //       const x = toScreenX(apexPoint.x, apexPoint.y);
    //       const y = toScreenY(apexPoint.x, apexPoint.y);

    //       ctx.fillStyle = "#000";
    //       ctx.beginPath();
    //       ctx.arc(x, y, 16, 0, Math.PI * 2);
    //       ctx.fill();

    //       ctx.fillStyle = "#fff";
    //       ctx.beginPath();
    //       ctx.arc(x, y, 14, 0, Math.PI * 2);
    //       ctx.fill();

    //       ctx.fillStyle = "#000";
    //       ctx.font = "bold 11px sans-serif";
    //       ctx.textAlign = "center";
    //       ctx.textBaseline = "middle";
    //       ctx.fillText(`${idx + 1}`, x, y);
    //     }
    //   });
    // }

    // Draw improvement opportunity markers (only where slower than reference)
    if (showImprovements && referenceLapData?.corners && currentPoint) {
      const currentDistance = currentPoint.distance;

      corners.forEach((corner: any, idx: number) => {
        // Find matching corner in reference lap
        const refCorner = referenceLapData.corners.find((c: any) =>
          Math.abs(c.apexDistance - corner.apexDistance) < 50
        );

        if (refCorner && corner.brakingZone) {
          // Calculate speed difference
          const speedDiff = (refCorner.apexSpeed || 0) - (corner.apexSpeed || 0);
          const timeLoss = (corner.exitDistance - corner.entryDistance) / Math.max(corner.apexSpeed, 1) -
                          (refCorner.exitDistance - refCorner.entryDistance) / Math.max(refCorner.apexSpeed, 1);

          // Only show marker if losing significant time (>0.1s)
          if (timeLoss > 0.1) {
            const bz = corner.brakingZone;

            // Find closest telemetry point to braking zone entry
            let markerPoint = null;
            let minDist = Infinity;
            for (const p of telemetry) {
              const dist = Math.abs(p.distance - bz.entryDistance);
              if (dist < minDist) {
                minDist = dist;
                markerPoint = p;
              }
            }

            if (markerPoint) {
              const mx = toScreenX(markerPoint.x, markerPoint.y);
              const my = toScreenY(markerPoint.x, markerPoint.y);

              // Check if currently AT this spot (tight window - only when you reach it)
              const distanceToCorner = currentDistance - bz.entryDistance;
              const isAtSpot = Math.abs(distanceToCorner) < 20; // Very tight - only at the spot

              // Yellow marker with exclamation mark
              ctx.fillStyle = "#ffff00";
              ctx.beginPath();
              ctx.arc(mx, my, 10, 0, Math.PI * 2);
              ctx.fill();

              // Black border
              ctx.strokeStyle = "#000000";
              ctx.lineWidth = 2;
              ctx.stroke();

              // Exclamation mark inside
              ctx.fillStyle = "#000000";
              ctx.font = "bold 14px Arial";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("!", mx, my);

              // Show tip ONLY when at the spot
              if (isAtSpot) {
                // Generate improvement tip based on data
                let tipText = '';
                if (speedDiff > 5) {
                  tipText = `Carry +${speedDiff.toFixed(0)} km/h`;
                } else if (timeLoss > 0.3) {
                  tipText = 'Brake later';
                } else {
                  tipText = 'More speed possible';
                }

                // Dynamic tooltip size based on text
                const boxWidth = 160;
                const boxHeight = 36;
                const boxX = mx - boxWidth / 2;
                const boxY = my - 55;

                // Tooltip background - solid yellow
                ctx.fillStyle = "#ffff00";
                ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

                // Black border
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 2;
                ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

                // Tip text - black on yellow
                ctx.fillStyle = "#000000";
                ctx.font = "bold 14px Arial";
                ctx.textAlign = "center";
                ctx.fillText(tipText, mx, boxY + 22);
              }
            }
          }
        }
      });
    }

    // Draw reference lap position (if available) - TIME SYNCHRONIZED
    if (referenceLapData?.telemetry && currentPoint) {
      const refTelemetry = referenceLapData.telemetry;

      // TIME-BASED MATCHING: Find where reference lap was at the same time
      const currentTime = currentPoint.time;

      // Find the reference point that matches the current time
      let targetRefIndex = refTelemetry.findIndex((p: any) => p.time >= currentTime);
      if (targetRefIndex === -1) targetRefIndex = refTelemetry.length - 1;
      if (targetRefIndex === 0) targetRefIndex = 1; // Ensure we can interpolate

      // Initialize smoothed index on first frame to current target
      if (smoothedRefIndexRef.current === null) {
        smoothedRefIndexRef.current = targetRefIndex;
      }

      // Smooth transition to target index
      const currentSmoothed = smoothedRefIndexRef.current ?? targetRefIndex;
      const difference = targetRefIndex - currentSmoothed;
      smoothedRefIndexRef.current = currentSmoothed + difference * 0.3; // Smooth movement

      // Now use the smoothed index for interpolation
      const smoothedIdx = smoothedRefIndexRef.current ?? 0;
      const idx1 = Math.floor(smoothedIdx);
      const idx2 = Math.min(idx1 + 1, refTelemetry.length - 1);
      const refFraction = smoothedIdx - idx1;

      const refPoint1 = refTelemetry[idx1];
      const refPoint2 = refTelemetry[idx2];

      // Smooth interpolation with safety checks
      if (refPoint1 && refPoint2) {
        const refInterpolatedX = refPoint1.x + (refPoint2.x - refPoint1.x) * refFraction;
        const refInterpolatedY = refPoint1.y + (refPoint2.y - refPoint1.y) * refFraction;

        const rx = toScreenX(refInterpolatedX, refInterpolatedY);
        const ry = toScreenY(refInterpolatedX, refInterpolatedY);

        // Only draw if coordinates are valid (not NaN)
        if (isFinite(rx) && isFinite(ry)) {
          // Reference lap car (cyan/blue) - same size as current lap
          ctx.fillStyle = "#00c8ff";
          ctx.beginPath();
          ctx.arc(rx, ry, 5, 0, Math.PI * 2);
          ctx.fill();

          // Inner dot
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(rx, ry, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw current position as a clean dot using interpolated position
    if (currentPoint) {
      const cx = toScreenX(interpolatedX, interpolatedY);
      const cy = toScreenY(interpolatedX, interpolatedY);

      // Outer ring (yellow to match racing line)
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Inner dot
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [lapData, corners, currentIndex, boundaries, showBoundaries, showRacingLine, showBrakingZones, showCornerMarkers, showImprovements, referenceLapData]);

  const currentTelemetryPoint = lapData?.telemetry?.[Math.floor(currentIndex)];

  return (
    <div className="relative rounded-lg border border-zinc-800 bg-zinc-900/50 mx-auto" style={{ maxWidth: "1200px" }}>
      {/* Telemetry Overlay */}
      <TelemetryOverlay telemetryPoint={currentTelemetryPoint} />

      {/* Toggle controls - moved to bottom right corner */}
      <div className="absolute bottom-20 right-2 z-20 flex flex-col gap-1 pointer-events-auto">
        <button
          onClick={() => setShowBoundaries(!showBoundaries)}
          className={`px-2 py-1 text-[10px] uppercase tracking-wide transition-colors ${
            showBoundaries
              ? 'bg-black/90 text-white border border-zinc-700'
              : 'bg-black/60 text-zinc-500 border border-zinc-800 hover:bg-black/80'
          }`}
        >
          Boundaries
        </button>
        <button
          onClick={() => setShowRacingLine(!showRacingLine)}
          className={`px-2 py-1 text-[10px] uppercase tracking-wide transition-colors ${
            showRacingLine
              ? 'bg-black/90 text-white border border-zinc-700'
              : 'bg-black/60 text-zinc-500 border border-zinc-800 hover:bg-black/80'
          }`}
        >
          Line
        </button>
        <button
          disabled
          className="px-2 py-1 text-[10px] uppercase tracking-wide bg-black/40 text-zinc-600 border border-zinc-800 cursor-not-allowed"
        >
          Braking (WIP)
        </button>
        <button
          disabled
          className="px-2 py-1 text-[10px] uppercase tracking-wide bg-black/40 text-zinc-600 border border-zinc-800 cursor-not-allowed"
        >
          Corners (WIP)
        </button>
        <button
          disabled
          className="px-2 py-1 text-[10px] uppercase tracking-wide bg-black/40 text-zinc-600 border border-zinc-800 cursor-not-allowed"
        >
          Tips (WIP)
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="cursor-crosshair bg-black mx-auto"
        style={{ height: "650px", width: "1200px", maxWidth: "100%" }}
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
