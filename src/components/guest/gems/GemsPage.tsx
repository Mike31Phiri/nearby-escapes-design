"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Star, ArrowRight, Diamond, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchExperiences } from "@/lib/api/discovery";
import type { Experience } from "@/lib/mock-data";

export function GemsPage() {
  const [gems, setGems] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadGems() {
      try {
        setIsLoading(true);
        const data = await fetchExperiences({ limit: 30 });
        if (isMounted) {
          // Curate items or show all available experiences
          setGems(data);
        }
      } catch (err) {
        console.error("Failed to load gems from API:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadGems();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-muted font-sans">
      <main className="flex-1">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-amber-500/10 via-primary/[0.02] to-transparent pb-12">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Diamond className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Hidden Gems
                </h1>
                <p className="text-base text-muted-foreground">
                  Off-the-beaten-path treasures across Zambia, handpicked for the curious traveler
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gems Grid */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 pb-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/50 bg-card p-4 flex flex-col sm:flex-row gap-4 animate-pulse"
                >
                  <div className="h-44 sm:h-36 sm:w-52 rounded-xl bg-muted shrink-0" />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                    <div className="h-8 bg-muted rounded w-1/3 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : gems.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-border/60 bg-card p-12 text-center">
              <Diamond className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
              <h3 className="font-semibold text-lg text-foreground">No gems found right now</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Check back soon as new authentic and local hidden gems are being published.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {gems.map((gem) => {
                const gemAny = gem as any;
                const img = gemAny.images?.[0] || gem.image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=70";
                const title = gemAny.title || gem.name || "Hidden Gem";
                const reviewsCount = gemAny.reviewsCount ?? gemAny.reviews ?? 0;

                return (
                  <div
                    key={gem.id}
                    className="group relative rounded-2xl border border-border/50 bg-card shadow-sm card-shadow transition-all hover:shadow-lg flex flex-col sm:flex-row"
                  >
                    {/* Image */}
                    <div className="relative h-44 sm:h-auto sm:w-56 shrink-0 overflow-hidden bg-muted rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
                      <img
                        src={img}
                        alt={title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r sm:from-black/30 sm:to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className="rounded-full bg-amber-500/90 text-white border-0 text-[9px] font-bold uppercase tracking-wider shadow-sm">
                          <Diamond className="h-3 w-3 mr-1" />
                          Hidden Gem
                        </Badge>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {gem.location}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-foreground">{gem.rating || 5.0}</span>
                          <span className="text-sm text-muted-foreground">({reviewsCount} reviews)</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/40">
                        <div>
                          <span className="text-xl font-bold text-foreground">K{gem.price}</span>
                          <span className="text-sm text-muted-foreground"> / person</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full text-sm font-semibold h-8 border-border/60"
                          asChild
                        >
                          <Link href={`/listings/experiences/${gem.id}`}>
                            Explore
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom note */}
          <div className="mt-12 text-center">
            <p className="text-base text-muted-foreground max-w-lg mx-auto">
              These hidden gems are just the beginning. As our community grows, more
              off-the-beaten-path treasures will be uncovered. Know a hidden gem?{" "}
              <Link
                href="/become-host"
                className="text-primary font-semibold underline underline-offset-2"
              >
                Share it with us
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
