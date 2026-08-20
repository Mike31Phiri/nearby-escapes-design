"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";
import { mockStays, type Stay } from "@/lib/mock-data";
import {
  VerticalFilterSidebar,
  type FilterConfig,
} from "@/components/shared/VerticalFilterSidebar";
import { FilterChips } from "@/components/shared/FilterChips";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type ResolvedLocation,
  buildStaysHeadline,
} from "@/lib/utils/locationSlug";

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
function StayCard({ stay }: { stay: Stay }) {
  const visibleAmenities = stay.amenities.slice(0, 3);
  const extraCount = stay.amenities.length - 3;

  return (
    <Link
      href={`/stays/${stay.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={stay.image}
          alt={stay.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-neutral-800 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          {stay.type}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i <= Math.floor(stay.rating)
                    ? "fill-[#f2ba0d] text-[#f2ba0d]"
                    : "fill-neutral-200 text-neutral-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-neutral-800 ml-0.5">{stay.rating}</span>
          <span className="text-xs text-neutral-400">({stay.reviews})</span>
        </div>

        <h3 className="font-bold text-sm md:text-base text-neutral-900 line-clamp-1 group-hover:text-purple transition-colors leading-tight">
          {stay.name}
        </h3>

        <p className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <span className="truncate">{stay.location}</span>
        </p>

        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {visibleAmenities.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 text-[10px] text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5 font-medium"
            >
              {AMENITY_ICONS[a] ?? <Sparkles className="h-2.5 w-2.5" />}
              {a}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-[10px] text-neutral-400 font-medium">+{extraCount}</span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-sm md:text-base font-black text-neutral-900">K{stay.price}</span>
            <span className="text-xs text-neutral-500 font-normal"> / night</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple group-hover:text-purple-hover transition-colors">
            View Stay <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

interface StaysPageProps {
  location?: ResolvedLocation;
}

export function StaysPage({ location }: StaysPageProps) {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") ?? "";

  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [drawerFilters, setDrawerFilters] = useState<Record<string, any>>(DEFAULT_DRAWER_FILTERS);
  
  const [sortValue, setSortValue] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Harmonized Search Inputs: Where, When, Guests
  const initialWhere = qParam || location?.city?.name || location?.province?.name || "";
  const [whereInput, setWhereInput] = useState(initialWhere);
  const [whenInput, setWhenInput] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  useEffect(() => {
    const resolved = qParam || location?.city?.name || location?.province?.name || "";
    setWhereInput(resolved);
  }, [qParam, location]);

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
    let result = [...mockStays];

    if (whereInput.trim()) {
      const q = whereInput.toLowerCase();
      result = result.filter((s) => s.location.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
      if (result.length === 0) result = [...mockStays];
    } else if (location) {
      if (location.type === "attraction" && location.attraction) {
        const ids = new Set(location.attraction.nearbyStayIds);
        const nearby = result.filter((s) => ids.has(s.id));
        if (nearby.length > 0) {
          result = nearby;
        }
      } else if (location.type === "city" && location.city) {
        result = result.filter((s) =>
          s.location.toLowerCase().includes(location.city!.name.toLowerCase()),
        );
        if (result.length === 0) result = [...mockStays];
      } else if (location.type === "province" && location.province) {
        const provinceName = location.province.name.toLowerCase().replace("province", "");
        result = result.filter((s) => s.location.toLowerCase().includes(provinceName));
        if (result.length === 0) result = [...mockStays];
      }
    }

    if (selectedPropertyTypes.length > 0) {
      result = result.filter((s) => {
        return selectedPropertyTypes.some((t) => {
          if (t === "Popular") return s.rating >= 4.7;
          if (t === "Unique") return s.type === "Boutique" || s.type === "Farm Stay" || s.type === "Boat Stay" || s.type === "Chalet";
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
  }, [whereInput, selectedPropertyTypes, drawerFilters, sortValue, location]);

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
      c.push({ label: "Instant Book", onRemove: () => handleDrawerFilterChange("instantBook", false) });
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

      {/* ── HERO TITLE SECTION ─────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-100 py-3.5">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">

          {/* Title */}
          <h1 className="text-lg md:text-xl font-extrabold text-neutral-900 text-center tracking-tight leading-snug">
            {dynamicHeadline}
          </h1>

          {/* Search Bar — compact inline row on mobile, full grid on desktop */}
          {/* Mobile: flex row with Where | When | Search */}
          <div className="mt-3 max-w-4xl mx-auto">

            {/* ── MOBILE (< md): single pill-row ── */}
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
                className="bg-purple text-white rounded-full h-9 w-9 hover:bg-purple-hover transition-colors shrink-0 flex items-center justify-center shadow-xs active:scale-95 cursor-pointer ml-0.5"
                aria-label="Search"
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* ── DESKTOP (md+): full grid ── */}
            <div className="hidden md:grid md:grid-cols-12 bg-white border border-neutral-200 shadow-sm rounded-2xl p-1.5 gap-1.5">

              {/* WHERE */}
              <div className="md:col-span-4 bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-1.5 transition-colors flex flex-col justify-center">
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-purple leading-none mb-0.5">Where</p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={whereInput}
                    onChange={(e) => setWhereInput(e.target.value)}
                    placeholder="Destination, city, or property"
                    className="w-full bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none placeholder:text-neutral-400 truncate"
                  />
                </div>
              </div>

              {/* WHEN */}
              <div className="md:col-span-3 bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-1.5 transition-colors flex flex-col justify-center">
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-purple leading-none mb-0.5">When</p>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                  <input
                    type="date"
                    value={whenInput}
                    onChange={(e) => setWhenInput(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* GUESTS / ROOMS */}
              <div className="md:col-span-3 bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-1.5 transition-colors flex flex-col justify-center">
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-purple leading-none mb-0.5">Guests &amp; Rooms</p>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 shrink-0">
                    <Users className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="text-xs font-semibold text-neutral-800">
                      {rooms} Rm, {guests} Gst
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-purple hover:text-purple text-[10px] font-bold">−</button>
                    <button type="button" onClick={() => setGuests((g) => g + 1)} className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-purple hover:text-purple text-[10px] font-bold">+</button>
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

      {/* ── STICKY FILTER BAR (Filters button + Property pills) ── */}
      <div className="sticky top-[64px] z-20 bg-white border-b border-neutral-200 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">
          <div className="flex items-center gap-2.5 py-2.5 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
            
            {/* Filters Button */}
            <button
              onClick={() => setFiltersOpen(true)}
              className={cn(
                "flex-none flex items-center gap-2 border rounded-full px-6 py-2 text-sm font-bold transition-all duration-150 active:scale-95 whitespace-nowrap shadow-xs",
                chips.length > 0
                  ? "bg-purple/10 border-purple text-purple hover:bg-purple/15"
                  : "bg-white border-neutral-300 text-neutral-800 hover:border-purple/60 hover:text-purple hover:bg-purple/[0.03]",
              )}
            >
              <SlidersHorizontal className="h-4 w-4 shrink-0" />
              <span>Filters</span>
              {chips.length > 0 && (
                <span className="flex items-center justify-center bg-purple text-white text-[11px] font-extrabold h-4.5 min-w-[18px] px-1 rounded-full leading-none">
                  {chips.length}
                </span>
              )}
            </button>

            <div className="h-5 w-px bg-neutral-200 flex-none" />

            {/* Category / Property Type Pills (Clean Text Only) */}
            {PROPERTY_TYPE_PILLS.map((cat) => {
              const active = selectedPropertyTypes.includes(cat.type);
              return (
                <button
                  key={cat.type}
                  onClick={() => togglePropertyType(cat.type)}
                  className={cn(
                    "flex-none whitespace-nowrap px-6 py-2 rounded-full border text-sm transition-all duration-150 active:scale-95 select-none",
                    active
                      ? "bg-purple text-white border-purple shadow-sm font-bold scale-[1.02]"
                      : "bg-white border-neutral-200 text-neutral-700 font-semibold hover:border-purple/50 hover:text-purple hover:bg-purple/[0.03] hover:shadow-xs",
                  )}
                >
                  {cat.label}
                </button>
              );
            })}

          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT (3 Cards Per Row) ─────────────── */}
      <main className="max-w-[1400px] mx-auto px-3 md:px-6 py-4">

        {/* Title bar + sort */}
        <div className="flex items-center justify-between mb-3.5 gap-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900">{dynamicHeadline}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              <span className="font-semibold text-neutral-700">{filteredStays.length}</span> properties found
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
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        <FilterChips chips={chips} onClearAll={handleResetAll} />

        {/* Cards grid: 3 larger columns */}
        {filteredStays.length === 0 ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
            {filteredStays.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        )}
      </main>

      {/* ── FILTERS DRAWER ── */}
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
