"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/shared/SearchBar";
import { serializeDates, deserializeDates, type DateRange } from "@/components/ui/DateRangePicker";
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
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { mockExperiences } from "@/lib/mock-data";
import { ExperienceCard } from "@/components/shared/ListingCards";
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
// (removed - using shared ListingCards ExperienceCard)

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const province = searchParams.get("province") ?? "";
  const city = searchParams.get("city") ?? "";
  const attraction = searchParams.get("attraction") ?? "";
  const q = searchParams.get("q") ?? "";
  const catParam = searchParams.get("cat") ?? searchParams.get("category") ?? "";
  const datesParam = searchParams.get("dates") ?? "";
  const guestsParam = searchParams.get("guests") ?? "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    catParam ? [catParam] : [],
  );
  const [drawerFilters, setDrawerFilters] = useState<Record<string, any>>(DEFAULT_DRAWER_FILTERS);

  const [sortValue, setSortValue] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Harmonized Search Inputs: Where, When, Guests
  const initialWhere = city || province || attraction || q || "";
  const [whereInput, setWhereInput] = useState(initialWhere);
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    datesParam ? deserializeDates(datesParam) : { checkIn: null, checkOut: null },
  );
  const [groupSizeInput, setGroupSizeInput] = useState<number>(() =>
    guestsParam ? Math.max(1, Number(guestsParam) || 2) : 2,
  );

  useEffect(() => {
    if (datesParam) {
      setDateRange(deserializeDates(datesParam));
    }
  }, [datesParam]);

  useEffect(() => {
    if (guestsParam) {
      setGroupSizeInput(Math.max(1, Number(guestsParam) || 2));
    }
  }, [guestsParam]);

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
      result = result.filter(
        (e) => e.location.toLowerCase().includes(search) || e.name.toLowerCase().includes(search),
      );
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
          if (cat === "unique")
            return e.category === "cultural" || e.category === "adventure" || e.category === "farm";
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
  }, [whereInput, selectedCategories, drawerFilters, sortValue, province, city, attraction, q]);

  const totalCount = filteredExperiences.length;
  const visibleExperiences = useMemo(() => {
    return filteredExperiences.slice(0, currentPage * PAGE_SIZE);
  }, [filteredExperiences, currentPage]);

  const hasMore = visibleExperiences.length < totalCount;
  const remainingCount = Math.max(0, totalCount - visibleExperiences.length);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 450);
  };

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
      {/* SEARCH HEADER SECTION */}
      <div className="bg-white border-b border-neutral-100 py-3.5">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">
          {/* Search Bar — identical floating pill capsule to Home Page */}
          <div className="max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto">
            <SearchBar
              activeCategory="experiences"
              initialDestination={whereInput}
              initialDates={dateRange}
              initialGuests={groupSizeInput}
              onChange={(st) => {
                setWhereInput(st.destination);
                setDateRange(st.dates);
                setGroupSizeInput(st.guests);
              }}
              onSearch={(term, dates, g) => {
                setWhereInput(term);
                setDateRange(dates);
                setGroupSizeInput(g);
                const params = new URLSearchParams(searchParams.toString());
                if (term) params.set("q", term);
                else params.delete("q");
                const dStr = serializeDates(dates);
                if (dStr) params.set("dates", dStr);
                else params.delete("dates");
                params.set("guests", String(g));
                router.replace(`/experiences?${params.toString()}`, { scroll: false });
              }}
            />
          </div>
        </div>
      </div>

      {/* STICKY FILTER BAR (Filters button + Category pills) */}
      <div className="sticky top-[64px] z-20 bg-white border-b border-neutral-200 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6">
          <div
            className="flex items-center gap-1.5 py-2.5 overflow-x-auto scrollbar-none"
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

            {/* Category Pills (Clean Text Only) */}
            {CATEGORY_PILLS.map((item) => {
              const active = selectedCategories.includes(item.cat);
              return (
                <button
                  key={item.cat}
                  onClick={() => toggleCategory(item.cat)}
                  className={cn(
                    "flex-none whitespace-nowrap px-5 py-2 rounded-full border text-sm transition-all duration-150 active:scale-95 select-none font-medium cursor-pointer",
                    active
                      ? "bg-purple text-white border-purple shadow-xs"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-purple/50 hover:text-purple hover:bg-purple/[0.03]",
                  )}
                >
                  {item.label}
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
              <span className="font-medium text-neutral-700">{filteredExperiences.length}</span>{" "}
              experiences found
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
        ) : filteredExperiences.length === 0 ? (
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
              {visibleExperiences.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} />
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
                      <span>Loading more experiences from database...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Experiences</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple/10 text-purple text-[10px] font-bold">
                        +{Math.min(PAGE_SIZE, remainingCount)}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 text-xs text-neutral-600 font-medium shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>No more experiences to load — You&apos;ve reached the end of the results</span>
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
                Show {filteredExperiences.length} experiences
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
