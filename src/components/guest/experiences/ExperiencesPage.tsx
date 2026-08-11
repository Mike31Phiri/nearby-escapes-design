"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Star,
  MapPin,
  SlidersHorizontal,
  X,
  Clock,
  Users,
  ChevronRight,
  Search,
} from "lucide-react";
import { mockExperiences, categoryLabels, type Experience } from "@/lib/mock-data";
import {
  VerticalFilterSidebar,
  type FilterConfig,
} from "@/components/shared/VerticalFilterSidebar";
import { FilterChips } from "@/components/shared/FilterChips";
import { SortBar } from "@/components/shared/SortBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Filter configuration ───────────────────────────────────────────────────

const FILTER_CONFIG: FilterConfig[] = [
  {
    id: "priceRange",
    label: "Price per Person",
    type: "price-range",
    min: 0,
    max: 1000,
    step: 25,
  },
  {
    id: "duration",
    label: "Duration",
    type: "checkbox-group",
    options: [
      { value: "< 3 Hours", label: "Under 2 hours" },
      { value: "Half Day", label: "Half-day (2–4 hrs)" },
      { value: "Full Day", label: "Full day (4+ hrs)" },
      { value: "Multi-Day", label: "Multi-day" },
    ],
  },
  {
    id: "category",
    label: "Type of Experience",
    type: "checkbox-group",
    options: [
      { value: "wildlife", label: "Guided Tours" },
      { value: "farm", label: "Farm Tours" },
      { value: "cultural", label: "Education Tours" },
      { value: "adventure", label: "Hidden Gem Experiences" },
      { value: "water", label: "Water Adventures" },
      { value: "industrial", label: "Industrial Tours" },
    ],
  },
  {
    id: "rating",
    label: "Authenticity Rating",
    type: "radio-group",
    options: [
      { value: "any", label: "Any" },
      { value: "4.5", label: "Highly Recommended (4.5+)" },
      { value: "4.8", label: "Exceptional (4.8+)" },
    ],
  },
  {
    id: "groupSize",
    label: "Group Size",
    type: "radio-group",
    options: [
      { value: "any", label: "Any" },
      { value: "Solo", label: "Solo" },
      { value: "Small (2-4)", label: "Small (2–4)" },
      { value: "Group (5+)", label: "Group (5+)" },
    ],
  },
];

const DEFAULT_FILTERS: Record<string, any> = {
  priceRange: { min: 0, max: 1000 },
  duration: [],
  category: [],
  rating: "any",
  groupSize: "any",
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
    label: "Guided Tours",
    isActive: (f) => (f.category as string[]).includes("wildlife"),
    apply: (f) => ({ ...f, category: [...(f.category as string[]), "wildlife"] }),
    remove: (f) => ({ ...f, category: (f.category as string[]).filter((c) => c !== "wildlife") }),
  },
  {
    label: "Farm Tours",
    isActive: (f) => (f.category as string[]).includes("farm"),
    apply: (f) => ({ ...f, category: [...(f.category as string[]), "farm"] }),
    remove: (f) => ({ ...f, category: (f.category as string[]).filter((c) => c !== "farm") }),
  },
  {
    label: "Hidden Gems",
    isActive: (f) => (f.category as string[]).includes("adventure"),
    apply: (f) => ({ ...f, category: [...(f.category as string[]), "adventure"] }),
    remove: (f) => ({ ...f, category: (f.category as string[]).filter((c) => c !== "adventure") }),
  },
  {
    label: "Top Rated 4.8+",
    isActive: (f) => f.rating === "4.8",
    apply: (f) => ({ ...f, rating: "4.8" }),
    remove: (f) => ({ ...f, rating: "any" }),
  },
  {
    label: "Half-day",
    isActive: (f) => (f.duration as string[]).includes("Half Day"),
    apply: (f) => ({ ...f, duration: [...(f.duration as string[]), "Half Day"] }),
    remove: (f) => ({ ...f, duration: (f.duration as string[]).filter((d) => d !== "Half Day") }),
  },
];

// ─── Experience Card (GetYourGuide Vertical Grid Style) ──────────────────────

