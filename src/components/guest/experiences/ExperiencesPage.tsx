"use client";

import { useState, useMemo } from"react";
import { useSearchParams } from"next/navigation";
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
} from"lucide-react";
import { mockExperiences, categoryLabels, categoryIcons, type Experience } from"@/lib/mock-data";
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
 label:"Price per Person",
 type:"price-range",
 min: 0,
 max: 1000,
 step: 25,
 unit:"K",
 },
 {
 id:"duration",
 label:"Duration",
 type:"checkbox-group",
 options: [
 { value:"< 3 Hours", label:"Under 2 hours"},
 { value:"Half Day", label:"Half-day (2–4 hrs)"},
 { value:"Full Day", label:"Full day (4+ hrs)"},
 { value:"Multi-Day", label:"Multi-day"},
 ],
 },
 {
 id:"category",
 label:"Type of Experience",
 type:"checkbox-group",
 options: [
 { value:"wildlife", label:"Guided Tours"},
 { value:"farm", label:"Farm Tours"},
 { value:"cultural", label:"Education Tours"},
 { value:"adventure", label:"Hidden Gem Experiences"},
 { value:"water", label:"Water Adventures"},
 { value:"industrial", label:"Industrial Tours"},
 ],
 },
 {
 id:"rating",
 label:"Authenticity Rating",
 type:"radio-group",
 options: [
 { value:"any", label:"Any"},
 { value:"4.5", label:"Highly Recommended (4.5+)"},
 { value:"4.8", label:"Exceptional (4.8+)"},
 ],
 },
 {
 id:"groupSize",
 label:"Group Size",
 type:"radio-group",
 options: [
 { value:"any", label:"Any"},
 { value:"Solo", label:"Solo"},
 { value:"Small (2-4)", label:"Small (2–4)"},
 { value:"Group (5+)", label:"Group (5+)"},
 ],
 },
];

const DEFAULT_FILTERS: Record<string, any> = {
 priceRange: { min: 0, max: 1000 },
 duration: [],
 category: [],
 rating:"any",
 groupSize:"any",
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
 label:"Guided Tours",
 isActive: (f) => (f.category as string[]).includes("wildlife"),
 apply: (f) => ({ ...f, category: [...(f.category as string[]),"wildlife"] }),
 remove: (f) => ({ ...f, category: (f.category as string[]).filter((c) => c !=="wildlife") }),
 },
 {
 label:"Farm Tours",
 isActive: (f) => (f.category as string[]).includes("farm"),
 apply: (f) => ({ ...f, category: [...(f.category as string[]),"farm"] }),
 remove: (f) => ({ ...f, category: (f.category as string[]).filter((c) => c !=="farm") }),
 },
 {
 label:"Hidden Gems",
 isActive: (f) => (f.category as string[]).includes("adventure"),
 apply: (f) => ({ ...f, category: [...(f.category as string[]),"adventure"] }),
 remove: (f) => ({ ...f, category: (f.category as string[]).filter((c) => c !=="adventure") }),
 },
 {
 label:"Top Rated 4.8+",
 isActive: (f) => f.rating ==="4.8",
 apply: (f) => ({ ...f, rating:"4.8"}),
 remove: (f) => ({ ...f, rating:"any"}),
 },
 {
 label:"Half-day",
 isActive: (f) => (f.duration as string[]).includes("Half Day"),
 apply: (f) => ({ ...f, duration: [...(f.duration as string[]),"Half Day"] }),
 remove: (f) => ({ ...f, duration: (f.duration as string[]).filter((d) => d !=="Half Day") }),
 },
];

// ─── Experience Card ─────────────────────────────────────────────────────────

function ExperienceCard({ exp }: { exp: Experience }) {
 const icon = categoryIcons[exp.category] ??"📍";
 const label = categoryLabels[exp.category] ??"Experience";

 const badgeLabel =
 exp.category ==="adventure"
 ?"Hidden Gem"
 : exp.category ==="cultural"
 ?"Education Tour"
 : exp.category ==="farm"
 ?"Farm Tour"
 : null;

 return (
 <Link
 href={`/experiences/${exp.id}`}
 className="group block bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
 >
 <div className="flex flex-col md:flex-row gap-4">
 {/* Image */}
 <div className="w-full md:w-48 h-40 flex-shrink-0 rounded-xl overflow-hidden relative">
 <img
 src={exp.image}
 alt={exp.name}
 className="w-full h-full object-cover"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"/>
 <span className="absolute bottom-2 left-2 bg-purple/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm inline-flex items-center gap-1">
 <span role="img"aria-label={label}>{icon}</span>
 {label}
 </span>
 </div>

 {/* Info */}
 <div className="flex-1 flex flex-col justify-between min-w-0">
 <div>
 <div className="flex justify-between items-start gap-2">
 <h3 className="font-semibold text-base text-black-soft tracking-tight leading-snug line-clamp-2 group-hover:text-purple transition-colors">
 {exp.name}
 </h3>
 {badgeLabel && (
 <span className="flex-none text-[10px] bg-gold/10 text-gold border border-gold/30 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
 {badgeLabel}
 </span>
 )}
 </div>

 <p className="flex items-center gap-1 text-sm text-black-muted mt-1">
 <MapPin className="h-3 w-3 shrink-0"/>
 {exp.location}
 </p>

 <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black-muted font-medium">
 <span className="inline-flex items-center gap-1">
 <Star className="h-3.5 w-3.5 fill-black text-black"/>
 {exp.rating}
 <span className="text-black-faint font-normal">({exp.reviews} reviews)</span>
 </span>
 {exp.duration && (
 <span className="inline-flex items-center gap-1">
 <Clock className="h-3 w-3"/>
 {exp.duration}
 </span>
 )}
 {exp.groupSize && (
 <span className="inline-flex items-center gap-1">
 <Users className="h-3 w-3"/>
 {exp.groupSize}
 </span>
 )}
 </div>
 </div>

 {/* Price + CTA */}
 <div className="mt-3 pt-3 border-t border-white-soft flex items-end justify-between">
 <div>
 <span className="text-xs text-black-faint">per person</span>
 <p className="text-2xl font-bold text-black leading-tight">K{exp.price}</p>
 </div>
 <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple group-hover:text-purple-hover transition-colors">
 Book this escape <ChevronRight className="h-3.5 w-3.5"/>
 </span>
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
 if (filter ==="< 3 Hours")
 return d.includes("15 min") || d.includes("1 hour") || d.includes("2 hour") || /^\d+\s*min/.test(d);
 if (filter ==="Half Day") return d.includes("half day");
 if (filter ==="Full Day") return d.includes("full day");
 if (filter ==="Multi-Day") return d.includes("multi") || d.includes("multi-day");
 return false;
 });
}

