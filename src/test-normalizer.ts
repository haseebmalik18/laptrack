import { LapLoader, LapNormalizer, LapAligner } from './analysis';

console.log('LapLens - Phase 1 Test: Lap Normalization & Alignment\n');

const loader = new LapLoader();
const normalizer = new LapNormalizer({ sampleRate: 1.0 });
const aligner = new LapAligner();

console.log('Loading available laps...');
const laps = loader.listAvailableLaps();

if (laps.length === 0) {
  console.log('No laps found in ./laps directory');
  console.log('Run the listener and complete some laps first!');
  process.exit(0);
}

console.log(`Found ${laps.length} laps:\n`);
laps.forEach(lap => {
  console.log(`  Lap ${lap.lapNumber}: ${lap.pointCount} points`);
});

if (laps.length < 2) {
  console.log('\nNeed at least 2 laps to test alignment. Run more laps!');
  process.exit(0);
}

console.log('\nLoading Lap 1 and Lap 2...');
const lap1Raw = loader.loadLapByNumber(1);
const lap2Raw = loader.loadLapByNumber(2);

if (!lap1Raw || !lap2Raw) {
  console.log('Failed to load laps');
  process.exit(1);
}

console.log(`Lap 1: ${lap1Raw.length} raw points`);
console.log(`Lap 2: ${lap2Raw.length} raw points`);

console.log('\nNormalizing laps (1 sample per meter)...');
const lap1Normalized = normalizer.normalize(lap1Raw);
const lap2Normalized = normalizer.normalize(lap2Raw);

console.log(`Lap 1: ${lap1Normalized.length} normalized points`);
console.log(`Lap 2: ${lap2Normalized.length} normalized points`);

const trackLength1 = normalizer.getTrackLength(lap1Raw);
const trackLength2 = normalizer.getTrackLength(lap2Raw);

console.log(`\nTrack length (Lap 1): ${trackLength1.toFixed(2)}m`);
console.log(`Track length (Lap 2): ${trackLength2.toFixed(2)}m`);

console.log('\nAligning laps...');
const aligned = aligner.alignLaps(lap1Normalized, lap2Normalized);

console.log(`Aligned lap length: ${aligned.length.toFixed(2)}m`);
console.log(`Start distance: ${aligned.startDistance.toFixed(2)}m`);
console.log(`End distance: ${aligned.endDistance.toFixed(2)}m`);
console.log(`Lap A points: ${aligned.lapA.length}`);
console.log(`Lap B points: ${aligned.lapB.length}`);

console.log('\nPhase 1 complete! Laps are ready for delta analysis.');
