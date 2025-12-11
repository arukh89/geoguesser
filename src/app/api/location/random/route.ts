import { NextResponse } from 'next/server';
import { isOnLand } from '@/lib/geo/landmask';

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export async function GET() {
  try {
    // Try up to N random samples until we find land
    for (let i = 0; i < 40; i++) {
      const lat = rand(-80, 80);
      const lon = rand(-180, 180);
      // Ensure land-only if dataset loads; fallback allows anywhere
      const ok = await isOnLand(lat, lon);
      if (ok) {
        return NextResponse.json({ found: true, lat, lon }, { status: 200 });
      }
    }
    // If we fail to find land, report not found
    return NextResponse.json({ found: false }, { status: 200 });
  } catch {
    return NextResponse.json({ found: false }, { status: 200 });
  }
}
