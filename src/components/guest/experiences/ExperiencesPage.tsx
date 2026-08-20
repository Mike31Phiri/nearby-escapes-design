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
  ChevronDown,
  CalendarDays,
  Search,
} from "lucide-react";
import { mockExperiences, categoryLabels, type Experience, type ExperienceCategory } from "@/lib/mock-data";
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
    label: "Price per Person",
    type: "price-range",
    min: 0,
    max: 1000,
    step: 25,
    unit: "K",
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

const DEFAULT_DRAWER_FILTERS: Record<string, any> = {
  priceRange: { min: 0, max: 1000 },
  duration: [],
  rating: "any",
  groupSize: "any",
};

// Independent Experience Category Pills (Clean text only)
const CATEGORY_PILLS: { label: string; cat: string }[] = [
  { label: "Popular", cat: "popular" },
  { label: "Unique", cat: "unique" },
  { label: "Wildlife & Safari", cat: "wildlife" },
  { label: "Farm Visits", cat: "farm" },
  { label: "Cultural & Heritage", cat: "cultural" },
  { label: "Hidden Gems & Adventure", cat: "adventure" },
  { label: "Water & Lakes", cat: "water" },
  { label: "Industrial Tours", cat: "industrial" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
];

const CATEGORY_COLORS: Record<string, string> = {
  wildlife: "from-amber-900/80",
  farm: "from-green-900/80",
  cultural: "from-purple-900/80",
  adventure: "from-orange-900/80",
  water: "from-blue-900/80",
  industrial: "from-slate-900/80",
  general: "from-neutral-900/80",
};

// Experience Card
function ExperienceCard({ exp }: { exp: Experience }) {
  const label = categoryLabels[exp.category] ?? "Experience";
  const gradientFrom = CATEGORY_COLORS[exp.category] ?? "from-neutral-900/80";

  return (
    <Link
      href={`/experiences/${exp.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={exp.image}
          alt={exp.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-t", gradientFrom, "via-transparent to-transparent")} />
        <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full font-bold backdrop-blur-sm">
          {label}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="h-3.5 w-3.5 fill-[#f2ba0d] text-[#f2ba0d]" />
          <span className="text-xs font-bold text-neutral-800">{exp.rating}</span>
          <span className="text-xs text-neutral-400">({exp.reviews})</span>
        </div>

        <h3 className="font-bold text-sm md:text-base text-neutral-900 line-clamp-1 group-hover:text-purple transition-colors leading-tight">
          {exp.name}
        </h3>

        <p className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <span className="truncate">{exp.location}</span>
        </p>

        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {exp.duration && (
            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5 font-medium">
              <Clock className="h-3 w-3 text-neutral-400" />
              {exp.duration}
            </span>
          )}
          {exp.groupSize && (
            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-full px-2 py-0.5 font-medium">
              <Users className="h-3 w-3 text-neutral-400" />
              {exp.groupSize}
            </span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-sm md:text-base font-black text-neutral-900">K{exp.price}</span>
            <span className="text-xs text-neutral-500 font-normal"> / person</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple group-hover:text-purple-hover transition-colors">
            Book <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function matchDuration(expDuration: string | undefined, filters: string[]): boolean {
  if (!expDuration || filters.length === 0) return true;
  const d = expDuration.toLowerCase();
  return filters.some((filter) => {
    if (filter === "< 3 Hours")
      return (
        d.includes("15 min") || d.includes("1 hour") || d.includes("2 hour") || /^\d+\s*min/.test(d)
      );
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

// Main Page
export function ExperiencesPage() {
  const searchParams = useSearchParams();
  const province = searchParams.get("province") ?? "";
  const city = searchParams.get("city") ?? "";
  const attraction = searchParams.get("attraction") ?? "";
  const q = searchParams.get("q") ?? "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [drawerFilters, setDrawerFilters] = useState<Record<string, any>>(DEFAULT_DRAWER_FILTERS);

  const [sortValue, setSortValue] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Harmonized Search Inputs: Where, When, Guests
  const initialWhere = city || province || attraction || q || "";
  const [whereInput, setWhereInput] = useState(initialWhere);
  const [whenInput, setWhenInput] = useState("");
  const [groupSizeInput, setGroupSizeInput] = useState(2);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => (prev.includes(cat) ? [] : [cat]));
  };

  const handleDrawerFilterChange = (filterId: string, value: any) => {
    setDrawerFilters((prev) => ({ ...prev, [filterId]: value }));
  };

  const handleResetAll = () => {
    setSelectedCategories([]);
    setDrawerFilters(DEFAULT_DRAWER_FILTERS);
  };

  const filteredExperiences = useMemo(() => {
    let result = [...mockExperiences];

    if (whereInput.trim()) {
      const search = whereInput.toLowerCase();
      result = result.filter((e) => e.location.toLowerCase().includes(search) || e.name.toLowerCase().includes(search));
      if (result.length === 0) result = [...mockExperiences];
    } else {
      const locationCtx = [attraction, city, province, q].filter(Boolean);
      if (locationCtx.length > 0) {
        const narrowed = result.filter((e) =>
          locationCtx.some((ctx) => e.location.toLowerCase().includes(ctx.toLowerCase())),
        );
        if (narrowed.length > 0) result = narrowed;
      }
    }

    if (selectedCategories.length > 0) {
      result = result.filter((e) => {
        return selectedCategories.some((cat) => {
          if (cat === "popular") return e.rating >= 4.7;
          if (cat === "unique") return e.category === "cultural" || e.category === "adventure" || e.category === "farm";
          return e.category === cat;
        });
      });
    }

    const pr = drawerFilters.priceRange;
    if (pr) result = result.filter((e) => e.price >= pr.min && e.price <= pr.max);

    const durs: string[] = drawerFilters.duration ?? [];
    if (durs.length > 0) result = result.filter((e) => matchDuration(e.duration, durs));

    const ratingFilter = drawerFilters.rating;
    if (ratingFilter && ratingFilter !== "any") {
      result = result.filter((e) => e.rating >= parseFloat(ratingFilter));
    }

    const gs = drawerFilters.groupSize;
    if (gs && gs !== "any") {
      result = result.filter((e) => matchGroupSize(e.groupSize, gs));
    }

    if (sortValue === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortValue === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortValue === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [whereInput, selectedCategories, drawerFilters, sortValue, province, city, attraction, q]);

  const chips = useMemo(() => {
    const c: { label: string; onRemove: () => void }[] = [];

    const durs: string[] = drawerFilters.duration ?? [];
    durs.forEach((v) =>
      c.push({
        label: v,
        onRemove: () =>
          handleDrawerFilterChange(
            "duration",
            durs.filter((x) => x !== v),
          ),
      }),
    );

    if (drawerFilters.rating && drawerFilters.rating !== "any")
      c.push({
        label: `${drawerFilters.rating}+ stars`,
        onRemove: () => handleDrawerFilterChange("rating", "any"),
      });

    if (drawerFilters.groupSize && drawerFilters.groupSize !== "any")
      c.push({
        label: drawerFilters.groupSize,
        onRemove: () => handleDrawerFilterChange("groupSize", "any"),
      });

    const pr = drawerFilters.priceRange;
    if (pr && (pr.min > 0 || pr.max < 1000))
      c.push({
        label: `K${pr.min}–K${pr.max}`,
        onRemove: () => handleDrawerFilterChange("priceRange", { min: 0, max: 1000 }),
      });

    return c;
  }, [selectedCategories, drawerFilters]);

  const dynamicTitle = useMemo(() => {
    const raw = q || city || province || attraction || "Zambia";
    const area = raw.charAt(0).toUpperCase() + raw.slice(1);
    return `Experiences & Tours in ${area}`;
  }, [q, city, province, attraction]);

  return (
    <div className="min-h-screen bg-[#faf8f4] font-sans">

      {/* ── HERO TITLE SECTION ─────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-100 py-3.5">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">

          {/* Title */}
          <h1 className="text-lg md:text-xl font-extrabold text-neutral-900 text-center tracking-tight leading-snug">
            {dynamicTitle}
          </h1>

          {/* Search Bar — compact inline row on mobile, full grid on desktop */}
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
                    placeholder="Destination, activity, or tour"
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

              {/* GUESTS */}
              <div className="md:col-span-3 bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-1.5 transition-colors flex flex-col justify-center">
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-purple leading-none mb-0.5">Guests</p>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 shrink-0">
                    <Users className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="text-xs font-semibold text-neutral-800">
                      {groupSizeInput} {groupSizeInput === 1 ? "Person" : "People"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => setGroupSizeInput((g) => Math.max(1, g - 1))} className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-purple hover:text-purple text-[10px] font-bold">−</button>
                    <button type="button" onClick={() => setGroupSizeInput((g) => g + 1)} className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-purple hover:text-purple text-[10px] font-bold">+</button>
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


      {/* ── STICKY FILTER BAR (Filters button + Category pills) ── */}
      <div className="sticky top-[64px] z-20 bg-white border-b border-neutral-200 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">
          <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
            
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

            {/* Category Pills (Clean Text Only) */}
            {CATEGORY_PILLS.map((item) => {
              const active = selectedCategories.includes(item.cat);
              return (
                <button
                  key={item.cat}
                  onClick={() => toggleCategory(item.cat)}
                  className={cn(
                    "flex-none whitespace-nowrap px-6 py-2 rounded-full border text-sm transition-all duration-150 active:scale-95 select-none",
                    active
                      ? "bg-purple text-white border-purple shadow-sm font-bold scale-[1.02]"
                      : "bg-white border-neutral-200 text-neutral-700 font-semibold hover:border-purple/50 hover:text-purple hover:bg-purple/[0.03] hover:shadow-xs",
                  )}
                >
                  {item.label}
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
            <h2 className="text-base font-bold text-neutral-900">{dynamicTitle}</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              <span className="font-semibold text-neutral-700">{filteredExperiences.length}</span> experiences found
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
        {filteredExperiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-neutral-100 mt-3">
            <Compass className="h-10 w-10 text-neutral-200 mb-2" />
            <h3 className="font-bold text-base text-neutral-800">No experiences found</h3>
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
            {filteredExperiences.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
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
                Show {filteredExperiences.length} experiences
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
