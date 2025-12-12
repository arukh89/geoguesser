// Prevent SSR from importing Leaflet (which requires window)
let L: any = undefined;

if (typeof window !== 'undefined') {
  L = require('leaflet');

  // Fix Leaflet's default icon paths for Next.js
  const DefaultIcon = L.Icon.Default;
  const iconUrl = DefaultIcon.prototype as { _getIconUrl?: unknown };
  // @ts-ignore
  delete iconUrl._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

export default L;
