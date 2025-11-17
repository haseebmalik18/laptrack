import { LapLoader, LapNormalizer, LapAligner, SectorAnalyzer } from './analysis';
import * as fs from 'fs';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: npx tsx src/visualize-sectors.ts <lap-a-number> <lap-b-number>');
    console.log('Example: npx tsx src/visualize-sectors.ts 1 2');
    process.exit(1);
  }

  const lapANum = parseInt(args[0]);
  const lapBNum = parseInt(args[1]);

  const loader = new LapLoader();
  const normalizer = new LapNormalizer({ sampleRate: 1.0 });
  const aligner = new LapAligner();
  const sectorAnalyzer = new SectorAnalyzer();

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
  const analysis = sectorAnalyzer.analyzeSectors(aligned, trackName);

  const html = generateHTML(analysis, lapANum, lapBNum, trackName, sectorAnalyzer);

  const outputPath = 'sector-comparison.html';
  fs.writeFileSync(outputPath, html);
  console.log(`\nVisualization saved to: ${outputPath}`);
}

function generateHTML(
  analysis: any,
  lapANum: number,
  lapBNum: number,
  trackName: string,
  analyzer: SectorAnalyzer
): string {
  const { sectors, summary } = analysis;

  const sectorRows = sectors.map((s: any) => {
    const deltaColor = analyzer.getDeltaColor(s.timeDelta);
    const rowClass = deltaColor === 'green' ? 'gain' : deltaColor === 'red' ? 'loss' : '';
    const symbol = deltaColor === 'green' ? '✓' : deltaColor === 'red' ? '✗' : '=';

    return `
      <tr class="${rowClass}">
        <td>${symbol} Sector ${s.sectorNumber}</td>
        <td>${Math.round(s.startDistance)}m - ${Math.round(s.endDistance)}m</td>
        <td>${Math.round(s.distance)}m</td>
        <td>${s.lapA.time.toFixed(3)}s</td>
        <td>${s.lapB.time.toFixed(3)}s</td>
        <td class="${rowClass}">${analyzer.formatTimeDelta(s.timeDelta)}</td>
        <td class="${rowClass}">${s.timeGainPercentage > 0 ? '+' : ''}${s.timeGainPercentage.toFixed(2)}%</td>
        <td>${s.lapA.avgSpeed.toFixed(1)} / ${s.lapB.avgSpeed.toFixed(1)}</td>
        <td>${(s.lapA.avgThrottle * 100).toFixed(0)}% / ${(s.lapB.avgThrottle * 100).toFixed(0)}%</td>
        <td>${s.lapA.cornerCount}</td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Sector Performance: Lap ${lapANum} vs Lap ${lapBNum}</title>
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

    .sector-chart {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      background: #1a1a1a;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #333;
    }
    .sector-bar {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .sector-bar h3 {
      font-size: 16px;
      text-align: center;
      color: #888;
    }
    .bar-container {
      display: flex;
      gap: 10px;
      align-items: flex-end;
      height: 200px;
    }
    .bar {
      flex: 1;
      background: linear-gradient(to top, #2a2a2a, #1a1a1a);
      border-radius: 4px 4px 0 0;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding: 10px 5px;
    }
    .bar.lap-a { background: linear-gradient(to top, #4488ff, #2266dd); }
    .bar.lap-b { background: linear-gradient(to top, #ff8844, #dd6622); }
    .bar .time { font-size: 14px; font-weight: bold; color: #fff; }
    .bar .label { font-size: 12px; color: #ccc; margin-top: 5px; }

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
    tr.gain td:nth-child(6), tr.gain td:nth-child(7) { color: #00ff88; font-weight: bold; }
    tr.loss td:nth-child(6), tr.loss td:nth-child(7) { color: #ff4444; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sector Performance Comparison</h1>
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
        <h3>Best Sector</h3>
        <div class="value">Sector ${summary.fastestSector.sectorNumber}</div>
        <div style="color: ${analyzer.getDeltaColor(summary.fastestSector.timeDelta) === 'green' ? '#00ff88' : '#ff4444'}; font-size: 16px; margin-top: 5px;">
          ${analyzer.formatTimeDelta(summary.fastestSector.timeDelta)}
        </div>
      </div>
      <div class="stat-box">
        <h3>Worst Sector</h3>
        <div class="value">Sector ${summary.slowestSector.sectorNumber}</div>
        <div style="color: ${analyzer.getDeltaColor(summary.slowestSector.timeDelta) === 'green' ? '#00ff88' : '#ff4444'}; font-size: 16px; margin-top: 5px;">
          ${analyzer.formatTimeDelta(summary.slowestSector.timeDelta)}
        </div>
      </div>
    </div>

    <div class="sector-chart">
      ${sectors.map((s: any) => `
        <div class="sector-bar">
          <h3>Sector ${s.sectorNumber}</h3>
          <div class="bar-container">
            <div class="bar lap-a" style="height: ${(s.lapA.time / Math.max(...sectors.map((x: any) => Math.max(x.lapA.time, x.lapB.time)))) * 100}%">
              <div class="time">${s.lapA.time.toFixed(2)}s</div>
              <div class="label">Lap ${lapANum}</div>
            </div>
            <div class="bar lap-b" style="height: ${(s.lapB.time / Math.max(...sectors.map((x: any) => Math.max(x.lapA.time, x.lapB.time)))) * 100}%">
              <div class="time">${s.lapB.time.toFixed(2)}s</div>
              <div class="label">Lap ${lapBNum}</div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 10px; color: ${analyzer.getDeltaColor(s.timeDelta) === 'green' ? '#00ff88' : '#ff4444'}; font-weight: bold;">
            ${analyzer.formatTimeDelta(s.timeDelta)}
          </div>
        </div>
      `).join('')}
    </div>

    <h2>Detailed Sector Breakdown (Lap ${lapANum} / Lap ${lapBNum})</h2>
    <table>
      <thead>
        <tr>
          <th>Sector</th>
          <th>Range</th>
          <th>Distance</th>
          <th>Lap ${lapANum} Time</th>
          <th>Lap ${lapBNum} Time</th>
          <th>Delta</th>
          <th>% Diff</th>
          <th>Avg Speed (km/h)</th>
          <th>Avg Throttle</th>
          <th>Corners</th>
        </tr>
      </thead>
      <tbody>
        ${sectorRows}
      </tbody>
    </table>
  </div>
</body>
</html>
  `;
}

main().catch(console.error);
