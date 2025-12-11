'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { Trophy, MapPin, Target, ArrowRight } from 'lucide-react';
import type { RoundResult } from '@/lib/game/types';
import { formatDistance, getPerformanceMessage } from '@/lib/game/scoring';
import '@/lib/leaflet.config';
import { useEffect, useState } from 'react';
import L from 'leaflet';

interface ResultsScreenProps {
  result: RoundResult;
  onNext: () => void;
  isLastRound: boolean;
}

// Custom icons for markers
const actualIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const guessIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function ResultsScreen({ result, onNext, isLastRound }: ResultsScreenProps) {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scorePercentage = (result.score / 5000) * 100;
  const performanceMessage = getPerformanceMessage(result.score, 5000);

  const actualPosition: LatLngExpression = [result.location.lat, result.location.lng];
  const guessPosition: LatLngExpression = [result.guess.lat, result.guess.lng];
  const linePositions: LatLngExpression[] = [actualPosition, guessPosition];

  // Calculate map bounds to show both markers
  const bounds: LatLngExpression[] = [actualPosition, guessPosition];
  const center: LatLngExpression = [
    (result.location.lat + result.guess.lat) / 2,
    (result.location.lng + result.guess.lng) / 2
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 pt-16 md:pt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="border-2 shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-3xl flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                Round {result.round} Results
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg mt-2">
                {performanceMessage}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="font-semibold text-gray-700">Location</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.location.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {result.location.country}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="font-semibold text-gray-700">Distance</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatDistance(result.distance)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    from actual location
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="font-semibold text-gray-700">Score</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {result.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {scorePercentage.toFixed(1)}% accuracy
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="h-96 rounded-lg overflow-hidden border-2"
            >
              {isClient && (
                <MapContainer
                  bounds={bounds}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker position={actualPosition} icon={actualIcon}>
                    <Popup>
                      <div className="font-semibold">Actual Location</div>
                      <div className="text-sm">{result.location.name}</div>
                    </Popup>
                  </Marker>

                  <Marker position={guessPosition} icon={guessIcon}>
                    <Popup>
                      <div className="font-semibold">Your Guess</div>
                      <div className="text-sm">{formatDistance(result.distance)} away</div>
                    </Popup>
                  </Marker>

                  <Polyline
                    positions={linePositions}
                    color="blue"
                    weight={2}
                    opacity={0.7}
                    dashArray="10, 10"
                  />
                </MapContainer>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={onNext}
                size="lg"
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLastRound ? 'View Final Results' : 'Next Round'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
