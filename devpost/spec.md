---
doc: spec
status: approved
---

# Nearby Escapes — Technical Spec

## How This Works, In Plain Language
Nearby Escapes is a web application built for domestic Zambian travel that runs in the browser and connects guest travelers with local hosts across three verticals: **Stays**, **Experiences**, and **Transport**.

1. **State & Inventory Engine:** All listings, property inventories (e.g. 15 chalets for a lodge, seats for a shuttle, or daily experience time slots), and bookings live in persistent reactive state stores (using Zustand with browser local storage). 
2. **Unified Guest Experience:** Guests browse listings on the Home and Explore pages filtered by category tabs. Clicking any listing opens a unified detail page with a 5-photo hero gallery, clear Zambian Kwacha (ZMW) pricing, and a sticky booking card.
3. **Availability & Slot Checking:** For Experiences, the booking card enforces selecting a specific date and time slot (e.g., 10:00, 13:00, 15:00) before enabling checkout. For Stays and Transport, it checks available chalet or seat inventory.
4. **Checkout Simulation:** The guest completes a checkout form (`/checkout/book`) which simulates payment gateway processing, reserves the slot/room/seat, automatically decrements the active inventory in the store, and shows a booking confirmation receipt.
5. **Host Management:** Local lodge hosts create and update listings through clean, step-by-step wizards. Changing unit counts (e.g., chalets) immediately updates available inventory across the app.

## The Core Journey Through the System
1. **Browse:** Guest visits `/` or `/explore` $\rightarrow$ Next.js client component renders category tabs (`Stays`, `Experiences`, `Transport`) fetching from `mock-data.ts` and `inventoryStore`.
2. **Select & Inspect:** Guest clicks a listing $\rightarrow$ Next.js routes to `/stays/[id]`, `/experiences/[id]`, or `/transport/[id]`.
3. **Check Availability:**
   - **Stays:** Calendar selects check-in/out $\rightarrow$ checks `useInventoryStore.getAvailableCount(listingId)`.
   - **Experiences:** Date picker selected $\rightarrow$ triggers daily slot availability check $\rightarrow$ guest selects an available time slot (10:00, 13:00, 15:00).
   - **Transport:** Guest selects trip mode (one-way / round trip / private hire) and passenger count $\rightarrow$ checks vehicle seat capacity.
4. **Initiate Booking:** Guest clicks "Book Now" $\rightarrow$ router navigates to `/checkout/book?type=...&id=...` carrying selected dates, slot, and guest count.
5. **Simulated Payment & Inventory Reduction:** Guest enters contact details $\rightarrow$ selects simulated payment gateway $\rightarrow$ submits $\rightarrow$ `useBookingStore` records booking and `useInventoryStore` decrements available units/seats $\rightarrow$ router redirects to `/checkout/confirmation`.
6. **Host Parity:** Host opens `/host/create` $\rightarrow$ submits new stay/experience/transport $\rightarrow$ new record saved to state $\rightarrow$ immediately searchable on Explore page.

PRD ref: `prd.md > The Core Journey`.

