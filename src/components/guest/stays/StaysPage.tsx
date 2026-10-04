"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/shared/SearchBar";
import { serializeDates, deserializeDates, type DateRange } from "@/components/ui/DateRangePicker";
import {
  Bed,
  Star,
  MapPin,
  SlidersHorizontal,
  X,
  Wifi,
  Waves,
  Coffee,
  Sparkles,
  Utensils,
  Dumbbell,
  Car,
  ChevronRight,
  CalendarDays,
  Users,
  ChevronDown,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { Stay } from "@/lib/mock-data";
import { fetchStays } from "@/lib/api/discovery";
import {
  VerticalFilterSidebar,
  type FilterConfig,
} from "@/components/shared/VerticalFilterSidebar";
import { FilterChips } from "@/components/shared/FilterChips";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ResolvedLocation } from "@/lib/utils/locationSlug";
import { StayCard } from "@/components/shared/ListingCards";
import { SearchListingSkeleton } from "@/components/shared/SearchListingSkeleton";

// Filter configuration for "Filters" drawer
const DRAWER_FILTER_CONFIG: FilterConfig[] = [
  {
    id: "priceRange",
    label: "Price per Night",
    type: "price-range",
    min: 0,
    max: 5000,
    step: 50,
    unit: "K",
  },
  {
    id: "amenities",
    label: "Amenities",
    type: "checkbox-group",
    options: [
      { value: "WiFi", label: "WiFi" },
      { value: "Pool", label: "Pool" },
      { value: "Breakfast", label: "Breakfast" },
      { value: "Spa", label: "Spa" },
      { value: "Guided Tours", label: "Guided Tours" },
      { value: "Restaurant", label: "Restaurant" },
      { value: "Gym", label: "Gym" },
      { value: "Airport Pickup", label: "Airport Pickup" },
    ],
  },
  {
    id: "rating",
    label: "Minimum Rating",
    type: "radio-group",
    options: [
      { value: "any", label: "Any" },
      { value: "3", label: "3+ stars" },
      { value: "4", label: "4+ stars" },
      { value: "4.5", label: "4.5+ stars" },
    ],
  },
  {
    id: "instantBook",
    label: "Instant Book only",
    type: "toggle",
  },
];

const DEFAULT_DRAWER_FILTERS: Record<string, any> = {
  priceRange: { min: 0, max: 5000 },
  amenities: [],
  rating: "any",
  instantBook: false,
};

// Property Type Pills (Clean text only, no icons)
const PROPERTY_TYPE_PILLS = [
  { label: "Popular", type: "Popular" },
  { label: "Unique", type: "Unique" },
  { label: "Lodge", type: "Lodge" },
  { label: "Hotel", type: "Hotel" },
  { label: "Camp", type: "Camp" },
  { label: "Resort", type: "Resort" },
  { label: "Boutique", type: "Boutique" },
  { label: "Guesthouse", type: "Guesthouse" },
  { label: "Chalet", type: "Chalet" },
  { label: "Farm Stay", type: "Farm Stay" },
  { label: "Apartment", type: "Apartment" },
  { label: "Boat Stay", type: "Boat Stay" },
];

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3 w-3" />,
  Pool: <Waves className="h-3 w-3" />,
  Breakfast: <Coffee className="h-3 w-3" />,
  Spa: <Sparkles className="h-3 w-3" />,
  "Guided Tours": <MapPin className="h-3 w-3" />,
  Restaurant: <Utensils className="h-3 w-3" />,
  Gym: <Dumbbell className="h-3 w-3" />,
  "Airport Pickup": <Car className="h-3 w-3" />,
};

