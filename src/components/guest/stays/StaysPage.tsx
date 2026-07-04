"use client";

import { useState, useEffect, useMemo } from "react";
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

// ─── Filter configuration ───────────────────────────────────────────────────

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

// ─── Amenity icon map ────────────────────────────────────────────────────────

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

// ─── Stay Card ───────────────────────────────────────────────────────────────

function StayCard({ stay }: { stay: Stay }) {
  const visibleAmenities = stay.amenities.slice(0, 4);
  const extraCount = stay.amenities.length - 4;

  return (
    <Link
      href={`/stays/${stay.id}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#1f1433] hover:scale-[1.01]"
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={stay.image}
          alt={stay.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Type badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#1f1433] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          {stay.type}
        </span>
        {/* Price badge */}
        <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[#1f1433] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          K{stay.price}
          <span className="text-gray-500 font-normal">/night</span>
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="h-3.5 w-3.5 fill-[#1f1433] text-[#1f1433]" />
          <span className="text-xs font-bold text-gray-900">{stay.rating}</span>
          <span className="text-xs text-gray-400">({stay.reviews} reviews)</span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-sm text-[#1f1433] line-clamp-1 group-hover:text-[#1f1433] transition-colors">
          {stay.name}
        </h3>

        {/* Location */}
        <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <MapPin className="h-3 w-3 shrink-0" />
          {stay.location}
        </p>

        {/* Amenities */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {visibleAmenities.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 rounded-full px-2 py-0.5"
            >
              {AMENITY_ICONS[a] ?? <Sparkles className="h-3 w-3" />}
              {a}
            </span>
          ))}
          {extraCount > 0 && <span className="text-[10px] text-gray-400">+{extraCount} more</span>}
        </div>

        {/* CTA */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1f1433] group-hover:text-[#1f1433] transition-colors">
            View Stay <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function StaysPage() {
  const searchParams = useSearchParams();
  const province = searchParams.get("province") ?? "";
  const city = searchParams.get("city") ?? "";
  const attraction = searchParams.get("attraction") ?? "";
  const q = searchParams.get("q") ?? "";

  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(DEFAULT_FILTERS);
  const [sortValue, setSortValue] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Filter change handler
  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [filterId]: value }));
  };

  const handleReset = () => setActiveFilters(DEFAULT_FILTERS);

  // ── Filtered + sorted results
  const filteredStays = useMemo(() => {
    let result = [...mockStays];

    // Location context from URL
    const locationCtx = [attraction, city, province, q].filter(Boolean);
    if (locationCtx.length > 0) {
      result = result.filter((s) =>
        locationCtx.some((ctx) => s.location.toLowerCase().includes(ctx.toLowerCase())),
      );
      // If nothing matches the location filter, show all (graceful fallback)
      if (result.length === 0) result = [...mockStays];
    }

    // Price range
    const pr = activeFilters.priceRange;
    if (pr) {
      result = result.filter((s) => s.price >= pr.min && s.price <= pr.max);
    }

    // Property type
    const pt: string[] = activeFilters.propertyType ?? [];
    if (pt.length > 0) {
      result = result.filter((s) => pt.includes(s.type));
    }

    // Amenities (AND logic — must have all selected)
    const am: string[] = activeFilters.amenities ?? [];
    if (am.length > 0) {
      result = result.filter((s) => am.every((a) => s.amenities.includes(a)));
    }

    // Rating
    const ratingFilter = activeFilters.rating;
    if (ratingFilter && ratingFilter !== "any") {
      const minRating = parseFloat(ratingFilter);
      result = result.filter((s) => s.rating >= minRating);
    }

    // Sort
    if (sortValue === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortValue === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortValue === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [activeFilters, sortValue, province, city, attraction, q]);

  // ── Active filter chips
  const chips = useMemo(() => {
    const c: { label: string; onRemove: () => void }[] = [];

    const pt: string[] = activeFilters.propertyType ?? [];
    pt.forEach((v) =>
      c.push({
        label: v,
        onRemove: () =>
          handleFilterChange(
            "propertyType",
            pt.filter((x) => x !== v),
          ),
      }),
    );

    const am: string[] = activeFilters.amenities ?? [];
    am.forEach((v) =>
      c.push({
        label: v,
        onRemove: () =>
          handleFilterChange(
            "amenities",
            am.filter((x) => x !== v),
          ),
      }),
    );

    if (activeFilters.rating && activeFilters.rating !== "any") {
      c.push({
        label: `${activeFilters.rating}+ stars`,
        onRemove: () => handleFilterChange("rating", "any"),
      });
    }

    if (activeFilters.instantBook) {
      c.push({ label: "Instant Book", onRemove: () => handleFilterChange("instantBook", false) });
    }

    const pr = activeFilters.priceRange;
    if (pr && (pr.min > 0 || pr.max < 5000)) {
      c.push({
        label: `K${pr.min}–K${pr.max}`,
        onRemove: () => handleFilterChange("priceRange", { min: 0, max: 5000 }),
      });
    }

    return c;
  }, [activeFilters]);

  // ── Breadcrumb parts
  const breadcrumbParts = ["Zambia", province, city].filter(Boolean);

  // ── Location label for SortBar
  const locationLabel = city || province || undefined;

  // ── Headline
  const headline = q
    ? `Stays for "${q}"`
    : city
      ? `Stays in ${city}`
      : province
        ? `Stays in ${province}`
        : "Stays in Zambia";

  return (
    <div className="min-h-screen bg-[#ffffff] font-sans">
      {/* Page header */}
      <div className="bg-gradient-to-b from-[#1f1433]/[0.04] via-[#1f1433]/[0.02] to-transparent pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-gray-500 mb-4"
          >
            {breadcrumbParts.map((part, i) => (
              <span key={part} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                <span
                  className={i === breadcrumbParts.length - 1 ? "text-[#1f1433] font-semibold" : ""}
                >
                  {part}
                </span>
              </span>
            ))}
            {breadcrumbParts.length > 0 && (
              <>
                <ChevronRight className="h-3 w-3 text-gray-300" />
                <span className="text-[#1f1433] font-semibold">Stays</span>
              </>
            )}
            {breadcrumbParts.length === 0 && (
              <span className="text-[#1f1433] font-semibold">Stays in Zambia</span>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2ba0d]/10 text-[#1f1433]">
              <Bed className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1f1433] font-display">
                {headline}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                From luxury lodges to boutique city stays
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block">
          <VerticalFilterSidebar
            filters={FILTER_CONFIG}
            activeFilters={activeFilters}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </aside>

        {/* Results */}
        <main>
          <div className="space-y-4">
            {/* Sort bar */}
            <SortBar
              total={filteredStays.length}
              sortValue={sortValue}
              onSortChange={setSortValue}
              locationLabel={locationLabel}
            />

            {/* Active filter chips */}
            <FilterChips chips={chips} onClearAll={handleReset} />
          </div>

          {/* Grid */}
          {filteredStays.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 mt-6">
              <Bed className="h-10 w-10 text-gray-200 mb-4" />
              <h3 className="font-bold text-lg text-[#1f1433]">No stays found</h3>
              <p className="text-gray-500 text-sm max-w-sm text-center mt-2">
                Try adjusting your filters to see more results.
              </p>
              <Button
                onClick={handleReset}
                variant="outline"
                className="mt-6 border-[#1f1433] text-[#1f1433] hover:bg-[#f2ba0d] hover:text-white"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
              {filteredStays.map((stay) => (
                <StayCard key={stay.id} stay={stay} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 bg-[#f2ba0d] text-white text-sm font-bold px-5 py-3 rounded-full shadow-lg hover:bg-[#2d1a4a] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {chips.length > 0 && (
            <span className="bg-[#f2ba0d] text-[#1f1433] text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {chips.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Sliding panel */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-[#ffffff] rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#ffffff] flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-base font-bold text-[#1f1433]">Filters</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close filters"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="px-5 pb-8">
              <VerticalFilterSidebar
                filters={FILTER_CONFIG}
                activeFilters={activeFilters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
            <div className="sticky bottom-0 bg-[#ffffff] px-5 py-4 border-t border-gray-100">
              <Button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#f2ba0d] hover:bg-[#2d1a4a] text-white font-bold"
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

