import { NextRequest, NextResponse } from 'next/server';
import { calculateDistance, calculateScore } from '@/lib/game/scoring';

type Body = {
  playerName?: string;
  mode?: 'classic'|'no-move'|'time-attack';
  rounds: number;
  // For this round/game summary
  totalScoreClient: number;
  // Current round data (optional if submitting per-round)
  actual?: { lat: number; lng: number };
  guess?: { lat: number; lng: number };
  timeSpentSec?: number;
  movementCount?: number; // clicks/steps
  pathMeters?: number; // approximate traversed distance
};

type Entry = {
  id: string;
  playerName: string;
  score: number;
  rounds: number;
  timestamp: number;
  averageDistance: number;
};

// In-memory leaderboard (non-persistent). Suitable for demo/local only.
const leaderboard: Entry[] = [];

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Body;
  const playerName = (body.playerName || 'Player').slice(0, 32);
  const mode = body.mode ?? 'classic';

  // Recompute score if round payload present
  let serverScore = 0;
  let avgDist = 0;
  let flagged = false;

  if (body.actual && body.guess) {
    const dist = calculateDistance(body.actual.lat, body.actual.lng, body.guess.lat, body.guess.lng);
    avgDist = dist;
    const s = calculateScore(dist);
    serverScore = s.score;

    // Anti-cheat heuristics
    const t = Math.max(0, Math.floor(body.timeSpentSec ?? 0));
    const moves = Math.max(0, Math.floor(body.movementCount ?? 0));
    const path = Math.max(0, Math.floor(body.pathMeters ?? 0));

    if (t < 2 && serverScore > 3000) flagged = true; // unlikely perfect in <2s
    if (mode === 'no-move' && (moves > 0 || path > 0)) flagged = true;
    if (serverScore >= 4800 && t < 4) flagged = true; // near-perfect very fast
  } else {
    // Fallback: trust client total if round not provided (less secure)
    serverScore = Math.max(0, Math.floor(body.totalScoreClient || 0));
    avgDist = 0;
  }

  const entry: Entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    playerName,
    score: serverScore,
    rounds: Math.max(1, Math.floor(body.rounds || 1)),
    timestamp: Date.now(),
    averageDistance: Math.round(avgDist),
  };

  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard.splice(0, 100); // keep top 100

  return NextResponse.json({ ok: true, entry, flagged });
}

export async function GET() {
  return NextResponse.json({ entries: leaderboard.slice(0, 100) });
}
