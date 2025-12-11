import { NextRequest, NextResponse } from 'next/server';

let last = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  if (!lat || !lon) return NextResponse.json({ error: 'lat/lon required' }, { status: 400 });

  // Respect Nominatim public usage policy ~1 req/sec
  const now = Date.now();
  const delta = now - last;
  if (delta < 1100) await new Promise(r => setTimeout(r, 1100 - delta));
  last = Date.now();

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'GeoExplorer/1.0 (contact@example.com)' } });
  if (!res.ok) return NextResponse.json({ error: 'geocoding failed' }, { status: 502 });
  const j = await res.json();
  return NextResponse.json({
    display_name: j.display_name,
    country: j.address?.country,
    country_code: j.address?.country_code?.toUpperCase(),
    city: j.address?.city || j.address?.town || j.address?.village,
  });
}
