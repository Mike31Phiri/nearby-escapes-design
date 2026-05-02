# Next.js Migration Guide

## Overview
This project has been migrated from TanStack Router + Vite to Next.js 15 with the App Router.

## Key Changes

### 1. Routing
- **Before**: TanStack Router with file-based routes in `src/routes/`
- **After**: Next.js App Router with pages in `src/app/`

### 2. Navigation
Replace TanStack Router imports:
```typescript
// Before
import { Link, useNavigate, useLocation, useParams } from "@tanstack/react-router";

// After
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
```

### 3. Link Component
```typescript
// Before
<Link to="/accommodations/$id" params={{ id: listing.id }} />

// After
<Link href={`/accommodations/${listing.id}`} />
```

### 4. Navigation Hook
```typescript
// Before
const navigate = useNavigate();
navigate({ to: "/login" });

// After
const router = useRouter();
router.push("/login");
```

### 5. Location Hook
```typescript
// Before
const location = useLocation();
const pathname = location.pathname;

// After
const pathname = usePathname();
```

### 6. URL Parameters
```typescript
// Before
const { id } = useParams();

// After (Server Components)
const { id } = await params;

// After (Client Components)
const { id } = useParams();
```

### 7. Search Params
```typescript
// Before
const search = useSearch();

// After (Server Components)
const searchParams = await searchParams;

// After (Client Components)
const searchParams = useSearchParams();
```

## File Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── not-found.tsx      # 404 page
│   └── global-error.tsx   # Error boundary
├── components/            # React components
├── features/              # Feature modules
├── lib/                   # Utilities
│   ├── auth.tsx           # Auth provider
│   └── router.ts          # Compatibility layer (optional)
└── pages/                 # Page components (reusable)
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## Next Steps

1. **Migrate remaining routes**: Convert `src/routes/*.tsx` files to Next.js App Router format in `src/app/`
2. **Update all imports**: Replace `@tanstack/react-router` imports with Next.js equivalents
3. **Add "use client"**: Add `"use client"` directive to components using hooks
4. **Test thoroughly**: Ensure all navigation and routing works correctly

## Dynamic Routes

Create folders with square brackets for dynamic segments:
- `src/app/accommodations/[id]/page.tsx` → `/accommodations/:id`
- `src/app/stays/[stayId]/rooms/[roomId]/page.tsx` → `/stays/:stayId/rooms/:roomId`

Example dynamic page:
```typescript
// src/app/accommodations/[id]/page.tsx
export default async function AccommodationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Fetch and render accommodation data
}
```
