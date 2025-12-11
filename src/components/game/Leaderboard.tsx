'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import type { LeaderboardEntry } from '@/lib/game/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentScore?: number;
}

export default function Leaderboard({ entries, currentScore }: LeaderboardProps) {
  const sortedEntries = [...entries].sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score).slice(0, 10);

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-semibold">{rank}</div>;
    }
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardTitle className="text-2xl flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Global Leaderboard
        </CardTitle>
        <CardDescription className="text-purple-100">
          Top explorers from around the world
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {sortedEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
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
                  className={`p-4 rounded-lg border-2 ${getRankColor(rank)} ${
                    isCurrentScore ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getMedalIcon(rank)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {entry.playerName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.rounds} rounds • Avg {entry.averageDistance}km
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a local leaderboard. Upgrade to unlock persistent leaderboards and Farcaster integration!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