function matchGroupSize(expGroupSize: string | undefined, filter: string): boolean {
 if (!expGroupSize) return false;
 const nums = expGroupSize.match(/\d+/g)?.map(Number) ?? [];
 const max = nums.length > 0 ? Math.max(...nums) : 0;
 if (filter ==="Solo") return max === 1;
 if (filter ==="Small (2-4)") return max >= 2 && max <= 4;
 if (filter ==="Group (5+)") return max >= 5;
 return false;
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ExperiencesPage() {
 const searchParams = useSearchParams();
 const province = searchParams.get("province") ??"";
 const city = searchParams.get("city") ??"";
 const attraction = searchParams.get("attraction") ??"";
 const q = searchParams.get("q") ??"";

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
 if (ratingFilter && ratingFilter !=="any") {
 result = result.filter((e) => e.rating >= parseFloat(ratingFilter));
 }

 const gs = activeFilters.groupSize;
 if (gs && gs !=="any") {
 result = result.filter((e) => matchGroupSize(e.groupSize, gs));
 }

 if (sortValue ==="price_asc") result.sort((a, b) => a.price - b.price);
 else if (sortValue ==="price_desc") result.sort((a, b) => b.price - a.price);
 else if (sortValue ==="rating") result.sort((a, b) => b.rating - a.rating);

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

 if (activeFilters.rating && activeFilters.rating !=="any")
 c.push({ label: `${activeFilters.rating}+ stars`, onRemove: () => handleFilterChange("rating","any") });

 if (activeFilters.groupSize && activeFilters.groupSize !=="any")
 c.push({ label: activeFilters.groupSize, onRemove: () => handleFilterChange("groupSize","any") });

 const pr = activeFilters.priceRange;
 if (pr && (pr.min > 0 || pr.max < 1000))
 c.push({
 label: `K${pr.min}–K${pr.max}`,
 onRemove: () => handleFilterChange("priceRange", { min: 0, max: 1000 }),
 });

 return c;
 }, [activeFilters]);

 const breadcrumbParts = ["Zambia", province, city].filter(Boolean);
 const locationLabel = city || province || undefined;
 const headline = q
 ? `Experiences for"${q}"`
 : city
 ? `Experiences in ${city}`
 : province
 ? `Experiences in ${province}`
 :"Experiences in Zambia";

 return (
 <div className="h-screen overflow-hidden bg-white-warm font-sans flex flex-col">
 <div className="max-w-[1100px] w-full mx-auto px-4 md:px-6 pt-4 flex flex-col flex-1 overflow-hidden">

 {/* Breadcrumb */}
 <nav aria-label="Breadcrumb"className="hidden lg:flex items-center gap-1 text-xs text-black-faint mb-2">
 <Link href="/"className="hover:text-purple transition-colors">Home</Link>
 <ChevronRight className="h-3 w-3 text-black-faint/50"/>
 <Link href="/explore"className="hover:text-purple transition-colors">Explore</Link>
 {breadcrumbParts.map((part, i) => (
 <span key={part} className="flex items-center gap-1">
 <ChevronRight className="h-3 w-3 text-black-faint/50"/>
 <span className={i === breadcrumbParts.length - 1 ?"text-black font-semibold":""}>{part}</span>
 </span>
 ))}
 <ChevronRight className="h-3 w-3 text-black-faint/50"/>
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
 <div className="bg-white rounded-full border border-gray-200 shadow-sm p-1.5 flex items-center gap-2 mb-5 hover:shadow-md transition-shadow">
 <Search className="h-4 w-4 text-black-faint ml-3 shrink-0"/>
 <input
 type="text"
 placeholder="Activity or destination"
 defaultValue={city || province ||""}
 className="flex-1 bg-transparent text-sm focus:outline-none text-black-soft font-medium placeholder:text-black-faint"
 />
 <button className="bg-purple hover:bg-purple-hover text-white rounded-full px-5 py-2 text-sm font-semibold transition-colors">
 Explore
 </button>
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
 <Compass className="h-10 w-10 text-gray-200 mb-4"/>
 <h3 className="font-bold text-xl text-black">No experiences found</h3>
 <p className="text-black-muted text-base max-w-sm text-center mt-2">
 Try adjusting your filters to discover more.
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
 {filteredExperiences.map((exp) => (
 <ExperienceCard key={exp.id} exp={exp} />
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
 Show {filteredExperiences.length} experiences
 </Button>
 </div>
 </div>
 </>
 )}
 </div>
 );
}
