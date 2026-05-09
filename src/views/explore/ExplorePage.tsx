"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Star, Send, Phone, Mail, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { SearchFilters, DEFAULT_FILTERS, type Filters } from "@/components/SearchFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

function ExploreContent({ query = "" }: { query?: string }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  
  const [filters, setFilters] = useState<Filters>({ 
    ...DEFAULT_FILTERS, 
    query, 
    categories: initialCategory ? [initialCategory] : [] 
  });
  const [sort, setSort] = useState<SortKey>("recommended");
  const [allListings, setAllListings] = useState(listings);

  useEffect(() => {
    try {
      const mock = JSON.parse(localStorage.getItem("mock_host_listings") || "[]");
      if (mock.length > 0) {
        setAllListings(prev => [...mock, ...prev]);
      }
    } catch(e) {}
  }, []);

  const allCategories = useMemo(() => Array.from(new Set(allListings.map((l) => l.category))), [allListings]);
  const allLocations = useMemo(
    () => Array.from(new Set(allListings.map((l) => l.location))).sort(),
    [allListings],
  );

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    let result = allListings.filter((listing) => {
      if (q && !`${listing.name} ${listing.location} ${listing.category}`.toLowerCase().includes(q))
        return false;
      if (filters.categories.length && !filters.categories.includes(listing.category)) return false;
      if (filters.locations.length && !filters.locations.includes(listing.location)) return false;
      if (listing.price < filters.priceMin || listing.price > filters.priceMax) return false;
      if (listing.rating < filters.minRating) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [filters, sort]);

  const reset = () => setFilters({ ...DEFAULT_FILTERS });

  const activeCategoryName = filters.categories.length > 0 
    ? filters.categories[0].charAt(0).toUpperCase() + filters.categories[0].slice(1) 
    : "Accommodations";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-border/40 pt-16 pb-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="max-w-3xl animate-in fade-in slide-in-from-left-8 duration-700">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">Discovery</p>
              <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground font-display leading-tight">
                {activeCategoryName}
              </h1>
              <p className="mt-6 text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                Discover the best {activeCategoryName.toLowerCase()} across Zambia. Hand-picked and verified for your peace of mind.
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="mt-10 flex flex-row items-center gap-2 bg-muted/20 p-2 rounded-full border border-border/40 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 hidden md:block" />
                <Input
                  placeholder={`Search…`}
                  value={filters.query}
                  onChange={(event) => setFilters({ ...filters, query: event.target.value })}
                  className="pl-4 md:pl-12 h-12 rounded-full border-none bg-white shadow-sm font-bold text-sm md:text-lg"
                />
              </div>
              
              <div className="flex items-center gap-2 pr-1">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 md:h-14 md:w-auto md:rounded-full md:px-8 gap-2 border-border/60 bg-white hover:bg-muted/50 rounded-full">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="hidden md:inline font-black uppercase tracking-widest text-xs">Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto pt-10">
                    <SearchFilters
                      filters={filters}
                      setFilters={setFilters}
                      allCategories={allCategories}
                      allLocations={allLocations}
                      onReset={reset}
                    />
                  </SheetContent>
                </Sheet>
                
                <div className="hidden sm:block">
                  <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                    <SelectTrigger className="h-14 w-[200px] rounded-full border-border/60 bg-white font-black uppercase tracking-widest text-xs">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/40 shadow-2xl">
                      <SelectItem value="recommended" className="font-bold">Recommended</SelectItem>
                      <SelectItem value="price-asc" className="font-bold">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc" className="font-bold">Price: High to Low</SelectItem>
                      <SelectItem value="rating" className="font-bold">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Grid */}
        <section className="mx-auto w-full max-w-7xl px-4 md:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight font-display">Discover Results</h2>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              {filtered.length} listings found
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[1.25rem] border-2 border-dashed border-border/40 p-20 text-center bg-white shadow-sm animate-in fade-in zoom-in duration-500">
              <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/30">
                <Search className="h-10 w-10" />
              </div>
              <p className="text-xl font-bold">No matches found</p>
              <p className="mt-2 text-muted-foreground font-medium">
                Try clearing some filters or adjusting your search terms.
              </p>
              <Button onClick={reset} variant="outline" className="mt-8 rounded-full px-8 font-bold border-2">
                Reset all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        {/* Contact CTA Footer Section */}
        <section className="bg-white border-t border-border/40 py-24 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display mb-4">
                    Want more? Check out our <span className="text-primary underline decoration-primary/30">Popular Attractions</span> and Packages.
                  </h2>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Can't find exactly what you're looking for? Our travel experts are ready to curate a bespoke experience just for you. Get in touch and let's plan your dream stay.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-foreground font-bold">
                    <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span>+260 971 123 456</span>
                  </div>
                  <div className="flex items-center gap-4 text-foreground font-bold">
                    <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span>hello@nearbyescapes.com</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAFBFC] p-8 rounded-[1.25rem] border border-border/60 shadow-sm">
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input placeholder="Full Name" className="rounded-2xl h-12 bg-white border-border/60 font-medium" />
                    <Input placeholder="Email Address" className="rounded-2xl h-12 bg-white border-border/60 font-medium" />
                  </div>
                  <Textarea placeholder="How can we help you plan your escape?" className="rounded-2xl min-h-[120px] bg-white border-border/60 font-medium" />
                  <Button className="w-full h-12 rounded-2xl font-black tracking-tight text-base shadow-lg shadow-primary/20">
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export function ExplorePage(props: { query?: string }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreContent {...props} />
    </Suspense>
  );
}
