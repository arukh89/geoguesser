import { NextRequest, NextResponse } from 'next/server';
import { isOnLand } from '@/lib/geo/landmask';

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

async function findMapillaryNear(lat: number, lon: number) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const r = await fetch(`${base}/api/imagery/mapillary?lat=${lat}&lon=${lon}`, { cache: 'no-store' });
  if (!r.ok) return null;
  const j = await r.json();
  return j?.found ? j : null;
}

async function findKartaViewInBBox(lat: number, lon: number, km = 5) {
  const d = km / 111; // deg approx
  const south = lat - d, north = lat + d, west = lon - d, east = lon + d;
  try {
    const url = `https://kartaview.org/1.0/photos/?bbox=${west},${south},${east},${north}&limit=50`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const items = data?.currentPageItems ?? [];
    if (!items.length) return null;
    const pick = items[Math.floor(Math.random() * items.length)];
    return {
      found: true,
      provider: 'kartaview',
      imageUrl: pick.largestImage ?? pick.image_url,
      lat: pick.lat,
      lon: pick.lng,
    };
  } catch { return null; }
}

export async function GET(_req: NextRequest) {
  // Try multiple random land samples to find a nearby Mapillary image
  for (let i = 0; i < 40; i++) {
    const lat = rand(-60, 75); // avoid extreme poles for better coverage odds
    const lon = rand(-180, 180);
    if (!(await isOnLand(lat, lon))) continue;
    const mly = await findMapillaryNear(lat, lon);
    if (mly) return NextResponse.json(mly);
  }
  // Fallback: try KartaView near a random land point with a larger bbox
  for (let i = 0; i < 20; i++) {
    const flat = rand(-60, 75), flon = rand(-180, 180);
    if (!(await isOnLand(flat, flon))) continue;
    const kv = await findKartaViewInBBox(flat, flon, 20);
    if (kv) return NextResponse.json(kv);
  }
  return NextResponse.json({ found: false });
}
