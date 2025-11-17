import { LapLoader, LapNormalizer, LapAligner, SpeedComparisonAnalyzer } from './analysis';
import * as fs from 'fs';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: npx tsx src/compare-speed.ts <lap-a-number> <lap-b-number>');
    console.log('Example: npx tsx src/compare-speed.ts 1 2');
    process.exit(1);
  }

  const lapANum = parseInt(args[0]);
  const lapBNum = parseInt(args[1]);

  const loader = new LapLoader();
  const normalizer = new LapNormalizer({ sampleRate: 1.0 });
  const aligner = new LapAligner();
  const speedAnalyzer = new SpeedComparisonAnalyzer();

  console.log(`\n=== Speed Comparison: Lap ${lapANum} vs Lap ${lapBNum} ===\n`);

  const availableLaps = loader.listAvailableLaps();
  const lapAInfo = availableLaps.find(l => l.lapNumber === lapANum);
  const lapBInfo = availableLaps.find(l => l.lapNumber === lapBNum);

  if (!lapAInfo) {
    console.error(`Lap ${lapANum} not found`);
    process.exit(1);
  }

  if (!lapBInfo) {
    console.error(`Lap ${lapBNum} not found`);
    process.exit(1);
  }

  const lapAMetadata = JSON.parse(fs.readFileSync(lapAInfo.filePath.replace('.csv', '.json'), 'utf-8'));
  const trackName = lapAMetadata.trackName || 'Unknown';

  console.log(`Track: ${trackName}`);
  console.log(`Loading laps...`);
  const rawLapA = loader.loadLap(lapAInfo.filePath);
  const rawLapB = loader.loadLap(lapBInfo.filePath);

  console.log(`Normalizing laps to 1 sample/meter...`);
  const normalizedA = normalizer.normalize(rawLapA);
  const normalizedB = normalizer.normalize(rawLapB);

  console.log(`Aligning laps...`);
  const aligned = aligner.alignLaps(normalizedA, normalizedB);

  console.log(`Analyzing speed comparison...\n`);
  const comparison = speedAnalyzer.compareSpeed(aligned, trackName);

  console.log('=== SUMMARY ===');
  console.log(`Total Time Delta: ${speedAnalyzer.formatTimeDelta(comparison.summary.totalTimeDelta)}`);
  console.log(`  Time in Corners: ${speedAnalyzer.formatTimeDelta(comparison.summary.timeGainedInCorners)}`);
  console.log(`  Time in Acceleration Zones: ${speedAnalyzer.formatTimeDelta(comparison.summary.timeGainedInAccelZones)}`);
  console.log(`\nSpeed Statistics:`);
  console.log(`  Average Speed Delta: ${comparison.summary.avgSpeedDelta.toFixed(2)} km/h`);
  console.log(`  Max Speed Delta: ${comparison.summary.maxSpeedDelta.toFixed(2)} km/h at ${Math.round(comparison.summary.maxSpeedDeltaDistance)}m`);

  const fastCorner = comparison.corners.find(c => c.cornerNumber === comparison.summary.fastestCornerGain.cornerNumber);
  const slowCorner = comparison.corners.find(c => c.cornerNumber === comparison.summary.slowestCornerLoss.cornerNumber);

  console.log(`\nBest Corner: #${comparison.summary.fastestCornerGain.cornerNumber} (${speedAnalyzer.formatTimeDelta(comparison.summary.fastestCornerGain.timeDelta)})`);
  console.log(`Worst Corner: #${comparison.summary.slowestCornerLoss.cornerNumber} (${speedAnalyzer.formatTimeDelta(comparison.summary.slowestCornerLoss.timeDelta)})`);

  console.log(`\n=== CORNER-BY-CORNER BREAKDOWN ===\n`);

  for (const corner of comparison.corners) {
    const deltaColor = speedAnalyzer.getDeltaColor(corner.timeDelta);
    const symbol = deltaColor === 'green' ? '✓' : deltaColor === 'red' ? '✗' : '=';

    console.log(`${symbol} Corner ${corner.cornerNumber} (${corner.entryDistance}m - ${corner.exitDistance}m)`);
    console.log(`  Time Delta: ${speedAnalyzer.formatTimeDelta(corner.timeDelta)}`);
    console.log(`  Entry Speed: ${corner.entrySpeed.lapA.toFixed(1)} vs ${corner.entrySpeed.lapB.toFixed(1)} km/h (${corner.entrySpeed.delta > 0 ? '+' : ''}${corner.entrySpeed.delta.toFixed(1)})`);
    console.log(`  Apex Speed:  ${corner.apexSpeed.lapA.toFixed(1)} vs ${corner.apexSpeed.lapB.toFixed(1)} km/h (${corner.apexSpeed.delta > 0 ? '+' : ''}${corner.apexSpeed.delta.toFixed(1)})`);
    console.log(`  Exit Speed:  ${corner.exitSpeed.lapA.toFixed(1)} vs ${corner.exitSpeed.lapB.toFixed(1)} km/h (${corner.exitSpeed.delta > 0 ? '+' : ''}${corner.exitSpeed.delta.toFixed(1)})`);
    console.log(`  Min Speed:   ${corner.minSpeed.lapA.toFixed(1)} vs ${corner.minSpeed.lapB.toFixed(1)} km/h (${corner.minSpeed.delta > 0 ? '+' : ''}${corner.minSpeed.delta.toFixed(1)})`);

    if (corner.brakingComparison) {
      console.log(`  Braking Point Speed: ${corner.brakingComparison.brakingPoint.lapA.toFixed(1)} vs ${corner.brakingComparison.brakingPoint.lapB.toFixed(1)} km/h`);
      console.log(`  Peak Brake: ${(corner.brakingComparison.peakBrake.lapA * 100).toFixed(0)}% vs ${(corner.brakingComparison.peakBrake.lapB * 100).toFixed(0)}%`);
    }
    console.log('');
  }

  if (comparison.accelerationZones.length > 0) {
    console.log(`=== ACCELERATION ZONES ===\n`);

    for (let i = 0; i < comparison.accelerationZones.length; i++) {
      const zone = comparison.accelerationZones[i];
      const deltaColor = speedAnalyzer.getDeltaColor(zone.timeDelta);
      const symbol = deltaColor === 'green' ? '✓' : deltaColor === 'red' ? '✗' : '=';

      const beforeCorner = zone.precedingCorner ? `after T${zone.precedingCorner}` : 'start';
      const afterCorner = zone.followingCorner ? `before T${zone.followingCorner}` : 'finish';

      console.log(`${symbol} Zone ${i + 1}: ${Math.round(zone.startDistance)}m - ${Math.round(zone.endDistance)}m (${beforeCorner} → ${afterCorner})`);
      console.log(`  Time Delta: ${speedAnalyzer.formatTimeDelta(zone.timeDelta)}`);
      console.log(`  Start Speed: ${zone.startSpeed.lapA.toFixed(1)} vs ${zone.startSpeed.lapB.toFixed(1)} km/h`);
      console.log(`  End Speed:   ${zone.endSpeed.lapA.toFixed(1)} vs ${zone.endSpeed.lapB.toFixed(1)} km/h`);
      console.log(`  Avg Accel:   ${zone.avgAcceleration.lapA.toFixed(2)} vs ${zone.avgAcceleration.lapB.toFixed(2)} m/s²`);
      console.log(`  Avg Throttle: ${(zone.avgThrottle.lapA * 100).toFixed(0)}% vs ${(zone.avgThrottle.lapB * 100).toFixed(0)}%`);
      console.log('');
    }
  }

  console.log('=== INSIGHTS ===');

  if (comparison.summary.totalTimeDelta < 0) {
    console.log(`\n✓ Lap ${lapANum} was ${Math.abs(comparison.summary.totalTimeDelta).toFixed(3)}s faster than Lap ${lapBNum}`);
  } else if (comparison.summary.totalTimeDelta > 0) {
    console.log(`\n✗ Lap ${lapANum} was ${comparison.summary.totalTimeDelta.toFixed(3)}s slower than Lap ${lapBNum}`);
  } else {
    console.log(`\n= Laps were identical`);
  }

  const cornerTimeLost = comparison.corners.filter(c => c.timeDelta > 0.05);
  const cornerTimeGained = comparison.corners.filter(c => c.timeDelta < -0.05);

  if (cornerTimeGained.length > 0) {
    console.log(`\nTime gained in ${cornerTimeGained.length} corner(s):`);
    cornerTimeGained.sort((a, b) => a.timeDelta - b.timeDelta).forEach(c => {
      console.log(`  Corner ${c.cornerNumber}: ${speedAnalyzer.formatTimeDelta(c.timeDelta)}`);
    });
  }

  if (cornerTimeLost.length > 0) {
    console.log(`\nTime lost in ${cornerTimeLost.length} corner(s):`);
    cornerTimeLost.sort((a, b) => b.timeDelta - a.timeDelta).forEach(c => {
      console.log(`  Corner ${c.cornerNumber}: ${speedAnalyzer.formatTimeDelta(c.timeDelta)}`);
    });
  }

  console.log('');
}

main().catch(console.error);
