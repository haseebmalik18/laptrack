import { LapLoader, LapNormalizer, LapAligner, SpeedComparisonAnalyzer } from './analysis';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: npx tsx src/visualize-speed-comparison.ts <lap-a-number> <lap-b-number>');
    console.log('Example: npx tsx src/visualize-speed-comparison.ts 1 2');
    process.exit(1);
  }

  const lapANum = parseInt(args[0]);
  const lapBNum = parseInt(args[1]);

  const loader = new LapLoader();
  const normalizer = new LapNormalizer({ sampleRate: 1.0 });
  const aligner = new LapAligner();
  const speedAnalyzer = new SpeedComparisonAnalyzer();

  const availableLaps = loader.listAvailableLaps();
  const lapAInfo = availableLaps.find(l => l.lapNumber === lapANum);
  const lapBInfo = availableLaps.find(l => l.lapNumber === lapBNum);

  if (!lapAInfo || !lapBInfo) {
    console.error(`Lap not found`);
    process.exit(1);
  }

  const lapAMetadata = JSON.parse(fs.readFileSync(lapAInfo.filePath.replace('.csv', '.json'), 'utf-8'));
  const trackName = lapAMetadata.trackName || 'Unknown';

  const rawLapA = loader.loadLap(lapAInfo.filePath);
  const rawLapB = loader.loadLap(lapBInfo.filePath);

  const normalizedA = normalizer.normalize(rawLapA);
  const normalizedB = normalizer.normalize(rawLapB);

  const aligned = aligner.alignLaps(normalizedA, normalizedB);
  const comparison = speedAnalyzer.compareSpeed(aligned, trackName);

  const html = generateHTML(comparison, lapANum, lapBNum, trackName, speedAnalyzer);

  const outputPath = 'speed-comparison.html';
  fs.writeFileSync(outputPath, html);
  console.log(`\nVisualization saved to: ${outputPath}`);
}

