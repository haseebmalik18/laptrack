import * as fs from 'fs';
import { LapLoader, LapNormalizer, detectCornersYawCurvature } from './analysis';

const loader = new LapLoader('./laps');
const rawTelemetry = loader.loadLapByNumber(1)!;

const normalizer = new LapNormalizer({ sampleRate: 1.0 });
const telemetry = normalizer.normalize(rawTelemetry);

const corners = detectCornersYawCurvature(telemetry, {
  minYawRateThreshold: 0.045,
  minCurvatureThreshold: 0.0022,
  minCornerLength: 45,
  minCornerDuration: 0.3,
  cornerMergeDistance: 18,
});

// Rotate 270 degrees counter-clockwise (or 90 clockwise): new_x = y, new_y = -x
const rotatedPoints = telemetry.map(p => ({
  ...p,
  rx: p.y!,   // Rotated X
  ry: -p.x!   // Rotated Y
}));

// Find bounds
let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;

rotatedPoints.forEach(p => {
  if (p.rx < minX) minX = p.rx;
  if (p.rx > maxX) maxX = p.rx;
  if (p.ry < minY) minY = p.ry;
  if (p.ry > maxY) maxY = p.ry;
});

const width = 1200;
const height = 800;
const margin = 50;

function scaleX(x: number, y: number): number {
  const rx = y; // Rotate 270° CCW
  return margin + ((rx - minX) / (maxX - minX)) * (width - 2 * margin);
}

function scaleY(x: number, y: number): number {
  const ry = -x; // Rotate 270° CCW
  return margin + ((ry - minY) / (maxY - minY)) * (height - 2 * margin);
}

