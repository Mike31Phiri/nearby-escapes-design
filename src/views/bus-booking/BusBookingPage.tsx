"use client";

import Link from "next/link";
import { Bus, MapPin, Clock, ArrowRight, CalendarDays } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockTransport } from "@/lib/mock-data";

export function BusBookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-blue-500/5 via-primary/[0.02] to-transparent pb-10">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Bus className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Bus & Transport
                </h1>
                <p className="text-sm text-muted-foreground">
                  Inter-city routes, shuttle services, and transfers across Zambia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="mx-auto max-w-4xl px-4 md:px-6 -mt-6 pb-16 space-y-4 mt-8">
          {mockTransport.map((route) => (
            <div
              key={route.id}
              className="group relative rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col sm:flex-row"
            >
              {/* Image */}
              <div className="relative h-36 sm:h-auto sm:w-56 shrink-0 overflow-hidden bg-muted">
                <img
                  src={route.image}
                  alt={`${route.from} to ${route.to}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent sm:bg-gradient-to-r" />
                <div className="absolute top-3 left-3">
                  <Badge className="rounded-full bg-blue-500/90 text-white border-0 text-[9px] font-bold uppercase tracking-wider shadow-sm">
                    <Bus className="h-3 w-3 mr-1" />
                    Route
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-5 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-foreground">
                      {route.from}
                      <span className="text-muted-foreground mx-1.5">→</span>
                      {route.to}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Bus className="h-3 w-3 shrink-0" />
                      Operated by {route.operator}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-foreground">K{route.price}</p>
                    <p className="text-[10px] text-muted-foreground">per seat</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 pt-3 border-t border-border/40">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                    {route.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground/60" />
                    {route.departures}
                  </span>
                  <Button
                    size="sm"
                    className="rounded-full text-xs font-bold h-8 ml-auto"
                    asChild
                  >
                    <Link href={`/listings/transport/${route.id}`}>
                      Book Now
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* More routes coming notice */}
          <div className="rounded-xl border border-dashed border-border/50 bg-card/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              More routes are being added. Know a transport provider?{" "}
              <Link href="/become-host" className="text-primary font-semibold underline underline-offset-2">
                List your service
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
