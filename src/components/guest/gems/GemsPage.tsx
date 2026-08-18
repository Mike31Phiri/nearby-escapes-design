"use client";

import Link from "next/link";
import { MapPin, Star, ArrowRight, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockGems } from "@/lib/mock-data";

export function GemsPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {mockGems.map((gem, idx) => (
              <div
                key={gem.id}
                className="group relative rounded-2xl border border-border/50 bg-card shadow-sm card-shadow transition-all hover:shadow-lg flex flex-col sm:flex-row"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-auto sm:w-56 shrink-0 overflow-hidden bg-muted">
                  <img
                    src={gem.image}
                    alt={gem.name}
                    className="h-full w-full object-cover"
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
                      {gem.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {gem.location}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-foreground">{gem.rating}</span>
                      <span className="text-sm text-muted-foreground">({gem.reviews} reviews)</span>
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
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-12 text-center">
            <p className="text-base text-muted-foreground max-w-lg mx-auto">
              These hidden gems are just the beginning. As our community grows, more
              off-the-beaten-path treasures will be uncovered. Know a hidden gem?{""}
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
