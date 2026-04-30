# Nearby Escapes (TanStack Start)

## Overview

A TanStack Start (React 19 + Vite 7) travel/booking app called "Nearby Escapes" with stays, transport, and packages. Uses TanStack Router with file-based routing under `src/routes`, Tailwind CSS v4, Radix UI / shadcn-style components, React Hook Form, Zod, and TanStack React Query.

The project was originally scaffolded for Cloudflare Workers deployment (see `wrangler.jsonc`, `@cloudflare/vite-plugin`).

## Project Structure

- `src/routes/` — file-based TanStack Router routes (auto-generated `routeTree.gen.ts`)
- `src/pages/` — page components rendered by routes
- `src/components/` — UI and feature components (shadcn-style under `components/ui/`)
- `src/api/`, `src/store/`, `src/hooks/`, `src/lib/`, `src/utils/` — app logic
- `src/styles.css`, `src/styles/` — Tailwind + theme styles
- `public/` — static assets (favicon, robots, webmanifest)
- `vite.config.ts` — uses `@lovable.dev/vite-tanstack-config` wrapper (bundles tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare for build, etc.)

## Replit Setup

- **Node**: `nodejs-20` module from Nix.
- **Package manager**: npm (lockfile present). `bun.lock` / `bunfig.toml` are leftover from upstream and unused on Replit.
- **Dev server**: `npm run dev` (Vite) bound to `0.0.0.0:5000` with `allowedHosts: true` so Replit's iframe proxy can reach it. Configured via `vite.config.ts`.
- **Workflow**: `Start application` runs `npm run dev` on port 5000 (webview).

## Deployment

- Configured as **autoscale** running `npm run dev` on port 5000.
- The upstream Cloudflare Workers build target (`@cloudflare/vite-plugin` + `wrangler.jsonc`) is preserved but not used by the Replit deployment. To deploy a production-grade build instead, swap to a Node SSR adapter or build for static output and update the deployment config.

## Recent Work (April 2026)

- Replaced 32 placeholder `PageScaffold` stubs with full UIs across account, profile, inbox, host suite (calendar, earnings, feedback, performance, inbox), collections, spotlight, stays detail/room, booking confirmation, support + article, and legal (terms / privacy / community standards) pages.
- Removed gradient backgrounds in favor of solid colors throughout HomePage and PageScaffold.
- `useBooking` hook extended: `BookingDraft` includes optional `stayName`; hook now returns `draft` alongside totals. `BOOKING_DRAFT_STORAGE_KEY` re-exported from `@/store/bookingStore`.
- Renamed all `host.<child>.tsx` route files to `host_.<child>.tsx` so they render as flat routes at `/host/<child>` instead of nesting inside `HostDashboardPage` (which has no `<Outlet />`). This fixed routes such as `/host/calendar`, `/host/earnings`, `/host/inbox`, `/host/properties`, `/host/performance`, `/host/feedback`, `/host/new-listing`, `/host/new-gem`, `/host/new-ride`, and the multi-step `/host/new-property/step-N` wizard.
- `src/routes/legal.terms.tsx` and `src/routes/legal.privacy.tsx` were re-pointed to import the new `@/pages/legal/TermsPage` and `@/pages/legal/PrivacyPolicyPage` components instead of inlining their own.
- If you see "Cannot read properties of null (reading 'useContext')" from Radix in dev, clear `node_modules/.vite` and restart — that was a stale Vite optimizeDeps cache, not a duplicate React install.
- **Role switching (Fiverr-style):** removed the desktop Travel/Host pill toggle (`ModeSwitcher`) from the global header. Switching modes now lives on the user profile (`src/routes/profile.index.tsx`) via a "Switch to hosting" / "Become a host" card, and on the host dashboard (`src/pages/host/HostDashboardPage.tsx`) via a "Switch to traveling" button next to "New listing". Same account books trips and hosts listings. The mobile sheet trigger in the navbar still surfaces the right links per role. `src/components/host/ModeSwitcher.tsx` is no longer imported but kept on disk as a reusable component if needed later. The standalone `src/pages/profile/ProfilePage.tsx` is currently unused — `/profile` renders `profile.index.tsx`.
- **Profile area split into standalone pages (Apr 30 2026):** `/profile` (Overview), `/profile/host` (Host dashboard) and `/profile/settings` (Settings) are now three independent pages instead of tabs in a shared sidebar layout. `src/routes/profile.tsx` is now a pathless layout that only enforces the auth guard and renders `<Outlet />`. Each child route owns its own `SiteHeader`, full-width `<main>` and `SiteFooter`. Navigation between them is through the existing profile button + mobile sheet links in `SiteHeader`.

## User Preferences

- Backend (NestJS + JWT auth) and S3 photo storage are owned by the user; this codebase is frontend-only with mock data.
- Prefer solid colors over gradients.
- Final delivery: push to GitHub remote `origin` = https://github.com/Mike31Phiri/dream-stay-builder. Push is gated behind a project task (deferred by user — do later).
