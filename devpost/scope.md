---
doc: scope
status: approved
---

# Nearby Escapes

A hyper-local Zambian travel platform redefining domestic travel by making Stays, Experiences, and Transport affordable, accessible, and community-driven.

## The Unique Kernel
An all-in-one domestic travel platform built exclusively for Zambia that unlocks affordable, overlooked escapes—connecting younger, budget-conscious travelers with small, local lodge owners and operators who cannot afford the high fees or complexity of global OTAs like Airbnb or Booking.com.

## Who It's For
- **The Traveler (Guest):** A young Zambian (student, early-career professional, Gen Z/millennial) who wants to explore Zambia (Lusaka, Livingstone, Kafue, etc.) without spending a fortune. They currently rely on word-of-mouth, disorganized WhatsApp groups, or overpriced tourist lodges.
- **The Host (Lodge/Activity/Transport Operator):** Often a traditional or older lodge owner (in their 60s, 70s, or 80s) or independent local operator who needs an ultra-simple, low-commission way to list rooms/chalets, set pricing, and manage inventory without getting bogged down by complicated tech.

## The Core Loop
1. **Discover & Search:** The traveler lands on Nearby Escapes, selects a destination/area, and browses or searches across three core tabs: **Stays**, **Experiences**, and **Transport**.
2. **Review Details:** The traveler inspects a cohesive, beautifully formatted product detail page showing authentic photos, local pricing (ZMW), amenities, and vital info.
3. **Book:** The traveler initiates a booking and proceeds through a clean checkout flow.
4. **Host Management:** The host logs in to a clean, minimal portal, creates or edits a listing (defining property details and inventory count, like 15 chalets), which instantly updates the guest-facing catalog.

## Inspiration & Identity
- **Mood & Aesthetic:** Fresh, vibrant, welcoming, and authentically Zambian. Modern and dynamic for younger travelers, yet clean and uncluttered enough for older hosts.
- **Visual Consistency:** A unified design style across all surfaces (Home, Explore, and the 3 Detail pages for Stays, Experiences, and Transport)—sharing the same layout rhythm, typography, visual hierarchy, and local touch.
- **Tone:** Affordable, adventurous, reliable, and proudly local.
- **Key Categories:**
  - *Stays:* Budget lodges, guesthouses, chalets, campsites.
  - *Experiences:* Cultural excursions, wildlife/nature tours, local entertainment.
  - *Transport:* Affordable ground options—intercity buses, shuttles, and private vehicle hires (excluding expensive flights).

## Why This Matters to the Learner
To create a real, impactful product that stimulates domestic tourism in Zambia, democratizes travel for younger generations, and gives local hospitality hosts a fair, low-cost platform to thrive.

## What "Working" Looks Like
A cohesive, end-to-end working prototype where:
1. A guest can browse and filter listings across Stays, Experiences, and Transport by location.
2. The product detail pages for all three categories have a consistent, polished layout displaying all host-provided fields.
3. The guest can select dates/options and walk through the checkout flow.
4. A host can create a listing and adjust lodge inventory count, and those changes seamlessly reflect in the state and detail views.

## The POC Boundary (Now)
- **Unified Guest Experience:**
  - Search and filter bar toggling across Stays, Experiences, and Transport.
  - Explore destination view (e.g., exploring top highlights in Lusaka).
  - Consistent and cohesive Product Detail Pages for Stays, Experiences, and Transport.
  - End-to-end Booking & Checkout flow (using payment gateway simulation/mock flow).
- **Streamlined Host Portal:**
  - Minimalist listing creation wizard for all 3 categories (Stays, Experiences, Transport) with clear fields (type, amenities, pricing).
  - Lodge Inventory management (managing multi-room/chalet quantities linked by property ID).
- **Data & State:**
  - Reactive local state / mock data store powering both host and guest views synchronously.

## Later
- Real backend database persistence (PostgreSQL/Supabase) and production authentication.
- Live Escrow payment integration and direct Zambian Mobile Money gateways (MTN, Airtel, Zamtel MoMo).
- Host analytics dashboard, reviews system, and automated multi-channel calendar sync.

## Explicitly Cut
- **Flight/Air Travel:** Excluded intentionally to maintain the core focus on affordable, accessible travel for the youth demographic.
- **Complex OTA Host Dashboards:** Intentionally cutting convoluted settings, multi-tier pricing models, and dense tabular interfaces to ensure older lodge hosts can navigate with zero confusion.
