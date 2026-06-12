"use client";

import Link from "next/link";
import { Heart, MapPin, Star, Trash2, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";

export function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
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
                <p className="text-sm text-muted-foreground">
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
              <p className="text-sm text-muted-foreground max-w-md mb-8">
                Tap the heart icon on any listing to save it here — your personal collection of
                stays, experiences, and transport options across Zambia.
              </p>
              <Button
                size="lg"
                className="rounded-full font-black uppercase tracking-widest text-xs shadow-lg"
                asChild
              >
                <Link href="/search">
                  <Search className="h-4 w-4 mr-2" />
                  Explore listings
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Image */}
                    <Link href={`/listings/stays/${item.id}`} className="block">
                      <div className="relative h-52 overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        {/* Price badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-foreground shadow-sm">
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
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {item.location}
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-foreground">{item.rating}</span>
                          <span className="text-xs text-muted-foreground">({item.reviews})</span>
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
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="flex justify-center mt-12">
                <Button
                  variant="outline"
                  className="rounded-full border-border/60 font-semibold text-xs"
                  asChild
                >
                  <Link href="/search">
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
