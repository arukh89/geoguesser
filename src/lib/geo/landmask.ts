import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { geoContains } from 'd3-geo';

// Lazy-loaded land geometry from world-atlas 110m (small, permissive)
let landGeo: Feature<MultiPolygon | Polygon> | null = null;
let loading: Promise<void> | null = null;

async function loadLand(): Promise<void> {
  if (landGeo) return;
  if (loading) return loading;
  loading = (async () => {
    // world-atlas provides compact TopoJSON; pick land at 110m
    const url = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) throw new Error('Failed to load land topojson');
    const topo = await res.json();
    // world-atlas exports object key 'land'
    const fc = feature(topo, topo.objects.land) as FeatureCollection;
    // Single feature MultiPolygon
    landGeo = fc.features[0] as Feature<MultiPolygon | Polygon>;
  })();
  return loading;
}

export async function isOnLand(lat: number, lon: number): Promise<boolean> {
  try {
    await loadLand();
    if (!landGeo) return true; // fallback: don’t block
    // geoContains expects [lon, lat]
    return geoContains(landGeo, [lon, lat]);
  } catch {
    return true; // if dataset fails, allow sampling
  }
}
