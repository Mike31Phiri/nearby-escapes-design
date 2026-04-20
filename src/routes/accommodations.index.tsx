import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { SearchFilters, DEFAULT_FILTERS, type Filters } from "@/components/SearchFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, SlidersHorizontal } from "lucide-react";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/accommodations/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Search accommodations — Nearby Escapes" },
      {
        name: "description",
        content: "Search and filter lodges, hotels, camps and guesthouses across Zambia.",
      },
      { property: "og:title", content: "Search accommodations — Nearby Escapes" },
      {
        property: "og:description",
        content: "Search and filter lodges, hotels, camps and guesthouses across Zambia.",
      },
    ],
  }),
  component: AccommodationsPage,
});

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

function AccommodationsPage() {
  const { q } = Route.useSearch();
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS, query: q });
  const [sort, setSort] = useState<SortKey>("recommended");

  const allCategories = useMemo(
    () => Array.from(new Set(listings.map((l) => l.category))),
    [],
  );
  const allLocations = useMemo(
    () => Array.from(new Set(listings.map((l) => l.location))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    let result = listings.filter((l) => {
      if (q && !`${l.name} ${l.location} ${l.category}`.toLowerCase().includes(q))
        return false;
      if (filters.categories.length && !filters.categories.includes(l.category))
        return false;
      if (filters.locations.length && !filters.locations.includes(l.location))
        return false;
      if (l.price < filters.priceMin || l.price > filters.priceMax) return false;
      if (l.rating < filters.minRating) return false;
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

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <SiteHeader />
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-8 md:mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Stay</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">
          Search accommodations
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Hand-picked places to rest your head across Zambia.
        </p>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location or type…"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="pl-9 h-11"
            />
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden h-11 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <div className="mt-6">
                  <SearchFilters
                    filters={filters}
                    setFilters={setFilters}
                    allCategories={allCategories}
                    allLocations={allLocations}
                    onReset={reset}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="h-11 w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
          <div className="hidden md:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <SearchFilters
              filters={filters}
              setFilters={setFilters}
              allCategories={allCategories}
              allLocations={allLocations}
              onReset={reset}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </p>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <p className="font-semibold">No matches</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try clearing some filters or adjusting your search.
                </p>
                <Button onClick={reset} variant="outline" className="mt-4">
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <div className="flex-1" />
      <SiteFooter />
    </div>
  );
}