function generateHTML(
  comparison: any,
  lapANum: number,
  lapBNum: number,
  trackName: string,
  analyzer: SpeedComparisonAnalyzer
): string {
  const { corners, accelerationZones, summary } = comparison;

  const cornerRows = corners.map((c: any) => {
    const deltaColor = analyzer.getDeltaColor(c.timeDelta);
    const rowClass = deltaColor === 'green' ? 'gain' : deltaColor === 'red' ? 'loss' : '';
    const symbol = deltaColor === 'green' ? '✓' : deltaColor === 'red' ? '✗' : '=';

    return `
      <tr class="${rowClass}">
        <td>${symbol} ${c.cornerNumber}</td>
        <td>${c.entryDistance}m</td>
        <td>${c.apexDistance}m</td>
        <td>${c.exitDistance}m</td>
        <td>${c.entrySpeed.lapA.toFixed(0)} / ${c.entrySpeed.lapB.toFixed(0)}</td>
        <td>${c.apexSpeed.lapA.toFixed(0)} / ${c.apexSpeed.lapB.toFixed(0)}</td>
        <td>${c.exitSpeed.lapA.toFixed(0)} / ${c.exitSpeed.lapB.toFixed(0)}</td>
        <td>${c.minSpeed.lapA.toFixed(0)} / ${c.minSpeed.lapB.toFixed(0)}</td>
        <td class="${rowClass}">${analyzer.formatTimeDelta(c.timeDelta)}</td>
      </tr>
    `;
  }).join('');

  const accelRows = accelerationZones.map((z: any, i: number) => {
    const deltaColor = analyzer.getDeltaColor(z.timeDelta);
    const rowClass = deltaColor === 'green' ? 'gain' : deltaColor === 'red' ? 'loss' : '';
    const symbol = deltaColor === 'green' ? '✓' : deltaColor === 'red' ? '✗' : '=';

    const beforeCorner = z.precedingCorner ? `T${z.precedingCorner}` : 'Start';
    const afterCorner = z.followingCorner ? `T${z.followingCorner}` : 'Finish';

    return `
      <tr class="${rowClass}">
        <td>${symbol} ${i + 1}</td>
        <td>${beforeCorner} → ${afterCorner}</td>
        <td>${Math.round(z.startDistance)}m - ${Math.round(z.endDistance)}m</td>
        <td>${Math.round(z.distance)}m</td>
        <td>${z.startSpeed.lapA.toFixed(0)} / ${z.startSpeed.lapB.toFixed(0)}</td>
        <td>${z.endSpeed.lapA.toFixed(0)} / ${z.endSpeed.lapB.toFixed(0)}</td>
        <td>${z.avgAcceleration.lapA.toFixed(2)} / ${z.avgAcceleration.lapB.toFixed(2)}</td>
        <td>${(z.avgThrottle.lapA * 100).toFixed(0)}% / ${(z.avgThrottle.lapB * 100).toFixed(0)}%</td>
        <td class="${rowClass}">${analyzer.formatTimeDelta(z.timeDelta)}</td>
      </tr>
    `;
  }).join('');

  const timeGainCorners = corners.filter((c: any) => c.timeDelta < -0.05);
  const timeLossCorners = corners.filter((c: any) => c.timeDelta > 0.05);

  const insightsHTML = `
    <div class="insights">
      <h2>Key Insights</h2>
      <div class="insight-box ${summary.totalTimeDelta < 0 ? 'gain' : 'loss'}">
        <h3>Overall Result</h3>
        <p>Lap ${lapANum} was <strong>${Math.abs(summary.totalTimeDelta).toFixed(3)}s ${summary.totalTimeDelta < 0 ? 'faster' : 'slower'}</strong> than Lap ${lapBNum}</p>
        <p>Time in Corners: ${analyzer.formatTimeDelta(summary.timeGainedInCorners)}</p>
        <p>Time in Acceleration: ${analyzer.formatTimeDelta(summary.timeGainedInAccelZones)}</p>
      </div>

      ${timeGainCorners.length > 0 ? `
      <div class="insight-box gain">
        <h3>Time Gained (${timeGainCorners.length} corners)</h3>
        <ul>
          ${timeGainCorners.sort((a: any, b: any) => a.timeDelta - b.timeDelta).map((c: any) =>
            `<li>Corner ${c.cornerNumber}: ${analyzer.formatTimeDelta(c.timeDelta)}</li>`
          ).join('')}
        </ul>
      </div>
      ` : ''}

      ${timeLossCorners.length > 0 ? `
      <div class="insight-box loss">
        <h3>Time Lost (${timeLossCorners.length} corners)</h3>
        <ul>
          ${timeLossCorners.sort((a: any, b: any) => b.timeDelta - a.timeDelta).map((c: any) =>
            `<li>Corner ${c.cornerNumber}: ${analyzer.formatTimeDelta(c.timeDelta)}</li>`
          ).join('')}
        </ul>
      </div>
      ` : ''}

      <div class="insight-box">
        <h3>Speed Statistics</h3>
        <p>Average Speed Delta: ${summary.avgSpeedDelta.toFixed(2)} km/h</p>
        <p>Max Speed Delta: ${summary.maxSpeedDelta.toFixed(2)} km/h at ${Math.round(summary.maxSpeedDeltaDistance)}m</p>
      </div>
    </div>
  `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Speed Comparison: Lap ${lapANum} vs Lap ${lapBNum}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 20px;
      background: #0a0a0a;
      color: #fff;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 { margin-bottom: 10px; font-size: 32px; }
    h2 { margin: 30px 0 15px; font-size: 24px; }
    h3 { margin-bottom: 10px; font-size: 18px; }
    .header { margin-bottom: 30px; }
    .subtitle { color: #888; font-size: 18px; }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .stat-box {
      background: #1a1a1a;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #333;
    }
    .stat-box h3 { color: #888; font-size: 14px; text-transform: uppercase; margin-bottom: 8px; }
    .stat-box .value { font-size: 28px; font-weight: bold; }
    .stat-box .value.gain { color: #00ff88; }
    .stat-box .value.loss { color: #ff4444; }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #1a1a1a;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 30px;
    }
    th {
      background: #2a2a2a;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #333;
      font-size: 13px;
      text-transform: uppercase;
      color: #888;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #222;
    }
    tr:hover { background: #252525; }
    tr.gain { background: rgba(0, 255, 136, 0.05); }
    tr.loss { background: rgba(255, 68, 68, 0.05); }
    tr.gain td:last-child { color: #00ff88; font-weight: bold; }
    tr.loss td:last-child { color: #ff4444; font-weight: bold; }

    .insights {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    .insight-box {
      background: #1a1a1a;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #333;
    }
    .insight-box.gain { border-color: #00ff88; background: rgba(0, 255, 136, 0.05); }
    .insight-box.loss { border-color: #ff4444; background: rgba(255, 68, 68, 0.05); }
    .insight-box h3 { margin-bottom: 15px; }
    .insight-box p { margin-bottom: 8px; color: #ccc; }
    .insight-box ul { list-style: none; }
    .insight-box li { padding: 5px 0; color: #ccc; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Speed Comparison</h1>
      <div class="subtitle">Lap ${lapANum} vs Lap ${lapBNum} - ${trackName}</div>
    </div>

    <div class="summary">
      <div class="stat-box">
        <h3>Total Time Delta</h3>
        <div class="value ${summary.totalTimeDelta < 0 ? 'gain' : 'loss'}">
          ${analyzer.formatTimeDelta(summary.totalTimeDelta)}
        </div>
      </div>
      <div class="stat-box">
        <h3>Time in Corners</h3>
        <div class="value ${summary.timeGainedInCorners < 0 ? 'gain' : 'loss'}">
          ${analyzer.formatTimeDelta(summary.timeGainedInCorners)}
        </div>
      </div>
      <div class="stat-box">
        <h3>Time in Acceleration</h3>
        <div class="value ${summary.timeGainedInAccelZones < 0 ? 'gain' : 'loss'}">
          ${analyzer.formatTimeDelta(summary.timeGainedInAccelZones)}
        </div>
      </div>
      <div class="stat-box">
        <h3>Avg Speed Delta</h3>
        <div class="value">${summary.avgSpeedDelta.toFixed(1)} km/h</div>
      </div>
    </div>

    <h2>Corner Performance (Lap ${lapANum} / Lap ${lapBNum})</h2>
    <table>
      <thead>
        <tr>
          <th>Corner</th>
          <th>Entry</th>
          <th>Apex</th>
          <th>Exit</th>
          <th>Entry Speed</th>
          <th>Apex Speed</th>
          <th>Exit Speed</th>
          <th>Min Speed</th>
          <th>Time Delta</th>
        </tr>
      </thead>
      <tbody>
        ${cornerRows}
      </tbody>
    </table>

    <h2>Acceleration Zones (Lap ${lapANum} / Lap ${lapBNum})</h2>
    <table>
      <thead>
        <tr>
          <th>Zone</th>
          <th>Location</th>
          <th>Distance</th>
          <th>Length</th>
          <th>Start Speed</th>
          <th>End Speed</th>
          <th>Avg Accel (m/s²)</th>
          <th>Avg Throttle</th>
          <th>Time Delta</th>
        </tr>
      </thead>
      <tbody>
        ${accelRows}
      </tbody>
    </table>

    ${insightsHTML}
  </div>
</body>
</html>
  `;
}

main().catch(console.error);
