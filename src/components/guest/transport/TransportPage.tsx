"use client";

import { useState, useMemo } from"react";
import { useSearchParams } from"next/navigation";
import {
 Bus,
 Clock,
 MapPin,
 SlidersHorizontal,
 X,
 ArrowRight,
 CalendarDays,
 ChevronRight,
 Users,
} from"lucide-react";
import { mockTransport, type Transport } from"@/lib/mock-data";
import {
 VerticalFilterSidebar,
 type FilterConfig,
} from"@/components/shared/VerticalFilterSidebar";
import { FilterChips } from"@/components/shared/FilterChips";
import { SortBar } from"@/components/shared/SortBar";
import Link from"next/link";
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";

// ─── Filter configuration ───────────────────────────────────────────────────

const FILTER_CONFIG: FilterConfig[] = [
 {
 id:"priceRange",
 label:"Price per person",
 type:"price-range",
 min: 0,
 max: 1000,
 step: 25,
 unit:"K",
 },
 {
 id:"vehicleType",
 label:"Vehicle type",
 type:"checkbox-group",
 options: [
 { value:"bus", label:"Bus (Shared)"},
 { value:"private", label:"Private Car"},
 { value:"minivan", label:"Minivan (Group)"},
 ],
 },
 {
 id:"capacity",
 label:"Capacity",
 type:"checkbox-group",
 options: [
 { value:"small", label:"1 - 4 seats"},
 { value:"medium", label:"5 - 10 seats"},
 { value:"large", label:"10+ seats"},
 ],
 },
 {
 id:"departureTime",
 label:"Departure time",
 type:"checkbox-group",
 options: [
 { value:"morning", label:"Morning (6AM - 12PM)"},
 { value:"afternoon", label:"Afternoon (12PM - 6PM)"},
 { value:"evening", label:"Evening (6PM - 10PM)"},
 ],
 },
];

const DEFAULT_FILTERS: Record<string, any> = {
 priceRange: { min: 0, max: 1000 },
 vehicleType: [],
 capacity: [],
 departureTime: [],
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
 label:"Bus (Shared)",
 isActive: (f) => (f.vehicleType as string[]).includes("bus"),
 apply: (f) => ({ ...f, vehicleType: [...(f.vehicleType as string[]),"bus"] }),
 remove: (f) => ({ ...f, vehicleType: (f.vehicleType as string[]).filter((c) => c !=="bus") }),
 },
 {
 label:"Private Car",
 isActive: (f) => (f.vehicleType as string[]).includes("private"),
 apply: (f) => ({ ...f, vehicleType: [...(f.vehicleType as string[]),"private"] }),
 remove: (f) => ({ ...f, vehicleType: (f.vehicleType as string[]).filter((c) => c !=="private") }),
 },
 {
 label:"Morning Departures",
 isActive: (f) => (f.departureTime as string[]).includes("morning"),
 apply: (f) => ({ ...f, departureTime: [...(f.departureTime as string[]),"morning"] }),
 remove: (f) => ({ ...f, departureTime: (f.departureTime as string[]).filter((c) => c !=="morning") }),
 },
];

// ─── Transport Card ──────────────────────────────────────────────────────────

