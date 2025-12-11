'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import '@/lib/leaflet.config';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';

interface WorldMapProps {
  onGuess: (lat: number, lng: number) => void;
  disabled?: boolean;
}

interface MapPosition {
  lat: number;
  lng: number;
}

function ClickHandler({ onClick }: { onClick: (pos: MapPosition) => void }) {
  useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function AutoResize() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => {
      try { map.invalidateSize(); } catch {}
    }, 50);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

export default function WorldMap({ onGuess, disabled = false }: WorldMapProps) {
  const [position, setPosition] = useState<MapPosition | null>(null);
  const [isClient] = useState<boolean>(typeof window !== 'undefined');

  const handlePositionClick = (pos: MapPosition): void => {
    if (!disabled) {
      setPosition(pos);
    }
  };

  const handleConfirmGuess = (): void => {
    if (position) {
      onGuess(position.lat, position.lng);
      setPosition(null);
    }
  };

  const handleClearGuess = (): void => {
    setPosition(null);
  };

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  const center: LatLngExpression = [20, 0];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <AutoResize />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onClick={handlePositionClick} />

        {position && (
          <Marker position={[position.lat, position.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-1">Your Guess</div>
                <div>Lat: {position.lat.toFixed(4)}</div>
                <div>Lng: {position.lng.toFixed(4)}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {!disabled && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] flex gap-2">
          {position ? (
            <>
              <Button
                onClick={handleConfirmGuess}
                size="lg"
                className="bg-green-600 hover:bg-green-700 shadow-lg"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Confirm Guess
              </Button>
              <Button
                onClick={handleClearGuess}
                size="lg"
                variant="secondary"
                className="shadow-lg"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </>
          ) : (
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-gray-600">
              Click on the map to place your guess
            </div>
          )}
        </div>
      )}
    </div>
  );
}
