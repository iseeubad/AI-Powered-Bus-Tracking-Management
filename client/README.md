This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

This client is organized for clarity, scalability, and type safety. Below is an overview of the most important folders and files under `src/`.

```text
src/
├── app/                      # Next.js App Router (routes, layout, global styles)
│   ├── layout.tsx            # App shell: HTML, global providers, metadata
│   ├── page.tsx              # Main Bus Tracker page
│   ├── globals.css           # Global CSS
│   └── leaflet.scss          # Leaflet-specific styles
├── components/
│   ├── map/                  # Map-related UI
│   │   ├── Map.tsx           # Map container, tiles, markers, focus logic
│   │   ├── ZoomControl.tsx   # Custom zoom control
│   │   ├── bus/              # Bus-specific map UI
│   │   │   ├── BusMarker.tsx       # Marker + popup UI (with Show More)
│   │   │   ├── BusDetailsModal.tsx # Detailed bus modal (opened via Show More)
│   │   │   ├── BusSidebar.tsx      # Sidebar list of buses (Track -> focus + popup)
│   │   │   └── index.ts            # Barrel export for bus components
│   │   └── index.ts          # Barrel export for map components
│   └── ui/                   # Reusable UI primitives (buttons, dialogs, etc.)
├── constants/                # Centralized constants/configuration
│   ├── app.ts                # App name, city label, descriptions
│   └── index.ts              # Barrel export
├── data/                     # Local/mock data sources
│   ├── mockBuses.ts          # Mock bus dataset used by the demo
│   └── index.ts              # Barrel export
├── hooks/                    # Reusable React hooks
│   ├── useBusTracking.ts     # Encapsulates selection/focus/Show More logic
│   └── index.ts              # Barrel export
├── lib/
│   └── utils.ts              # Utilities (e.g., className helpers)
└── types/                    # Centralized TypeScript types
    ├── bus.ts                # Bus, marker props, stats
    ├── map.ts                # Map types and props
    └── index.ts              # Barrel export
```

### Key Flows

- Bus marker click: shows a compact popup only. No modal is auto-opened.
- Popup “Show More”: opens `BusDetailsModal` with full details and actions.
- Sidebar “Track”: focuses the map on the selected bus and opens its popup.

### Where Things Live

- Map behavior (focus, tiles, markers): `components/map/Map.tsx`
- Bus marker + popup: `components/map/bus/BusMarker.tsx`
- Detailed bus modal: `components/map/bus/BusDetailsModal.tsx`
- Sidebar list: `components/map/bus/BusSidebar.tsx`
- Shared types: `types/`
- App and map configuration: `constants/`
- Mock/demo data: `data/`
- Encapsulated state/logic: `hooks/useBusTracking.ts`

### Import Style

Barrel exports are provided to keep imports concise, but Map component must be imported directly to prevent SSR issues:

```ts
// Components (Map excluded from barrel export to prevent SSR)
import { BusSidebar } from "@/components/map/bus/BusSidebar"
import { BusDetailsDialog } from "@/components/map/bus/BusDetailsModal"
const Map = dynamic(() => import("@/components/map/Map"), { ssr: false })

// Hooks
import { useBusTracking } from "@/hooks"

// Data & constants
import { MOCK_BUSES } from "@/data"
import { MAP_CONFIG, APP_CONFIG } from "@/constants"

// Types
import type { BusItem, MapBus } from "@/types"
```

This structure helps keep domain logic discoverable, encourages reuse, and scales well as the project grows.
