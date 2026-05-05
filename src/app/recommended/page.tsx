"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { Sparkles, ArrowRight, Star, TrendingUp, Gem } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RecommendedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <div className="mb-12">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 font-bold mb-4">Curated for you</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Hand-picked Escapes</h1>
          <p className="text-muted-foreground text-lg mt-2 max-w-2xl">Our team has scouted the best stays, transport routes and experiences across Zambia just for you.</p>
        </div>

        <div className="space-y-20">
          {/* Top Stays */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Top-rated Stays</h2>
                  <p className="text-sm text-muted-foreground">Properties with consistent 5-star ratings</p>
                </div>
              </div>
              <Link href="/search?category=stays" className="hidden md:flex items-center gap-2 font-bold text-primary hover:underline">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {listings.slice(0, 4).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>

          {/* Affordability Picks */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Affordability Picks</h2>
                  <p className="text-sm text-muted-foreground">Best value for your money this month</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {listings.slice(4, 8).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>

          {/* Hidden Gems */}
          <section className="bg-muted/30 -mx-4 md:-mx-6 px-4 md:px-6 py-16 rounded-[40px] border border-border/40">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Gem className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Hidden Gems</h2>
                  <p className="text-sm text-muted-foreground">Unique experiences off the beaten path</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {listings.slice(0, 4).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-20 bg-[image:var(--gradient-hero)] rounded-[40px] p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Ready for your next adventure?</h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">Discover more incredible escapes across Zambia or start planning your custom trip with us.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/search">
                <Button className="rounded-full px-10 h-14 bg-white text-primary hover:bg-white/90 font-extrabold text-lg shadow-xl">
                  Browse All Listings
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="rounded-full px-10 h-14 border-white/40 text-white hover:bg-white/10 font-extrabold text-lg">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
          <Sparkles className="absolute top-10 right-10 h-32 w-32 text-white/10 rotate-12" />
          <Sparkles className="absolute bottom-[-20px] left-[-20px] h-48 w-48 text-white/5 -rotate-12" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
