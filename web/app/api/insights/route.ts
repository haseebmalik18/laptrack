import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

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

    // Get track name from lap metadata
    const lapFiles = fs.readdirSync(lapsDir).filter(f => f.startsWith(`lap_${currentLap}_`) && f.endsWith('.json'));
    if (lapFiles.length === 0) {
      return NextResponse.json({ error: 'Lap not found' }, { status: 404 });
    }

    const lapMetadata = JSON.parse(fs.readFileSync(path.join(lapsDir, lapFiles[0]), 'utf-8'));
    const trackName = lapMetadata.trackName;
    const match = trackName.match(/\(([^)]+)\)/);
    const simpleName = match ? match[1].toLowerCase() : trackName.toLowerCase();

    // Load corners database
    const cornerDbPath = path.join(cornersDir, `${simpleName}.json`);
    if (!fs.existsSync(cornerDbPath)) {
      return NextResponse.json({ error: 'Corner database not found' }, { status: 404 });
    }

    // WIP: Insights generation not yet implemented
    // TODO: Integrate with GForceAnalyzer and SpeedComparisonAnalyzer
    // Will use corner database and comparison analysis to generate real insights
    const insights: any[] = [];

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights', details: String(error) },
      { status: 500 }
    );
  }
}
