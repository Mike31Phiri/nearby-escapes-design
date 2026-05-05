"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/explore/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid, Map as MapIcon, SlidersHorizontal,
  X, ChevronDown, Star, Wifi, Car, Coffee,
  Wind, Dumbbell, Search as SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Filter config ────────────────────────────────────────────────────────────
const PRICE_RANGES = [
  { id: "any", label: "Any price" },
  { id: "0-100", label: "Under ZMW 100" },
  { id: "100-200", label: "ZMW 100 – 200" },
  { id: "200-350", label: "ZMW 200 – 350" },
  { id: "350+", label: "ZMW 350+" },
];

const PROPERTY_TYPES = [
  { id: "Lodge", label: "Lodge" },
  { id: "Hotel", label: "Hotel" },
  { id: "Camp", label: "Camp" },
  { id: "Guesthouse", label: "Guesthouse" },
];

const AMENITIES = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "ac", label: "AC", icon: Wind },
  { id: "gym", label: "Gym", icon: Dumbbell },
];

const RATINGS = [
  { id: "4.9+", label: "4.9+ ★ Exceptional" },
  { id: "4.5+", label: "4.5+ ★ Excellent" },
  { id: "4.0+", label: "4.0+ ★ Very Good" },
];

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
];

// ─── Filter pill component ────────────────────────────────────────────────────
function FilterPill({
  label,
  active,
  onClick,
  onClear,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  onClear?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold whitespace-nowrap transition-all duration-200 group",
        active
          ? "bg-foreground text-background border-foreground shadow-md"
          : "bg-background text-foreground border-border hover:border-foreground hover:shadow-sm"
      )}
    >
      {label}
      {active && onClear && (
        <X
          className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100"
          onClick={(e) => { e.stopPropagation(); onClear(); }}
        />
      )}
      {!active && <ChevronDown className="h-3.5 w-3.5 opacity-40" />}
    </button>
  );
}

// ─── Dropdown panel ───────────────────────────────────────────────────────────
function FilterDropdown({ children, open }: { children: React.ReactNode; open: boolean }) {
  if (!open) return null;
  return (
    <div className="absolute top-full left-0 mt-3 bg-background border border-border rounded-3xl shadow-2xl z-50 min-w-[240px] p-4 animate-in fade-in zoom-in-95 duration-200">
      {children}
    </div>
  );
}

