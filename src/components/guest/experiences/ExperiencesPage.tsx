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
} from "lucide-react";
import { mockExperiences, categoryLabels, categoryIcons, type Experience } from "@/lib/mock-data";
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
    label: "Price per Person",
    type: "price-range",
    min: 0,
    max: 500,
    step: 10,
    unit: "K",
  },
  {
    id: "category",
    label: "Category",
    type: "checkbox-group",
    options: [
      { value: "cultural", label: "Cultural" },
      { value: "wildlife", label: "Wildlife" },
      { value: "farm", label: "Farm" },
      { value: "industrial", label: "Industrial" },
      { value: "adventure", label: "Adventure" },
      { value: "water", label: "Water" },
    ],
  },
  {
    id: "difficulty",
    label: "Difficulty",
    type: "radio-group",
    options: [
      { value: "any", label: "Any" },
      { value: "Easy", label: "Easy" },
      { value: "Moderate", label: "Moderate" },
      { value: "Challenging", label: "Challenging" },
    ],
  },
  {
    id: "duration",
    label: "Duration",
    type: "radio-group",
    options: [
      { value: "any", label: "Any" },
      { value: "< 3 Hours", label: "< 3 Hours" },
      { value: "Half Day", label: "Half Day" },
      { value: "Full Day", label: "Full Day" },
      { value: "Multi-Day", label: "Multi-Day" },
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
  priceRange: { min: 0, max: 500 },
  category: [],
  difficulty: "any",
  duration: "any",
  groupSize: "any",
};

// ─── Experience Card ─────────────────────────────────────────────────────────

function ExperienceCard({ exp }: { exp: Experience }) {
  const icon = categoryIcons[exp.category] ?? "📍";
  const label = categoryLabels[exp.category] ?? "Experience";

  return (
    <Link
      href={`/experiences/${exp.id}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#1f1433] hover:scale-[1.01]"
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={exp.image}
          alt={exp.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Category badge */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#1f1433] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
          <span role="img" aria-label={label}>
            {icon}
          </span>
          {label}
        </span>
        {/* Price */}
        <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-[#1f1433] text-sm font-bold px-2.5 py-1 rounded-full shadow-sm">
          From K{exp.price}
          <span className="text-gray-500 font-normal">/person</span>
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="h-3.5 w-3.5 fill-[#1f1433] text-[#1f1433]" />
          <span className="text-sm font-bold text-gray-900">{exp.rating}</span>
          <span className="text-sm text-gray-400">({exp.reviews} reviews)</span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-base text-[#1f1433] line-clamp-2 leading-snug group-hover:text-[#1f1433] transition-colors">
          {exp.name}
        </h3>

        {/* Location */}
        <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <MapPin className="h-3 w-3 shrink-0" />
          {exp.location}
        </p>

        {/* Duration + Group size badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {exp.duration && (
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 rounded-full px-2 py-0.5">
              <Clock className="h-3 w-3" />
              {exp.duration}
            </span>
          )}
          {exp.groupSize && (
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 rounded-full px-2 py-0.5">
              <Users className="h-3 w-3" />
              {exp.groupSize}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1f1433] group-hover:text-[#1f1433] transition-colors">
            Book Experience <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Helper: duration match ──────────────────────────────────────────────────

function matchDuration(expDuration: string | undefined, filter: string): boolean {
  if (!expDuration) return false;
  const d = expDuration.toLowerCase();
  if (filter === "< 3 Hours")
    return (
      d.includes("15 min") ||
      d.includes("1 hour") ||
      d.includes("2 hour") ||
      d.includes("3 hour") ||
      /^\d+\s*min/.test(d)
    );
  if (filter === "Half Day") return d.includes("half day");
  if (filter === "Full Day") return d.includes("full day");
  if (filter === "Multi-Day") return d.includes("multi") || d.includes("day");
  return false;
}

// ─── Helper: group size match ────────────────────────────────────────────────

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

  // ── Filtered + sorted results
  const filteredExperiences = useMemo(() => {
    let result = [...mockExperiences];

    // Location context from URL
    const locationCtx = [attraction, city, province, q].filter(Boolean);
    if (locationCtx.length > 0) {
      const narrowed = result.filter((e) =>
        locationCtx.some((ctx) => e.location.toLowerCase().includes(ctx.toLowerCase())),
      );
      if (narrowed.length > 0) result = narrowed;
    }

    // Price
    const pr = activeFilters.priceRange;
    if (pr) result = result.filter((e) => e.price >= pr.min && e.price <= pr.max);

    // Category (checkbox multi-select)
    const cats: string[] = activeFilters.category ?? [];
    if (cats.length > 0) result = result.filter((e) => cats.includes(e.category));

    // Difficulty — experiences don't have difficulty in type but filter is defined; skip gracefully
    // Duration
    const dur = activeFilters.duration;
    if (dur && dur !== "any") {
      result = result.filter((e) => matchDuration(e.duration, dur));
    }

    // Group size
    const gs = activeFilters.groupSize;
    if (gs && gs !== "any") {
      result = result.filter((e) => matchGroupSize(e.groupSize, gs));
    }

    // Sort
    if (sortValue === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortValue === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortValue === "rating") result.sort((a, b) => a.rating - b.rating);

    return result;
  }, [activeFilters, sortValue, province, city, attraction, q]);

  // ── Active chips
  const chips = useMemo(() => {
    const c: { label: string; onRemove: () => void }[] = [];

    const cats: string[] = activeFilters.category ?? [];
    cats.forEach((v) =>
      c.push({
        label: categoryLabels[v as keyof typeof categoryLabels] ?? v,
        onRemove: () =>
          handleFilterChange(
            "category",
            cats.filter((x) => x !== v),
          ),
      }),
    );

    if (activeFilters.difficulty && activeFilters.difficulty !== "any")
      c.push({
        label: activeFilters.difficulty,
        onRemove: () => handleFilterChange("difficulty", "any"),
      });
    if (activeFilters.duration && activeFilters.duration !== "any")
      c.push({
        label: activeFilters.duration,
        onRemove: () => handleFilterChange("duration", "any"),
      });
    if (activeFilters.groupSize && activeFilters.groupSize !== "any")
      c.push({
        label: activeFilters.groupSize,
        onRemove: () => handleFilterChange("groupSize", "any"),
      });

    const pr = activeFilters.priceRange;
    if (pr && (pr.min > 0 || pr.max < 500))
      c.push({
        label: `K${pr.min}–K${pr.max}`,
        onRemove: () => handleFilterChange("priceRange", { min: 0, max: 500 }),
      });

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
    <div className="min-h-screen bg-[#ffffff] font-sans">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1f1433]/[0.06] via-[#1f1433]/[0.02] to-transparent pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-gray-500 mb-4"
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
                <span className="text-[#1f1433] font-semibold">Experiences</span>
              </>
            )}
            {breadcrumbParts.length === 0 && (
              <span className="text-[#1f1433] font-semibold">Experiences in Zambia</span>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2ba0d]/10 text-[#1f1433]">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1f1433] font-display">
                {headline}
              </h1>
              <p className="text-base text-gray-500 mt-0.5">
                Safaris, cultural tours, farm visits and more
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
              <h3 className="font-bold text-xl text-[#1f1433]">No experiences found</h3>
              <p className="text-gray-500 text-base max-w-sm text-center mt-2">
                Try adjusting your filters to discover more.
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
              {filteredExperiences.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 bg-[#f2ba0d] text-white text-base font-bold px-5 py-3 rounded-full shadow-lg hover:bg-[#2d1a4a] transition-colors"
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
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-[#ffffff] rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#ffffff] flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-lg font-bold text-[#1f1433]">Filters</span>
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
                Show {filteredExperiences.length} experiences
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
