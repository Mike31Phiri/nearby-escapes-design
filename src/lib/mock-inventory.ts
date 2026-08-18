/**
 * Mock inventory for host listings.
 *
 * Every listing carries a set of sellable units — the host declares the count
 * during onboarding (rooms for lodges, seats for buses, slots / individual
 * capacity for activities). This module simulates that inventory so the host
 * portal can show what is available vs unavailable at a glance.
 */

export type InventoryUnitStatus = "available" | "occupied" | "blocked";

export interface InventoryUnit {
  id: string;
  label: string;
  status: InventoryUnitStatus;
  /** e.g. "Guest: Sarah P. · Jun 25–29" */
  note?: string;
  /** Per-unit rate in ZMW (informational) */
  price?: number;
}

export interface ListingInventory {
  listingId: string;
  unitType: "room" | "slot" | "seat";
  /** Singular label — "Room", "Slot", "Seat" */
  unitLabel: string;
  /** Plural label — "Rooms", "Slots", "Seats" */
  unitLabelPlural: string;
  total: number;
  units: InventoryUnit[];
}

/** Build seat labels like 1A–1D, 2A–2D … */
function buildSeats(rows: number, cols: number, availableEvery = 3): InventoryUnit[] {
  const letters = ["A", "B", "C", "D"];
  const units: InventoryUnit[] = [];
  let n = 0;
  for (let r = 1; r <= rows; r++) {
    for (let c = 0; c < cols; c++) {
      n += 1;
      const occupied = n % availableEvery === 0;
      units.push({
        id: `seat-${r}${letters[c]}`,
        label: `Seat ${r}${letters[c]}`,
        status: occupied ? "occupied" : "available",
        price: 250,
        ...(occupied ? { note: "Booked · next departure" } : {}),
      });
    }
  }
  return units;
}

/** Build room units with a mix of availability. */
function buildRooms(
  names: string[],
  price: number,
  occupiedIdx: number[] = [],
  blockedIdx: number[] = [],
): InventoryUnit[] {
  return names.map((label, i) => {
    const status: InventoryUnitStatus = occupiedIdx.includes(i)
      ? "occupied"
      : blockedIdx.includes(i)
        ? "blocked"
        : "available";
    return {
      id: `room-${i + 1}`,
      label,
      status,
      price,
      ...(status === "occupied"
        ? { note: "Occupied · checking out soon" }
        : status === "blocked"
          ? { note: "Closed · maintenance" }
          : {}),
    };
  });
}

/** Build activity slots. */
function buildSlots(
  slots: { label: string; note: string; status: InventoryUnitStatus }[],
  price: number,
): InventoryUnit[] {
  return slots.map((s, i) => ({
    id: `slot-${i + 1}`,
    label: s.label,
    status: s.status,
    price,
    ...(s.note ? { note: s.note } : {}),
  }));
}

export const mockInventories: ListingInventory[] = [
  {
    listingId: "h1",
    unitType: "room",
    unitLabel: "Room",
    unitLabelPlural: "Rooms",
    total: 8,
    units: buildRooms(
      [
        "Room 1 — Savanna Suite",
        "Room 2 — River View",
        "Room 3 — Baobab Suite",
        "Room 4 — Zambezi View",
        "Room 5 — Bush Chalet",
        "Room 6 — Acacia Suite",
        "Room 7 — Sunset Room",
        "Room 8 — Elephant Room",
      ],
      450,
      [0, 4],
      [6],
    ),
  },
  {
    listingId: "h2",
    unitType: "room",
    unitLabel: "Room",
    unitLabelPlural: "Rooms",
    total: 6,
    units: buildRooms(
      [
        "Room 1 — River Lodge Twin",
        "Room 2 — River Lodge King",
        "Room 3 — Family Chalet",
        "Room 4 — Waterfront Cabin",
        "Room 5 — Bushview Room",
        "Room 6 — Garden Room",
      ],
      380,
      [1, 2],
    ),
  },
  {
    listingId: "h3",
    unitType: "room",
    unitLabel: "Tent",
    unitLabelPlural: "Tents",
    total: 4,
    units: buildRooms(
      [
        "Tent 1 — Wetlands Meru",
        "Tent 2 — Birders' Meru",
        "Tent 3 — Family Meru",
        "Tent 4 — Lakeside Meru",
      ],
      420,
      [0, 3],
    ),
  },
  {
    listingId: "h4",
    unitType: "slot",
    unitLabel: "Slot",
    unitLabelPlural: "Slots",
    total: 6,
    units: buildSlots(
      [
        { label: "Sunrise Flight · 06:30", status: "occupied", note: "Booked · 4 pax" },
        { label: "Morning Flight · 08:00", status: "available", note: "" },
        { label: "Midday Flight · 10:00", status: "blocked", note: "Closed · airfield works" },
        { label: "Afternoon Flight · 14:00", status: "available", note: "" },
        { label: "Golden Hour Flight · 16:00", status: "available", note: "" },
        { label: "Sunset Flight · 17:30", status: "occupied", note: "Booked · 2 pax" },
      ],
      180,
    ),
  },
  {
    listingId: "h5",
    unitType: "slot",
    unitLabel: "Slot",
    unitLabelPlural: "Slots",
    total: 4,
    units: buildSlots(
      [
        { label: "Morning Drive · 06:00", status: "occupied", note: "Booked · 2 pax" },
        { label: "Midday Drive · 11:00", status: "available", note: "" },
        { label: "Afternoon Drive · 15:00", status: "available", note: "" },
        { label: "Night Drive · 19:00", status: "available", note: "" },
      ],
      120,
    ),
  },
  {
    listingId: "h6",
    unitType: "seat",
    unitLabel: "Seat",
    unitLabelPlural: "Seats",
    total: 20,
    units: buildSeats(5, 4),
  },
];

/** Look up inventory for a listing id. */
export function getInventoryForListing(listingId: string): ListingInventory | undefined {
  return mockInventories.find((inv) => inv.listingId === listingId);
}

/** Counts helper — available / occupied / blocked / total. */
export function inventoryCounts(inv: ListingInventory) {
  const available = inv.units.filter((u) => u.status === "available").length;
  const occupied = inv.units.filter((u) => u.status === "occupied").length;
  const blocked = inv.units.filter((u) => u.status === "blocked").length;
  return {
    total: inv.total,
    available,
    occupied,
    blocked,
    unavailable: occupied + blocked,
  };
}
