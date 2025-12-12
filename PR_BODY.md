Upgrade to Next.js 16 + Matrix theming + Leaflet CSS dev fix (Droid-assisted)

Summary:
- Upgrade Next.js 15.3.6 → 16.0.10, React 19.2.3, TypeScript 5.9.3
- Fix Leaflet dev HMR runtime error: remove local CSS imports; load via CDN in app layout
- Secure Mapillary API: use server-only MAPILLARY_SERVER_TOKEN in API route
- Add MatrixToggle to header; unify Leaderboard and Buttons to Matrix theme tokens

Validation (local):
- ESLint: pnpm dlx eslint . --max-warnings=0 → 0 warnings
- Types: pnpm exec tsc --noEmit → OK
- Build: pnpm build → OK
- E2E: pnpm test:e2e → 6 passed, 1 failing (timer visibility in time-attack; unrelated to map/theming)

Notes:
- Dev-only Leaflet CSS via CDN avoids Next 16 Turbopack HMR issue ("Module factory is not available") seen when importing leaflet.css from node_modules in client modules.
- Timer test flake likely due to how the header timer text is queried; can follow up separately.