const SORT_OPTIONS = [
  { value: "recommended", label: "Our top picks" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
];

// Stay Card
// (removed - using shared ListingCards StayCard)

interface StaysPageProps {
  location?: ResolvedLocation;
}

export function StaysPage({ location }: StaysPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const typeParam = searchParams.get("type") ?? "";
  const datesParam = searchParams.get("dates") ?? "";
  const guestsParam = searchParams.get("guests") ?? "";

  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    typeParam ? [typeParam] : [],
  );
  const [drawerFilters, setDrawerFilters] = useState<Record<string, any>>(DEFAULT_DRAWER_FILTERS);

  const [sortValue, setSortValue] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Live Backend Data
  const [stays, setStays] = useState<Stay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Harmonized Search Inputs: Where, When, Guests
  const initialWhere = qParam || location?.city?.name || location?.province?.name || "";
  const [whereInput, setWhereInput] = useState(initialWhere);
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    datesParam ? deserializeDates(datesParam) : { checkIn: null, checkOut: null },
  );
  const [guests, setGuests] = useState<number>(() =>
    guestsParam ? Math.max(1, Number(guestsParam) || 2) : 2,
  );

  useEffect(() => {
    const resolved = qParam || location?.city?.name || location?.province?.name || "";
    setWhereInput(resolved);
  }, [qParam, location]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchStays({ q: whereInput.trim() || undefined })
      .then((data) => {
        if (isMounted) {
          setStays(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("fetchStays error:", err);
        if (isMounted) {
          setStays([]);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [whereInput]);

  useEffect(() => {
    if (datesParam) {
      setDateRange(deserializeDates(datesParam));
    }
  }, [datesParam]);

  useEffect(() => {
    if (guestsParam) {
      setGuests(Math.max(1, Number(guestsParam) || 2));
    }
  }, [guestsParam]);

  useEffect(() => {
    if (typeParam) {
      setSelectedPropertyTypes([typeParam]);
    }
  }, [typeParam]);

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes((prev) => (prev.includes(type) ? [] : [type]));
  };

  const handleDrawerFilterChange = (filterId: string, value: any) => {
    setDrawerFilters((prev) => ({ ...prev, [filterId]: value }));
  };

  const handleResetAll = () => {
    setSelectedPropertyTypes([]);
    setDrawerFilters(DEFAULT_DRAWER_FILTERS);
  };

  const filteredStays = useMemo(() => {
    let result = [...stays];

    if (whereInput.trim()) {
      const q = whereInput.toLowerCase();
      const matched = result.filter(
        (s) => s.location.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
      );
      if (matched.length > 0) result = matched;
    } else if (location) {
      if (location.type === "attraction" && location.attraction) {
        const ids = new Set(location.attraction.nearbyStayIds);
        const nearby = result.filter((s) => ids.has(s.id));
        if (nearby.length > 0) {
          result = nearby;
        }
      } else if (location.type === "city" && location.city) {
        const matched = result.filter((s) =>
          s.location.toLowerCase().includes(location.city!.name.toLowerCase()),
        );
        if (matched.length > 0) result = matched;
      } else if (location.type === "province" && location.province) {
        const provinceName = location.province.name.toLowerCase().replace("province", "");
        const matched = result.filter((s) => s.location.toLowerCase().includes(provinceName));
        if (matched.length > 0) result = matched;
      }
    }

    if (selectedPropertyTypes.length > 0) {
      result = result.filter((s) => {
        return selectedPropertyTypes.some((t) => {
          if (t === "Popular") return s.rating >= 4.7;
          if (t === "Unique")
            return (
              s.type === "Boutique" ||
              s.type === "Farm Stay" ||
              s.type === "Boat Stay" ||
              s.type === "Chalet"
            );
          return s.type === t;
        });
      });
    }

    const pr = drawerFilters.priceRange;
    if (pr) result = result.filter((s) => s.price >= pr.min && s.price <= pr.max);

    const am: string[] = drawerFilters.amenities ?? [];
    if (am.length > 0) result = result.filter((s) => am.every((a) => s.amenities.includes(a)));

    const ratingFilter = drawerFilters.rating;
    if (ratingFilter && ratingFilter !== "any") {
      result = result.filter((s) => s.rating >= parseFloat(ratingFilter));
    }

    if (sortValue === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortValue === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortValue === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [stays, whereInput, selectedPropertyTypes, drawerFilters, sortValue, location]);

  // Pagination for search results & next database requests
  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Scroll to top immediately on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Reset pagination when search parameters or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [whereInput, selectedPropertyTypes, drawerFilters, sortValue, location]);

  const totalCount = filteredStays.length;
  const visibleStays = useMemo(() => {
    return filteredStays.slice(0, currentPage * PAGE_SIZE);
  }, [filteredStays, currentPage]);

  const hasMore = visibleStays.length < totalCount;
  const remainingCount = Math.max(0, totalCount - visibleStays.length);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // Simulates next database request batch
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 450);
  };

  const chips = useMemo(() => {
    const c: { label: string; onRemove: () => void }[] = [];

    const am: string[] = drawerFilters.amenities ?? [];
    am.forEach((v) =>
      c.push({
        label: v,
        onRemove: () =>
          handleDrawerFilterChange(
            "amenities",
            am.filter((x) => x !== v),
          ),
      }),
    );

    if (drawerFilters.rating && drawerFilters.rating !== "any") {
      c.push({
        label: `${drawerFilters.rating}+ stars`,
        onRemove: () => handleDrawerFilterChange("rating", "any"),
      });
    }

    if (drawerFilters.instantBook) {
      c.push({
        label: "Instant Book",
        onRemove: () => handleDrawerFilterChange("instantBook", false),
      });
    }

    const pr = drawerFilters.priceRange;
    if (pr && (pr.min > 0 || pr.max < 5000)) {
      c.push({
        label: `K${pr.min}–K${pr.max}`,
        onRemove: () => handleDrawerFilterChange("priceRange", { min: 0, max: 5000 }),
      });
    }

    return c;
  }, [selectedPropertyTypes, drawerFilters]);

  const dynamicHeadline = useMemo(() => {
    const raw = qParam.trim() || location?.city?.name || location?.province?.name || "Zambia";
    const area = raw.charAt(0).toUpperCase() + raw.slice(1);
    return `Places to stay in ${area}`;
  }, [qParam, location]);

  return (
    <div className="min-h-screen bg-[#faf8f4] font-sans">
      {/* SEARCH HEADER SECTION */}
      <div className="bg-white border-b border-neutral-100 py-3.5">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">
          {/* Search Bar — identical floating pill capsule to Home Page */}
          <div className="max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto">
            <SearchBar
              activeCategory="stays"
              initialDestination={whereInput}
              initialDates={dateRange}
              initialGuests={guests}
              onChange={(st) => {
                setWhereInput(st.destination);
                setDateRange(st.dates);
                setGuests(st.guests);
              }}
              onSearch={(term, dates, g) => {
                setWhereInput(term);
                setDateRange(dates);
                setGuests(g);
                const params = new URLSearchParams(searchParams.toString());
                if (term) params.set("q", term);
                else params.delete("q");
                const dStr = serializeDates(dates);
                if (dStr) params.set("dates", dStr);
                else params.delete("dates");
                params.set("guests", String(g));
                const targetPath = location ? `/${location.slug}/stays` : "/zambia/stays";
                router.replace(`${targetPath}?${params.toString()}`, { scroll: false });
              }}
            />
          </div>
        </div>
      </div>

      {/* STICKY FILTER BAR (Pinned Filters button + Scrolling Property pills) */}
      <div className="sticky top-[64px] z-20 bg-white border-b border-neutral-200 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">
          <div className="flex items-center py-2.5 relative">
            {/* Pinned Static Filters Button */}
            <div className="flex-none flex items-center pr-3 z-10 bg-white">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className={cn(
                  "flex items-center gap-2 border rounded-full px-4 sm:px-5 py-2 text-sm font-medium transition-all duration-150 active:scale-95 whitespace-nowrap shadow-2xs cursor-pointer",
                  chips.length > 0
                    ? "bg-purple/10 border-purple text-purple hover:bg-purple/15"
                    : "bg-white border-neutral-300 text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50",
                )}
              >
                <div className="relative flex items-center">
                  <SlidersHorizontal className="h-4 w-4 shrink-0" />
                  {chips.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-purple ring-2 ring-white" />
                  )}
                </div>
                <span>Filters</span>
              </button>
              <div className="h-5 w-px bg-neutral-200 ml-3 shrink-0" />
            </div>

            {/* Scrolling Property Type Pills */}
            <div
              className="flex-1 flex items-center gap-2.5 overflow-x-auto scrollbar-none pl-1 py-0.5"
              style={{ scrollbarWidth: "none" }}
            >
              {PROPERTY_TYPE_PILLS.map((cat) => {
                const active = selectedPropertyTypes.includes(cat.type);
                return (
                  <button
                    key={cat.type}
                    onClick={() => togglePropertyType(cat.type)}
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
      </div>

      {/* MAIN CONTENT (3 Cards Per Row) */}
      <main className="max-w-[1400px] mx-auto px-3 md:px-6 py-4">
        {/* Title bar + sort */}
        <div className="flex items-center justify-between mb-3.5 gap-4">
          <div>
            <p className="text-xs text-neutral-500">
              <span className="font-medium text-neutral-700">{filteredStays.length}</span>{" "}
              properties found
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

        {/* Cards grid: 3 larger columns */}
        {isLoading ? (
          <SearchListingSkeleton count={6} />
        ) : filteredStays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-neutral-100 mt-3">
            <Bed className="h-10 w-10 text-neutral-200 mb-2" />
            <h3 className="font-bold text-base text-neutral-800">No stays found</h3>
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
              {visibleStays.map((stay) => (
                <StayCard key={stay.id} stay={stay} />
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
                      <span>Loading more stays from database...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Stays</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple/10 text-purple text-[10px] font-bold">
                        +{Math.min(PAGE_SIZE, remainingCount)}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 text-xs text-neutral-600 font-medium shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>No more stays to load — You&apos;ve reached the end of the results</span>
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
                Show {filteredStays.length} stays
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
