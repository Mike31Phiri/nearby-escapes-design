"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Star, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FiltersPage() {
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const categories = ["Stays", "Transport", "Gems", "Packages"];
  const amenities = ["Wi-Fi", "Pool", "Free Parking", "Kitchen", "Air conditioning", "Pet friendly", "Gym"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Filters</h1>
          <Link href="/search">
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <X className="h-6 w-6" />
            </Button>
          </Link>
        </div>

        <div className="space-y-12">
          {/* Categories */}
          <section>
            <h2 className="text-xl font-bold mb-6">Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2 bg-muted/30 p-4 rounded-2xl border border-border/40">
                  <Checkbox id={cat} />
                  <Label htmlFor={cat} className="font-bold cursor-pointer">{cat}</Label>
                </div>
              ))}
            </div>
          </section>

          {/* Price Range */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Price range</h2>
              <span className="text-sm font-medium text-muted-foreground">ZMW {priceRange[0]} - ZMW {priceRange[1]}+</span>
            </div>
            <Slider
              defaultValue={[0, 5000]}
              max={10000}
              step={100}
              onValueChange={setPriceRange}
              className="py-4"
            />
            <div className="flex gap-4 mt-6">
              <div className="flex-1 space-y-2">
                <Label htmlFor="min-price" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Minimum</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground text-sm">ZMW</span>
                  <input id="min-price" type="number" defaultValue={0} className="w-full bg-muted/50 border border-border/60 rounded-xl py-3 pl-14 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="max-price" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Maximum</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground text-sm">ZMW</span>
                  <input id="max-price" type="number" defaultValue={5000} className="w-full bg-muted/50 border border-border/60 rounded-xl py-3 pl-14 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-xl font-bold mb-6">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-3">
                  <Checkbox id={amenity} className="h-5 w-5 rounded-md" />
                  <Label htmlFor={amenity} className="text-base font-medium cursor-pointer">{amenity}</Label>
                </div>
              ))}
            </div>
            <button className="mt-6 text-sm font-bold text-primary hover:underline">Show more</button>
          </section>

          {/* Star Rating */}
          <section>
            <h2 className="text-xl font-bold mb-6">Minimum Rating</h2>
            <div className="flex flex-wrap gap-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 font-bold hover:bg-muted transition-all"
                >
                  {rating} <Star className="h-4 w-4 fill-accent text-accent" />
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="sticky bottom-4 left-0 right-0 mt-20 bg-background/80 backdrop-blur-md border border-border/60 rounded-3xl p-6 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-8 duration-500">
          <button className="text-sm font-bold underline hover:no-underline">Clear all</button>
          <Link href="/search">
            <Button className="h-12 rounded-xl px-10 bg-primary font-bold shadow-lg">
              Show 48 results
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
