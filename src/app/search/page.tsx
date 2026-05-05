"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/explore/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, LayoutGrid, Map as MapIcon, Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const categories = [
  { id: "all", label: "All" },
  { id: "stays", label: "Stays" },
  { id: "transport", label: "Transport" },
  { id: "gems", label: "Gems" },
  { id: "packages", label: "Packages" },
];

export default function SearchPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="sticky top-20 z-30 bg-background border-b border-border/50 py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full max-w-2xl">
              <SearchBar />
            </div>
            <div className="flex items-center gap-2">
              <Link href="/filters">
                <Button variant="outline" className="rounded-xl h-11 px-4 gap-2 border-border/60 font-semibold">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </Button>
              </Link>
              <div className="h-10 w-[1px] bg-border/60 mx-1 hidden md:block" />
              <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 bg-muted/50 text-foreground">
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 text-muted-foreground">
                <MapIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent hover:border-border"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Search Results</h1>
            <p className="text-muted-foreground mt-1">Found 48 escapes matching your search</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
            <select className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
            </select>
          </div>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <SearchIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              We couldn&apos;t find any listings matching your current filters. Try adjusting your search or clearing some filters.
            </p>
            <Button className="rounded-xl px-8 h-12 bg-primary font-bold shadow-lg">
              Clear all filters
            </Button>
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Button variant="outline" className="rounded-xl px-12 h-12 border-2 font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
            Load more results
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
