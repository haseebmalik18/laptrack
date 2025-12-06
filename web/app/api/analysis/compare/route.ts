import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { SpeedComparisonAnalyzer } from '../../../../../src/analysis/speed-comparison';
import { SectorAnalyzer } from '../../../../../src/analysis/sector-analysis';
import { GForceAnalyzer } from '../../../../../src/analysis/gforce-analysis';
import { LapLoader } from '../../../../../src/analysis/lap-loader';
import { LapAligner } from '../../../../../src/analysis/lap-aligner';
import { LapNormalizer } from '../../../../../src/analysis/lap-normalizer';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lapANum = parseInt(searchParams.get('lapA') || '');
    const lapBNum = parseInt(searchParams.get('lapB') || '');
    const type = searchParams.get('type') || 'speed';

    if (isNaN(lapANum) || isNaN(lapBNum)) {
      return NextResponse.json(
        { error: 'Invalid lap numbers' },
        { status: 400 }
      );
    }

    // Initialize paths
    const lapsDir = path.join(process.cwd(), '..', 'laps');
    const cornersDir = path.join(process.cwd(), '..', 'corners');

    // Initialize analyzers
    const loader = new LapLoader(lapsDir);
    const normalizer = new LapNormalizer({ sampleRate: 1.0 });
    const aligner = new LapAligner();

    // Load laps
    const availableLaps = loader.listAvailableLaps();
    const lapAInfo = availableLaps.find(l => l.lapNumber === lapANum);
    const lapBInfo = availableLaps.find(l => l.lapNumber === lapBNum);

    if (!lapAInfo || !lapBInfo) {
      return NextResponse.json(
        { error: 'Lap not found' },
        { status: 404 }
      );
    }

    // Get track name from metadata
    const lapAMetadata = JSON.parse(
      fs.readFileSync(lapAInfo.filePath.replace('.csv', '.json'), 'utf-8')
    );
    const trackName = lapAMetadata.trackName || 'Unknown';

    // Load and process laps
    const rawLapA = loader.loadLap(lapAInfo.filePath);
    const rawLapB = loader.loadLap(lapBInfo.filePath);

    const normalizedA = normalizer.normalize(rawLapA);
    const normalizedB = normalizer.normalize(rawLapB);

    const aligned = aligner.alignLaps(normalizedA, normalizedB);

    // Run analysis based on type
    let comparisonData;
    if (type === 'speed') {
      const analyzer = new SpeedComparisonAnalyzer({ cornerDbPath: cornersDir });
      const analysis = analyzer.compareSpeed(aligned, trackName);
      comparisonData = transformSpeedComparison(analysis);
    } else if (type === 'sector') {
      const analyzer = new SectorAnalyzer(cornersDir);
      const analysis = analyzer.analyzeSectors(aligned, trackName);
      comparisonData = transformSectorComparison(analysis);
    } else if (type === 'gforce') {
      const analyzer = new GForceAnalyzer({ cornerDbPath: cornersDir });
      const analysis = analyzer.analyzeGForces(aligned, trackName);
      comparisonData = transformGForceComparison(analysis);
    } else {
      return NextResponse.json(
        { error: 'Invalid analysis type' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      type,
      comparison: comparisonData,
    });
  } catch (error) {
    console.error('Error in comparison analysis:', error);
    return NextResponse.json(
      { error: 'Failed to perform analysis' },
      { status: 500 }
    );
  }
}

// Transform functions to match frontend data format

