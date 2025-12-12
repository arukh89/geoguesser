# Geo Detective: Farcaster Quest 🌍

A geo-guessing game mini-app for the Farcaster decentralized social network. Test your geography knowledge by identifying locations from panoramic street views!

## Features

- **Interactive Gameplay**: 5-round geo-guessing with real-world panoramic imagery
- **Real-Time Leaderboard**: Powered by SpacetimeDB for live score updates
- **Matrix UI Theme**: Green-on-black CRT aesthetic with scanlines and digital rain
- **Farcaster Integration**: Quick auth and social sharing
- **Multi-Provider Support**: Mapillary and KartaView imagery

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Database**: SpacetimeDB (real-time leaderboard)
- **Mapping**: Leaflet + React Leaflet
- **Styling**: Tailwind CSS + Radix UI
- **Animation**: Framer Motion
- **Testing**: Playwright E2E

## Setup

### Prerequisites

- Node.js 18+ and pnpm
- SpacetimeDB CLI ([installation guide](https://spacetimedb.com/install))

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

```env
NEXT_PUBLIC_MAPILLARY_TOKEN=MLY|your_access_token_here
NEXT_PUBLIC_STDB_URI=http://127.0.0.1:3010
```

**⚠️ CRITICAL: SpacetimeDB Port Configuration**

SpacetimeDB **must run on a different port than Next.js dev server** (default 3000). We recommend **port 3010**.

Failure to configure this will cause leaderboard connection failures as the app attempts to connect to the Next.js server instead of SpacetimeDB.

### 3. Start SpacetimeDB

Navigate to the SpacetimeDB module and publish it locally on **port 3010**:

```bash
cd spacetime
spacetime publish -s http://127.0.0.1:3010 leaderboard
```

Verify STDB is running:
```bash
spacetime logs -s http://127.0.0.1:3010 leaderboard
```

### 4. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Scripts

```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint (strict: max-warnings=0)
pnpm test         # Run Playwright E2E tests
pnpm test:e2e:ui  # Run tests with Playwright UI
```

## Project Structure

```
src/
├── app/                  # Next.js app routes
│   ├── api/             # API endpoints (imagery, geocoding, auth)
│   ├── layout.tsx       # Root layout with Matrix theme
│   └── page.tsx         # Main game orchestrator
├── components/
│   ├── game/            # Game UI (viewer, map, results, leaderboard)
│   ├── matrix/          # Matrix theme components (rain, splash, toggle)
│   └── ui/              # Reusable UI primitives (Radix)
├── lib/
│   ├── game/            # Core game logic (locations, scoring, types)
│   └── geo/             # Geo utilities
├── hooks/               # Farcaster integration hooks
└── spacetime/           # SpacetimeDB generated client
```

## Leaderboard Architecture

The leaderboard uses **SpacetimeDB** for real-time score synchronization:

1. **Score Submission**: `FinalResults.tsx` calls `reducers.submitScore()` on game completion
2. **Live Updates**: `Leaderboard.tsx` subscribes to `SELECT * FROM score` for reactive updates
3. **Port Isolation**: STDB runs on 3010, Next.js on 3000 to prevent connection collisions

### Runtime Guards

Both `Leaderboard.tsx` and `FinalResults.tsx` include runtime warnings if port 3000 is detected in `NEXT_PUBLIC_STDB_URI`:

```
⚠️ STDB URI uses port 3000 which conflicts with Next.js dev server.
Set NEXT_PUBLIC_STDB_URI=http://127.0.0.1:3010 in .env to fix this.
```

## Testing

Run the full E2E test suite:

```bash
pnpm test:e2e
```

Tests cover:
- Home screen rendering
- Game mode selection
- API endpoints (location, imagery)
- Leaderboard connectivity

## Matrix UI Theme

The app uses a Matrix-inspired aesthetic:

- **Colors**: Green (`#00FF41`) on black (`#0D0208`)
- **Typography**: VT323, Share Tech Mono monospace fonts
- **Effects**: CRT scanlines, digital rain, glitch overlays
- **Components**: All panels/cards use Matrix palette variables

Toggle the Matrix rain via the sidebar toggle switch.

## Farcaster Integration

The app is a Farcaster mini-app with:

- **Metadata**: `public/.well-known/farcaster.json` defines mini-app manifest
- **Quick Auth**: `useQuickAuth` hook for seamless authentication
- **Sharing**: Direct Cast composition with game results

## API Endpoints

- `GET /api/location/random` - Fetch random panoramic location
- `GET /api/imagery/mapillary` - Mapillary imagery metadata
- `GET /api/auth/me` - Farcaster auth verification
- ~~`GET /api/geocode/reverse`~~ - Removed (unused)

## Contributing

1. Follow existing Matrix UI patterns (green/black, VT323 fonts)
2. Ensure `pnpm lint` passes with zero warnings
3. Run `pnpm build` before committing
4. Add Playwright tests for new features

## License

MIT
