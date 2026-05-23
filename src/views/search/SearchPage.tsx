"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, Suspense } from "react";
import { SlidersHorizontal, MapPin, Search, X, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mockStays, mockTransport, mockExperiences, mockGems, mockPackages } from "@/lib/mock-data";
import type { Stay, Transport, Experience, Package } from "@/lib/mock-data";
import {
  SearchStayCard,
  SearchTransportCard,
  SearchExperienceCard,
  SearchPackageCard,
} from "@/components/explore/SearchCard";

// Extract all unique locations across all categories
const allUniqueLocations = Array.from(
  new Set([
    ...mockStays.map((s) => s.location),
    ...mockTransport.map((t) => t.from),
    ...mockTransport.map((t) => t.to),
    ...mockExperiences.map((e) => e.location),
    ...mockGems.map((g) => g.location),
    ...mockPackages.map((p) => p.location),
  ]),
).sort();

const categories = [
  { value: "stays", label: "Stays" },
  { value: "transport", label: "Transport" },
  { value: "attractions", label: "Attractions" },
  { value: "gems", label: "Hidden Gems" },
  { value: "packages", label: "Packages" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL parameters
  const categoryParam = searchParams.get("category") || "stays";
  const queryParam = searchParams.get("q") || "";
  const locationParam = searchParams.get("location") || "all";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const amenitiesParam = searchParams.get("amenities") || "";
  const sortByParam = searchParams.get("sortBy") || "recommended";

  // Form filter states (local)
  const [category, setCategory] = useState(categoryParam);
  const [location, setLocation] = useState(locationParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    amenitiesParam ? amenitiesParam.split(",") : [],
  );
  const [sortBy, setSortBy] = useState(sortByParam);

  // Synchronize state with URL when search params change (e.g. Back button)
  useEffect(() => {
    setCategory(categoryParam);
    setLocation(locationParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setSelectedAmenities(amenitiesParam ? amenitiesParam.split(",") : []);
    setSortBy(sortByParam);
  }, [categoryParam, locationParam, minPriceParam, maxPriceParam, amenitiesParam, sortByParam]);

  // Handle Apply Filters
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (queryParam) params.set("q", queryParam);
    if (location !== "all") params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (selectedAmenities.length > 0) params.set("amenities", selectedAmenities.join(","));
    if (sortBy) params.set("sortBy", sortBy);

    router.push(`/search?${params.toString()}`);
  };

  // Handle Clear All
  const handleClearFilters = () => {
    setCategory("stays");
    setLocation("all");
    setMinPrice("");
    setMaxPrice("");
    setSelectedAmenities([]);
    setSortBy("recommended");
    router.push("/search?category=stays");
  };

  // Amenities handling
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    );
  };

  // Filter and Sort Data
  const filteredResults = useMemo(() => {
    let results: (Stay | Transport | Experience | Package)[] = [];

    // Load correct dataset
    if (categoryParam === "stays") results = [...mockStays];
    else if (categoryParam === "transport") results = [...mockTransport];
    else if (categoryParam === "attractions") results = [...mockExperiences];
    else if (categoryParam === "gems") results = [...mockGems];
    else if (categoryParam === "packages") results = [...mockPackages];

    // Filter by text search (query)
    if (queryParam) {
      const q = queryParam.toLowerCase();
      results = results.filter((item) => {
        const nameMatch = "name" in item ? item.name?.toLowerCase().includes(q) || false : false;
        const locMatch =
          "location" in item ? item.location?.toLowerCase().includes(q) || false : false;
        const operatorMatch =
          "operator" in item ? item.operator?.toLowerCase().includes(q) || false : false;
        const fromMatch = "from" in item ? item.from?.toLowerCase().includes(q) || false : false;
        const toMatch = "to" in item ? item.to?.toLowerCase().includes(q) || false : false;
        return nameMatch || locMatch || operatorMatch || fromMatch || toMatch;
      });
    }

    // Filter by Location dropdown
    if (locationParam !== "all") {
      results = results.filter((item) => {
        const loc = "location" in item ? item.location || "" : "";
        const from = "from" in item ? item.from || "" : "";
        const to = "to" in item ? item.to || "" : "";
        return (
          loc.toLowerCase() === locationParam.toLowerCase() ||
          from.toLowerCase() === locationParam.toLowerCase() ||
          to.toLowerCase() === locationParam.toLowerCase()
        );
      });
    }

    // Filter by Price Min
    if (minPriceParam) {
      const min = parseFloat(minPriceParam);
      if (!isNaN(min)) {
        results = results.filter((item) => item.price >= min);
      }
    }

    // Filter by Price Max
    if (maxPriceParam) {
      const max = parseFloat(maxPriceParam);
      if (!isNaN(max)) {
        results = results.filter((item) => item.price <= max);
      }
    }

    // Filter by Amenities (Stays only)
    if (categoryParam === "stays" && amenitiesParam) {
      const amenitiesFilter = amenitiesParam.split(",");
      const staysResults = results as Stay[];
      results = staysResults.filter((stay) =>
        amenitiesFilter.every((amenity) => stay.amenities?.includes(amenity)),
      );
    }

    // Sort Results
    results.sort((a, b) => {
      if (sortByParam === "price-low") return a.price - b.price;
      if (sortByParam === "price-high") return b.price - a.price;
      if (sortByParam === "rating-high") {
        const ratingA = "rating" in a ? a.rating || 0 : 0;
        const ratingB = "rating" in b ? b.rating || 0 : 0;
        return ratingB - ratingA;
      }
      return 0; // Default/recommended (mock order)
    });

    return results;
  }, [
    categoryParam,
    queryParam,
    locationParam,
    minPriceParam,
    maxPriceParam,
    amenitiesParam,
    sortByParam,
  ]);

  // Sidebar Filter Form
  const filterFormContent = (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Sort by Category
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full h-11 rounded-xl border-border/60 focus:ring-primary">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Location
        </Label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full h-11 rounded-xl border-border/60 focus:ring-primary">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {allUniqueLocations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Price Range (ZMW)
        </Label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
              Min
            </span>
            <Input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/60"
              placeholder="0"
            />
          </div>
          <span className="text-muted-foreground/60">—</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
              Max
            </span>
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/60"
              placeholder="9999"
            />
          </div>
        </div>
      </div>

      {/* Amenities (Stays only) */}
      {category === "stays" && (
        <div className="space-y-3 pt-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Amenities
          </Label>
          <div className="space-y-2.5">
            {["WiFi", "Pool", "Spa", "Guided Tours", "Meals Included", "Breakfast"].map(
              (amenity) => (
                <div key={amenity} className="flex items-center space-x-3 cursor-pointer">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                    className="rounded-md border-border/80"
                  />
                  <Label
                    htmlFor={`amenity-${amenity}`}
                    className="text-sm font-medium text-foreground cursor-pointer select-none"
                  >
                    {amenity}
                  </Label>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
        <Button
          onClick={handleApplyFilters}
          className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-xs shadow-md shadow-primary/10 transition-all hover:scale-[1.01]"
        >
          Apply Filters
        </Button>
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-widest border-border/60 text-muted-foreground hover:bg-muted/50"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Dynamic header / Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-1">
              <MapPin className="h-3.5 w-3.5" /> Zambia Escapes
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Showing {filteredResults.length} {categoryParam}
              {locationParam !== "all" ? ` in ${locationParam}` : ""}
            </h1>
            {queryParam && (
              <p className="text-sm text-muted-foreground mt-1">
                Search results for &ldquo;{queryParam}&rdquo;
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile filters drawer trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="md:hidden flex items-center gap-2 h-11 rounded-xl border-border/60 font-bold text-xs uppercase tracking-wider"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] p-6">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
                    <SlidersHorizontal className="h-5 w-5 text-primary" /> Filters
                  </SheetTitle>
                  <SheetDescription>
                    Adjust your preferences for accommodations and travel.
                  </SheetDescription>
                </SheetHeader>
                {filterFormContent}
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline-block">
                Sort by:
              </span>
              <Select
                value={sortBy}
                onValueChange={(val) => {
                  setSortBy(val);
                  // Update URL instantly for sorting
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("sortBy", val);
                  router.push(`/search?${params.toString()}`);
                }}
              >
                <SelectTrigger className="w-[160px] sm:w-[180px] h-11 rounded-xl border-border/60 focus:ring-primary text-xs font-bold">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating-high">Rating: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Panel */}
          <aside className="hidden md:block w-72 shrink-0 bg-card border border-border/40 p-6 rounded-2xl sticky top-24 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/40">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-black tracking-tight text-foreground">Filters</h2>
            </div>
            {filterFormContent}
          </aside>

          {/* Results Grid / Main Area */}
          <section className="flex-1 min-w-0">
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children animate-in fade-in duration-500">
                {filteredResults.map((item) => {
                  if (categoryParam === "stays") {
                    return <SearchStayCard key={item.id} item={item as Stay} />;
                  } else if (categoryParam === "transport") {
                    return <SearchTransportCard key={item.id} item={item as Transport} />;
                  } else if (categoryParam === "attractions") {
                    return <SearchExperienceCard key={item.id} item={item as Experience} />;
                  } else if (categoryParam === "gems") {
                    return (
                      <SearchExperienceCard key={item.id} item={item as Experience} isGem={true} />
                    );
                  } else if (categoryParam === "packages") {
                    return <SearchPackageCard key={item.id} item={item as Package} />;
                  }
                  return null;
                })}
              </div>
            ) : (
              // Empty State
              <div className="bg-card border border-border/40 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-[var(--shadow-card)] animate-in fade-in duration-300 mt-8">
                <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                  No matches found
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  We couldn&apos;t find any {categoryParam} matching your criteria. Try adjusting
                  your filters or resetting them.
                </p>
                <Button
                  onClick={handleClearFilters}
                  className="rounded-xl px-6 h-11 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Filters
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-bold text-muted-foreground">
          Loading Escapes...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
