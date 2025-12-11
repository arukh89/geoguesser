import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon paths for Next.js
// This resolves the issue where marker icons don't load correctly

// Remove default icon URL resolution
const DefaultIcon = L.Icon.Default;
const iconUrl = DefaultIcon.prototype as { _getIconUrl?: unknown };
delete iconUrl._getIconUrl;

// Set custom icon URLs
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default L;