// Generate HTML with SVG
const html = `<!DOCTYPE html>
<html>
<head>
  <title>Bahrain Track - Corner Detection Visualization</title>
  <style>
    body { font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; margin: 20px; }
    svg { background: #2a2a2a; border: 2px solid #444; }
    .info { margin: 20px 0; }
    .corner-legend { display: flex; gap: 20px; flex-wrap: wrap; margin: 20px 0; }
    .legend-item { display: flex; align-items: center; gap: 10px; }
    .color-box { width: 20px; height: 20px; border: 1px solid #666; }
  </style>
</head>
<body>
  <h1>Bahrain International Circuit - Corner Detection</h1>
  <div class="info">
    <strong>Detected Corners:</strong> ${corners.length} / 15 (Official)<br>
    <strong>Track Length:</strong> ${telemetry[telemetry.length - 1].distance.toFixed(0)}m
  </div>

  <div class="corner-legend">
    <div class="legend-item"><div class="color-box" style="background: #ff4444;"></div>Hairpin (&lt;80 km/h)</div>
    <div class="legend-item"><div class="color-box" style="background: #ffaa44;"></div>Slow (80-120 km/h)</div>
    <div class="legend-item"><div class="color-box" style="background: #44aaff;"></div>Medium (120-180 km/h)</div>
    <div class="legend-item"><div class="color-box" style="background: #44ff44;"></div>Fast (180-250 km/h)</div>
    <div class="legend-item"><div class="color-box" style="background: #ff44ff;"></div>Very Fast (&gt;250 km/h)</div>
  </div>

  <svg width="${width}" height="${height}">
    <!-- Track outline -->
    <polyline
      points="${telemetry.map(p => `${scaleX(p.x!, p.y!)},${scaleY(p.x!, p.y!)}`).join(' ')}"
      fill="none"
      stroke="#666"
      stroke-width="3"
    />

    <!-- Start/Finish line -->
    <circle
      cx="${scaleX(telemetry[0].x!, telemetry[0].y!)}"
      cy="${scaleY(telemetry[0].x!, telemetry[0].y!)}"
      r="8"
      fill="#00ff00"
      stroke="#fff"
      stroke-width="2"
    />
    <text
      x="${scaleX(telemetry[0].x!, telemetry[0].y!) + 15}"
      y="${scaleY(telemetry[0].x!, telemetry[0].y!) + 5}"
      fill="#00ff00"
      font-size="14"
      font-weight="bold"
    >START</text>

    <!-- Distance markers every 1000m -->
    ${[1000, 2000, 3000, 4000, 5000].map(dist => {
      const idx = Math.min(dist, telemetry.length - 1);
      const p = telemetry[idx];
      return `
        <circle cx="${scaleX(p.x!, p.y!)}" cy="${scaleY(p.x!, p.y!)}" r="4" fill="#888" />
        <text x="${scaleX(p.x!, p.y!) + 10}" y="${scaleY(p.x!, p.y!) + 5}" fill="#888" font-size="12">${dist}m</text>
      `;
    }).join('')}

    <!-- Detected corners -->
    ${corners.map((corner, idx) => {
      const entryP = telemetry.find(p => Math.abs(p.distance - corner.entryDistance) < 1);
      const apexP = telemetry.find(p => Math.abs(p.distance - corner.apexDistance) < 1);
      const exitP = telemetry.find(p => Math.abs(p.distance - corner.exitDistance) < 1);

      if (!entryP || !apexP || !exitP) return '';

      const color =
        corner.type === 'hairpin' ? '#ff4444' :
        corner.type === 'slow' ? '#ffaa44' :
        corner.type === 'medium' ? '#44aaff' :
        corner.type === 'fast' ? '#44ff44' :
        '#ff44ff';

      // Get all telemetry points within this corner
      const cornerPoints = telemetry.filter(p =>
        p.distance >= corner.entryDistance && p.distance <= corner.exitDistance
      );

      // Create polyline path through corner to show actual curve
      const cornerPath = cornerPoints.map(p =>
        `${scaleX(p.x!, p.y!)},${scaleY(p.x!, p.y!)}`
      ).join(' ');

      return `
        <!-- Corner ${corner.id} -->
        <polyline
          points="${cornerPath}"
          fill="none"
          stroke="${color}"
          stroke-width="8"
          opacity="0.7"
        />
        <circle
          cx="${scaleX(apexP.x!, apexP.y!)}"
          cy="${scaleY(apexP.x!, apexP.y!)}"
          r="12"
          fill="${color}"
          stroke="#fff"
          stroke-width="2"
        />
        <text
          x="${scaleX(apexP.x!, apexP.y!)}"
          y="${scaleY(apexP.x!, apexP.y!) + 5}"
          fill="#fff"
          font-size="16"
          font-weight="bold"
          text-anchor="middle"
          stroke="#000"
          stroke-width="3"
          paint-order="stroke"
        >${corner.id}</text>
      `;
    }).join('')}
  </svg>

  <div class="info" style="margin-top: 20px;">
    <h3>Detected Corners:</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <tr style="background: #333; text-align: left;">
        <th style="padding: 10px; border: 1px solid #555;">Corner</th>
        <th style="padding: 10px; border: 1px solid #555;">Type</th>
        <th style="padding: 10px; border: 1px solid #555;">Direction</th>
        <th style="padding: 10px; border: 1px solid #555;">Distance Range</th>
        <th style="padding: 10px; border: 1px solid #555;">Length</th>
      </tr>
      ${corners.map(c => `
        <tr style="background: #2a2a2a;">
          <td style="padding: 10px; border: 1px solid #555;">${c.id}</td>
          <td style="padding: 10px; border: 1px solid #555;">${c.type}</td>
          <td style="padding: 10px; border: 1px solid #555;">${c.direction === 'left' ? '←' : '→'}</td>
          <td style="padding: 10px; border: 1px solid #555;">${c.entryDistance.toFixed(0)}m - ${c.exitDistance.toFixed(0)}m</td>
          <td style="padding: 10px; border: 1px solid #555;">${c.length.toFixed(0)}m</td>
        </tr>
      `).join('')}
    </table>
  </div>
</body>
</html>`;

fs.writeFileSync('bahrain-corners-viz.html', html);
console.log('Visualization saved to: bahrain-corners-viz.html');
console.log('Open this file in your browser to see the 2D track map with detected corners.');
