'use client';

import { useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

interface PanoramaViewerProps {
  imageUrl: string;
  onLoad?: () => void;
}

export default function PanoramaViewer({ imageUrl, onLoad }: PanoramaViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple panorama viewer with draggable image
    // In production, you could use a library like Pannellum for true 360° viewing
    
    if (!viewerRef.current) return;

    const viewer = viewerRef.current;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e: MouseEvent): void => {
      isDragging = true;
      startX = e.pageX - viewer.offsetLeft;
      scrollLeft = viewer.scrollLeft;
      viewer.style.cursor = 'grabbing';
    };

    const handleMouseUp = (): void => {
      isDragging = false;
      viewer.style.cursor = 'grab';
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - viewer.offsetLeft;
      const walk = (x - startX) * 2;
      viewer.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: TouchEvent): void => {
      isDragging = true;
      startX = e.touches[0].pageX - viewer.offsetLeft;
      scrollLeft = viewer.scrollLeft;
    };

    const handleTouchEnd = (): void => {
      isDragging = false;
    };

    const handleTouchMove = (e: TouchEvent): void => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - viewer.offsetLeft;
      const walk = (x - startX) * 2;
      viewer.scrollLeft = scrollLeft - walk;
    };

    viewer.addEventListener('mousedown', handleMouseDown);
    viewer.addEventListener('mouseup', handleMouseUp);
    viewer.addEventListener('mousemove', handleMouseMove);
    viewer.addEventListener('mouseleave', handleMouseUp);
    viewer.addEventListener('touchstart', handleTouchStart);
    viewer.addEventListener('touchend', handleTouchEnd);
    viewer.addEventListener('touchmove', handleTouchMove);

    return () => {
      viewer.removeEventListener('mousedown', handleMouseDown);
      viewer.removeEventListener('mouseup', handleMouseUp);
      viewer.removeEventListener('mousemove', handleMouseMove);
      viewer.removeEventListener('mouseleave', handleMouseUp);
      viewer.removeEventListener('touchstart', handleTouchStart);
      viewer.removeEventListener('touchend', handleTouchEnd);
      viewer.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black">
      <div
        ref={viewerRef}
        className="w-full h-full overflow-hidden cursor-grab select-none"
        style={{ touchAction: 'none' }}
      >
        <img
          src={imageUrl}
          alt="Panoramic view"
          className="h-full w-auto min-w-full object-cover pointer-events-none"
          onLoad={onLoad}
          draggable={false}
        />
      </div>

      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <Info className="w-4 h-4" />
        <span className="text-sm">Drag to look around</span>
      </div>
    </div>
  );
}
