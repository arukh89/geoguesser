'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, MapPin, Target, Share2, RotateCcw, TrendingUp } from 'lucide-react';
import type { RoundResult } from '@/lib/game/types';
import { formatDistance, calculateAverageDistance } from '@/lib/game/scoring';
import Leaderboard from './Leaderboard';
import { useEffect } from 'react';
import { DbConnection } from '@/spacetime';

interface FinalResultsProps {
  results: RoundResult[];
  totalScore: number;
  onPlayAgain: () => void;
  onShare: () => void;
}

export default function FinalResults({
  results,
  totalScore,
  onPlayAgain,
  onShare,
}: FinalResultsProps) {
  const distances = results.map((r: RoundResult) => r.distance);
  const averageDistance = calculateAverageDistance(distances);
  const bestRound = results.reduce((best: RoundResult, current: RoundResult) =>
    current.score > best.score ? current : best
  );
  const maxPossibleScore = results.length * 5000;
  const accuracyPercentage = (totalScore / maxPossibleScore) * 100;

  // No local fallback: leaderboard is fully powered by SpacetimeDB

  const getPerformanceLevel = (percentage: number): { title: string; message: string; emoji: string } => {
    if (percentage >= 90) {
      return {
        title: 'Legendary',
        message: "You're a geography master!",
        emoji: '🌟',
      };
    } else if (percentage >= 75) {
      return {
        title: 'Excellent',
        message: 'Impressive knowledge of the world!',
        emoji: '🎯',
      };
    } else if (percentage >= 60) {
      return {
        title: 'Great',
        message: 'You know your way around!',
        emoji: '👏',
      };
    } else if (percentage >= 40) {
      return {
        title: 'Good',
        message: 'Nice effort, keep exploring!',
        emoji: '👍',
      };
    } else {
      return {
        title: 'Keep Learning',
        message: 'Every explorer starts somewhere!',
        emoji: '🗺️',
      };
    }
  };

  const performance = getPerformanceLevel(accuracyPercentage);

  // Submit score to SpacetimeDB once when final results are shown (best-effort)
  useEffect(() => {
    const submit = async () => {
      try {
        const uri = process.env.NEXT_PUBLIC_STDB_URI ?? 'http://127.0.0.1:3000';
        const conn = DbConnection.builder()
          .withUri(uri)
          .withModuleName('leaderboard')
          .withLightMode(true)
          .build();

        conn.reducers.submitScore({
          playerName: 'You',
          scoreValue: totalScore,
          rounds: results.length,
          averageDistance: Math.round(averageDistance),
        });

        // Optional: disconnect shortly after submitting to avoid keeping a socket open
        setTimeout(() => conn.disconnect(), 1500);
      } catch (err) {
        console.error('Failed to submit score to SpacetimeDB:', err);
      }
    };
    submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Removed internal API fallback; SpacetimeDB only

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 pt-16 md:pt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <Card className="border-2 shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl mb-2">{performance.emoji}</div>
              <CardTitle className="text-4xl mb-2">
                {performance.title}!
              </CardTitle>
              <CardDescription className="text-purple-100 text-xl">
                {performance.message}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200"
            >
              <div className="text-sm font-semibold text-gray-600 mb-2">
                TOTAL SCORE
              </div>
              <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {totalScore.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {accuracyPercentage.toFixed(1)}% accuracy
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="font-semibold text-gray-700">Avg Distance</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatDistance(averageDistance)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Trophy className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="font-semibold text-gray-700">Best Round</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {bestRound.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {bestRound.location.name}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="font-semibold text-gray-700">Rounds</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {results.length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    completed
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Round Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.map((result: RoundResult, index: number) => (
                      <div
                        key={result.round}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {result.location.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDistance(result.distance)} away
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {result.score.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                onClick={onShare}
                size="lg"
                className="flex-1 h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share on Farcaster
              </Button>
              <Button
                onClick={onPlayAgain}
                size="lg"
                variant="outline"
                className="flex-1 h-14 text-lg border-2"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Leaderboard currentScore={totalScore} />
        </motion.div>
      </motion.div>
    </div>
  );
}
