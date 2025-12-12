'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HomeScreen from '@/components/game/HomeScreen';
import { Button } from '@/components/ui/button';
import GameHeader from '@/components/game/GameHeader';
import PanoramaViewer from '@/components/game/PanoramaViewer';
import ResultsScreen from '@/components/game/ResultsScreen';
import FinalResults from '@/components/game/FinalResults';
import { getRandomLocations } from '@/lib/game/locations';
import { calculateDistance, calculateScore } from '@/lib/game/scoring';
import { toast } from 'sonner';
import type { GameMode, GameState, Location, RoundResult } from '@/lib/game/types';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

// Dynamic import for WorldMap to avoid SSR issues with Leaflet
import MatrixLoader from '@/components/matrix/MatrixLoader';
const WorldMap = dynamic(() => import('@/components/game/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[var(--bg)] flex items-center justify-center">
      <MatrixLoader label="Loading map..." />
    </div>
  ),
});

const TOTAL_ROUNDS = 5;
const TIME_ATTACK_LIMIT = 60; // seconds per round

type GameScreen = 'home' | 'playing' | 'results' | 'final';

export default function GeoExplorerGame() {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    totalRounds: TOTAL_ROUNDS,
    score: 0,
    locations: [],
    currentLocation: null,
    guess: null,
    roundScores: [],
    gameStarted: false,
    gameEnded: false,
  });

  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [showMap, setShowMap] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchRandomShot() {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? '';
    const r = await fetch(`${base}/api/location/random`, { cache: 'no-store' });
    if (!r.ok) return null;
    const j = await r.json();
    return j?.found ? j as { provider: 'mapillary'|'kartaview'; imageId?: string; imageUrl?: string; lat: number; lon: number } : null;
  }

  // Initialize game
  const startGame = (mode: GameMode, durationSec?: number): void => {
    // Run async to fetch global shots; fallback to curated list on failure
    (async () => {
      try {
        setLoading(true);
        const shots = await Promise.all(Array.from({ length: TOTAL_ROUNDS }).map(() => fetchRandomShot()));
        const fallback = getRandomLocations(TOTAL_ROUNDS);
        const locations = shots.map((s, i) => {
          if (!s) return fallback[i];
          return {
            id: s.imageId || `kv-${i}`,
            name: 'Mystery Location',
            country: '',
            continent: '',
            lat: s.lat,
            lng: s.lon,
            provider: s.provider,
            imageId: s.imageId,
            imageUrl: s.imageUrl,
            difficulty: 'medium' as const,
            hints: [],
          };
        });
        setGameState({
          currentRound: 1,
          totalRounds: TOTAL_ROUNDS,
          score: 0,
          locations: locations,
          currentLocation: locations[0] || null,
          guess: null,
          roundScores: [],
          gameStarted: true,
          gameEnded: false,
          mode,
          timeLimitSec: mode === 'time-attack' ? (durationSec ?? TIME_ATTACK_LIMIT) : undefined,
          timeLeftSec: mode === 'time-attack' ? (durationSec ?? TIME_ATTACK_LIMIT) : undefined,
        });
        setCurrentScreen('playing');
        setShowMap(false);
      } finally {
        setLoading(false);
      }
    })();
  };

  // Countdown for Time Attack mode
  useEffect(() => {
    if (gameState.mode !== 'time-attack' || currentScreen !== 'playing') return;
    if (!gameState.timeLeftSec || gameState.timeLeftSec <= 0) return;
    const id = setInterval(() => {
      setGameState((prev) => ({ ...prev, timeLeftSec: (prev.timeLeftSec ?? 0) - 1 }));
    }, 1000);
    return () => clearInterval(id);
  }, [gameState.mode, currentScreen, gameState.timeLeftSec]);

  // Auto-finish round when time is up
  useEffect(() => {
    if (gameState.mode !== 'time-attack') return;
    if (currentScreen !== 'playing') return;
    if ((gameState.timeLeftSec ?? 0) > 0) return;
    // No guess: count as 0 score
    if (gameState.currentLocation) {
      const roundResult: RoundResult = {
        location: gameState.currentLocation,
        guess: { lat: 0, lng: 0 },
        distance: 20000,
        score: 0,
        round: gameState.currentRound,
      };
      setGameState((prev) => ({
        ...prev,
        roundScores: [...prev.roundScores, roundResult],
      }));
      setCurrentScreen('results');
      setShowMap(false);
    }
  }, [gameState.timeLeftSec, currentScreen, gameState.mode, gameState.currentLocation, gameState.currentRound]);

  // Handle guess submission
  const handleGuess = (lat: number, lng: number): void => {
    if (!gameState.currentLocation) return;

    // Compute locally; final submission to SpacetimeDB occurs in FinalResults
    const distance = calculateDistance(
      gameState.currentLocation.lat,
      gameState.currentLocation.lng,
      lat,
      lng
    );
    const result = calculateScore(distance);
    const roundResult: RoundResult = {
      location: gameState.currentLocation,
      guess: { lat, lng },
      distance: distance,
      score: result.score,
      round: gameState.currentRound,
    };
    setGameState((prev: GameState) => ({
      ...prev,
      guess: { lat, lng },
      roundScores: [...prev.roundScores, roundResult],
      score: prev.score + result.score,
    }));
    setCurrentScreen('results');
    setShowMap(false);
  };

  // Move to next round
  const nextRound = (): void => {
    if (gameState.currentRound >= gameState.totalRounds) {
      setGameState((prev: GameState) => ({
        ...prev,
        gameEnded: true,
      }));
      setCurrentScreen('final');
      return;
    }

    const nextRoundNumber = gameState.currentRound + 1;
    const nextLocation = gameState.locations[nextRoundNumber - 1];

    setGameState((prev: GameState) => ({
      ...prev,
      currentRound: nextRoundNumber,
      currentLocation: nextLocation || null,
      guess: null,
      timeLeftSec: prev.mode === 'time-attack' ? (prev.timeLimitSec ?? TIME_ATTACK_LIMIT) : prev.timeLeftSec,
    }));

    setCurrentScreen('playing');
    setShowMap(false);
  };

  // Show/hide map (defer show to next tick to avoid detaching the clicked button mid-action)
  const showMapNow = (): void => {
    setTimeout(() => setShowMap(true), 0);
  };
  const hideMapNow = (): void => setShowMap(false);

  // Share results on Farcaster
  const handleShare = (): void => {
    const shareText = `🌍 I scored ${gameState.score.toLocaleString()} points in Farcaster Geo Explorer!\n\nCan you beat my score? 🎯`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success('Score copied to clipboard! Share it on Farcaster!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });

    // In a real implementation, this would integrate with Farcaster SDK
    console.log('Share on Farcaster:', shareText);
  };

  // Restart game
  const playAgain = (): void => {
    setCurrentScreen('home');
    setGameState({
      currentRound: 0,
      totalRounds: TOTAL_ROUNDS,
      score: 0,
      locations: [],
      currentLocation: null,
      guess: null,
      roundScores: [],
      gameStarted: false,
      gameEnded: false,
    });
    setShowMap(false);
  };

  // Get current round result for results screen
  const currentRoundResult = gameState.roundScores[gameState.roundScores.length - 1];

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative">
      {loading && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <MatrixLoader label="Initializing..." />
        </div>
      )}
      {currentScreen === 'home' && (
        <HomeScreen onStart={startGame} />
      )}

      {currentScreen === 'playing' && gameState.currentLocation && (
        <>
          <GameHeader
            currentRound={gameState.currentRound}
            totalRounds={gameState.totalRounds}
            score={gameState.score}
            timeLeftSec={gameState.mode === 'time-attack' ? gameState.timeLeftSec : undefined}
          />

          <div className="h-[calc(100vh-73px)] flex flex-col md:flex-row">
            {/* Panorama Viewer */}
            <div className={`${showMap ? 'hidden' : 'flex'} flex-1 relative`}>
              <PanoramaViewer
                imageUrl={gameState.currentLocation.panoramaUrl}
                shot={gameState.currentLocation.provider ? {
                  provider: gameState.currentLocation.provider as 'mapillary'|'kartaview',
                  imageId: gameState.currentLocation.imageId,
                  imageUrl: gameState.currentLocation.imageUrl,
                } : undefined}
                allowMove={gameState.mode !== 'no-move'}
              />
              
              <Button
                onClick={showMapNow}
                size="lg"
                className="absolute bottom-4 right-4 z-10"
              >
                {showMap ? 'Hide Map' : 'Make a Guess'}
              </Button>
            </div>

            {/* Map as full-screen overlay when visible to avoid layout issues */}
            <div className={`${showMap ? 'fixed inset-0 z-[100]' : 'hidden'} bg-black`} data-testid="map-overlay">
              <WorldMap onGuess={handleGuess} active={showMap} />
            </div>
          </div>
        </>
      )}

      {currentScreen === 'results' && currentRoundResult && (
        <ResultsScreen
          result={currentRoundResult}
          onNext={nextRound}
          isLastRound={gameState.currentRound >= gameState.totalRounds}
        />
      )}

      {currentScreen === 'final' && (
        <FinalResults
          results={gameState.roundScores}
          totalScore={gameState.score}
          onPlayAgain={playAgain}
          onShare={handleShare}
        />
      )}
    </main>
  );
}