function transformSpeedComparison(analysis: any) {
  return {
    cornerComparison: analysis.corners.map((corner: any) => ({
      corner: corner.cornerNumber,
      lapA: {
        entry: corner.entrySpeed.lapA,
        apex: corner.apexSpeed.lapA,
        exit: corner.exitSpeed.lapA,
        min: corner.minSpeed.lapA,
      },
      lapB: {
        entry: corner.entrySpeed.lapB,
        apex: corner.apexSpeed.lapB,
        exit: corner.exitSpeed.lapB,
        min: corner.minSpeed.lapB,
      },
      delta: {
        entry: corner.entrySpeed.delta,
        apex: corner.apexSpeed.delta,
        exit: corner.exitSpeed.delta,
        min: corner.minSpeed.delta,
        time: corner.timeDelta,
      },
    })),
    accelerationZones: analysis.accelerationZones.map((zone: any, idx: number) => ({
      zone: idx + 1,
      lapA: {
        entrySpeed: zone.startSpeed.lapA,
        exitSpeed: zone.endSpeed.lapA,
        speedGain: zone.endSpeed.lapA - zone.startSpeed.lapA,
        duration: zone.duration.lapA,
      },
      lapB: {
        entrySpeed: zone.startSpeed.lapB,
        exitSpeed: zone.endSpeed.lapB,
        speedGain: zone.endSpeed.lapB - zone.startSpeed.lapB,
        duration: zone.duration.lapB,
      },
      delta: {
        entrySpeed: zone.startSpeed.delta,
        exitSpeed: zone.endSpeed.delta,
        time: zone.timeDelta,
      },
    })),
    summary: {
      totalTimeDelta: analysis.summary.totalTimeDelta,
      avgSpeedDelta: analysis.summary.avgSpeedDelta,
      timeInCorners: analysis.summary.timeGainedInCorners,
      timeInAcceleration: analysis.summary.timeGainedInAccelZones,
      cornersAnalyzed: analysis.corners.length,
      accelZones: analysis.accelerationZones.length,
    },
  };
}

function transformSectorComparison(analysis: any) {
  return {
    sectors: analysis.sectors.map((sector: any) => ({
      sector: sector.sectorNumber,
      lapA: {
        time: sector.lapA.time,
        avgSpeed: sector.lapA.avgSpeed,
        corners: sector.lapA.cornerCount,
        avgThrottle: sector.lapA.avgThrottle,
        avgBrake: sector.lapA.avgBrake,
      },
      lapB: {
        time: sector.lapB.time,
        avgSpeed: sector.lapB.avgSpeed,
        corners: sector.lapB.cornerCount,
        avgThrottle: sector.lapB.avgThrottle,
        avgBrake: sector.lapB.avgBrake,
      },
      delta: {
        time: sector.timeDelta,
        percentage: sector.timeGainPercentage,
        avgSpeed: sector.avgSpeedDelta,
      },
    })),
    summary: {
      totalDelta: analysis.summary.totalTimeDelta,
      bestSector: analysis.summary.fastestSector.sectorNumber,
      bestSectorDelta: analysis.summary.fastestSector.timeDelta,
      worstSector: analysis.summary.slowestSector.sectorNumber,
      worstSectorDelta: analysis.summary.slowestSector.timeDelta,
    },
  };
}

function transformGForceComparison(analysis: any) {
  return {
    cornerComparison: analysis.corners.map((corner: any) => ({
      corner: corner.cornerNumber,
      lapA: {
        peakLateral: corner.peakLateralG.lapA,
        peakLongitudinal: Math.max(
          Math.abs(corner.peakBrakingG.lapA),
          Math.abs(corner.peakAccelG.lapA)
        ),
        peakCombined: corner.peakCombinedG.lapA,
        avgLateral: corner.avgLateralG.lapA,
        consistency: 1.0 - corner.lateralGStdDev.lapA,
      },
      lapB: {
        peakLateral: corner.peakLateralG.lapB,
        peakLongitudinal: Math.max(
          Math.abs(corner.peakBrakingG.lapB),
          Math.abs(corner.peakAccelG.lapB)
        ),
        peakCombined: corner.peakCombinedG.lapB,
        avgLateral: corner.avgLateralG.lapB,
        consistency: 1.0 - corner.lateralGStdDev.lapB,
      },
      delta: {
        peakLateral: corner.peakLateralG.delta,
        peakLongitudinal: corner.peakBrakingG.delta,
        peakCombined: corner.peakCombinedG.delta,
        avgLateral: corner.avgLateralG.delta,
      },
    })),
    insights: analysis.corners
      .filter((corner: any) => corner.insight)
      .map((corner: any) => ({
        corner: corner.cornerNumber,
        insight: corner.insight.type,
        recommendation: corner.insight.recommendation || corner.insight.message,
        confidence: corner.insight.confidence,
      })),
    summary: {
      avgLateralGA: analysis.summary.avgLateralG.lapA,
      avgLongitudinalGA: Math.max(
        Math.abs(analysis.summary.avgBrakingG.lapA),
        Math.abs(analysis.summary.avgAccelG.lapA)
      ),
      peakCombinedGA: analysis.summary.peakLateralG.lapA,
    },
  };
}
