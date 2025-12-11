'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, MapPin, Trophy, Target } from 'lucide-react';

interface HomeScreenProps {
  onStart: (mode: 'classic'|'no-move'|'time-attack', durationSec?: number) => void;
}

export default function HomeScreen({ onStart }: HomeScreenProps) {
  const modes: { key: 'classic'|'no-move'|'time-attack'; title: string; desc: string }[] = [
    { key: 'classic', title: 'Classic', desc: '5 rounds, free exploration' },
    { key: 'no-move', title: 'No-Move', desc: 'Look around only, no navigation' },
    { key: 'time-attack', title: 'Time Attack', desc: 'Beat the clock each round' },
  ];
  const start = (m: 'classic'|'no-move'|'time-attack', d?: number) => onStart(m, d);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 pt-16 md:pt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-6 rounded-full">
              <Globe className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3"
          >
            Farcaster Geo Explorer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600"
          >
            Explore the world. Test your geography skills. Share your scores.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">How to Play</CardTitle>
              <CardDescription>Master the world in 3 simple steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-start gap-4"
              >
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">1. Explore</h3>
                  <p className="text-gray-600">
                    You&apos;ll be dropped into a random location around the world. Look around using your mouse or touch to drag the 360° view.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-start gap-4"
              >
                <div className="bg-green-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">2. Guess</h3>
                  <p className="text-gray-600">
                    Click on the world map to drop a pin where you think you are. The closer your guess, the higher your score!
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="flex items-start gap-4"
              >
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">3. Score & Share</h3>
                  <p className="text-gray-600">
                    Earn up to 5,000 points per round. Complete 5 rounds and share your results with friends on Farcaster!
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-medium text-gray-700">
                    <span className="font-bold">Pro Tip:</span> Look for landmarks, architecture, language signs, and vegetation to help identify your location!
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 }}
                className="pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {modes.map((m) => (
                    <Button
                      key={m.key}
                      onClick={() => start(m.key)}
                      size="lg"
                      className="w-full text-left h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
                      aria-label={m.key === 'time-attack' ? 'Time Attack' : undefined}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{m.title}</span>
                        <span className="text-xs opacity-80" aria-hidden={m.key === 'time-attack'}>
                          {m.desc}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="mt-3">
                  <div className="text-sm text-gray-600 mb-2">Time Attack duration</div>
                  <div className="grid grid-cols-3 gap-3">
                    {[30, 60, 90].map((sec) => (
                      <Button
                        key={sec}
                        onClick={() => start('time-attack', sec)}
                        size="lg"
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                      >
                        Time Attack {sec}s
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center mt-6 text-sm text-gray-500"
        >
          Powered by Farcaster • Built on Base
        </motion.p>
      </motion.div>
    </div>
  );
}
