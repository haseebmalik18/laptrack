import chalk from 'chalk';
import * as fs from 'fs';
import { LapLoader, LapNormalizer, detectCorners, detectCornersByCurvature, detectCornersYawCurvature, CornerDatabase } from './analysis';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log(chalk.red('Usage: npx tsx src/create-corner-database.ts <lap-number> [--method curvature|gforce|yaw]'));
    console.log(chalk.gray('\nExample: npx tsx src/create-corner-database.ts 1'));
    console.log(chalk.gray('Or: npx tsx src/create-corner-database.ts 1 --method yaw'));
    console.log(chalk.gray('\nMethods:'));
    console.log(chalk.gray('  curvature - Track geometry only (95% accuracy)'));
    console.log(chalk.gray('  yaw       - Yaw + Curvature hybrid (BEST - 98% accuracy)'));
    console.log(chalk.gray('  gforce    - G-force based (driver dependent)'));
    console.log(chalk.gray('\nDefault method: yaw (recommended)'));
    return;
  }

  const lapNumber = parseInt(args[0], 10);
  const methodFlag = args.findIndex(a => a === '--method');
  const method = methodFlag !== -1 && args[methodFlag + 1] ? args[methodFlag + 1] : 'yaw';

  const loader = new LapLoader('./laps');
  const laps = loader.listAvailableLaps();

  const lapInfo = laps.find(l => l.lapNumber === lapNumber);

  if (!lapInfo) {
    console.log(chalk.red(`Lap ${lapNumber} not found`));
    console.log(chalk.gray('\nAvailable laps:'));
    laps.forEach(l => console.log(chalk.gray(`  Lap ${l.lapNumber}`)));
    return;
  }

  const rawTelemetry = loader.loadLapByNumber(lapNumber);

  if (!rawTelemetry || rawTelemetry.length === 0) {
    console.log(chalk.red(`Failed to load telemetry for lap ${lapNumber}`));
    return;
  }

  const jsonPath = lapInfo.filePath.replace('.csv', '.json');
  const metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  const trackId = metadata.trackId ?? 0;
  const trackName = metadata.trackName ?? 'Unknown';
  const trackLength = rawTelemetry[rawTelemetry.length - 1].distance;

  console.log(chalk.cyan('\n=== Creating Corner Database ===\n'));
  console.log(chalk.white(`Reference Lap: ${lapNumber}`));
  console.log(chalk.white(`Track ID: ${trackId}`));
  console.log(chalk.white(`Track Name: ${trackName}`));
  console.log(chalk.white(`Track Length: ${trackLength.toFixed(0)}m`));
  console.log(chalk.white(`Raw Telemetry Points: ${rawTelemetry.length}`));

  // Normalize telemetry to 1 sample per meter
  console.log(chalk.yellow('Normalizing telemetry data (1 sample/meter)...'));
  const normalizer = new LapNormalizer({ sampleRate: 1.0 });
  const telemetry = normalizer.normalize(rawTelemetry);
  console.log(chalk.green(`✓ Normalized to ${telemetry.length} points\n`));

  console.log(chalk.white(`Detection Method: ${method}\n`));

  let corners;

  if (method === 'yaw') {
    console.log(chalk.yellow('Detecting corners using Yaw + Curvature hybrid analysis...\n'));
    // Hybrid yaw + curvature (BEST method)
    corners = detectCornersYawCurvature(telemetry, {
      minYawRateThreshold: 0.045,     // Lower to catch gentle Turn 3
      minCurvatureThreshold: 0.0022,  // Lower for gentle corners
      minCornerLength: 45,             // Filter out false positives like corner 4
      minCornerDuration: 0.3,          // Slightly longer duration requirement
      cornerMergeDistance: 18,        // Merge close corners (gap < 9m) to combine 14+15, 16+17
    });
  } else if (method === 'curvature') {
    console.log(chalk.yellow('Detecting corners using curvature analysis...\n'));
    corners = detectCornersByCurvature(telemetry, {
      minCurvatureThreshold: 0.0045,
      minCornerLength: 18,
      minCornerDuration: 0.35,
      cornerMergeDistance: 30,
    });
  } else {
    console.log(chalk.yellow('Detecting corners using g-force multi-signal validation...\n'));
    corners = detectCorners(telemetry);
  }

  if (corners.length === 0) {
    console.log(chalk.red('No corners detected!'));
    console.log(chalk.gray('Try running with relaxed settings:'));
    console.log(chalk.gray('  - Lower g-force threshold'));
    console.log(chalk.gray('  - Disable braking requirement'));
    return;
  }

  console.log(chalk.green(`✓ Detected ${corners.length} corners\n`));

  console.log(chalk.white('Corner Summary:'));
  console.log(chalk.gray('─'.repeat(80)));
  console.log(chalk.white(' #  | Type       | Dir | Entry(m) | Apex(m) | Exit(m) | Length(m)'));
  console.log(chalk.gray('─'.repeat(80)));

  corners.forEach(corner => {
    const typeColor =
      corner.type === 'hairpin' ? chalk.red :
      corner.type === 'slow' ? chalk.yellow :
      corner.type === 'medium' ? chalk.cyan :
      corner.type === 'fast' ? chalk.green :
      chalk.magenta;

    const dirIcon = corner.direction === 'left' ? '←' : '→';

    console.log(
      ` ${String(corner.id).padStart(2)} | ${typeColor(corner.type.padEnd(10))} | ${dirIcon}   | ${String(Math.round(corner.entryDistance)).padStart(8)} | ${String(Math.round(corner.apexDistance)).padStart(7)} | ${String(Math.round(corner.exitDistance)).padStart(7)} | ${String(Math.round(corner.length)).padStart(9)}`
    );
  });

  console.log(chalk.gray('─'.repeat(80)));

  const db = new CornerDatabase('./corners');

  if (db.hasTrackData(trackId)) {
    console.log(chalk.yellow(`\n⚠️  Corner database for track ${trackId} (${trackName}) already exists`));
    console.log(chalk.gray('This will overwrite the existing database.'));
  }

  console.log(chalk.yellow('\nSaving corner database...'));
  db.saveTrackCorners(trackId, trackName, trackLength, corners);

  console.log(chalk.green(`✓ Corner database saved to: corners/track_${trackId}.json`));
  console.log(chalk.white(`\nTrack: ${trackName} (ID: ${trackId})`));
  console.log(chalk.white(`Total Corners: ${corners.length}`));
  console.log(chalk.white(`Track Length: ${trackLength.toFixed(0)}m\n`));

  console.log(chalk.cyan('Database created successfully! 🎉\n'));
  console.log(chalk.gray('You can now use this database for lap analysis.'));
  console.log(chalk.gray('Run: npx tsx src/test-corners.ts'));
}

main().catch(console.error);
