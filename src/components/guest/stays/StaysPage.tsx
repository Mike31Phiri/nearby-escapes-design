"use client";

import { useState, useMemo } from "react";
import {
  Bed,
  Star,
  MapPin,
  SlidersHorizontal,
  X,
  ChevronRight,
  ArrowLeft,
  Search,
} from "lucide-react";
import { mockStays, type Stay } from "@/lib/mock-data";
import {
  VerticalFilterSidebar,
  type FilterConfig,
} from "@/components/shared/VerticalFilterSidebar";
import { FilterChips } from "@/components/shared/FilterChips";
import { SortBar } from "@/components/shared/SortBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type ResolvedLocation,
  buildStaysBreadcrumbs,
  buildStaysHeadline,
} from "@/lib/utils/locationSlug";
import { useBackNavigation } from "@/hooks/useBackNavigation";

// ─── Filter configuration ────────────────────────────────────────────────────

const FILTER_CONFIG: FilterConfig[] = [
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
    id: "propertyType",
    label: "Property Type",
    type: "checkbox-group",
    options: [
      { value: "Lodge", label: "Lodge" },
      { value: "Hotel", label: "Hotel" },
      { value: "Camp", label: "Camp" },
      { value: "Resort", label: "Resort" },
      { value: "Boutique", label: "Boutique" },
      { value: "Guesthouse", label: "Guesthouse" },
      { value: "Chalet", label: "Chalet" },
      { value: "Farm Stay", label: "Farm Stay" },
    ],
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

const DEFAULT_FILTERS: Record<string, any> = {
  priceRange: { min: 0, max: 5000 },
  propertyType: [],
  amenities: [],
  rating: "any",
  instantBook: false,
};

// ─── Quick-filter chip definitions ──────────────────────────────────────────

interface QuickChip {
  label: string;
  isActive: (f: Record<string, any>) => boolean;
  apply: (f: Record<string, any>) => Record<string, any>;
  remove: (f: Record<string, any>) => Record<string, any>;
}

const QUICK_CHIPS: QuickChip[] = [
  {
    label: "Rating 4.5+",
    isActive: (f) => f.rating === "4.5",
    apply: (f) => ({ ...f, rating: "4.5" }),
    remove: (f) => ({ ...f, rating: "any" }),
  },
  {
    label: "Pool",
    isActive: (f) => (f.amenities as string[]).includes("Pool"),
    apply: (f) => ({ ...f, amenities: [...(f.amenities as string[]), "Pool"] }),
    remove: (f) => ({
      ...f,
      amenities: (f.amenities as string[]).filter((a) => a !== "Pool"),
    }),
  },
  {
    label: "Breakfast",
    isActive: (f) => (f.amenities as string[]).includes("Breakfast"),
    apply: (f) => ({
      ...f,
      amenities: [...(f.amenities as string[]), "Breakfast"],
    }),
    remove: (f) => ({
      ...f,
      amenities: (f.amenities as string[]).filter((a) => a !== "Breakfast"),
    }),
  },
  {
    label: "WiFi",
    isActive: (f) => (f.amenities as string[]).includes("WiFi"),
    apply: (f) => ({ ...f, amenities: [...(f.amenities as string[]), "WiFi"] }),
    remove: (f) => ({
      ...f,
      amenities: (f.amenities as string[]).filter((a) => a !== "WiFi"),
    }),
  },
  {
    label: "Spa",
    isActive: (f) => (f.amenities as string[]).includes("Spa"),
    apply: (f) => ({ ...f, amenities: [...(f.amenities as string[]), "Spa"] }),
    remove: (f) => ({
      ...f,
      amenities: (f.amenities as string[]).filter((a) => a !== "Spa"),
    }),
  },
];

// ─── Stay Card (GetYourGuide Grid Style) ─────────────────────────────────────

function StayCard({ stay }: { stay: Stay }) {
  return (
    <Link
      href={`/stays/${stay.id}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
    >
      {/* Image Container */}
      <div className="w-full h-48 relative overflow-hidden shrink-0">
        <img
          src={stay.image}
          alt={stay.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Transparent Category Tag at Bottom Left */}
        <span className="absolute bottom-3 left-3 bg-black/40 text-white text-[10px] px-2.5 py-1 rounded-full font-medium backdrop-blur-md border border-white/20 inline-flex items-center uppercase tracking-wider">
          {stay.type}
        </span>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <p className="flex items-center gap-1 text-xs text-black-muted font-medium mb-1">
            <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
            {stay.location}
          </p>

          <h3 className="font-bold text-base text-black-soft tracking-tight leading-snug line-clamp-2 group-hover:text-purple-900 transition-colors">
            {stay.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {stay.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="text-[10px] text-black-muted bg-gray-100 rounded-full px-2 py-0.5 font-medium"
              >
                {a}
              </span>
            ))}
            {stay.amenities.length > 3 && (
              <span className="text-[10px] text-black-faint font-medium">
                +{stay.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer (Rating + Price) */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between">
          <div className="flex items-center gap-1 text-xs font-semibold text-black-soft">
            <Star className="h-3.5 w-3.5 fill-black text-black" />
            <span>{stay.rating}</span>
            <span className="text-black-faint font-normal">({stay.reviews})</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-black-faint font-medium block leading-none">Per night</span>
            <p className="text-lg font-extrabold text-black leading-tight mt-0.5">
              kwacha {stay.price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface StaysPageProps {
  /** Resolved location context from the [location] route param. */
  location?: ResolvedLocation;
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function StaysPage({ location }: StaysPageProps) {
  const goBack = useBackNavigation("/explore");

  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(DEFAULT_FILTERS);
  const [sortValue, setSortValue] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [filterId]: value }));
  };

  const handleReset = () => setActiveFilters(DEFAULT_FILTERS);

  // ── Filtered + sorted results
  const filteredStays = useMemo(() => {
    let result = [...mockStays];

    if (location) {
      if (location.type === "attraction" && location.attraction) {
        const ids = new Set(location.attraction.nearbyStayIds);
        const nearby = result.filter((s) => ids.has(s.id));
        if (nearby.length > 0) {
          result = nearby;
        } else if (location.city) {
          result = result.filter((s) =>
            s.location.toLowerCase().includes(location.city!.name.toLowerCase()),
          );
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

    const pr = activeFilters.priceRange;
    if (pr) result = result.filter((s) => s.price >= pr.min && s.price <= pr.max);

    const pt: string[] = activeFilters.propertyType ?? [];
    if (pt.length > 0) result = result.filter((s) => pt.includes(s.type));

    const am: string[] = activeFilters.amenities ?? [];
    if (am.length > 0) result = result.filter((s) => am.every((a) => s.amenities.includes(a)));

    const ratingFilter = activeFilters.rating;
    if (ratingFilter && ratingFilter !== "any") {
      result = result.filter((s) => s.rating >= parseFloat(ratingFilter));
    }

    if (sortValue === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortValue === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortValue === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [activeFilters, sortValue, location]);

  // ── Active filter chips
  const chips = useMemo(() => {
    const c: { label: string; onRemove: () => void }[] = [];

    const pt: string[] = activeFilters.propertyType ?? [];
    pt.forEach((v) =>
      c.push({ label: v, onRemove: () => handleFilterChange("propertyType", pt.filter((x) => x !== v)) }),
    );

    const am: string[] = activeFilters.amenities ?? [];
    am.forEach((v) =>
      c.push({ label: v, onRemove: () => handleFilterChange("amenities", am.filter((x) => x !== v)) }),
    );

    if (activeFilters.rating && activeFilters.rating !== "any") {
      c.push({ label: `${activeFilters.rating}+ stars`, onRemove: () => handleFilterChange("rating", "any") });
    }

    if (activeFilters.instantBook) {
      c.push({ label: "Instant Book", onRemove: () => handleFilterChange("instantBook", false) });
    }

    const pr = activeFilters.priceRange;
    if (pr && (pr.min > 0 || pr.max < 5000)) {
      c.push({ label: `kwacha ${pr.min}–kwacha ${pr.max}`, onRemove: () => handleFilterChange("priceRange", { min: 0, max: 5000 }) });
    }

    return c;
  }, [activeFilters]);

  const headline = location ? buildStaysHeadline(location) : "Stays in Zambia";
  const breadcrumbs = location ? buildStaysBreadcrumbs(location) : [];
  const locationLabel = location?.city?.name ?? location?.province?.name ?? undefined;

  return (
    <div className="h-screen overflow-hidden bg-white-warm font-sans flex flex-col">
      <div className="max-w-[1100px] w-full mx-auto px-4 md:px-6 pt-4 flex flex-col flex-1 overflow-hidden">

        {/* Mobile Header */}
        <div className="flex lg:hidden items-center gap-2 mb-3">
          <button
            onClick={goBack}
            aria-label="Go back"
            className="p-1.5 -ml-1 rounded-full hover:bg-white-soft text-black-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-black truncate">{headline}</h1>
        </div>

        {/* Desktop Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-1 text-xs text-black-faint mb-2">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 text-black-faint/50" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-purple transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-black font-semibold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Desktop Title */}
        <div className="hidden lg:block mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-black">{headline}</h1>
          <p className="text-black-muted mt-0.5 font-script text-xl text-purple/80">
            Find lodges, camps, and guesthouses across Zambia.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-full border border-gray-200 shadow-sm p-1.5 flex items-center gap-2 mb-4 hover:shadow-md transition-shadow w-full">
          <Search className="h-4 w-4 text-black-faint ml-2 sm:ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Search stays or location"
            defaultValue={locationLabel || ""}
            className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none text-black-soft font-medium placeholder:text-black-faint px-1"
          />
          <button className="bg-purple-900 hover:bg-purple-hover text-white rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-colors shrink-0">
            Explore
          </button>
        </div>

        {/* Quick-filter chips + Filter Trigger Button */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex-none flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-900 text-white text-xs font-bold shadow-sm hover:bg-purple-hover transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {chips.length > 0 && (
              <span className="bg-white text-purple text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {chips.length}
              </span>
            )}
          </button>

          {QUICK_CHIPS.map((chip) => {
            const active = chip.isActive(activeFilters);
            return (
              <button
                key={chip.label}
                onClick={() => setActiveFilters((prev) => (active ? chip.remove(prev) : chip.apply(prev)))}
                className={cn(
                  "flex-none whitespace-nowrap px-4 py-1.5 rounded-full border text-xs font-semibold transition-all",
                  active
                    ? "bg-purple-900 text-white border-purple-900 shadow-sm"
                    : "bg-white border-gray-200 text-black-soft hover:border-purple-900 hover:text-purple-900 shadow-sm",
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Main layout */}
        <div className="flex-1 overflow-hidden">
          <main className="min-w-0 overflow-y-auto h-full pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="space-y-4">
              <SortBar
                total={filteredStays.length}
                sortValue={sortValue}
                onSortChange={setSortValue}
                locationLabel={locationLabel}
              />
              <FilterChips chips={chips} onClearAll={handleReset} />
            </div>

            {filteredStays.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 mt-6">
                <Bed className="h-10 w-10 text-gray-200 mb-4" />
                <h3 className="font-bold text-xl text-black">No stays found</h3>
                <p className="text-black-muted text-base max-w-sm text-center mt-2">
                  Try adjusting your filters to see more results.
                </p>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="mt-6 border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
                {filteredStays.map((stay) => (
                  <StayCard key={stay.id} stay={stay} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Filter Modal Dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden z-10">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <span className="text-lg font-bold text-black">Filters</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close filters"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="px-5 py-4 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <VerticalFilterSidebar
                filters={FILTER_CONFIG}
                activeFilters={activeFilters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>

            <div className="px-5 py-4 border-t border-gray-100 shrink-0 bg-white">
              <Button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-purple-900 hover:bg-purple-hover text-white font-bold"
              >
                Show {filteredStays.length} stays
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}