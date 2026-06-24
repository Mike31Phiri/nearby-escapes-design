"use client";

import Link from "next/link";
import { Bed, MapPin, Star, ArrowRight, Wifi, Waves, Coffee, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockStays } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3 w-3" />,
  Pool: <Waves className="h-3 w-3" />,
  Breakfast: <Coffee className="h-3 w-3" />,
  Spa: <Sparkles className="h-3 w-3" />,
  "Guided Tours": <MapPin className="h-3 w-3" />,
};

export function AccommodationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted font-sans">
      <main className="flex-1">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-10">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bed className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Accommodations
                </h1>
                <p className="text-sm text-muted-foreground">
                  {mockStays.length} properties — from luxury lodges to boutique city stays
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6">
          <div className="flex flex-wrap gap-2">
            {["All", "Lodge", "Hotel", "Camp", "Resort", "Boutique"].map((type) => (
              <button
                key={type}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold border transition-all",
                  type === "All"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border/60 hover:border-primary/30 hover:text-foreground",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {mockStays.map((stay) => (
              <div
                key={stay.id}
                className="group relative rounded-2xl border border-border/50 bg-card shadow-sm card-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <Link href={`/listings/stays/${stay.id}`} className="block">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={stay.image}
                      alt={stay.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="outline"
                        className="rounded-full bg-white/90 text-foreground border-0 text-[9px] font-bold uppercase tracking-wider shadow-sm"
                      >
                        <Bed className="h-3 w-3 mr-1" />
                        {stay.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-foreground shadow-sm">
                        K{stay.price}
                        <span className="font-normal text-muted-foreground"> / night</span>
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link
                    href={`/listings/stays/${stay.id}`}
                    className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {stay.name}
                  </Link>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {stay.location}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-foreground">{stay.rating}</span>
                    <span className="text-xs text-muted-foreground">({stay.reviews} reviews)</span>
                  </div>
                  {/* Amenities preview */}
                  <div className="flex items-center gap-2 mt-2.5 text-muted-foreground">
                    {stay.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="text-[10px] flex items-center gap-0.5">
                        {amenityIcons[a] ?? null}
                        {a}
                      </span>
                    ))}
                    {stay.amenities.length > 3 && (
                      <span className="text-[10px] text-muted-foreground/60">
                        +{stay.amenities.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Bed className="h-3 w-3" />
                      {stay.beds} bed · {stay.baths} bath · up to {stay.guests}
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 rounded-lg p-0" asChild>
                      <Link href={`/listings/stays/${stay.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
