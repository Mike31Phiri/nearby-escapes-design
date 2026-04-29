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

## User Preferences

None recorded yet.
