"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  ShieldCheck,
  Calendar,
  Phone,
  User,
  Star,
  Users,
  Briefcase,
  AlertTriangle,
  Info,
  Coffee,
  Wifi,
  Sparkles,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { cn } from "@/lib/utils";
import type { Transport } from "@/lib/mock-data";

interface TransportDetailPageProps {
  route: Transport;
  backHref?: string;
}

export function TransportDetailPage({
  route,
  backHref = "/search?category=transport",
}: TransportDetailPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Back breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            href={backHref}
            className="hover:text-primary transition-colors font-medium flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back to results
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold truncate">
            {route.from} to {route.to}
          </span>
        </div>

        {/* Header Title Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                Transport
              </span>
              <span className="text-xs font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified Route
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-2 flex items-center gap-3">
              <span>{route.from}</span>
              <span className="text-muted-foreground/40 font-light">➔</span>
              <span>{route.to}</span>
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Operated by <strong className="text-foreground">{route.operator}</strong> • Daily
              departures available
            </p>
          </div>
        </div>

        {/* Photo Banner */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-8 bg-muted shadow-sm max-h-[360px]">
          <img
            src={route.image}
            alt={`${route.from} to ${route.to}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white space-y-1">
            <span className="text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              Inter-City Highway Express
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight drop-shadow-md">
              Comfortable travel across Zambia&apos;s finest highways
            </h2>
          </div>
        </div>

        {/* Content Section & Sidebar Form */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Left Side: Route and Service details */}
          <div className="space-y-10">
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-5 py-5 border-y border-border/40">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4.5 w-4.5 text-primary/70" />
                <span>
                  Duration: <strong>{route.duration}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Compass className="h-4.5 w-4.5 text-primary/70" />
                <span>
                  Frequency: <strong>{route.departures}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4.5 w-4.5 text-primary/70" />
                <span>
                  Capacity: <strong>Up to 50 Passengers</strong>
                </span>
              </div>
            </div>

            {/* Route Overview */}
            <section>
              <h2 className="text-xl font-black tracking-tight text-foreground mb-3">
                Route Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                Travel safely and comfortably on this highly popular route from {route.from} to{" "}
                {route.to}. Enjoy fully air-conditioned interiors, reclining luxury seats, charging
                outlets, and onboard entertainment. Perfect for business travelers, tourists, or
                visiting family, this service guarantees smooth transit with experienced, verified
                local operators.
              </p>
            </section>

            {/* Travel Path Visualization */}
            <section>
              <h2 className="text-xl font-black tracking-tight text-foreground mb-5">
                Journey Timeline & Stops
              </h2>
              <div className="relative pl-6 border-l border-primary/20 space-y-8 ml-3">
                {/* Start */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border-2 border-primary bg-white flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">
                    Departure: {route.from} Terminal
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Please check in 45 minutes before departure time.
                  </p>
                </div>
                {/* Midstop */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border-2 border-muted-foreground/30 bg-white flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">Transit Pitstop</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    15-minute rest, refreshment, and stretch stop midway.
                  </p>
                </div>
                {/* End */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">
                    Arrival: {route.to} Terminal
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Estimated transit duration is {route.duration} subject to traffic conditions.
                  </p>
                </div>
              </div>
            </section>

            {/* Transit Amenities */}
            <section>
              <h2 className="text-xl font-black tracking-tight text-foreground mb-4">
                Boarding Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: "Air Conditioning", icon: Sparkles },
                  { name: "Reclining Seats", icon: Coffee },
                  { name: "USB Charging Ports", icon: Zap },
                  { name: "On-Board WiFi", icon: Wifi },
                  { name: "Luggage Storage", icon: Briefcase },
                  { name: "Verified Operator", icon: ShieldCheck },
                ].map(({ name, icon: Icon }) => (
                  <div
                    key={name}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 border border-border/40 text-sm font-medium text-foreground"
                  >
                    <Icon className="h-4 w-4 text-primary/70 shrink-0" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Policies and Baggage */}
            <section className="p-5 rounded-2xl border border-amber-500/10 bg-amber-500/5 space-y-4">
              <h3 className="font-bold text-base text-amber-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" /> Baggage & Cancellation Policy
              </h3>
              <ul className="space-y-2.5 text-sm text-amber-800/80">
                <li className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Free Baggage Allowance:</strong> Up to 2 standard bags (max 20kg total)
                    in the undercarriage storage, plus 1 small carry-on.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Cancellation:</strong> 100% refund for cancellations requested up to 24
                    hours prior to travel date. Non-refundable within 24 hours.
                  </span>
                </li>
              </ul>
            </section>

            {/* Guest Reviews */}
            <ReviewSection
              listingId={route.id}
              listingName={`${route.from} to ${route.to}`}
              listingType="transport"
            />
          </div>

          {/* Right Side: Interactive Booking Card */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-card border border-border/40 rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Ticket Price Header */}
              <div className="bg-primary px-6 py-5 text-white">
                <p className="text-primary-foreground/80 text-xs font-bold uppercase tracking-widest mb-1">
                  Ticket Rate Starting at
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary-foreground">
                    K{route.price}
                  </span>
                  <span className="text-primary-foreground/75 text-sm">/seat</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-primary-foreground/90 text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Instant SMS Ticket confirmation upon booking approval</span>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="p-6 space-y-5">
                <h3 className="font-black text-lg text-foreground tracking-tight">
                  Invoice Summary
                </h3>

                {/* What's Included */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    What&apos;s Included
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary/70" />
                      <span>Duration: {route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Compass className="h-4 w-4 text-primary/70" />
                      <span>{route.departures} departures</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-primary/70" />
                      <span>Verified operator: {route.operator}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4 text-primary/70" />
                      <span>Up to 20kg baggage included</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/40" />

                {/* Boarding Amenities Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Boarding Amenities
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Air Conditioning", "Reclining Seats", "WiFi", "USB Charging"].map((a) => (
                      <span
                        key={a}
                        className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/40" />

                {/* Price Summary */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Price Breakdown
                  </p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Ticket rate</span>
                      <span className="font-semibold text-foreground">K{route.price}/seat</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Booking fee (est.)</span>
                      <span className="font-semibold text-foreground">5%</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic">
                    Final total calculated after selecting passengers & class
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href={`/checkout/book?type=transport&id=${route.id}`}
                  className="w-full h-12 rounded-xl bg-primary font-black uppercase tracking-widest text-sm text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  Proceed to Booking
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <p className="text-center text-xs text-muted-foreground">
                  Free cancellation 24h before departure · Secure seat
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
