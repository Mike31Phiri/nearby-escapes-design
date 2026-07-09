"use client";

import { useState, useMemo } from"react";
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
 ArrowLeft,
} from"lucide-react";
import { mockStays, type Stay } from"@/lib/mock-data";
import {
 VerticalFilterSidebar,
 type FilterConfig,
} from"@/components/shared/VerticalFilterSidebar";
import { FilterChips } from"@/components/shared/FilterChips";
import { SortBar } from"@/components/shared/SortBar";
import Link from"next/link";
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";
import {
 type ResolvedLocation,
 buildStaysBreadcrumbs,
 buildStaysHeadline,
} from"@/lib/utils/locationSlug";
import { useBackNavigation } from"@/hooks/useBackNavigation";

// ─── Filter configuration ────────────────────────────────────────────────────

const FILTER_CONFIG: FilterConfig[] = [
 {
 id:"priceRange",
 label:"Price per Night",
 type:"price-range",
 min: 0,
 max: 5000,
 step: 50,
 unit:"K",
 },
 {
 id:"propertyType",
 label:"Property Type",
 type:"checkbox-group",
 options: [
 { value:"Lodge", label:"Lodge"},
 { value:"Hotel", label:"Hotel"},
 { value:"Camp", label:"Camp"},
 { value:"Resort", label:"Resort"},
 { value:"Boutique", label:"Boutique"},
 { value:"Guesthouse", label:"Guesthouse"},
 { value:"Chalet", label:"Chalet"},
 { value:"Farm Stay", label:"Farm Stay"},
 ],
 },
 {
 id:"amenities",
 label:"Amenities",
 type:"checkbox-group",
 options: [
 { value:"WiFi", label:"WiFi"},
 { value:"Pool", label:"Pool"},
 { value:"Breakfast", label:"Breakfast"},
 { value:"Spa", label:"Spa"},
 { value:"Guided Tours", label:"Guided Tours"},
 { value:"Restaurant", label:"Restaurant"},
 { value:"Gym", label:"Gym"},
 { value:"Airport Pickup", label:"Airport Pickup"},
 ],
 },
 {
 id:"rating",
 label:"Minimum Rating",
 type:"radio-group",
 options: [
 { value:"any", label:"Any"},
 { value:"3", label:"3+ stars"},
 { value:"4", label:"4+ stars"},
 { value:"4.5", label:"4.5+ stars"},
 ],
 },
 {
 id:"instantBook",
 label:"Instant Book only",
 type:"toggle",
 },
];

const DEFAULT_FILTERS: Record<string, any> = {
 priceRange: { min: 0, max: 5000 },
 propertyType: [],
 amenities: [],
 rating:"any",
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
 label:"Rating 4.5+",
 isActive: (f) => f.rating ==="4.5",
 apply: (f) => ({ ...f, rating:"4.5"}),
 remove: (f) => ({ ...f, rating:"any"}),
 },
 {
 label:"Pool",
 isActive: (f) => (f.amenities as string[]).includes("Pool"),
 apply: (f) => ({ ...f, amenities: [...(f.amenities as string[]),"Pool"] }),
 remove: (f) => ({
 ...f,
 amenities: (f.amenities as string[]).filter((a) => a !=="Pool"),
 }),
 },
 {
 label:"Breakfast",
 isActive: (f) => (f.amenities as string[]).includes("Breakfast"),
 apply: (f) => ({
 ...f,
 amenities: [...(f.amenities as string[]),"Breakfast"],
 }),
 remove: (f) => ({
 ...f,
 amenities: (f.amenities as string[]).filter((a) => a !=="Breakfast"),
 }),
 },
 {
 label:"WiFi",
 isActive: (f) => (f.amenities as string[]).includes("WiFi"),
 apply: (f) => ({ ...f, amenities: [...(f.amenities as string[]),"WiFi"] }),
 remove: (f) => ({
 ...f,
 amenities: (f.amenities as string[]).filter((a) => a !=="WiFi"),
 }),
 },
 {
 label:"Spa",
 isActive: (f) => (f.amenities as string[]).includes("Spa"),
 apply: (f) => ({ ...f, amenities: [...(f.amenities as string[]),"Spa"] }),
 remove: (f) => ({
 ...f,
 amenities: (f.amenities as string[]).filter((a) => a !=="Spa"),
 }),
 },
];

// ─── Amenity icon map ────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, React.ReactNode> = {
 WiFi: <Wifi className="h-3 w-3"/>,
 Pool: <Waves className="h-3 w-3"/>,
 Breakfast: <Coffee className="h-3 w-3"/>,
 Spa: <Sparkles className="h-3 w-3"/>,
