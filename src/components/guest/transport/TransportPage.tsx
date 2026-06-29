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
} from "lucide-react";
import { mockTransport, type Transport } from "@/lib/mock-data";
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
    id: "serviceType",
    label: "Service Type",
    type: "radio-group",
    options: [
      { value: "all", label: "All" },
      { value: "Self-drive", label: "Self-drive" },
      { value: "Chauffeured", label: "Chauffeured" },
      { value: "Shuttle", label: "Shuttle" },
      { value: "Charter", label: "Charter" },
    ],
  },
  {
    id: "priceRange",
    label: "Price",
    type: "price-range",
    min: 0,
    max: 2000,
    step: 50,
    unit: "K",
  },
  {
    id: "departure",
    label: "Departure City",
    type: "checkbox-group",
    options: [
      { value: "Lusaka", label: "Lusaka" },
      { value: "Livingstone", label: "Livingstone" },
      { value: "Ndola", label: "Ndola" },
      { value: "Kitwe", label: "Kitwe" },
      { value: "Chipata", label: "Chipata" },
      { value: "Mfuwe", label: "Mfuwe" },
    ],
  },
  {
    id: "destination",
    label: "Destination City",
    type: "checkbox-group",
    options: [
      { value: "Lusaka", label: "Lusaka" },
      { value: "Livingstone", label: "Livingstone" },
      { value: "Ndola", label: "Ndola" },
      { value: "Kitwe", label: "Kitwe" },
      { value: "Chipata", label: "Chipata" },
      { value: "Mfuwe", label: "Mfuwe" },
    ],
  },
];

const DEFAULT_FILTERS: Record<string, any> = {
  serviceType: "all",
  priceRange: { min: 0, max: 2000 },
  departure: [],
  destination: [],
};

// ─── Transport Card ──────────────────────────────────────────────────────────

