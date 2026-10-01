/**
 * Mock inventory for single listings across Stays, Experiences, and Transport.
 *
 * A single listing represents an offering that carries inventory:
 * - Stays (Lodges / Camps): Multiple rooms or chalets of that lodge.
 * - Transport (Car Rentals / Fleets): Multiple vehicles of the same type (e.g., 2 or 3 identical cars).
 * - Experiences (Tours / Safaris): Multiple bookable time slots (e.g. Morning, Midday, Sunset).
 * - Transport (Routes / Shuttles): Seat inventory for scheduled departures.
 *
 * The listing remains available and bookable for as long as available inventory > 0.
 */

export type InventoryUnitStatus = "available" | "occupied" | "blocked";

export interface InventoryUnit {
  id: string;
  label: string;
  status: InventoryUnitStatus;
  /** e.g. "Guest: Sarah P. · Jun 25–29" or "Cleaned & fueled" */
  note?: string;
  /** Per-unit rate in ZMW (informational) */
  price?: number;
  /** Time slot string for experiences (e.g. "08:00 AM", "14:00 PM") */
  timeSlot?: string;
  /** Registration plate number for vehicles */
  plateNumber?: string;
  /** Available participant capacity / spots */
  capacity?: number;
}

export interface ListingInventory {
  listingId: string;
  unitType: "room" | "slot" | "seat" | "vehicle";
  /** Singular label — "Room", "Time Slot", "Seat", "Vehicle" */
  unitLabel: string;
  /** Plural label — "Rooms", "Time Slots", "Seats", "Vehicles" */
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
          ? { note: "Closed · maintenance & service" }
          : { note: "Ready for check-in" }),
    };
  });
}

/** Build activity / experience time slots. */
function buildSlots(
  slots: { label: string; timeSlot: string; note: string; status: InventoryUnitStatus; capacity?: number }[],
  price: number,
): InventoryUnit[] {
  return slots.map((s, i) => ({
    id: `slot-${i + 1}`,
    label: s.label,
    timeSlot: s.timeSlot,
    status: s.status,
    price,
    capacity: s.capacity ?? 6,
    ...(s.note ? { note: s.note } : {}),
  }));
}

/** Build vehicle fleet units (e.g. 2 or 3 cars on a single transport listing). */
function buildVehicles(
  vehicles: { label: string; plateNumber: string; note: string; status: InventoryUnitStatus }[],
  price: number,
): InventoryUnit[] {
  return vehicles.map((v, i) => ({
    id: `veh-${i + 1}`,
    label: v.label,
    plateNumber: v.plateNumber,
    status: v.status,
    price,
    note: v.note,
  }));
}

