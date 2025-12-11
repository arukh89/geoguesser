"use client";
import { Viewer } from 'mapillary-js';
import { useEffect, useRef } from 'react';

export default function MapillaryViewer({ imageId }: { imageId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !imageId) return;
    const v = new Viewer({
      accessToken: process.env.NEXT_PUBLIC_MAPILLARY_TOKEN!,
      container: ref.current,
      imageId,
      component: { cover: false },
    });
    return () => v.remove();
  }, [imageId]);
  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}
