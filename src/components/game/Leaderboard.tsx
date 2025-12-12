"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/game/types";
import { DbConnection, type SubscriptionHandle } from "@/spacetime";

interface LeaderboardProps {
  currentScore?: number;
}

export default function Leaderboard({ currentScore }: LeaderboardProps) {
  const [remoteEntries, setRemoteEntries] = useState<LeaderboardEntry[] | null>(null);
  const subRef = useRef<SubscriptionHandle | null>(null);
  const connRef = useRef<InstanceType<typeof DbConnection> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const connect = async () => {
      try {
        const uri = process.env.NEXT_PUBLIC_STDB_URI ?? "http://127.0.0.1:3000";
        const conn = DbConnection.builder().withUri(uri).withModuleName("leaderboard").withLightMode(true).build();
        connRef.current = conn;

        const snapshot = () => {
          const rows = Array.from(conn.db.score.iter());
          const mapped: LeaderboardEntry[] = rows.map((r: any, idx: number) => ({
            id: `${r.playerName}-${String(r.tsMs ?? 0)}-${idx}`,
            playerName: r.playerName,
            score: Number(r.scoreValue ?? 0),
            rounds: Number(r.rounds ?? 0),
            timestamp: Number(r.tsMs ?? 0),
            averageDistance: Number(r.averageDistance ?? 0),
          }));
          if (!cancelled) setRemoteEntries(mapped);
        };

        // Keep state updated on table changes
        const onAny = () => snapshot();
        conn.db.score.onInsert(onAny);
        conn.db.score.onDelete(onAny);
        // Some tables may support onUpdate depending on PK; safe to try
        // @ts-ignore optional
        if ("onUpdate" in conn.db.score) (conn.db.score as any).onUpdate(() => snapshot());

        // Subscribe to bring initial rows into the client cache
        const sub = conn
          .subscriptionBuilder()
          .onApplied(() => snapshot())
          .onError(() => {
            if (!cancelled) setRemoteEntries(null);
          })
          .subscribe("SELECT * FROM score");
        subRef.current = sub;
      } catch (e) {
        console.error("SpacetimeDB leaderboard subscribe failed:", e);
        if (!cancelled) setRemoteEntries(null);
      }
    };
    connect();
    return () => {
      cancelled = true;
      try {
        subRef.current?.unsubscribe();
      } catch {}
      try {
        connRef.current?.disconnect();
      } catch {}
      subRef.current = null;
      connRef.current = null;
    };
  }, []);

  const sortedEntries = useMemo(() => {
    const list = remoteEntries ?? [];
    return [...list].sort((a, b) => b.score - a.score).slice(0, 10);
  }, [remoteEntries]);

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-[var(--accent)]" />;
      case 2:
        return <Medal className="w-6 h-6 text-[color:rgba(151,255,151,0.85)]" />;
      case 3:
        return <Award className="w-6 h-6 text-[var(--accent)]" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-[color:rgba(151,255,151,0.7)] font-semibold">{rank}</div>;
    }
  };

  const getRankColor = (rank: number): string =>
    'bg-[rgba(0,255,65,0.06)] border-[rgba(0,255,65,0.25)]';

  return (
    <Card className="mx-panel border mx-border shadow-[var(--shadow)]">
      <CardHeader className="border-b mx-border text-[var(--text)] bg-[rgba(0,255,65,0.06)]">
        <CardTitle className="text-2xl flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          {remoteEntries && remoteEntries.length > 0 ? "Live Leaderboard" : "Leaderboard (connect STDB)"}
        </CardTitle>
        <CardDescription>
          {remoteEntries && remoteEntries.length > 0
            ? "Real-time scores from SpacetimeDB"
            : "No data. Start SpacetimeDB to enable live leaderboard."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 text-[var(--text)]">
        {sortedEntries.length === 0 ? (
          <div className="text-center py-8 text-[color:rgba(151,255,151,0.7)]">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-[color:rgba(151,255,151,0.35)]" />
            <p>No scores yet. Be the first to play!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedEntries.map((entry: LeaderboardEntry, index: number) => {
              const rank = index + 1;
              const isCurrentScore = currentScore && entry.score === currentScore;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${getRankColor(rank)} ${
                    isCurrentScore ? 'ring-2 ring-[var(--accent)]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getMedalIcon(rank)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate text-[var(--text)]">
                        {entry.playerName}
                      </div>
                      <div className="text-sm text-[color:rgba(151,255,151,0.8)]">
                        {entry.rounds} rounds • Avg {entry.averageDistance}km
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-[var(--accent)]">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-[color:rgba(151,255,151,0.7)]">points</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!remoteEntries || remoteEntries.length === 0 ? (
          <div className="mt-6 p-4 rounded-lg border mx-border bg-[rgba(0,255,65,0.06)]">
            <p className="text-sm text-[color:rgba(151,255,151,0.9)]">
              <strong>Note:</strong> No entries yet. Start SpacetimeDB at {`$`}{"{"}NEXT_PUBLIC_STDB_URI{"}"} and play to populate the leaderboard.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