function TransportCard({ route }: { route: Transport }) {
 // Inferring mockup labels from mock data to match the design roughly
 const isPrivate = route.operator.toLowerCase().includes("tour") || route.operator.toLowerCase().includes("transfer");
 const isMinivan = route.id ==="t3";
 
 const vehicleLabel = isPrivate ?"🚗 Private Car": isMinivan ?"🚐 Minivan":"🚌 Bus";
 const capacityLabel = isPrivate ?"Up to 4 passengers": isMinivan ?"8 seats":"40 seats";
 const departureTimeLabel ="8:00 AM departure"; // Default fallback since mock data uses"Daily"

 return (
 <div className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row gap-4">
 {/* Image */}
 <div className="w-full md:w-48 h-40 flex-shrink-0 bg-gray-200 rounded-xl overflow-hidden relative">
 <img
 src={route.image}
 alt={vehicleLabel}
 className="w-full h-full object-cover"
 loading="lazy"
 />
 <span className="absolute bottom-2 left-2 bg-purple/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
 {vehicleLabel}
 </span>
 </div>
 
 {/* Info */}
 <div className="flex-1 flex flex-col justify-between min-w-0">
 <div>
 <div className="flex justify-between items-start gap-2">
 <h3 className="font-semibold text-lg text-black tracking-tight leading-snug line-clamp-2">
 {route.from} to {route.to}
 </h3>
 <span className="flex-none text-[10px] bg-gold/10 text-gold-hover px-2 py-0.5 rounded-full font-bold border border-gold/30">
 Local host
 </span>
 </div>
 
 <p className="text-sm text-black-muted mt-0.5">
 Hosted by <span className="font-semibold text-purple">{route.operator}</span>
 </p>
 
 <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black-muted font-medium">
 <span className="inline-flex items-center gap-1">
 🕒 {departureTimeLabel}
 </span>
 <span className="inline-flex items-center gap-1">
 ⏱️ {route.duration}
 </span>
 <span className="inline-flex items-center gap-1">
 👥 {capacityLabel}
 </span>
 </div>
 {!isPrivate && (
 <p className="text-xs text-purple font-medium mt-1">
 🌟 Daily service, air-conditioned
 </p>
 )}
 {isPrivate && (
 <p className="text-xs text-purple font-medium mt-1">
 🌟 Door-to-door service
 </p>
 )}
 </div>
 
 {/* Price + CTA */}
 <div className="mt-3 pt-3 border-t border-white-soft flex items-end justify-between">
 <div>
 <span className="text-xs text-black-faint">per person</span>
 <p className="text-2xl font-bold text-black leading-tight">K{route.price}</p>
 </div>
 <Link href={`/transport/${route.id}`}>
 <button className="bg-purple hover:bg-purple-hover text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
 Book seat
 </button>
 </Link>
 </div>
 </div>
 </div>
 );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function TransportPage() {
 const searchParams = useSearchParams();
 const fromParam = searchParams.get("from") ??"";
 const toParam = searchParams.get("to") ??"";
 const qParam = searchParams.get("q") ??"";

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

 // Sort
 if (sortValue ==="price_asc") result.sort((a, b) => a.price - b.price);
 else if (sortValue ==="price_desc") result.sort((a, b) => b.price - a.price);
 else if (sortValue ==="duration_asc") {
 // Parse duration string to minutes for sorting
 const toMinutes = (d: string) => {
 const h = parseInt(d.match(/(\d+)h/)?.[1] ??"0");
 const m = parseInt(d.match(/(\d+)m/)?.[1] ??"0");
 return h * 60 + m;
 };
 result.sort((a, b) => toMinutes(a.duration) - toMinutes(b.duration));
 }

 return result;
 }, [activeFilters, sortValue, fromParam, toParam, qParam]);

 // ── Active chips
 const chips = useMemo(() => {
 const c: { label: string; onRemove: () => void }[] = [];

 const vTypes: string[] = activeFilters.vehicleType ?? [];
 vTypes.forEach((v) =>
 c.push({
 label: v ==="bus"?"Bus": v ==="private"?"Private Car":"Minivan",
 onRemove: () => handleFilterChange("vehicleType", vTypes.filter((x) => x !== v)),
 }),
 );
 
 const capacities: string[] = activeFilters.capacity ?? [];
 capacities.forEach((v) =>
 c.push({
 label: v ==="small"?"1-4 seats": v ==="medium"?"5-10 seats":"10+ seats",
 onRemove: () => handleFilterChange("capacity", capacities.filter((x) => x !== v)),
 }),
 );
 
 const depTimes: string[] = activeFilters.departureTime ?? [];
 depTimes.forEach((v) =>
 c.push({
 label: v ==="morning"?"Morning": v ==="afternoon"?"Afternoon":"Evening",
 onRemove: () => handleFilterChange("departureTime", depTimes.filter((x) => x !== v)),
 }),
 );

 const pr = activeFilters.priceRange;
 if (pr && (pr.min > 0 || pr.max < 1000))
 c.push({
 label: `K${pr.min}–K${pr.max}`,
 onRemove: () => handleFilterChange("priceRange", { min: 0, max: 1000 }),
 });

 return c;
 }, [activeFilters]);

 const breadcrumbParts = ["Zambia"];

 return (
 <div className="h-screen overflow-hidden bg-white-warm font-sans flex flex-col">
 <div className="max-w-[1100px] w-full mx-auto px-4 md:px-6 pt-4 flex flex-col flex-1 overflow-hidden">
 
 {/* Breadcrumb */}
 <nav aria-label="Breadcrumb"className="hidden lg:flex items-center gap-1 text-xs text-black-faint mb-2">
 <Link href="/"className="hover:text-purple transition-colors">Home</Link>
 <ChevronRight className="h-3 w-3 text-black-faint/50"/>
 <Link href="/explore"className="hover:text-purple transition-colors">Explore</Link>
 <ChevronRight className="h-3 w-3 text-black-faint/50"/>
 <Link href="/zambia"className="hover:text-purple transition-colors">Zambia</Link>
 <ChevronRight className="h-3 w-3 text-black-faint/50"/>
 <span className="text-black font-semibold">Local Transport</span>
 </nav>

 {/* Desktop title */}
 <div className="hidden lg:block mb-4">
 <h1 className="text-3xl font-bold tracking-tight text-black">Get around Zambia with ease</h1>
 <p className="text-black-muted mt-0.5 font-script text-xl text-purple/80">
 Travel like a local, hosted by locals.
 </p>
 </div>

 {/* Search bar */}
 <div className="bg-white rounded-2xl md:rounded-full border border-gray-200 shadow-sm p-1.5 flex flex-col md:flex-row md:items-center gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100 mb-5 hover:shadow-md transition-shadow">
 
 {/* From & To (Inline on mobile) */}
 <div className="flex flex-row flex-1 divide-x divide-gray-100">
 <input
 type="text"
 placeholder="From"
 defaultValue={fromParam ||""}
 className="flex-1 px-4 py-3 md:py-2.5 bg-transparent text-sm focus:outline-none min-w-0 font-medium text-black-soft placeholder:text-black-faint"
 />
 <input
 type="text"
 placeholder="To"
 defaultValue={toParam ||""}
 className="flex-1 px-4 py-3 md:py-2.5 bg-transparent text-sm focus:outline-none min-w-0 font-medium text-black-soft placeholder:text-black-faint"
 />
 </div>
 
 {/* Date & Button (Inline on mobile) */}
 <div className="flex flex-row items-center justify-between md:justify-end gap-3 pt-2 pb-1 md:py-0 w-full md:w-auto px-3 md:px-0">
 <div className="relative flex items-center justify-center h-10 w-10 shrink-0 md:ml-2 group">
 <CalendarDays className="h-5 w-5 text-black-faint group-hover:text-purple transition-colors pointer-events-none"/>
 <input 
 type="date"
 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
 title="Select Date"
 />
 </div>
 
 <button className="bg-purple hover:bg-purple-hover text-white rounded-xl md:rounded-full px-6 py-3 md:py-2.5 text-sm font-semibold flex-1 md:flex-none transition-colors">
 Find rides
 </button>
 </div>
 </div>

 {/* Quick-filter chips */}
 <div className="flex gap-2 overflow-x-auto pb-1 mb-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
 {QUICK_CHIPS.map((chip) => {
 const active = chip.isActive(activeFilters);
 return (
 <button
 key={chip.label}
 onClick={() => setActiveFilters((prev) => (active ? chip.remove(prev) : chip.apply(prev)))}
 className={cn(
"flex-none whitespace-nowrap px-4 py-1.5 rounded-full border text-xs font-semibold transition-all",
 active
 ?"bg-purple text-white border-purple shadow-sm"
 :"bg-white border-gray-200 text-black-soft hover:border-purple hover:text-purple shadow-sm",
 )}
 >
 {chip.label}
 </button>
 );
 })}
 </div>

 {/* Main layout */}
 <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 flex-1 overflow-hidden">
 
 {/* Sidebar */}
 <aside className="hidden lg:flex flex-col overflow-y-auto h-full pb-6 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
 <VerticalFilterSidebar
 filters={FILTER_CONFIG}
 activeFilters={activeFilters}
 onChange={handleFilterChange}
 onReset={handleReset}
 />
 </aside>

 {/* Results */}
 <main className="min-w-0 overflow-y-auto h-full pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
 <div className="space-y-4">
 <div className="flex justify-end items-center gap-2">
 <span className="text-sm text-black-muted font-medium">Sort by:</span>
 <select
 value={sortValue}
 onChange={(e) => setSortValue(e.target.value)}
 className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-purple text-black-soft"
 >
 <option value="recommended">Recommended for you</option>
 <option value="price_asc">Price (Lowest first)</option>
 <option value="departure_asc">Earliest departure</option>
 <option value="duration_asc">Shortest duration</option>
 </select>
 </div>

 {/* Map Placeholder */}
 <div className="hidden lg:flex w-full h-44 bg-white-soft rounded-xl border border-gray-200 items-center justify-center text-black-muted text-sm cursor-pointer hover:bg-gray-100 transition-colors">
 📍 View available routes on a map
 </div>
 
 <FilterChips chips={chips} onClearAll={handleReset} />
 </div>

 {filteredRoutes.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 mt-6">
 <Bus className="h-10 w-10 text-gray-200 mb-4"/>
 <h3 className="font-bold text-xl text-black">No routes found</h3>
 <p className="text-black-muted text-base max-w-sm text-center mt-2">
 Try adjusting your filters to see more routes.
 </p>
 <Button
 onClick={handleReset}
 variant="outline"
 className="mt-6 border-purple text-purple hover:bg-gold hover:text-white hover:border-gold"
 >
 Clear all filters
 </Button>
 </div>
 ) : (
 <div className="flex flex-col gap-4 mt-6">
 {filteredRoutes.map((route) => (
 <TransportCard key={route.id} route={route} />
 ))}
 </div>
 )}
 </main>
 </div>
 </div>

 {/* Mobile filter FAB */}
 <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
 <button
 onClick={() => setMobileFiltersOpen(true)}
 className="flex items-center gap-2 bg-gold text-white text-base font-bold px-5 py-3 rounded-full shadow-lg hover:bg-gold-hover transition-colors"
 >
 <SlidersHorizontal className="h-4 w-4"/>
 Filters
 {chips.length > 0 && (
 <span className="bg-white text-purple text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
 <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
 <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-gray-100">
 <span className="text-lg font-bold text-black">Filters</span>
 <button
 onClick={() => setMobileFiltersOpen(false)}
 className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
 aria-label="Close filters"
 >
 <X className="h-4 w-4 text-gray-600"/>
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
 <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100">
 <Button
 onClick={() => setMobileFiltersOpen(false)}
 className="w-full bg-gold hover:bg-gold-hover text-white font-bold"
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
