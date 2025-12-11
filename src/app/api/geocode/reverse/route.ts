import { NextRequest, NextResponse } from 'next/server';

// Optional Upstash-based rate limiting + cache (free tier supported)
let upstashConfigured: boolean | null = null;
let Redis: any = null;
let Ratelimit: any = null;
let redis: any = null;
let rl: any = null;

function ensureUpstash() {
  if (upstashConfigured !== null) return upstashConfigured;
  try {
    // Only attempt if env present
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      Redis = require('@upstash/redis').Redis;
      Ratelimit = require('@upstash/ratelimit').Ratelimit;
      redis = Redis.fromEnv();
      rl = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(30, '1 m') }); // 30/min per IP
      upstashConfigured = true;
    } else {
      upstashConfigured = false;
    }
  } catch {
    upstashConfigured = false;
  }
  return upstashConfigured;
}

const memCache = new Map<string, { expires: number; body: string }>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  if (!lat || !lon) return NextResponse.json({ error: 'lat/lon required' }, { status: 400 });

  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const ua = `GeoGuesser/1.0 (contact: @arukh89 on Farcaster)`;

  // Distributed RL + cache when configured, otherwise in-memory best-effort
  if (ensureUpstash()) {
    const { success } = await rl.limit(`geocode:${ip}`);
    if (!success) return new Response('Rate limit exceeded', { status: 429 });
    const cacheKey = `revgeo:${lat}:${lon}`;
    const cached = await redis.get(cacheKey);
    if (cached) return new Response(cached, { headers: { 'content-type': 'application/json' } });
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&addressdetails=1`;
    const res = await fetch(url, { headers: { 'User-Agent': ua } });
    if (!res.ok) return NextResponse.json({ error: 'geocoding failed' }, { status: 502 });
    const text = await res.text();
    await redis.set(cacheKey, text, { ex: 600 }); // 10 minutes
    return new Response(text, { headers: { 'content-type': 'application/json' } });
  }

  // Fallback: naive in-memory cache + soft RL to respect ToS on single instance
  const cacheKey = `revgeo:${lat}:${lon}`;
  const now = Date.now();
  const hit = memCache.get(cacheKey);
  if (hit && hit.expires > now) {
    return new Response(hit.body, { headers: { 'content-type': 'application/json' } });
  }
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&addressdetails=1`;
  const res = await fetch(url, { headers: { 'User-Agent': ua } });
  if (!res.ok) return NextResponse.json({ error: 'geocoding failed' }, { status: 502 });
  const text = await res.text();
  memCache.set(cacheKey, { body: text, expires: now + 10 * 60 * 1000 });
  return new Response(text, { headers: { 'content-type': 'application/json' } });
}