export default function SearchPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("any");
  const [propertyType, setPropertyType] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("recommended");
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const toggleFilter = (f: string) => setOpenFilter(openFilter === f ? null : f);

  const toggleMulti = (list: string[], setList: (v: string[]) => void, id: string) => {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  // Count active filters
  const activeFilterCount = [
    priceRange !== "any" ? 1 : 0,
    propertyType.length,
    amenities.length,
    rating ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearAll = () => {
    setPriceRange("any");
    setPropertyType([]);
    setAmenities([]);
    setRating("");
    setOpenFilter(null);
  };

  const categories = [
    { id: "all", label: "All" },
    { id: "stays", label: "Stays" },
    { id: "transport", label: "Transport" },
    { id: "gems", label: "Gems" },
    { id: "packages", label: "Packages" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ── Sticky search + filter bar ── */}
      <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-3">
          {/* Top row: search + view toggle */}
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-2xl">
              <SearchBar />
            </div>
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl flex-shrink-0">
              <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10 bg-background shadow-sm">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10 text-muted-foreground hover:text-foreground">
                <MapIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ── DIFFERENTIATED FILTER BAR ── */}
          {/* Horizontal scrollable pill bar — no sidebar, no modal */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {/* Category pills */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}

            <div className="h-6 w-px bg-border/70 flex-shrink-0 mx-1" />

            {/* Price filter */}
            <div className="relative flex-shrink-0">
              <FilterPill
                label={priceRange === "any" ? "Price" : PRICE_RANGES.find(p => p.id === priceRange)?.label ?? "Price"}
                active={priceRange !== "any"}
                onClick={() => toggleFilter("price")}
                onClear={() => setPriceRange("any")}
              />
              <FilterDropdown open={openFilter === "price"}>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 px-2">Price range</p>
                {PRICE_RANGES.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => { setPriceRange(pr.id); setOpenFilter(null); }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-2xl text-sm font-bold transition-colors",
                      priceRange === pr.id ? "bg-foreground text-background" : "hover:bg-muted/50"
                    )}
                  >
                    {pr.label}
                  </button>
                ))}
              </FilterDropdown>
            </div>

            {/* Property type filter */}
            <div className="relative flex-shrink-0">
              <FilterPill
                label={propertyType.length > 0 ? `Type (${propertyType.length})` : "Property type"}
                active={propertyType.length > 0}
                onClick={() => toggleFilter("type")}
                onClear={() => setPropertyType([])}
              />
              <FilterDropdown open={openFilter === "type"}>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 px-2">Property type</p>
                {PROPERTY_TYPES.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => toggleMulti(propertyType, setPropertyType, pt.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-2xl text-sm font-bold transition-colors flex items-center justify-between",
                      propertyType.includes(pt.id) ? "bg-foreground text-background" : "hover:bg-muted/50"
                    )}
                  >
                    {pt.label}
                    {propertyType.includes(pt.id) && <X className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </FilterDropdown>
            </div>

            {/* Rating filter */}
            <div className="relative flex-shrink-0">
              <FilterPill
                label={rating ? RATINGS.find(r => r.id === rating)?.label ?? "Rating" : "Rating"}
                active={!!rating}
                onClick={() => toggleFilter("rating")}
                onClear={() => setRating("")}
              />
              <FilterDropdown open={openFilter === "rating"}>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 px-2">Minimum rating</p>
                {RATINGS.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => { setRating(rt.id); setOpenFilter(null); }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-2xl text-sm font-bold transition-colors flex items-center gap-2",
                      rating === rt.id ? "bg-foreground text-background" : "hover:bg-muted/50"
                    )}
                  >
                    <Star className="h-3.5 w-3.5" /> {rt.label}
                  </button>
                ))}
              </FilterDropdown>
            </div>

            {/* Amenities filter */}
            <div className="relative flex-shrink-0">
              <FilterPill
                label={amenities.length > 0 ? `Amenities (${amenities.length})` : "Amenities"}
                active={amenities.length > 0}
                onClick={() => toggleFilter("amenities")}
                onClear={() => setAmenities([])}
              />
              <FilterDropdown open={openFilter === "amenities"}>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 px-2">Amenities</p>
                {AMENITIES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleMulti(amenities, setAmenities, id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-2xl text-sm font-bold transition-colors flex items-center gap-2",
                      amenities.includes(id) ? "bg-foreground text-background" : "hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4" /> {label}
                    {amenities.includes(id) && <X className="h-3.5 w-3.5 ml-auto" />}
                  </button>
                ))}
              </FilterDropdown>
            </div>

            {/* Clear all — only shown when filters active */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="flex-shrink-0 px-4 py-2.5 text-sm font-black text-destructive underline hover:no-underline whitespace-nowrap transition-colors"
              >
                Clear all ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10">
        {/* Results header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Search Results</h1>
            <p className="text-muted-foreground mt-1 font-medium">
              {listings.length} escapes found
              {activeCategory !== "all" && ` in ${categories.find(c => c.id === activeCategory)?.label}`}
            </p>
          </div>
          {/* Sort */}
          <div className="flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-2xl border border-border/50">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-bold text-muted-foreground">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-sm font-black focus:outline-none cursor-pointer pr-1"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 stagger-children">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
              <SearchIcon className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-black mb-2">No results found</h2>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              We couldn&apos;t find any listings matching your current filters. Try adjusting your search or clearing some filters.
            </p>
            <Button onClick={clearAll} className="rounded-2xl px-8 h-12 bg-primary font-black shadow-lg">
              Clear all filters
            </Button>
          </div>
        )}

        {/* Load more */}
        {listings.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Button variant="outline" className="rounded-2xl px-12 h-12 border-2 font-black hover:bg-primary hover:text-white transition-all shadow-sm">
              Load more results
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