"Guided Tours": <MapPin className="h-3 w-3"/>,
 Restaurant: <Utensils className="h-3 w-3"/>,
 Gym: <Dumbbell className="h-3 w-3"/>,
"Airport Pickup": <Car className="h-3 w-3"/>,
};

// ─── Stay Card ───────────────────────────────────────────────────────────────

function StayCard({ stay }: { stay: Stay }) {
 const visibleAmenities = stay.amenities.slice(0, 4);
 const extraCount = stay.amenities.length - 4;

 return (
 <Link
 href={`/stays/${stay.id}`}
 className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:border-purple"
 >
 {/* Image */}
 <div className="relative aspect-[3/2] overflow-hidden">
 <img
 src={stay.image}
 alt={stay.name}
 className="h-full w-full object-cover"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"/>
 {/* Type badge */}
 <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
 {stay.type}
 </span>
 {/* Price badge */}
 <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-black text-sm font-bold px-2.5 py-1 rounded-full shadow-sm">
 K{stay.price}
 <span className="text-black-faint font-normal">/night</span>
 </span>
 </div>

 {/* Info */}
 <div className="p-4">
 {/* Rating */}
 <div className="flex items-center gap-1 mb-1.5">
 <Star className="h-3.5 w-3.5 fill-black text-black"/>
 <span className="text-sm font-bold text-black">{stay.rating}</span>
 <span className="text-sm text-black-faint">({stay.reviews} reviews)</span>
 </div>

 {/* Name */}
 <h3 className="font-bold text-base text-black line-clamp-1 group-hover:text-purple transition-colors">
 {stay.name}
 </h3>

 {/* Location */}
 <p className="flex items-center gap-1 text-sm text-black-muted mt-1">
 <MapPin className="h-3 w-3 shrink-0"/>
 {stay.location}
 </p>

 {/* Amenities */}
 <div className="flex items-center gap-2 mt-3 flex-wrap">
 {visibleAmenities.map((a) => (
 <span
 key={a}
 className="inline-flex items-center gap-1 text-[10px] text-black-muted bg-white-soft rounded-full px-2 py-0.5"
 >
 {AMENITY_ICONS[a] ?? <Sparkles className="h-3 w-3"/>}
 {a}
 </span>
 ))}
 {extraCount > 0 && (
 <span className="text-[10px] text-black-faint">+{extraCount} more</span>
 )}
 </div>

 {/* CTA */}
 <div className="mt-3 pt-3 border-t border-white-soft">
 <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple group-hover:text-purple-hover transition-colors">
 View Stay <ChevronRight className="h-3.5 w-3.5"/>
 </span>
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

 // ── Filter change handler
 const handleFilterChange = (filterId: string, value: any) => {
 setActiveFilters((prev) => ({ ...prev, [filterId]: value }));
 };

 const handleReset = () => setActiveFilters(DEFAULT_FILTERS);

 // ── Filtered + sorted results
 const filteredStays = useMemo(() => {
 let result = [...mockStays];

 // Location filtering based on resolved slug context
 if (location) {
 if (location.type ==="attraction"&& location.attraction) {
 // For attractions, use the specific nearbyStayIds list
 const ids = new Set(location.attraction.nearbyStayIds);
 const nearby = result.filter((s) => ids.has(s.id));
 // Fall back to city-level filtering if nearbyStayIds is empty
 if (nearby.length > 0) {
 result = nearby;
 } else if (location.city) {
 result = result.filter((s) =>
 s.location.toLowerCase().includes(location.city!.name.toLowerCase()),
 );
 }
 } else if (location.type ==="city"&& location.city) {
 result = result.filter((s) =>
 s.location.toLowerCase().includes(location.city!.name.toLowerCase()),
 );
 if (result.length === 0) result = [...mockStays];
 } else if (location.type ==="province"&& location.province) {
 const provinceName = location.province.name.toLowerCase().replace("province","");
 result = result.filter((s) => s.location.toLowerCase().includes(provinceName));
 if (result.length === 0) result = [...mockStays];
 }
 // country → show all
 }

 // Price range
 const pr = activeFilters.priceRange;
 if (pr) result = result.filter((s) => s.price >= pr.min && s.price <= pr.max);

 // Property type
 const pt: string[] = activeFilters.propertyType ?? [];
 if (pt.length > 0) result = result.filter((s) => pt.includes(s.type));

 // Amenities (AND logic)
 const am: string[] = activeFilters.amenities ?? [];
 if (am.length > 0) result = result.filter((s) => am.every((a) => s.amenities.includes(a)));

 // Rating
 const ratingFilter = activeFilters.rating;
 if (ratingFilter && ratingFilter !=="any") {
 result = result.filter((s) => s.rating >= parseFloat(ratingFilter));
 }

 // Sort
 if (sortValue ==="price_asc") result.sort((a, b) => a.price - b.price);
 else if (sortValue ==="price_desc") result.sort((a, b) => b.price - a.price);
 else if (sortValue ==="rating") result.sort((a, b) => b.rating - a.rating);

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

 if (activeFilters.rating && activeFilters.rating !=="any") {
 c.push({ label: `${activeFilters.rating}+ stars`, onRemove: () => handleFilterChange("rating","any") });
 }

 if (activeFilters.instantBook) {
 c.push({ label:"Instant Book", onRemove: () => handleFilterChange("instantBook", false) });
 }

 const pr = activeFilters.priceRange;
 if (pr && (pr.min > 0 || pr.max < 5000)) {
 c.push({ label: `K${pr.min}–K${pr.max}`, onRemove: () => handleFilterChange("priceRange", { min: 0, max: 5000 }) });
 }

 return c;
 }, [activeFilters]);

 // ── Derived display values
 const headline = location ? buildStaysHeadline(location) :"Stays in Zambia";
 const breadcrumbs = location ? buildStaysBreadcrumbs(location) : [];
 const locationLabel = location?.city?.name ?? location?.province?.name ?? undefined;

 return (
 <div className="h-screen overflow-hidden bg-white-warm font-sans flex flex-col">
 <div className="max-w-[960px] w-full mx-auto px-4 md:px-6 pt-4 flex flex-col flex-1 overflow-hidden">

 {/* ── MOBILE: Back arrow + title ────────────────────────────────── */}
 <div className="flex lg:hidden items-center gap-2 mb-5">
 <button
 onClick={goBack}
 aria-label="Go back"
 className="p-1.5 -ml-1 rounded-full hover:bg-white-soft text-black-muted transition-colors"
 >
 <ArrowLeft className="h-5 w-5"/>
 </button>
 <h1 className="text-lg font-bold text-black truncate">{headline}</h1>
 </div>

 {/* ── DESKTOP: Breadcrumb trail ─────────────────────────────────── */}
 {breadcrumbs.length > 0 && (
 <nav aria-label="Breadcrumb"className="hidden lg:flex items-center gap-1 text-xs text-black-faint mb-2">
 {breadcrumbs.map((crumb, i) => (
 <span key={i} className="flex items-center gap-1">
 {i > 0 && <ChevronRight className="h-3 w-3 text-black-faint/50"/>}
 {crumb.href ? (
 <Link
 href={crumb.href}
 className="hover:text-purple transition-colors"
 >
 {crumb.label}
 </Link>
 ) : (
 <span className="text-black font-semibold">{crumb.label}</span>
 )}
 </span>
 ))}
 </nav>
 )}

 {/* ── DESKTOP: Title + subtitle ─────────────────────────────────── */}
 <div className="hidden lg:block mb-6">
 <h1 className="text-3xl font-bold tracking-tight text-black">{headline}</h1>
 <p className="text-sm text-black-muted mt-1">
 Find lodges, camps, and guesthouses — handpicked across Zambia.
 </p>
 </div>

 {/* ── Quick-filter chip row ─────────────────────────────────────── */}
 <div
 className="flex gap-2 overflow-x-auto pb-1 mb-5"
 style={{ scrollbarWidth:"none"}}
 >
 {QUICK_CHIPS.map((chip) => {
 const active = chip.isActive(activeFilters);
 return (
 <button
 key={chip.label}
 onClick={() =>
 setActiveFilters((prev) =>
 active ? chip.remove(prev) : chip.apply(prev),
 )
 }
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

 {/* ── Main layout: sidebar + results ───────────────────────────── */}
 <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 flex-1 overflow-hidden">

 {/* Sidebar — desktop only, independently scrollable */}
 <aside className="hidden lg:flex flex-col overflow-y-auto h-full pb-6 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
 <VerticalFilterSidebar
 filters={FILTER_CONFIG}
 activeFilters={activeFilters}
 onChange={handleFilterChange}
 onReset={handleReset}
 />
 </aside>

 {/* Results column — independently scrollable */}
 <main className="min-w-0 overflow-y-auto h-full pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
 <Bed className="h-10 w-10 text-gray-200 mb-4"/>
 <h3 className="font-bold text-xl text-black">No stays found</h3>
 <p className="text-black-muted text-base max-w-sm text-center mt-2">
 Try adjusting your filters to see more results.
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
 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
 {filteredStays.map((stay) => (
 <StayCard key={stay.id} stay={stay} />
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
 <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
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
 Show {filteredStays.length} stays
 </Button>
 </div>
 </div>
 </>
 )}
 </div>
 );
}
