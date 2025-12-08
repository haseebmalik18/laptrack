import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { LapLoader } from '@analysis/lap-loader';
import { LapNormalizer } from '@analysis/lap-normalizer';
import { LapAligner } from '@analysis/lap-aligner';
import { SectorAnalyzer } from '@analysis/sector-analysis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currentLap = searchParams.get('current');
    const referenceLap = searchParams.get('reference');

    if (!currentLap || !referenceLap) {
      return NextResponse.json(
        { error: 'Missing lap parameters' },
        { status: 400 }
      );
    }

    const lapsDir = path.join(process.cwd(), '..', 'laps');
    const cornersDir = path.join(process.cwd(), '..', 'corners');

    const loader = new LapLoader(lapsDir);
    const normalizer = new LapNormalizer({ sampleRate: 1.0 });
    const aligner = new LapAligner();
    const sectorAnalyzer = new SectorAnalyzer(cornersDir);

    const availableLaps = loader.listAvailableLaps();
    const lapAInfo = availableLaps.find(l => l.lapNumber === parseInt(currentLap));
    const lapBInfo = availableLaps.find(l => l.lapNumber === parseInt(referenceLap));

    if (!lapAInfo || !lapBInfo) {
      return NextResponse.json({ error: 'Lap not found' }, { status: 404 });
    }

    const lapAMetadata = JSON.parse(fs.readFileSync(lapAInfo.filePath.replace('.csv', '.json'), 'utf-8'));
    const trackName = lapAMetadata.trackName || 'Unknown';

    const rawLapA = loader.loadLap(lapAInfo.filePath);
    const rawLapB = loader.loadLap(lapBInfo.filePath);

    const normalizedA = normalizer.normalize(rawLapA);
    const normalizedB = normalizer.normalize(rawLapB);

    const aligned = aligner.alignLaps(normalizedA, normalizedB);
    const analysis = sectorAnalyzer.analyzeSectors(aligned, trackName);

    const sectors = analysis.sectors.map((sector: any) => ({
      sector: sector.sectorNumber,
      current: sector.lapA.time,
      reference: sector.lapB.time,
      delta: sector.timeDelta,
    }));

    const totalCurrent = sectors.reduce((sum, s) => sum + s.current, 0);
    const totalRef = sectors.reduce((sum, s) => sum + s.reference, 0);
    const totalDelta = totalCurrent - totalRef;

    return NextResponse.json({
      sectors,
      total: {
        current: totalCurrent,
        reference: totalRef,
        delta: totalDelta,
      },
      metadata: {
        currentLap: parseInt(currentLap),
        referenceLap: parseInt(referenceLap),
        track: trackName,
      },
    });
  } catch (error) {
    console.error('Error generating sector times:', error);
    return NextResponse.json(
      { error: 'Failed to generate sector times', details: String(error) },
      { status: 500 }
    );
  }
}
