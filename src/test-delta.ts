import { LapLoader, LapNormalizer, LapAligner, DeltaTimeCalculator } from './analysis';
import chalk from 'chalk';

async function testDelta() {
  const loader = new LapLoader();
  const normalizer = new LapNormalizer();
  const aligner = new LapAligner();
  const deltaCalc = new DeltaTimeCalculator();

  console.log(chalk.cyan('Delta Time Analysis Test\n'));

  const laps = loader.listAvailableLaps();

  if (laps.length < 2) {
    console.log(chalk.red('Need at least 2 laps to compare'));
    return;
  }

  console.log(chalk.gray(`Found ${laps.length} laps\n`));

  const lap1 = loader.loadLapByNumber(laps[0].lapNumber);
  const lap2 = loader.loadLapByNumber(laps[1].lapNumber);

  if (!lap1 || !lap2) {
    console.log(chalk.red('Failed to load laps'));
    return;
  }

  console.log(chalk.yellow('Normalizing laps...'));
  const normalized1 = normalizer.normalize(lap1);
  const normalized2 = normalizer.normalize(lap2);

  console.log(chalk.gray(`Lap ${laps[0].lapNumber}: ${normalized1.length} points`));
  console.log(chalk.gray(`Lap ${laps[1].lapNumber}: ${normalized2.length} points\n`));

  console.log(chalk.yellow('Aligning laps...'));
  const aligned = aligner.alignLaps(normalized1, normalized2);

  console.log(chalk.gray(`Aligned range: ${aligned.startDistance.toFixed(0)}m - ${aligned.endDistance.toFixed(0)}m`));
  console.log(chalk.gray(`Length: ${aligned.length.toFixed(0)}m (${aligned.lapA.length} points)\n`));

  console.log(chalk.yellow('Calculating delta time...'));
  const delta = deltaCalc.calculateDelta(aligned);

  console.log(chalk.cyan('\nDelta Analysis Summary\n'));
  console.log(`Total time difference: ${chalk.bold(deltaCalc.formatDelta(delta.summary.totalTimeDifference))}`);
  console.log(`Average delta: ${deltaCalc.formatDelta(delta.summary.averageDelta)}\n`);

  console.log(chalk.green(`Best gain: ${deltaCalc.formatDelta(delta.summary.maxGain)} at ${delta.summary.maxGainDistance.toFixed(0)}m`));
  console.log(chalk.red(`Worst loss: ${deltaCalc.formatDelta(delta.summary.maxLoss)} at ${delta.summary.maxLossDistance.toFixed(0)}m\n`));

  console.log(chalk.cyan('Sample Delta Points:\n'));

  const samplePoints = [0, Math.floor(delta.points.length * 0.25), Math.floor(delta.points.length * 0.5), Math.floor(delta.points.length * 0.75), delta.points.length - 1];

  samplePoints.forEach((i) => {
    const p = delta.points[i];
    const deltaStr = deltaCalc.formatDelta(p.deltaTime);
    const color = p.deltaTime < 0 ? chalk.green : p.deltaTime > 0 ? chalk.red : chalk.gray;

    console.log(`${p.distance.toFixed(0).padStart(5)}m: ${color(deltaStr.padStart(9))} | Speed: ${p.lapASpeed.toFixed(1)} vs ${p.lapBSpeed.toFixed(1)} km/h`);
  });

  console.log(chalk.cyan('\nDelta calculation complete!\n'));
}

testDelta().catch(console.error);
