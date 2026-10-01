---
doc: prd
status: approved
---

# Nearby Escapes — Product Requirements Document

A domestic Zambian travel platform that democratizes travel for young locals (students, youth) through affordable Stays, Experiences, and Transport, while empowering small local lodge hosts and operators with simple listing and inventory tools.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`

## The Core Journey

### 1. Guest Journey: Discovery to Confirmed Booking
1. **Home / Discovery:** The guest lands on the homepage, selects a destination/city (e.g., Lusaka, Livingstone, Kafue), and explores via three tabs: **Stays**, **Experiences**, and **Transport**.
2. **Search & Filters:** The guest can filter listings by location, price (ZMW), or category-specific tags.
3. **Product Detail View:** The guest opens a listing and sees a unified layout:
   - Hero photo gallery (up to 5 host-uploaded images).
   - Host/Lodge business identity, title, rating, and location.
   - Amenities and features tag pills.
   - Category-specific details (itinerary, room types, vehicle specs).
   - Reviews and similar recommendations.
4. **Availability & Slot Check:**
   - **For Stays:** Guest picks check-in and check-out dates; checks if chalets/rooms are available (> 0 in inventory).
   - **For Experiences:** Guest chooses a date and must **Check Availability** to select an open time slot (e.g. 10:00, 13:00, 15:00) before "Book Now" is enabled.
   - **For Transport:** Guest picks trip type (one-way, round trip, full vehicle) and checks available seats.
5. **Checkout & Confirmation:** Guest clicks "Book Now", reviews their trip on `/checkout/book`, fills in guest info, simulates payment gateway confirmation, and lands on `/checkout/confirmation`. Available inventory is automatically decremented.

### 2. Host Journey: Listing Creation & Inventory Management
1. **Vertical Gateway:** The host navigates to the host portal and chooses what to list: **Stay**, **Experience**, or **Transport**.
2. **Step-by-Step Creation:** A clean, minimal, non-complex wizard collects essential fields:
   - Business/property name, description, and location.
   - Up to 5 photos.
   - Category options (amenities, experience slots, or transport vehicle/route specs).
   - Local pricing (in ZMW).
3. **Inventory Setup:**
   - For Lodges: Sets total available unit count (e.g., 15 chalets for the lodge).
   - For Experiences: Sets max spots per daily time slot.
   - For Transport: Sets total seat capacity.
4. **Instant Catalog Parity:** Newly created listings and edited inventory counts immediately reflect in the guest-facing catalog and detail views.

## Screens and Layout

1. **Home & Explore Surfaces (`/` and `/explore`):**
   - Search bar with destination selector and date/guest controls.
   - Three category tabs: `Stays`, `Experiences`, `Transport`.
   - Responsive listing cards showing cover image, title, location, rating, price per night/person/seat in ZMW, and category badge.
2. **Unified Product Detail Pages (`/stays/[id]`, `/experiences/[id]`, `/transport/[id]`):**
   - **Top:** 5-image hero layout with lightbox viewer.
   - **Main (Left ~65%):** Business badge, title, location pin, description, amenities pill grid, category-specific breakdown (itinerary/slots/rules), host profile card, customer reviews, and similar items.
   - **Sticky Booking Widget (Right ~35%):**
     - Price prominently in ZMW.
     - Live date/slot/seat picker.
     - Availability check indicator.
     - Cost breakdown (base rate + service fee = total ZMW).
     - Prominent "Book Now" button (or "Sold Out" state).
3. **Checkout Flow (`/checkout/book` & `/checkout/confirmation`):**
   - Order summary sidebar with selected listing photo, dates/slots, and pricing breakdown.
   - Guest details form (name, email, phone).
   - Simulated payment gateway selector.
   - Confirmation page showing booking reference, receipt, and next steps.
4. **Host Creation Wizard (`/host/create/...`):**
   - Clean, step-by-step progress indicator designed for low tech barrier.
   - Dedicated flows for Stays, Experiences, and Transport.
   - Property inventory configuration.

## Look and Feel
- **Visual Consistency:** Unified design system across Guest and Host pages: consistent card corner radiuses, clean borders, consistent typography (Inter/Sans), and harmonious spacing.
- **Palette:** Warm, vibrant, welcoming Zambian aesthetic with crisp contrast, clean whites/grays, and accessible status colors (emerald for available, amber for limited spots, rose for sold out).
- **Zambian Context:** All currency displayed in Zambian Kwacha (ZMW). Local destination terminology and routes (Lusaka, Livingstone, Ndola, Siavonga, Kafue).

## Features and Behavior

### 1. Guest Discovery & Search
- As a traveler, I want to search and toggle between Stays, Experiences, and Transport so I can plan my entire domestic trip in one place.
  - [ ] Category tabs filter listings instantly.
  - [ ] Search input matches listing title, description, or location.
  - [ ] Price tags clearly display `ZMW` values.

### 2. Experience Slot & Availability Checking
- As a traveler booking an Experience, I want to check available time slots on a specific date before booking so I can reserve a guaranteed spot.
  - [ ] Guest selects a calendar date.
  - [ ] System checks and displays daily time slots (e.g. 10:00, 13:00, 15:00) with remaining capacity.
  - [ ] "Book Now" remains disabled until an active, available slot is selected.
  - [ ] If all slots are full for that date, display "Sold Out on this date" badge.

### 3. Stay & Transport Inventory Enforcement
- As a traveler, I want to see real-time availability so I don't book an unavailable room or seat.
  - [ ] Stays detail widget checks property chalet/room inventory.
  - [ ] Transport detail widget checks remaining seat count.
  - [ ] When inventory reaches 0, the booking CTA transitions to "Sold Out" and disables.

### 4. Host Creation & Multi-Unit Inventory
- As an older lodge owner, I want a simple way to list my property and set how many chalets I have so guests can book without overbooking.
  - [ ] Wizard walks through listing type, photos, pricing in ZMW, and amenities.
  - [ ] Lodge inventory input allows setting total room/chalet capacity (e.g., 15).
  - [ ] Saving the listing updates the reactive state store immediately.

## States and Boundaries

- **Normal Available State:** Listings show full details, green "Available" indicators, active date/slot pickers, and enabled "Book Now" CTA.
- **Sold Out / 0 Inventory State:**
  - Booking widget displays clear red/amber "Sold Out" warning.
  - Date/slot pickers show 0 spots remaining.
  - "Book Now" button is disabled.
- **No Search Results State:**
  - When a query or filter finds 0 matches, display a warm, localized empty state: "No escapes found in [destination] yet. Try exploring nearby areas like Lusaka or Livingstone."
- **Persistence Boundary:**
  - POC uses reactive in-memory / local state stores (`inventoryStore`, `availabilityStore`, `mock-data`). Changes persist across page navigations in the current session.

## Product Decisions

- **Consistent Design Language:** All detail pages share identical layout grids, typography, and card structures to eliminate fragmented visual styles.
- **Slot Selection Mandatory for Experiences:** Experiences require selecting an explicit daily time slot before initiating checkout.
- **Local State First:** We will verify and polish the user journey using local state and mock stores before connecting live PostgreSQL/Supabase databases.
- **No Flight Bookings:** Excluded by design to maintain affordability for young travelers.

## What We're Building (POC)
1. **Design System Polish:** Refactor `StayDetailPage`, `ExperienceDetailPage`, and `TransportDetailPage` to share a unified visual hierarchy and component styling.
2. **Dynamic Host-to-Guest Data Flow:** Ensure all host creation fields (photos, descriptions, amenities, pricing in ZMW, daily slots, vehicle specs) dynamically render on guest detail pages.
3. **Availability & Slot Logic:** Wire up date selection and experience slot checking to live inventory counts.
4. **End-to-End Booking:** Seamless navigation from Detail -> `/checkout/book` -> `/checkout/confirmation`, decrementing available inventory upon payment simulation.
5. **Host Inventory Update:** Ensure hosts can view and adjust room/seat counts in the host management view.

## Deferred From the POC
- Live Mobile Money API integration (MTN MoMo, Airtel Money API).
- Production database persistence & user authentication backend.
- Automated SMS / WhatsApp booking confirmations.
- Multi-host calendar sync (iCal).

## Non-Goals
- Flight or airline ticketing.
- Complicated OTA yield management or multi-tiered corporate rate tables.

## Open Questions
- None blocking spec: The journey, slot checking, inventory rules, and visual consistency requirements are clearly defined.
