import { NextRequest, NextResponse } from 'next/server';
import { getRandomLocations } from '@/lib/game/locations';

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export async function GET(req: NextRequest) {
  const origin = new URL(req.url).origin;
  // Try a few random samples against Mapillary coverage; fall back to curated list
  const tries = 8;
  for (let i = 0; i < tries; i++) {
    const lat = rand(-55, 75); // bias away from poles/oceans a bit
    const lon = rand(-180, 180);
    try {
      const resp = await fetch(`${origin}/api/imagery/mapillary?lat=${lat}&lon=${lon}`, { cache: 'no-store' });
      if (resp.ok) {
        const j = await resp.json();
        if (j?.found && j?.imageId && typeof j.lat === 'number' && typeof j.lon === 'number') {
          return NextResponse.json({ found: true, provider: 'mapillary', imageId: j.imageId, lat: j.lat, lon: j.lon });
        }
      }
    } catch {}
  }

  // Fallback to a curated static panorama image as a playable experience
  const [loc] = getRandomLocations(1);
  if (loc) {
    return NextResponse.json({ found: true, provider: 'kartaview', imageUrl: loc.panoramaUrl, lat: loc.lat, lon: loc.lng });
  }

  return NextResponse.json({ found: false });
}