export const mockInventories: ListingInventory[] = [
  // --- HOST PROFILE STAY LISTINGS ---
  {
    listingId: "h1",
    unitType: "room",
    unitLabel: "Chalet",
    unitLabelPlural: "Chalets",
    total: 8,
    units: buildRooms(
      [
        "Chalet 1 — Savanna Suite",
        "Chalet 2 — River View Suite",
        "Chalet 3 — Baobab Suite",
        "Chalet 4 — Zambezi View",
        "Chalet 5 — Bush Chalet",
        "Chalet 6 — Acacia Suite",
        "Chalet 7 — Sunset Room",
        "Chalet 8 — Elephant Room",
      ],
      450,
      [0, 4],
      [6],
    ),
  },
  {
    listingId: "h2",
    unitType: "room",
    unitLabel: "Chalet",
    unitLabelPlural: "Chalets",
    total: 6,
    units: buildRooms(
      [
        "Chalet 1 — River Lodge Twin",
        "Chalet 2 — River Lodge King",
        "Chalet 3 — Family Chalet",
        "Chalet 4 — Waterfront Cabin",
        "Chalet 5 — Bushview Room",
        "Chalet 6 — Garden Room",
      ],
      380,
      [1, 2],
    ),
  },
  {
    listingId: "h3",
    unitType: "room",
    unitLabel: "Safari Tent",
    unitLabelPlural: "Safari Tents",
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

  // --- HOST PROFILE EXPERIENCE LISTINGS ---
  {
    listingId: "h4",
    unitType: "slot",
    unitLabel: "Time Slot",
    unitLabelPlural: "Time Slots",
    total: 6,
    units: buildSlots(
      [
        { label: "Sunrise Flight", timeSlot: "06:30 AM", status: "occupied", note: "Booked · 4 pax", capacity: 0 },
        { label: "Morning Flight", timeSlot: "08:00 AM", status: "available", note: "4 spots remaining", capacity: 4 },
        { label: "Midday Flight", timeSlot: "10:30 AM", status: "blocked", note: "Closed · airfield maintenance", capacity: 0 },
        { label: "Afternoon Flight", timeSlot: "14:00 PM", status: "available", note: "6 spots remaining", capacity: 6 },
        { label: "Golden Hour Flight", timeSlot: "16:00 PM", status: "available", note: "3 spots remaining", capacity: 3 },
        { label: "Sunset Flight", timeSlot: "17:30 PM", status: "occupied", note: "Booked · 2 pax", capacity: 0 },
      ],
      180,
    ),
  },
  {
    listingId: "h5",
    unitType: "slot",
    unitLabel: "Time Slot",
    unitLabelPlural: "Time Slots",
    total: 4,
    units: buildSlots(
      [
        { label: "Dawn Game Drive", timeSlot: "06:00 AM", status: "occupied", note: "Booked · 4 pax", capacity: 0 },
        { label: "Midday Safari Trail", timeSlot: "11:00 AM", status: "available", note: "6 spots remaining", capacity: 6 },
        { label: "Afternoon Bush Drive", timeSlot: "15:00 PM", status: "available", note: "2 spots remaining", capacity: 2 },
        { label: "Night Eyes Spotlight Drive", timeSlot: "19:00 PM", status: "available", note: "5 spots remaining", capacity: 5 },
      ],
      120,
    ),
  },

  // --- HOST PROFILE TRANSPORT LISTINGS ---
  {
    listingId: "h6",
    unitType: "seat",
    unitLabel: "Seat",
    unitLabelPlural: "Seats",
    total: 20,
    units: buildSeats(5, 4),
  },
  {
    listingId: "h7",
    unitType: "vehicle",
    unitLabel: "Vehicle",
    unitLabelPlural: "Vehicles",
    total: 3,
    units: buildVehicles(
      [
        {
          label: "Vehicle 1 — 4x4 Land Cruiser Prado",
          plateNumber: "ABX 2940",
          status: "available",
          note: "Ready for departure · Full tank & GPS",
        },
        {
          label: "Vehicle 2 — 4x4 Land Cruiser Prado",
          plateNumber: "ALB 8412",
          status: "available",
          note: "Ready for departure · Roof rack & fridge",
        },
        {
          label: "Vehicle 3 — 4x4 Land Cruiser Prado",
          plateNumber: "BCA 1044",
          status: "occupied",
          note: "On safari · returns Friday 16:00",
        },
      ],
      1200,
    ),
  },

  // --- GUEST STAYS INVENTORIES ---
  {
    listingId: "1",
    unitType: "room",
    unitLabel: "Chalet",
    unitLabelPlural: "Chalets",
    total: 6,
    units: buildRooms(
      [
        "Chalet 1 — Presidential River Suite",
        "Chalet 2 — Luxury Safari Villa",
        "Chalet 3 — Elephant Valley Chalet",
        "Chalet 4 — Zambezi Sunset View",
        "Chalet 5 — Leopard Ridge Suite",
        "Chalet 6 — Hippo Pool Chalet",
      ],
      450,
      [0, 1],
    ),
  },
  {
    listingId: "2",
    unitType: "room",
    unitLabel: "Chalet",
    unitLabelPlural: "Chalets",
    total: 8,
    units: buildRooms(
      [
        "Chalet 1 — Lagoon Suite",
        "Chalet 2 — Wildlife View Chalet",
        "Chalet 3 — Acacia Family Suite",
        "Chalet 4 — Mfuwe Bush Villa",
        "Chalet 5 — Riverfront Chalet",
        "Chalet 6 — Woodland Chalet",
        "Chalet 7 — Safari Hideaway",
        "Chalet 8 — Baobab Boma",
      ],
      380,
      [1, 3],
      [7],
    ),
  },
  {
    listingId: "3",
    unitType: "room",
    unitLabel: "Chalet",
    unitLabelPlural: "Chalets",
    total: 5,
    units: buildRooms(
      [
        "Chalet 1 — Riverside Cottage",
        "Chalet 2 — Stilted Zambezi Chalet",
        "Chalet 3 — Garden Hideaway",
        "Chalet 4 — Island View Suite",
        "Chalet 5 — Family Riverside Suite",
      ],
      340,
      [2],
    ),
  },

  // --- GUEST EXPERIENCE TIME SLOTS ---
  {
    listingId: "e1",
    unitType: "slot",
    unitLabel: "Time Slot",
    unitLabelPlural: "Time Slots",
    total: 5,
    units: buildSlots(
      [
        { label: "Morning Flight", timeSlot: "08:00 AM", status: "available", note: "4 spots left", capacity: 4 },
        { label: "Midday Gorge Flight", timeSlot: "10:30 AM", status: "available", note: "6 spots left", capacity: 6 },
        { label: "Afternoon Flight", timeSlot: "13:30 PM", status: "blocked", note: "Scheduled maintenance", capacity: 0 },
        { label: "Scenic Falls Flight", timeSlot: "15:30 PM", status: "available", note: "3 spots left", capacity: 3 },
        { label: "Golden Sunset Flight", timeSlot: "17:00 PM", status: "occupied", note: "Fully booked", capacity: 0 },
      ],
      180,
    ),
  },
  {
    listingId: "e2",
    unitType: "slot",
    unitLabel: "Time Slot",
    unitLabelPlural: "Time Slots",
    total: 3,
    units: buildSlots(
      [
        { label: "Dawn Walking Safari", timeSlot: "06:30 AM", status: "available", note: "6 spots left", capacity: 6 },
        { label: "Bush Tracking Trail", timeSlot: "10:00 AM", status: "available", note: "4 spots left", capacity: 4 },
        { label: "Sundowner Walking Trail", timeSlot: "15:30 PM", status: "available", note: "2 spots left", capacity: 2 },
      ],
      140,
    ),
  },
  {
    listingId: "e3",
    unitType: "slot",
    unitLabel: "Time Slot",
    unitLabelPlural: "Time Slots",
    total: 3,
    units: buildSlots(
      [
        { label: "Morning Reef Snorkel", timeSlot: "08:30 AM", status: "available", note: "8 spots left", capacity: 8 },
        { label: "Island Discovery & Snorkel", timeSlot: "13:00 PM", status: "available", note: "5 spots left", capacity: 5 },
        { label: "Sunset Shoreline Cruise", timeSlot: "16:30 PM", status: "available", note: "4 spots left", capacity: 4 },
      ],
      110,
    ),
  },
  {
    listingId: "e4",
    unitType: "slot",
    unitLabel: "Time Slot",
    unitLabelPlural: "Time Slots",
    total: 4,
    units: buildSlots(
      [
        { label: "Dawn Predator Drive", timeSlot: "06:00 AM", status: "available", note: "4 spots left", capacity: 4 },
        { label: "Midday Waterhole Drive", timeSlot: "11:00 AM", status: "available", note: "6 spots left", capacity: 6 },
        { label: "Afternoon & Sunset Drive", timeSlot: "15:30 PM", status: "available", note: "2 spots left", capacity: 2 },
        { label: "Night Eyes Spotlight Drive", timeSlot: "19:30 PM", status: "occupied", note: "Booked out", capacity: 0 },
      ],
      120,
    ),
  },

  // --- GUEST TRANSPORT VEHICLE FLEETS (Single listing with multiple identical vehicles) ---
  {
    listingId: "t1",
    unitType: "vehicle",
    unitLabel: "Vehicle",
    unitLabelPlural: "Vehicles",
    total: 3,
    units: buildVehicles(
      [
        {
          label: "Vehicle 1 — Executive Shuttle Van",
          plateNumber: "ABR 3310",
          status: "available",
          note: "Cleaned, air-conditioned & ready",
        },
        {
          label: "Vehicle 2 — Executive Shuttle Van",
          plateNumber: "BBL 9021",
          status: "available",
          note: "Cleaned, air-conditioned & ready",
        },
        {
          label: "Vehicle 3 — Executive Shuttle Van",
          plateNumber: "CAZ 1148",
          status: "occupied",
          note: "En route to Livingstone · returns tonight",
        },
      ],
      250,
    ),
  },
  {
    listingId: "t2",
    unitType: "vehicle",
    unitLabel: "Vehicle",
    unitLabelPlural: "Vehicles",
    total: 2,
    units: buildVehicles(
      [
        {
          label: "Vehicle 1 — Luxury Coach Express",
          plateNumber: "ABL 1180",
          status: "available",
          note: "Station bay 3 ready",
        },
        {
          label: "Vehicle 2 — Luxury Coach Express",
          plateNumber: "ABL 1181",
          status: "occupied",
          note: "Operating morning route",
        },
      ],
      180,
    ),
  },
  {
    listingId: "t3",
    unitType: "vehicle",
    unitLabel: "Vehicle",
    unitLabelPlural: "Vehicles",
    total: 2,
    units: buildVehicles(
      [
        {
          label: "Vehicle 1 — Toyota HiAce Luxury",
          plateNumber: "BCA 5022",
          status: "available",
          note: "Ready for charter",
        },
        {
          label: "Vehicle 2 — Toyota HiAce Luxury",
          plateNumber: "BCA 5023",
          status: "available",
          note: "Ready for charter",
        },
      ],
      320,
    ),
  },
  {
    listingId: "t4",
    unitType: "vehicle",
    unitLabel: "Vehicle",
    unitLabelPlural: "Vehicles",
    total: 3,
    units: buildVehicles(
      [
        {
          label: "Vehicle 1 — 4x4 Safari Land Cruiser",
          plateNumber: "ABX 2940",
          status: "available",
          note: "Full safari spec · Roof tent & fridge",
        },
        {
          label: "Vehicle 2 — 4x4 Safari Land Cruiser",
          plateNumber: "ALB 8412",
          status: "available",
          note: "Full safari spec · Dual tanks & recovery gear",
        },
        {
          label: "Vehicle 3 — 4x4 Safari Land Cruiser",
          plateNumber: "BCA 1044",
          status: "occupied",
          note: "Lower Zambezi expedition",
        },
      ],
      1200,
    ),
  },
];

/** Generate sensible fallback inventory if a listing id is not pre-seeded */
export function generateFallbackInventory(listingId: string): ListingInventory {
  const isTransport = listingId.startsWith("t") || listingId.toLowerCase().includes("trans");
  const isExp = listingId.startsWith("e") || listingId.toLowerCase().includes("exp");

  if (isTransport) {
    return {
      listingId,
      unitType: "vehicle",
      unitLabel: "Vehicle",
      unitLabelPlural: "Vehicles",
      total: 3,
      units: [
        { id: `veh-1`, label: "Vehicle 1 — Fleet Car", status: "available", note: "Ready for rental", plateNumber: "ABX 1011" },
        { id: `veh-2`, label: "Vehicle 2 — Fleet Car", status: "available", note: "Ready for rental", plateNumber: "ABX 1012" },
        { id: `veh-3`, label: "Vehicle 3 — Fleet Car", status: "occupied", note: "On active hire", plateNumber: "ABX 1013" },
      ],
    };
  }

  if (isExp) {
    return {
      listingId,
      unitType: "slot",
      unitLabel: "Time Slot",
      unitLabelPlural: "Time Slots",
      total: 3,
      units: [
        { id: `slot-1`, label: "Morning Session", timeSlot: "08:30 AM", status: "available", capacity: 4, note: "4 spots open" },
        { id: `slot-2`, label: "Afternoon Session", timeSlot: "14:00 PM", status: "available", capacity: 6, note: "6 spots open" },
        { id: `slot-3`, label: "Sunset Session", timeSlot: "17:00 PM", status: "occupied", capacity: 0, note: "Booked" },
      ],
    };
  }

  // Default to stay rooms
  return {
    listingId,
    unitType: "room",
    unitLabel: "Room",
    unitLabelPlural: "Rooms",
    total: 5,
    units: [
      { id: `room-1`, label: "Chalet 1", status: "available", note: "Open for bookings" },
      { id: `room-2`, label: "Chalet 2", status: "available", note: "Open for bookings" },
      { id: `room-3`, label: "Chalet 3", status: "available", note: "Open for bookings" },
      { id: `room-4`, label: "Chalet 4", status: "occupied", note: "Booked" },
      { id: `room-5`, label: "Chalet 5", status: "available", note: "Open for bookings" },
    ],
  };
}

/** Look up inventory for a listing id. */
export function getInventoryForListing(listingId: string): ListingInventory {
  const found = mockInventories.find((inv) => inv.listingId === listingId);
  return found || generateFallbackInventory(listingId);
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
    hasAvailability: available > 0,
  };
}
