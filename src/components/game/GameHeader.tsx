'use client';

import { Trophy, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GameHeaderProps {
  currentRound: number;
  totalRounds: number;
  score: number;
}

export default function GameHeader({ currentRound, totalRounds, score }: GameHeaderProps) {
  const progress = (currentRound / totalRounds) * 100;

  return (
    <div className="bg-white border-b-2 border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div className="text-sm">
                <span className="font-semibold text-gray-900">Round</span>
                <span className="ml-2 text-gray-600">
                  {currentRound} / {totalRounds}
                </span>
              </div>
            </div>

            <div className="hidden md:block w-32">
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <div className="text-sm">
              <span className="font-semibold text-gray-900">Score</span>
              <span className="ml-2 text-gray-600 font-mono">
                {score.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="md:hidden mt-2">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
}