function TransportCard({ route }: { route: Transport }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#1A0B2E]">
      {/* Route header */}
      <div className="bg-gradient-to-r from-[#1A0B2E] to-[#2d1a4a] p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight font-display">
              <span className="truncate">{route.from}</span>
              <ArrowRight className="h-5 w-5 text-[#D4AF37] shrink-0" />
              <span className="truncate">{route.to}</span>
            </div>
            <p className="text-white/60 text-xs mt-1 font-medium">{route.operator}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-[#D4AF37]">K{route.price}</p>
            <p className="text-white/50 text-[10px] font-medium">per seat</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-center gap-5 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            {route.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            {route.departures}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            {route.from}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 bg-[#1A0B2E]/5 text-[#1A0B2E] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            <Bus className="h-3 w-3" />
            Transport
          </span>
          <Link href={`/transport/${route.id}`}>
            <Button
              size="sm"
              className="bg-[#1A0B2E] hover:bg-[#2d1a4a] text-white font-bold rounded-lg h-8 px-4 text-xs transition-colors"
            >
              Book Route
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Sort bar label override (uses "routes" instead of "stays") ──────────────

function TransportSortBar({
  total,
  sortValue,
  onSortChange,
}: {
  total: number;
  sortValue: string;
  onSortChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-gray-500 font-medium">
        <span className="text-[#1A0B2E] font-bold">{total}</span> routes available
      </p>
      <select
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A0B2E]/20 focus:border-[#1A0B2E] transition-colors cursor-pointer"
        aria-label="Sort results"
      >
        <option value="recommended">Recommended</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="duration_asc">Duration: Shortest First</option>
      </select>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function TransportPage() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from") ?? "";
  const toParam = searchParams.get("to") ?? "";
  const qParam = searchParams.get("q") ?? "";

  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(DEFAULT_FILTERS);
  const [sortValue, setSortValue] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [filterId]: value }));
  };

  const handleReset = () => setActiveFilters(DEFAULT_FILTERS);

  // ── Filtered + sorted results
  const filteredRoutes = useMemo(() => {
    let result = [...mockTransport];

    // URL param context
    if (fromParam)
      result = result.filter((r) => r.from.toLowerCase().includes(fromParam.toLowerCase()));
    if (toParam) result = result.filter((r) => r.to.toLowerCase().includes(toParam.toLowerCase()));
    if (qParam) {
      result = result.filter(
        (r) =>
          r.from.toLowerCase().includes(qParam.toLowerCase()) ||
          r.to.toLowerCase().includes(qParam.toLowerCase()),
      );
    }

    // Price
    const pr = activeFilters.priceRange;
    if (pr) result = result.filter((r) => r.price >= pr.min && r.price <= pr.max);

    // Departure cities
    const deps: string[] = activeFilters.departure ?? [];
    if (deps.length > 0) result = result.filter((r) => deps.includes(r.from));

    // Destination cities
    const dests: string[] = activeFilters.destination ?? [];
    if (dests.length > 0) result = result.filter((r) => dests.includes(r.to));

    // Sort
    if (sortValue === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortValue === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortValue === "duration_asc") {
      // Parse duration string to minutes for sorting
      const toMinutes = (d: string) => {
        const h = parseInt(d.match(/(\d+)h/)?.[1] ?? "0");
        const m = parseInt(d.match(/(\d+)m/)?.[1] ?? "0");
        return h * 60 + m;
      };
      result.sort((a, b) => toMinutes(a.duration) - toMinutes(b.duration));
    }

    return result;
  }, [activeFilters, sortValue, fromParam, toParam, qParam]);

  // ── Active chips
  const chips = useMemo(() => {
    const c: { label: string; onRemove: () => void }[] = [];

    if (activeFilters.serviceType && activeFilters.serviceType !== "all")
      c.push({
        label: activeFilters.serviceType,
        onRemove: () => handleFilterChange("serviceType", "all"),
      });

    const deps: string[] = activeFilters.departure ?? [];
    deps.forEach((v) =>
      c.push({
        label: `From: ${v}`,
        onRemove: () =>
          handleFilterChange(
            "departure",
            deps.filter((x) => x !== v),
          ),
      }),
    );

    const dests: string[] = activeFilters.destination ?? [];
    dests.forEach((v) =>
      c.push({
        label: `To: ${v}`,
        onRemove: () =>
          handleFilterChange(
            "destination",
            dests.filter((x) => x !== v),
          ),
      }),
    );

    const pr = activeFilters.priceRange;
    if (pr && (pr.min > 0 || pr.max < 2000))
      c.push({
        label: `K${pr.min}–K${pr.max}`,
        onRemove: () => handleFilterChange("priceRange", { min: 0, max: 2000 }),
      });

    return c;
  }, [activeFilters]);

  const headline =
    fromParam && toParam
      ? `${fromParam} → ${toParam}`
      : fromParam
        ? `From ${fromParam}`
        : "Transport Routes";

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-600/[0.04] via-blue-600/[0.02] to-transparent pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-gray-500 mb-4"
          >
            <span>Zambia</span>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <span className="text-[#1A0B2E] font-semibold">Transport</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A0B2E]/10 text-[#1A0B2E]">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A0B2E] font-display">
                {headline}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Shuttles, charters and private transfers across Zambia
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
            <TransportSortBar
              total={filteredRoutes.length}
              sortValue={sortValue}
              onSortChange={setSortValue}
            />
            <FilterChips chips={chips} onClearAll={handleReset} />
          </div>

          {filteredRoutes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 mt-6">
              <Bus className="h-10 w-10 text-gray-200 mb-4" />
              <h3 className="font-bold text-lg text-[#1A0B2E]">No routes found</h3>
              <p className="text-gray-500 text-sm max-w-sm text-center mt-2">
                Try adjusting your filters to see more routes.
              </p>
              <Button
                onClick={handleReset}
                variant="outline"
                className="mt-6 border-[#1A0B2E] text-[#1A0B2E] hover:bg-[#1A0B2E] hover:text-white"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
              {filteredRoutes.map((route) => (
                <TransportCard key={route.id} route={route} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 bg-[#1A0B2E] text-white text-sm font-bold px-5 py-3 rounded-full shadow-lg hover:bg-[#2d1a4a] transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {chips.length > 0 && (
            <span className="bg-[#D4AF37] text-[#1A0B2E] text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
          <div className="fixed inset-x-0 bottom-0 z-50 bg-[#FDFBF7] rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#FDFBF7] flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-base font-bold text-[#1A0B2E]">Filters</span>
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
            <div className="sticky bottom-0 bg-[#FDFBF7] px-5 py-4 border-t border-gray-100">
              <Button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#1A0B2E] hover:bg-[#2d1a4a] text-white font-bold"
              >
                Show {filteredRoutes.length} routes
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
