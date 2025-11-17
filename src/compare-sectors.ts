import { LapLoader, LapNormalizer, LapAligner, SectorAnalyzer } from './analysis';
import * as fs from 'fs';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: npx tsx src/compare-sectors.ts <lap-a-number> <lap-b-number>');
    console.log('Example: npx tsx src/compare-sectors.ts 1 2');
    process.exit(1);
  }

  const lapANum = parseInt(args[0]);
  const lapBNum = parseInt(args[1]);

  const loader = new LapLoader();
  const normalizer = new LapNormalizer({ sampleRate: 1.0 });
  const aligner = new LapAligner();
  const sectorAnalyzer = new SectorAnalyzer();

  console.log(`\n=== Sector Performance: Lap ${lapANum} vs Lap ${lapBNum} ===\n`);

  const availableLaps = loader.listAvailableLaps();
  const lapAInfo = availableLaps.find(l => l.lapNumber === lapANum);
  const lapBInfo = availableLaps.find(l => l.lapNumber === lapBNum);

  if (!lapAInfo || !lapBInfo) {
    console.error(`Lap not found`);
    process.exit(1);
  }

  const lapAMetadata = JSON.parse(fs.readFileSync(lapAInfo.filePath.replace('.csv', '.json'), 'utf-8'));
  const trackName = lapAMetadata.trackName || 'Unknown';

  console.log(`Track: ${trackName}`);
  console.log(`Loading and normalizing laps...\n`);

  const rawLapA = loader.loadLap(lapAInfo.filePath);
  const rawLapB = loader.loadLap(lapBInfo.filePath);

  const normalizedA = normalizer.normalize(rawLapA);
  const normalizedB = normalizer.normalize(rawLapB);

  const aligned = aligner.alignLaps(normalizedA, normalizedB);
  const analysis = sectorAnalyzer.analyzeSectors(aligned, trackName);

  console.log('=== SUMMARY ===');
  console.log(`Total Time Delta: ${sectorAnalyzer.formatTimeDelta(analysis.summary.totalTimeDelta)}`);
  console.log(`Best Sector: Sector ${analysis.summary.fastestSector.sectorNumber} (${sectorAnalyzer.formatTimeDelta(analysis.summary.fastestSector.timeDelta)})`);
  console.log(`Worst Sector: Sector ${analysis.summary.slowestSector.sectorNumber} (${sectorAnalyzer.formatTimeDelta(analysis.summary.slowestSector.timeDelta)})`);

  console.log(`\n=== SECTOR BREAKDOWN ===\n`);

  for (const sector of analysis.sectors) {
    const deltaColor = sectorAnalyzer.getDeltaColor(sector.timeDelta);
    const symbol = deltaColor === 'green' ? '✓' : deltaColor === 'red' ? '✗' : '=';

    console.log(`${symbol} SECTOR ${sector.sectorNumber} (${Math.round(sector.startDistance)}m - ${Math.round(sector.endDistance)}m)`);
    console.log(`  Distance: ${Math.round(sector.distance)}m`);
    console.log(`  Time Delta: ${sectorAnalyzer.formatTimeDelta(sector.timeDelta)} (${sector.timeGainPercentage > 0 ? '+' : ''}${sector.timeGainPercentage.toFixed(2)}%)`);
    console.log('');
    console.log(`  Lap ${lapANum}:`);
    console.log(`    Time: ${sector.lapA.time.toFixed(3)}s`);
    console.log(`    Avg Speed: ${sector.lapA.avgSpeed.toFixed(1)} km/h`);
    console.log(`    Speed Range: ${sector.lapA.minSpeed.toFixed(0)} - ${sector.lapA.maxSpeed.toFixed(0)} km/h`);
    console.log(`    Avg Throttle: ${(sector.lapA.avgThrottle * 100).toFixed(0)}%`);
    console.log(`    Avg Brake: ${(sector.lapA.avgBrake * 100).toFixed(0)}%`);
    console.log(`    Corners: ${sector.lapA.cornerCount}`);
    console.log('');
    console.log(`  Lap ${lapBNum}:`);
    console.log(`    Time: ${sector.lapB.time.toFixed(3)}s`);
    console.log(`    Avg Speed: ${sector.lapB.avgSpeed.toFixed(1)} km/h`);
    console.log(`    Speed Range: ${sector.lapB.minSpeed.toFixed(0)} - ${sector.lapB.maxSpeed.toFixed(0)} km/h`);
    console.log(`    Avg Throttle: ${(sector.lapB.avgThrottle * 100).toFixed(0)}%`);
    console.log(`    Avg Brake: ${(sector.lapB.avgBrake * 100).toFixed(0)}%`);
    console.log(`    Corners: ${sector.lapB.cornerCount}`);
    console.log('');
    console.log(`  Performance:`);
    console.log(`    Avg Speed Delta: ${sector.avgSpeedDelta > 0 ? '+' : ''}${sector.avgSpeedDelta.toFixed(1)} km/h`);
    console.log('');
  }

  console.log('=== INSIGHTS ===');

  if (analysis.summary.totalTimeDelta < 0) {
    console.log(`\n✓ Lap ${lapANum} was ${Math.abs(analysis.summary.totalTimeDelta).toFixed(3)}s faster than Lap ${lapBNum}`);
  } else if (analysis.summary.totalTimeDelta > 0) {
    console.log(`\n✗ Lap ${lapANum} was ${analysis.summary.totalTimeDelta.toFixed(3)}s slower than Lap ${lapBNum}`);
  } else {
    console.log(`\n= Laps were identical`);
  }

  const gainedSectors = analysis.sectors.filter(s => s.timeDelta < -0.01);
  const lostSectors = analysis.sectors.filter(s => s.timeDelta > 0.01);

  if (gainedSectors.length > 0) {
    console.log(`\nTime gained in ${gainedSectors.length} sector(s):`);
    gainedSectors.sort((a, b) => a.timeDelta - b.timeDelta).forEach(s => {
      console.log(`  Sector ${s.sectorNumber}: ${sectorAnalyzer.formatTimeDelta(s.timeDelta)} (${s.timeGainPercentage.toFixed(2)}%)`);
    });
  }

  if (lostSectors.length > 0) {
    console.log(`\nTime lost in ${lostSectors.length} sector(s):`);
    lostSectors.sort((a, b) => b.timeDelta - a.timeDelta).forEach(s => {
      console.log(`  Sector ${s.sectorNumber}: ${sectorAnalyzer.formatTimeDelta(s.timeDelta)} (${s.timeGainPercentage.toFixed(2)}%)`);
    });
  }

  console.log('');
}

main().catch(console.error);
