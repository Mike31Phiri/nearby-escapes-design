---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [ ] **1. Unified Detail Page System & Design Consistency**
  Becomes usable: All three detail pages (`/stays/[id]`, `/experiences/[id]`, `/transport/[id]`) share a unified visual shell: 5-photo hero gallery, clean Zambian Kwacha (ZMW) pricing, consistent typography, badges, amenities pills, host card, reviews, and sticky booking card.
  Why now: Solves the core user pain point of "inconsistent design style" across the three verticals, establishing the shared visual foundation.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Components > 1. Unified Detail Page System`, `spec.md > Look and Feel`
  Build: Harmonize `StayDetailPage.tsx`, `ExperienceDetailPage.tsx`, and `TransportDetailPage.tsx` to share layout structure, styling tokens, and 5-image hero grids.
  Verify (mechanical): Run TypeScript check and verify all three detail page components compile cleanly without syntax or prop errors.
  Learner check: Open `/stays/s1`, `/experiences/e1`, and `/transport/t1` in the browser and confirm the pages look consistent and cohesive.
  Commit: `Unify visual layout and design across Stays, Experiences, and Transport detail pages`

- [ ] **2. Experience Daily Slot Checking & Availability Engine**
  Becomes usable: On the Experience detail page, guests must pick a date and check daily availability slots (e.g. 10:00 AM, 1:00 PM, 3:30 PM). Selecting an active slot unlocks the "Book Now" CTA with live capacity indicators.
  Why now: Directly implements the core business logic the user requested before checkout can be initiated for experiences.
  PRD ref: `prd.md > Features and Behavior #2`
  Spec ref: `spec.md > Components > 2. ExperienceSlotChecker & Availability Widget`
  Build: Implement interactive daily slot checker in `ExperienceDetailPage.tsx`, validate capacity per slot, and require slot selection before navigating to checkout.
  Verify (mechanical): Validate that clicking dates renders slots, selecting slot enables "Book Now", and no-slot/full dates display sold out indicators.
  Learner check: Pick a date on an experience, click a time slot, verify that spots remaining update and "Book Now" activates with the selected slot.
  Commit: `Add daily time slot availability checker to Experience detail page`

- [ ] **3. Multi-Unit Inventory & Live Capacity Enforcement**
  Becomes usable: Stay and Transport detail booking cards check live inventory from `useInventoryStore` (e.g., lodge chalets and shuttle seats). When inventory reaches 0, the booking CTA displays a high-visibility "Sold Out" state.
  Why now: Prevents overbooking for lodge chalets and transport seats, fulfilling the core inventory requirement for hosts.
  PRD ref: `prd.md > Features and Behavior #3`
  Spec ref: `spec.md > Components > 3. StickyBookingCard`, `spec.md > Data Model`
  Build: Wire `useInventoryStore.getAvailableCount(listingId)` to the booking widgets for Stays and Transport, showing remaining units and disabling CTA when 0.
  Verify (mechanical): Toggle unit statuses in `useInventoryStore` and verify detail card transitions dynamically between "Available" and "Sold Out".
  Learner check: Check a stay and transport detail page; verify the remaining units count displays accurately in the booking card.
  Commit: `Enforce live unit and seat inventory on Stay and Transport booking widgets`

- [ ] **4. End-to-End Booking Checkout & Automatic Inventory Decrement**
  Becomes usable: Clicking "Book Now" on any detail page takes the selected dates, slots, or seats into `/checkout/book`. Completing the checkout form and simulated payment confirms the reservation on `/checkout/confirmation` and automatically decrements the active inventory in `useInventoryStore`.
  Why now: Closes the full guest loop from discovery to confirmed booking with live inventory consequence.
  PRD ref: `prd.md > The Core Journey #1`, `prd.md > What We're Building`
  Spec ref: `spec.md > Components > 4. Booking Checkout & Confirmation`
  Build: Ensure `/checkout/book` receives experience slot params, finalizes the booking in `useBookingStore`, calls `useInventoryStore.adjustInventoryCount()` or blocks an inventory unit, and redirects to confirmation.
  Verify (mechanical): Submit a booking and verify the inventory count in `useInventoryStore` decreases by 1 and the booking appears in `useBookingStore`.
  Learner check: Book an experience or chalet, walk through checkout, see the confirmation receipt, and verify remaining inventory drops.
  Commit: `Connect checkout to automatic inventory reduction and booking confirmation`

- [ ] **5. Host Portal Listing Creation & Inventory Sync**
  Becomes usable: A host can use `/host/create` to publish a stay, experience, or transport listing and adjust property unit counts in `/host/inventory` (e.g., 15 chalets under the lodge name), with new listings immediately appearing in `/explore` and detail pages.
  Why now: Completes the host side of the POC, ensuring older lodge operators have an ultra-simple listing and inventory experience with full catalog parity.
  PRD ref: `prd.md > The Core Journey #2`, `prd.md > Features and Behavior #4`
  Spec ref: `spec.md > Components > 5. Host Creation & Multi-Unit Inventory Manager`
  Build: Ensure `StayCreateFlow`, `ExperienceCreateFlow`, and `TransportCreateFlow` register new listings into the listing store, and verify property inventory updates in `HostInventoryPage.tsx`.
  Verify (mechanical): Create a test listing in the wizard and verify it appears in `ExplorePage.tsx` and can be opened in the detail view.
  Learner check: Go to the host portal, add/adjust chalets for a lodge, and see the updated inventory reflected immediately on the guest side.
  Commit: `Sync host listing creation and inventory adjustments with guest catalog`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Slice 2 (Unified detail pages + Experience daily slot checking tried in browser)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [to be completed at end of build]
Route and stops: [to be completed at end of build]
Edit outcome: [to be completed at end of build]
Reflection: [to be completed at end of build]
Activity mode: [to be completed at end of build]

## Revisions