function ExperienceCard({ exp }: { exp: Experience }) {
  const label = categoryLabels[exp.category] ?? "Experience";

  const badgeLabel =
    exp.category === "adventure"
      ? "Hidden Gem"
      : exp.category === "cultural"
      ? "Education Tour"
      : exp.category === "farm"
      ? "Farm Tour"
      : null;

  return (
    <Link
      href={`/experiences/${exp.id}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
    >
      {/* Image Container */}
      <div className="w-full h-48 relative overflow-hidden shrink-0">
        <img
          src={exp.image}
          alt={exp.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badge maintained with white text at top right */}
        {badgeLabel && (
          <span className="absolute top-3 right-3 text-[10px] bg-gold/90 text-white border border-gold/30 px-2 py-0.5 rounded-full font-bold shadow-sm whitespace-nowrap backdrop-blur-sm">
            {badgeLabel}
          </span>
        )}

        {/* Transparent Category Label at Bottom Left */}
        <span className="absolute bottom-3 left-3 bg-black/40 text-white text-[10px] px-2.5 py-1 rounded-full font-medium backdrop-blur-md border border-white/20 inline-flex items-center">
          {label}
        </span>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <p className="flex items-center gap-1 text-xs text-black-muted font-medium mb-1">
            <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
            {exp.location}
          </p>

          <h3 className="font-bold text-base text-black-soft tracking-tight leading-snug line-clamp-2 group-hover:text-purple-900 transition-colors">
            {exp.name}
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-black-muted font-medium">
            {exp.duration && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-400" />
                {exp.duration}
              </span>
            )}
            {exp.groupSize && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3 text-gray-400" />
                {exp.groupSize}
              </span>
            )}
          </div>
        </div>

        {/* Footer (Rating + Price) */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between">
          <div className="flex items-center gap-1 text-xs font-semibold text-black-soft">
            <Star className="h-3.5 w-3.5 fill-black text-black" />
            <span>{exp.rating}</span>
            <span className="text-black-faint font-normal">({exp.reviews})</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-black-faint font-medium block leading-none">From</span>
            <p className="text-lg font-extrabold text-black leading-tight mt-0.5">
              kwacha {exp.price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Duration matching helper ─────────────────────────────────────────────────

function matchDuration(expDuration: string | undefined, filters: string[]): boolean {
  if (!expDuration || filters.length === 0) return true;
  const d = expDuration.toLowerCase();
  return filters.some((filter) => {
    if (filter === "< 3 Hours")
      return d.includes("15 min") || d.includes("1 hour") || d.includes("2 hour") || /^\d+\s*min/.test(d);
    if (filter === "Half Day") return d.includes("half day");
    if (filter === "Full Day") return d.includes("full day");
    if (filter === "Multi-Day") return d.includes("multi") || d.includes("multi-day");
    return false;
  });
}

function matchGroupSize(expGroupSize: string | undefined, filter: string): boolean {
  if (!expGroupSize) return false;
  const nums = expGroupSize.match(/\d+/g)?.map(Number) ?? [];
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  if (filter === "Solo") return max === 1;
  if (filter === "Small (2-4)") return max >= 2 && max <= 4;
  if (filter === "Group (5+)") return max >= 5;
  return false;
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ExperiencesPage() {
  const searchParams = useSearchParams();
  const province = searchParams.get("province") ?? "";
  const city = searchParams.get("city") ?? "";
  const attraction = searchParams.get("attraction") ?? "";
  const q = searchParams.get("q") ?? "";

  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(DEFAULT_FILTERS);
  const [sortValue, setSortValue] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [filterId]: value }));
  };

  const handleReset = () => setActiveFilters(DEFAULT_FILTERS);

  const filteredExperiences = useMemo(() => {
    let result = [...mockExperiences];

    const locationCtx = [attraction, city, province, q].filter(Boolean);
    if (locationCtx.length > 0) {
      const narrowed = result.filter((e) =>
        locationCtx.some((ctx) => e.location.toLowerCase().includes(ctx.toLowerCase())),
      );
      if (narrowed.length > 0) result = narrowed;
    }

    const pr = activeFilters.priceRange;
    if (pr) result = result.filter((e) => e.price >= pr.min && e.price <= pr.max);

    const cats: string[] = activeFilters.category ?? [];
    if (cats.length > 0) result = result.filter((e) => cats.includes(e.category));

    const durs: string[] = activeFilters.duration ?? [];
    if (durs.length > 0) result = result.filter((e) => matchDuration(e.duration, durs));

    const ratingFilter = activeFilters.rating;
    if (ratingFilter && ratingFilter !== "any") {
      result = result.filter((e) => e.rating >= parseFloat(ratingFilter));
    }

    const gs = activeFilters.groupSize;
    if (gs && gs !== "any") {
      result = result.filter((e) => matchGroupSize(e.groupSize, gs));
    }

    if (sortValue === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortValue === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortValue === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [activeFilters, sortValue, province, city, attraction, q]);

  const chips = useMemo(() => {
    const c: { label: string; onRemove: () => void }[] = [];

    const cats: string[] = activeFilters.category ?? [];
    cats.forEach((v) =>
      c.push({
        label: categoryLabels[v as keyof typeof categoryLabels] ?? v,
        onRemove: () => handleFilterChange("category", cats.filter((x) => x !== v)),
      }),
    );

    const durs: string[] = activeFilters.duration ?? [];
    durs.forEach((v) =>
      c.push({ label: v, onRemove: () => handleFilterChange("duration", durs.filter((x) => x !== v)) }),
    );

    if (activeFilters.rating && activeFilters.rating !== "any")
      c.push({ label: `${activeFilters.rating}+ stars`, onRemove: () => handleFilterChange("rating", "any") });

    if (activeFilters.groupSize && activeFilters.groupSize !== "any")
      c.push({ label: activeFilters.groupSize, onRemove: () => handleFilterChange("groupSize", "any") });

    return c;
  }, [activeFilters]);

  const breadcrumbParts = ["Zambia", province, city].filter(Boolean);
  const locationLabel = city || province || undefined;
  const headline = q
    ? `Experiences for "${q}"`
    : city
    ? `Experiences in ${city}`
    : province
    ? `Experiences in ${province}`
    : "Experiences in Zambia";

  return (
    <div className="h-screen overflow-hidden bg-white-warm font-sans flex flex-col">
      <div className="max-w-[1100px] w-full mx-auto px-4 md:px-6 pt-4 flex flex-col flex-1 overflow-hidden">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-1 text-xs text-black-faint mb-2">
          <Link href="/" className="hover:text-purple transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-black-faint/50" />
          <Link href="/explore" className="hover:text-purple transition-colors">Explore</Link>
          {breadcrumbParts.map((part, i) => (
            <span key={part} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-black-faint/50" />
              <span className={i === breadcrumbParts.length - 1 ? "text-black font-semibold" : ""}>{part}</span>
            </span>
          ))}
          <ChevronRight className="h-3 w-3 text-black-faint/50" />
          <span className="text-black font-semibold">Experiences</span>
        </nav>

        {/* Desktop title */}
        <div className="hidden lg:block mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-black">{headline}</h1>
          <p className="text-black-muted mt-0.5 font-script text-xl text-purple/80">
            Unlock hidden gems &amp; unforgettable moments.
          </p>
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-full border border-gray-200 shadow-sm p-1.5 flex items-center gap-2 mb-4 hover:shadow-md transition-shadow w-full">
          <Search className="h-4 w-4 text-black-faint ml-2 sm:ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Activity or destination"
            defaultValue={city || province || ""}
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
                total={filteredExperiences.length}
                sortValue={sortValue}
                onSortChange={setSortValue}
                locationLabel={locationLabel}
              />
              <FilterChips chips={chips} onClearAll={handleReset} />
            </div>

            {filteredExperiences.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 mt-6">
                <Compass className="h-10 w-10 text-gray-200 mb-4" />
                <h3 className="font-bold text-xl text-black">No experiences found</h3>
                <p className="text-black-muted text-base max-w-sm text-center mt-2">
                  Try adjusting your filters to discover more.
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
                {filteredExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} exp={exp} />
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
                Show {filteredExperiences.length} experiences
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}