## Stack
- **Framework:** Next.js 15+ (App Router, Client Components for interactive UI) — [Next.js Docs](https://nextjs.org/docs)
- **Language:** TypeScript 5+ — strictly typed props, state interfaces, and data models — [TypeScript Docs](https://www.typescriptlang.org/docs/)
- **Styling:** Tailwind CSS + Radix UI Primitives + Lucide React Icons — [Tailwind Docs](https://tailwindcss.com/docs)
- **State Management:** Zustand with `persist` middleware backed by `safeLocalStorage` for instant reactivity and persistence across reloads — [Zustand Docs](https://zustand.docs.pmnd.rs/)
- **UI Notifications:** Sonner toast library for feedback on bookings, errors, and inventory updates — [Sonner Docs](https://sonner.emilkowal.ski/)

## Where It Runs and How Someone Tries It
- **Runtime:** Node.js / Bun local development server running in any modern browser.
- **Port:** `http://localhost:3000`
- **Start Command:**
  ```bash
  bun run dev
  # or
  npm run dev
  ```
- **Demo Script:**
  1. Open `http://localhost:3000/explore` and toggle between Stays, Experiences, and Transport.
  2. Open an Experience detail page, pick a date, view the available time slots, select a slot, and click "Book Now".
  3. Complete checkout on `/checkout/book` and verify confirmation receipt on `/checkout/confirmation`.
  4. Navigate to `/host/create` or `/host/inventory` to adjust available units and verify instant parity.

## Look and Feel
- **Visual Consistency:** Unified layout across Stays, Experiences, and Transport detail pages—sharing the same 5-image gallery grid, border radiuses (`rounded-2xl`), typography hierarchy, and sticky right-hand booking card.
- **Color Palette:** Warm, rich local Zambian tones: deep slate headers, warm amber/emerald accents, clean neutral borders (`border-border`), and high-contrast readable text.
- **Currency & Labels:** Exclusively Zambian Kwacha formatted as `ZMW [amount]` (e.g. `ZMW 450 / night`).

## Components

### 1. Unified Detail Page System
- **Files:** 
  - `src/components/guest/listings/StayDetailPage.tsx`
  - `src/components/guest/listings/ExperienceDetailPage.tsx`
  - `src/components/guest/listings/TransportDetailPage.tsx`
- **Function:** Refactored to share identical visual shell: 5-photo grid, host badges, description, amenities/specs tag grid, reviews, and similar items.
- PRD ref: `prd.md > Screens and Layout`, `prd.md > Features and Behavior #1`.

### 2. ExperienceSlotChecker & Availability Widget
- **Files:** Integrated within `ExperienceDetailPage.tsx` and sticky booking card.
- **Function:** Displays interactive daily time slot pills (e.g. `10:00 AM - 12:00 PM`, `01:00 PM - 03:00 PM`, `03:30 PM - 05:30 PM`) with remaining spots. Disables "Book Now" until a slot is chosen.
- PRD ref: `prd.md > Features and Behavior #2`.

### 3. StickyBookingCard
- **Files:** Reusable booking widget in each detail page.
- **Function:** Displays dynamic pricing in ZMW, live total calculation with fees, unit/seat availability count from `useInventoryStore`, and "Book Now" or "Sold Out" status.
- PRD ref: `prd.md > Features and Behavior #3`.

### 4. Booking Checkout & Confirmation
- **Files:** 
  - `src/components/guest/checkout/BookingFormPage.tsx`
  - `src/components/guest/checkout/BookingConfirmationPage.tsx`
- **Function:** Reads checkout params, renders price summary, simulates payment gateway authorization, creates booking record, and reduces available inventory.
- PRD ref: `prd.md > The Core Journey #1`.

### 5. Host Creation & Multi-Unit Inventory Manager
- **Files:**
  - `src/components/host/create/CreateVerticalGateway.tsx`
  - `src/components/host/create/stay/StayCreateFlow.tsx`
  - `src/components/host/create/experience/ExperienceCreateFlow.tsx`
  - `src/components/host/create/transport/TransportCreateFlow.tsx`
  - `src/components/host/HostInventoryPage.tsx`
  - `src/store/inventoryStore.ts`
- **Function:** Minimal wizard for older/independent hosts to publish listings and adjust property unit counts (e.g., 15 chalets under lodge name).
- PRD ref: `prd.md > Features and Behavior #4`.

## Data Model

```typescript
// Core Listing types in src/lib/mock-data.ts
export interface Stay {
  id: string;
  name: string;
  location: string;
  price: number; // ZMW
  images: string[];
  amenities: string[];
  type: string;
  description?: string;
  beds?: number;
  baths?: number;
  guests?: number;
}

export interface Experience {
  id: string;
  name: string;
  location: string;
  price: number; // ZMW
  images: string[];
  duration: string;
  category: string;
  description: string;
  timeSlots?: string[]; // e.g. ["10:00 AM", "01:00 PM", "03:30 PM"]
  included?: string[];
  whatToBring?: string[];
}

export interface Transport {
  id: string;
  from: string;
  to: string;
  operator: string;
  price: number; // ZMW
  images?: string[];
  duration: string;
  vehicleType?: "bus" | "shuttle" | "private_car";
  seatCapacity?: number;
  availableSeats?: number;
  departureTime?: string;
}

// Inventory Unit in src/lib/mock-inventory.ts
export interface InventoryUnit {
  id: string;
  label: string; // e.g., "Chalet 1", "Morning Slot 10:00", "Seat 4A"
  status: "available" | "occupied" | "blocked";
  note?: string;
}

export interface ListingInventory {
  listingId: string;
  propertyName: string;
  unitLabel: string;
  unitLabelPlural: string;
  total: number;
  units: InventoryUnit[];
}
```

## File Structure

```
miniproject/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── explore/page.tsx               # Explore hub & tabbed discovery
│   │   │   ├── stays/[id]/page.tsx            # Stay Detail Route
│   │   │   ├── experiences/[id]/page.tsx      # Experience Detail Route
│   │   │   ├── transport/[id]/page.tsx        # Transport Detail Route
│   │   │   └── checkout/
│   │   │       ├── book/page.tsx              # Booking checkout form
│   │   │       └── confirmation/page.tsx      # Confirmation receipt
│   │   └── host/
│   │       ├── create/page.tsx                # Listing creation gateway
│   │       └── inventory/page.tsx             # Lodge & unit inventory manager
│   ├── components/
│   │   ├── guest/
│   │   │   ├── listings/
│   │   │   │   ├── StayDetailPage.tsx         # Unified Stay Detail component
│   │   │   │   ├── ExperienceDetailPage.tsx   # Unified Experience Detail component
│   │   │   │   └── TransportDetailPage.tsx    # Unified Transport Detail component
│   │   │   ├── checkout/
│   │   │   │   ├── BookingFormPage.tsx        # Unified booking checkout
│   │   │   │   └── BookingConfirmationPage.tsx# Booking confirmation view
│   │   │   └── explore/
│   │   │       └── ExplorePage.tsx            # Tabbed discovery & search
│   │   └── host/
│   │       ├── create/                        # Host creation wizards
│   │       └── HostInventoryPage.tsx          # Inventory management UI
│   ├── store/
│   │   ├── inventoryStore.ts                  # Reactive multi-unit inventory store
│   │   ├── bookingStore.ts                    # Confirmed bookings store
│   │   └── availabilityStore.ts               # Date & pricing rules store
│   └── lib/
│       ├── mock-data.ts                       # Zambian stays, experiences, transports
│       └── mock-inventory.ts                  # Initial unit counts and generator
└── devpost/
    ├── learner-profile.md                     # Completed profile
    ├── scope.md                               # Approved scope
    ├── prd.md                                 # Approved PRD
    └── spec.md                                # Approved Technical Blueprint
```

## External Services and Dependencies
- **Browser LocalStorage:** No external cloud services or databases required for this POC. All persistence is managed client-side via Zustand `persist` middleware.
- **Zero Third-Party API Keys:** Completely self-contained, ensuring instant local testing with zero environment friction.

## Important Failure Modes
1. **Listing Not Found / Invalid ID:** If a guest navigates to an unknown ID in `/stays/[id]`, display a friendly fallback with a button to return to the Explore page.
2. **0 Inventory / Overbooked Slot:** If all chalets, seats, or experience slots are booked, the booking button disables with a high-visibility "Sold Out" state, preventing duplicate bookings.
3. **Form Validation Failures:** In checkout, missing guest phone numbers or names are highlighted with inline errors and toast alerts.

## What Was Simplified and Why
- **Local Reactive State instead of PostgreSQL/Supabase:** Avoids database migration and cloud hosting friction during initial development, allowing instant testing of the entire user journey.
- **Simulated Payment Gateway instead of Live Mobile Money API:** Lets us verify the full booking state machine and inventory decrement without requiring live Zambian telecom merchant agreements.
- **Pre-seeded Authentic Zambian Mock Data:** Provides rich, representative lodges and tours across Lusaka, Livingstone, and Kafue immediately.

## Decisions and Open Issues
- **Consistent Visual Framework:** Detail pages unified around a common 2-column container with 5-photo hero gallery and sticky booking widget.
- **Experience Slot Enforcement:** Explicit requirement that experiences require selecting an available daily time slot before checkout is unlocked.
- **Technical Clarification:** Demonstrated how `useInventoryStore.adjustInventoryCount()` connects host chalet adjustments directly to the guest availability badges.
