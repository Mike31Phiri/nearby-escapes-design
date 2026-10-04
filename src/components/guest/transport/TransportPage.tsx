"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/shared/SearchBar";
import { serializeDates, deserializeDates, type DateRange } from "@/components/ui/DateRangePicker";
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
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { mockTransport } from "@/lib/mock-data";
import { TransportCard } from "@/components/shared/ListingCards";
import { SearchListingSkeleton } from "@/components/shared/SearchListingSkeleton";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") ?? "";
  const toParam = searchParams.get("to") ?? "";
  const qParam = searchParams.get("q") ?? "";
  const tripParam = (searchParams.get("trip") as "one_way" | "round_trip" | null) ?? "one_way";
  const datesParam = searchParams.get("dates") ?? "";
  const passengersParam = searchParams.get("passengers") || searchParams.get("guests") || "";

  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [drawerFilters, setDrawerFilters] = useState<Record<string, any>>(DEFAULT_DRAWER_FILTERS);

  const [sortValue, setSortValue] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Search state matching SearchBar inputs: Leaving from, Going to, Dates, Passengers, Trip Type
  const [leavingFrom, setLeavingFrom] = useState(fromParam);
  const [goingTo, setGoingTo] = useState(toParam || qParam);
  const [tripType, setTripType] = useState<"one_way" | "round_trip">(
    tripParam === "round_trip" ? "round_trip" : "one_way",
  );
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    datesParam ? deserializeDates(datesParam) : { checkIn: null, checkOut: null },
  );
  const [passengers, setPassengers] = useState<number>(() =>
    passengersParam ? Math.max(1, Number(passengersParam) || 1) : 1,
  );

  // Synchronize when searchParams update
  useEffect(() => {
    setLeavingFrom(fromParam);
  }, [fromParam]);

  useEffect(() => {
    setGoingTo(toParam || qParam);
  }, [toParam, qParam]);

  useEffect(() => {
    if (tripParam) {
      setTripType(tripParam === "round_trip" ? "round_trip" : "one_way");
    }
  }, [tripParam]);

  useEffect(() => {
    if (datesParam) {
      setDateRange(deserializeDates(datesParam));
    }
  }, [datesParam]);

  useEffect(() => {
    if (passengersParam) {
      setPassengers(Math.max(1, Number(passengersParam) || 1));
    }
  }, [passengersParam]);

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

    const f = leavingFrom.trim().toLowerCase();
    const t = goingTo.trim().toLowerCase();

    if (f || t) {
      result = result.filter((item) => {
        const matchFrom = !f || item.from.toLowerCase().includes(f);
        const matchTo = !t || item.to.toLowerCase().includes(t);
        return matchFrom && matchTo;
      });
      if (result.length === 0) result = [...mockTransport];
    } else if (fromParam || toParam || qParam) {
      result = result.filter((item) => {
        const text = `${item.from} ${item.to} ${item.operator}`.toLowerCase();
        return (
          (!fromParam || item.from.toLowerCase().includes(fromParam.toLowerCase())) &&
          (!toParam || item.to.toLowerCase().includes(toParam.toLowerCase())) &&
          (!qParam || text.includes(qParam.toLowerCase()))
        );
      });
      if (result.length === 0) result = [...mockTransport];
    }

    if (selectedVehicleTypes.length > 0) {
      result = result.filter((item) => {
        const isPrivate =
          item.operator.toLowerCase().includes("tour") ||
          item.operator.toLowerCase().includes("transfer");
        const isMinivan = item.id === "t3";
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
    if (pr) result = result.filter((item) => item.price >= pr.min && item.price <= pr.max);

    if (sortValue === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortValue === "price_desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [leavingFrom, goingTo, selectedVehicleTypes, drawerFilters, sortValue, fromParam, toParam, qParam]);

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
    if (leavingFrom && goingTo) {
      return `Transport & Rides from ${leavingFrom} to ${goingTo}`;
    }
    if (fromParam && toParam) {
      return `Transport & Rides from ${fromParam} to ${toParam}`;
    }
    const raw = goingTo || leavingFrom || qParam || fromParam || toParam || "Zambia";
    const area = raw.charAt(0).toUpperCase() + raw.slice(1);
    return `Transport & Rides in ${area}`;
  }, [leavingFrom, goingTo, qParam, fromParam, toParam]);

  // Pagination for search results & next database requests
  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to top immediately on mount & simulate skeleton loading state
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, []);

  // Reset pagination when search parameters or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [leavingFrom, goingTo, selectedVehicleTypes, drawerFilters, fromParam, toParam, qParam]);

  const totalCount = filteredTransport.length;
  const visibleTransport = useMemo(() => {
    return filteredTransport.slice(0, currentPage * PAGE_SIZE);
  }, [filteredTransport, currentPage]);

  const hasMore = visibleTransport.length < totalCount;
  const remainingCount = Math.max(0, totalCount - visibleTransport.length);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] font-sans">
      {/* SEARCH HEADER SECTION */}
      <div className="bg-white border-b border-neutral-100 py-3.5">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">
          {/* Search Bar — identical floating pill capsule to Home Page */}
          <div className="max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto">
            <SearchBar
              activeCategory="transport"
              initialLeavingFrom={leavingFrom}
              initialGoingTo={goingTo}
              initialTripType={tripType}
              initialDates={dateRange}
              initialGuests={passengers}
              onChange={(st) => {
                if (st.leavingFrom !== undefined) setLeavingFrom(st.leavingFrom);
                if (st.goingTo !== undefined) setGoingTo(st.goingTo);
                if (st.tripType) setTripType(st.tripType);
                setDateRange(st.dates);
                setPassengers(st.guests);
              }}
              onSearch={(_term, dates, g, extra) => {
                const nextFrom = extra?.leavingFrom !== undefined ? extra.leavingFrom : leavingFrom;
                const nextTo = extra?.goingTo !== undefined ? extra.goingTo : goingTo;
                const nextTrip = extra?.tripType || tripType;
                setLeavingFrom(nextFrom);
                setGoingTo(nextTo);
                setTripType(nextTrip);
                setDateRange(dates);
                setPassengers(g);

                const params = new URLSearchParams(searchParams.toString());
                if (nextFrom) params.set("from", nextFrom);
                else params.delete("from");
                if (nextTo) params.set("to", nextTo);
                else params.delete("to");
                params.set("trip", nextTrip);
                const dStr = serializeDates(dates);
                if (dStr) params.set("dates", dStr);
                else params.delete("dates");
                params.set("guests", String(g));

                router.replace(`/transport?${params.toString()}`, { scroll: false });
              }}
            />
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
            <p className="text-xs text-neutral-500">
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
        {isLoading ? (
          <SearchListingSkeleton count={6} />
        ) : filteredTransport.length === 0 ? (
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
              {visibleTransport.map((route) => (
                <TransportCard key={route.id} route={route} />
              ))}
            </div>

            {/* Pagination / Database Next Page Request Section */}
            <div className="mt-10 mb-8 flex flex-col items-center justify-center gap-3">
              {hasMore ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white border border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-xs disabled:opacity-60 cursor-pointer active:scale-98"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-purple" />
                      <span>Loading more routes from database...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Routes</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple/10 text-purple text-[10px] font-bold">
                        +{Math.min(PAGE_SIZE, remainingCount)}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 text-xs text-neutral-600 font-medium shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>No more transport routes to load — You&apos;ve reached the end of the results</span>
                </div>
              )}
            </div>
          </>
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
