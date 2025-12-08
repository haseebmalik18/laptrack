import { NextResponse } from 'next/server';

// Stub API route - insights feature not yet implemented
// TODO: Integrate with GForceAnalyzer and SpeedComparisonAnalyzer for multi-metric insights
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currentLap = searchParams.get('current');
  const referenceLap = searchParams.get('reference');

  if (!currentLap || !referenceLap) {
    return NextResponse.json(
      { error: 'Missing lap parameters' },
      { status: 400 }
    );
  }

  // Feature not yet implemented - return empty insights
  return NextResponse.json({ insights: [] });
}
