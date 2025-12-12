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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4 pt-16 md:pt-4 relative overflow-hidden">
      {/* subtle scanline overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 1px, rgba(0,255,65,0.12) 1px 2px)'
      }} />
      {/* background rain now rendered globally in layout */}
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
            <div className="p-6 rounded-full bg-[rgba(0,255,65,0.08)] border border-[rgba(0,255,65,0.3)] shadow-[var(--shadow)]">
              <Globe className="w-16 h-16 text-[var(--accent)]" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold text-[var(--accent)] tracking-wide mb-3 mx-glitch"
            data-text="Farcaster Geo Explorer"
          >
            Farcaster Geo Explorer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-[color:rgba(151,255,151,0.8)]"
          >
            Explore the world. Test your geography skills. Share your scores.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="shadow-xl">
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
                <div className="p-3 rounded-lg bg-[rgba(0,255,65,0.08)] border border-[rgba(0,255,65,0.25)]">
                  <Globe className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">1. Explore</h3>
                  <p className="text-[color:rgba(151,255,151,0.8)]">
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
                <div className="p-3 rounded-lg bg-[rgba(0,255,65,0.08)] border border-[rgba(0,255,65,0.25)]">
                  <MapPin className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">2. Guess</h3>
                  <p className="text-[color:rgba(151,255,151,0.8)]">
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
                <div className="p-3 rounded-lg bg-[rgba(0,255,65,0.08)] border border-[rgba(0,255,65,0.25)]">
                  <Trophy className="w-6 h-6 text-[var(--accent)]" />
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
                className="p-4 rounded-lg border mx-border bg-[rgba(0,255,65,0.06)]"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-[var(--accent)]" />
                  <p className="text-sm font-medium text-[var(--text)]">
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
                      className="w-full text-left h-14 hover:bg-[rgba(0,255,65,0.08)]"
                      aria-label={m.key === 'time-attack' ? 'Time Attack' : undefined}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{m.title}</span>
                        <span className="text-xs opacity-80 text-[color:rgba(151,255,151,0.8)]" aria-hidden={m.key === 'time-attack'}>
                          {m.desc}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="mt-3">
                  <div className="text-sm text-[color:rgba(151,255,151,0.8)] mb-2">Time Attack duration</div>
                  <div className="grid grid-cols-3 gap-3">
                    {[30, 60, 90].map((sec) => (
                      <Button
                        key={sec}
                        onClick={() => start('time-attack', sec)}
                        size="lg"
                        className="w-full h-12 hover:bg-[rgba(0,255,65,0.08)]"
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
          className="text-center mt-6 text-sm text-[color:rgba(151,255,151,0.7)]"
        >
          Powered by Farcaster • Built on Base
        </motion.p>
      </motion.div>
    </div>
  );
}
