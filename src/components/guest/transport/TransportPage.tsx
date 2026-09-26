"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bus,
  Clock,
  MapPin,
  SlidersHorizontal,
  X,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  ChevronDown,
  Users,
  Car,
  Search,
} from "lucide-react";
import { mockTransport, type Transport } from "@/lib/mock-data";
import { TransportCard } from "@/components/shared/ListingCards";
import {
  VerticalFilterSidebar,
  type FilterConfig,
} from "@/components/shared/VerticalFilterSidebar";
import { FilterChips } from "@/components/shared/FilterChips";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Drawer Filter Config
const DRAWER_FILTER_CONFIG: FilterConfig[] = [
  {
    id: "priceRange",
    label: "Price per person",
    type: "price-range",
    min: 0,
    max: 1000,
    step: 25,
    unit: "K",
  },
  {
    id: "capacity",
    label: "Capacity",
    type: "checkbox-group",
    options: [
      { value: "small", label: "1 - 4 seats" },
      { value: "medium", label: "5 - 10 seats" },
      { value: "large", label: "10+ seats" },
    ],
  },
  {
    id: "departureTime",
    label: "Departure time",
    type: "checkbox-group",
    options: [
      { value: "morning", label: "Morning (6AM - 12PM)" },
      { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
      { value: "evening", label: "Evening (6PM - 10PM)" },
    ],
  },
];

const DEFAULT_DRAWER_FILTERS: Record<string, any> = {
  priceRange: { min: 0, max: 1000 },
  capacity: [],
  departureTime: [],
};

// Independent Vehicle Type Pills (Clean text only)
const VEHICLE_TYPE_PILLS = [
  { label: "Popular", type: "popular" },
  { label: "Unique", type: "unique" },
  { label: "Bus (Shared)", type: "bus" },
  { label: "Private Car", type: "private" },
  { label: "Minivan (Group)", type: "minivan" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

// Transport Card
// (removed - using shared ListingCards TransportCard)

// Main Page
export function TransportPage() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") ?? "";
  const toParam = searchParams.get("to") ?? "";
  const qParam = searchParams.get("q") ?? "";

  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [drawerFilters, setDrawerFilters] = useState<Record<string, any>>(DEFAULT_DRAWER_FILTERS);

  const [sortValue, setSortValue] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Harmonized Search Inputs: Where, When, Passengers
  const initialWhere =
    fromParam && toParam ? `${fromParam} to ${toParam}` : fromParam || toParam || qParam || "";
  const [whereInput, setWhereInput] = useState(initialWhere);
  const [whenInput, setWhenInput] = useState("");
  const [passengers, setPassengers] = useState(1);

  const toggleVehicleType = (type: string) => {
    setSelectedVehicleTypes((prev) => (prev.includes(type) ? [] : [type]));
  };

  const handleDrawerFilterChange = (filterId: string, value: any) => {
    setDrawerFilters((prev) => ({ ...prev, [filterId]: value }));
  };

  const handleResetAll = () => {
    setSelectedVehicleTypes([]);
    setDrawerFilters(DEFAULT_DRAWER_FILTERS);
  };

  const filteredTransport = useMemo(() => {
    let result = [...mockTransport];

    if (whereInput.trim()) {
      const q = whereInput.toLowerCase();
      result = result.filter(
        (t) =>
          t.from.toLowerCase().includes(q) ||
          t.to.toLowerCase().includes(q) ||
          t.operator.toLowerCase().includes(q),
      );
      if (result.length === 0) result = [...mockTransport];
    } else if (fromParam || toParam || qParam) {
      result = result.filter((t) => {
        const text = `${t.from} ${t.to} ${t.operator}`.toLowerCase();
        return (
          (!fromParam || t.from.toLowerCase().includes(fromParam.toLowerCase())) &&
          (!toParam || t.to.toLowerCase().includes(toParam.toLowerCase())) &&
          (!qParam || text.includes(qParam.toLowerCase()))
        );
      });
      if (result.length === 0) result = [...mockTransport];
    }

    if (selectedVehicleTypes.length > 0) {
      result = result.filter((t) => {
        const isPrivate =
          t.operator.toLowerCase().includes("tour") ||
          t.operator.toLowerCase().includes("transfer");
        const isMinivan = t.id === "t3";
        const vType = isPrivate ? "private" : isMinivan ? "minivan" : "bus";
        return selectedVehicleTypes.some((type) => {
          // Seat estimates mirror the capacity labels shown on TransportCard.
          const seats = isPrivate ? 4 : isMinivan ? 8 : 40;
          if (type === "popular") return seats <= 14;
          if (type === "unique") return isPrivate || isMinivan;
          return type === vType;
        });
      });
    }

    const pr = drawerFilters.priceRange;
    if (pr) result = result.filter((t) => t.price >= pr.min && t.price <= pr.max);

    if (sortValue === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortValue === "price_desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [whereInput, selectedVehicleTypes, drawerFilters, sortValue, fromParam, toParam, qParam]);

  const chips = useMemo(() => {
    const c: { label: string; onRemove: () => void }[] = [];

    const pr = drawerFilters.priceRange;
    if (pr && (pr.min > 0 || pr.max < 1000))
      c.push({
        label: `K${pr.min}–K${pr.max}`,
        onRemove: () => handleDrawerFilterChange("priceRange", { min: 0, max: 1000 }),
      });

    return c;
  }, [selectedVehicleTypes, drawerFilters]);

  const dynamicTitle = useMemo(() => {
    if (fromParam && toParam) {
      return `Transport & Rides from ${fromParam} to ${toParam}`;
    }
    const raw = qParam || fromParam || toParam || "Zambia";
    const area = raw.charAt(0).toUpperCase() + raw.slice(1);
    return `Transport & Rides in ${area}`;
  }, [qParam, fromParam, toParam]);

  return (
    <div className="min-h-screen bg-[#faf8f4] font-sans">
      {/* HERO TITLE SECTION */}
      <div className="bg-white border-b border-neutral-100 py-3.5">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">
          {/* Title */}
          <h1 className="text-xl md:text-2xl font-semibold text-neutral-900 text-center tracking-tight leading-snug">
            {dynamicTitle}
          </h1>

          {/* Search Bar — compact inline row on mobile, full grid on desktop */}
          <div className="mt-3 max-w-4xl mx-auto">
            {/* MOBILE (< md): single pill-row */}
            <div className="grid md:hidden grid-cols-[1fr_auto_1fr_auto] items-center bg-white border border-neutral-200 shadow-[0_4px_20px_rgba(31,20,51,0.08)] rounded-full pl-3.5 pr-1.5 py-1.5 min-h-[48px] gap-1.5">
              {/* Where (1fr equal column) */}
              <div className="flex items-center gap-1.5 min-w-0 px-1">
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                <input
                  type="text"
                  value={whereInput}
                  onChange={(e) => setWhereInput(e.target.value)}
                  placeholder="Where to?"
                  className="w-full bg-transparent text-xs font-medium text-neutral-700 focus:outline-none placeholder:text-neutral-400 truncate"
                />
              </div>

              {/* Middle Divider (Centered at exact midpoint) */}
              <div className="h-5 w-px bg-neutral-200 shrink-0" />

              {/* When (1fr equal column) */}
              <div className="flex items-center gap-1.5 min-w-0 px-1">
                <CalendarDays className="h-4 w-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
                <input
                  type="date"
                  value={whenInput}
                  onChange={(e) => setWhenInput(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium text-neutral-700 focus:outline-none cursor-pointer placeholder:text-neutral-400"
                />
              </div>

              {/* Search button (unshrinked) */}
              <button
                type="button"
                className="bg-neutral-900 text-white rounded-full h-9 w-9 hover:bg-neutral-800 transition-colors shrink-0 flex items-center justify-center shadow-xs active:scale-95 cursor-pointer ml-0.5"
                aria-label="Search"
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* DESKTOP (md+): full grid */}
            <div className="hidden md:grid md:grid-cols-12 bg-white border border-neutral-200 shadow-sm rounded-2xl p-1.5 gap-1.5">
              {/* WHERE */}
              <div className="md:col-span-4 bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-1.5 transition-colors flex flex-col justify-center">
                <p className="text-[9px] font-medium uppercase tracking-wider text-neutral-500 leading-none mb-1">
                  Where
                </p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={whereInput}
                    onChange={(e) => setWhereInput(e.target.value)}
                    placeholder="Origin or destination city"
                    className="w-full bg-transparent text-xs font-medium text-neutral-800 focus:outline-none placeholder:text-neutral-400 truncate"
                  />
                </div>
              </div>

              {/* WHEN */}
              <div className="md:col-span-3 bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-1.5 transition-colors flex flex-col justify-center">
                <p className="text-[9px] font-medium uppercase tracking-wider text-neutral-500 leading-none mb-1">
                  When
                </p>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <input
                    type="date"
                    value={whenInput}
                    onChange={(e) => setWhenInput(e.target.value)}
                    className="w-full bg-transparent text-xs font-medium text-neutral-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* PASSENGERS */}
              <div className="md:col-span-3 bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-1.5 transition-colors flex flex-col justify-center">
                <p className="text-[9px] font-medium uppercase tracking-wider text-neutral-500 leading-none mb-1">
                  Passengers
                </p>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 shrink-0">
                    <Users className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="text-xs font-medium text-neutral-800">
                      {passengers} {passengers === 1 ? "Passenger" : "Passengers"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                      className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-purple hover:text-purple text-[10px] font-bold"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => setPassengers((p) => p + 1)}
                      className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-purple hover:text-purple text-[10px] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className="md:col-span-2 flex items-center">
                <Button
                  type="button"
                  className="w-full h-full min-h-[38px] bg-purple hover:bg-purple-hover text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY FILTER BAR (Filters button + Vehicle Type pills) */}
      <div className="sticky top-[64px] z-20 bg-white border-b border-neutral-200 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">
          <div
            className="flex items-center gap-2.5 py-2.5 overflow-x-auto scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {/* Filters Button */}
            <button
              onClick={() => setFiltersOpen(true)}
              className={cn(
                "flex-none flex items-center gap-2 border rounded-full px-5 py-2 text-sm font-medium transition-all duration-150 active:scale-95 whitespace-nowrap shadow-2xs",
                chips.length > 0
                  ? "bg-purple/10 border-purple text-purple hover:bg-purple/15"
                  : "bg-white border-neutral-300 text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50",
              )}
            >
              <SlidersHorizontal className="h-4 w-4 shrink-0" />
              <span>Filters</span>
              {chips.length > 0 && (
                <span className="flex items-center justify-center bg-purple text-white text-[11px] font-medium h-4.5 min-w-[18px] px-1 rounded-full leading-none">
                  {chips.length}
                </span>
              )}
            </button>

            <div className="h-5 w-px bg-neutral-200 flex-none" />

            {/* Vehicle Type Pills (Clean Text Only) */}
            {VEHICLE_TYPE_PILLS.map((cat) => {
              const active = selectedVehicleTypes.includes(cat.type);
              return (
                <button
                  key={cat.type}
                  onClick={() => toggleVehicleType(cat.type)}
                  className={cn(
                    "flex-none whitespace-nowrap px-5 py-2 rounded-full border text-sm transition-all duration-150 active:scale-95 select-none font-medium cursor-pointer",
                    active
                      ? "bg-purple text-white border-purple shadow-xs"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-purple/50 hover:text-purple hover:bg-purple/[0.03]",
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT (3 Cards Per Row) */}
      <main className="max-w-[1400px] mx-auto px-3 md:px-6 py-4">
        {/* Title bar + sort */}
        <div className="flex items-center justify-between mb-3.5 gap-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">{dynamicTitle}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              <span className="font-medium text-neutral-700">{filteredTransport.length}</span>{" "}
              routes found
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-neutral-500 hidden sm:block">Sort:</span>
            <div className="relative">
              <select
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
                className="appearance-none bg-white border border-neutral-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        <FilterChips chips={chips} onClearAll={handleResetAll} />

        {/* Cards grid: 3 larger columns */}
        {filteredTransport.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-neutral-100 mt-3">
            <Bus className="h-10 w-10 text-neutral-200 mb-2" />
            <h3 className="font-bold text-base text-neutral-800">No transport routes found</h3>
            <p className="text-neutral-400 text-xs max-w-sm text-center mt-1">
              Try adjusting your search criteria or filters.
            </p>
            <Button
              onClick={handleResetAll}
              variant="outline"
              className="mt-4 border-purple text-purple hover:bg-purple hover:text-white text-xs h-8 px-4"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
            {filteredTransport.map((route) => (
              <TransportCard key={route.id} route={route} />
            ))}
          </div>
        )}
      </main>

      {/* FILTERS DRAWER */}
      {filtersOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-3 border-b border-neutral-100">
              <span className="text-base font-bold text-neutral-900">Filters</span>
              <button
                onClick={() => setFiltersOpen(false)}
                className="h-7 w-7 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                aria-label="Close filters"
              >
                <X className="h-3.5 w-3.5 text-neutral-600" />
              </button>
            </div>
            <div className="px-5 pb-8">
              <VerticalFilterSidebar
                filters={DRAWER_FILTER_CONFIG}
                activeFilters={drawerFilters}
                onChange={handleDrawerFilterChange}
                onReset={() => setDrawerFilters(DEFAULT_DRAWER_FILTERS)}
              />
            </div>
            <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-neutral-100">
              <Button
                onClick={() => setFiltersOpen(false)}
                className="w-full bg-purple hover:bg-purple-hover text-white font-bold"
              >
                Show {filteredTransport.length} routes
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
