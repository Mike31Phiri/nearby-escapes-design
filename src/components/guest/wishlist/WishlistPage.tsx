"use client";

import Link from "next/link";
import {
  Heart,
  MapPin,
  Star,
  Trash2,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";

export function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  return (
    <div className="min-h-screen flex flex-col bg-muted font-sans">
      <main className="flex-1">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-10">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  My Collections
                </h1>
                <p className="text-base text-muted-foreground">
                  {items.length > 0
                    ? `${items.length} saved ${items.length === 1 ? "property" : "properties"}`
                    : "Your saved listings will appear here"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 pb-16">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <Heart className="h-10 w-10 text-primary/30" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
                Nothing saved yet
              </h2>
              <p className="text-base text-muted-foreground max-w-md mb-8">
                Tap the heart icon on any listing to save it here — your personal collection of
                stays, experiences, and transport options across Zambia.
              </p>
              <Button
                size="lg"
                className="rounded-full font-black uppercase tracking-widest text-sm shadow-lg"
                asChild
              >
                <Link href="/explore">
                  <Search className="h-4 w-4 mr-2" />
                  Explore listings
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8">
              <div className="relative flex items-center">
                {/* Left arrow */}
                <button
                  onClick={() => {
                    const el = document.getElementById("saved-scroll");
                    el?.scrollBy({ left: -400, behavior: "smooth" });
                  }}
                  className="hidden md:flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white border border-border/60 shadow-sm hover:bg-muted transition-all -ml-1 mr-2 z-10"
                  aria-label="Scroll saved items left"
                >
                  <ChevronLeft className="h-4 w-4 text-foreground" />
                </button>

                {/* Scrollable saved items */}
                <div
                  id="saved-scroll"
                  className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth flex-1 py-2"
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="min-w-[280px] sm:min-w-[300px] md:min-w-[320px] lg:min-w-[340px] shrink-0"
                    >
                      <div className="group relative rounded-2xl border border-border/50 bg-card shadow-sm card-shadow transition-all hover:shadow-lg h-full">
                        {/* Image */}
                        <Link href={`/listings/stays/${item.id}`} className="block">
                          <div className="relative h-52 overflow-hidden rounded-t-2xl bg-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            {/* Price badge */}
                            <div className="absolute bottom-3 left-3">
                              <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-foreground shadow-sm">
                                K{item.price}
                                <span className="font-normal text-muted-foreground"> / night</span>
                              </span>
                            </div>
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="p-4">
                          <Link
                            href={`/listings/stays/${item.id}`}
                            className="font-bold text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {item.location}
                          </p>
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-bold text-foreground">
                                {item.rating}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ({item.reviews})
                              </span>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                              aria-label={`Remove ${item.name} from saved`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right arrow */}
                <button
                  onClick={() => {
                    const el = document.getElementById("saved-scroll");
                    el?.scrollBy({ left: 400, behavior: "smooth" });
                  }}
                  className="hidden md:flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white border border-border/60 shadow-sm hover:bg-muted transition-all ml-2 -mr-1 z-10"
                  aria-label="Scroll saved items right"
                >
                  <ChevronRight className="h-4 w-4 text-foreground" />
                </button>
              </div>

              {/* Bottom CTA */}
              <div className="flex justify-center mt-12">
                <Button
                  variant="outline"
                  className="rounded-full border-border/60 font-semibold text-sm"
                  asChild
                >
                  <Link href="/explore">
                    <Search className="h-3.5 w-3.5 mr-1.5" />
                    Discover more
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
