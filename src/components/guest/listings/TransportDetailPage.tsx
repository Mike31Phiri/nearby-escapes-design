"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  ShieldCheck,
  Star,
  Users,
  Briefcase,
  Info,
  Coffee,
  Wifi,
  Sparkles,
  Zap,
  Heart,
  Share2,
} from "lucide-react";
import { ReviewSection } from "@/components/guest/reviews/ReviewSection";
import { cn } from "@/lib/utils";
import type { Transport } from "@/lib/mock-data";
import { mockListingReviews } from "@/lib/mock-listing-reviews";
import { toast } from "sonner";
import { useAuth } from "@/lib/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { AuthGuardDialog } from "@/components/guest/auth/AuthGuardDialog";

function getRatingDistribution(reviews: { rating: number }[]) {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const key = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
    if (key >= 1 && key <= 5) dist[key]++;
  });
  const total = reviews.length || 1;
  return Object.entries(dist).map(([star, count]) => ({
    star: Number(star),
    count,
    percentage: (count / total) * 100,
  }));
}

interface TransportDetailPageProps {
  route: Transport;
  backHref?: string;
}

export function TransportDetailPage({ route, backHref = "/transport" }: TransportDetailPageProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = isSaved(route.id);

  const reviews = mockListingReviews[route.id] || [];
  const avgRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 4.5;
  const ratingDist = getRatingDistribution(reviews);

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeItem(route.id);
      toast.success(`Removed from collections`);
    } else {
      addItem({
        id: route.id,
        name: `${route.from} to ${route.to}`,
        image: route.image,
        price: route.price,
        location: route.from,
        rating: 4.5,
        reviews: 0,
        type: "Transport",
      });
      toast.success(`Saved to collections`, {
        icon: <Heart className="h-4 w-4 fill-primary text-primary" />,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans pb-20 md:pb-0">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Breadcrumbs row */}
        <div className="flex items-center gap-2 text-base text-muted-foreground mb-5">
          <Link
            href={backHref}
            className="hover:text-primary transition-colors font-medium flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-muted-foreground">Transport</span>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-foreground font-semibold truncate max-w-[200px]">
            {route.from} to {route.to}
          </span>
        </div>

        {/* Header Title Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                Transport
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Verified Route
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-foreground mb-1.5">
              {route.from} <span className="text-muted-foreground/30 font-light">→</span> {route.to}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground">
              {reviews.length > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <strong className="text-foreground">{avgRating.toFixed(1)}</strong>
                  <span>
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </span>
              )}
              <span>
                Operated by <strong className="text-foreground">{route.operator}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground/60" />
                {route.duration}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied!");
              }}
              className="h-9 w-9 rounded-xl border border-border/60 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all shadow-sm"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "h-9 w-9 rounded-xl border bg-card flex items-center justify-center transition-all shadow-sm",
                isFavorited
                  ? "border-primary/30 text-primary bg-primary/5"
                  : "border-border/60 text-muted-foreground hover:text-primary hover:border-primary/30",
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorited && "fill-primary")} />
            </button>
          </div>
        </div>

        {/* Photo Banner */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-7 bg-muted shadow-sm max-h-[360px]">
          <img
            src={route.image}
            alt={`${route.from} to ${route.to}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 inline-block">
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
              <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <Clock className="h-4.5 w-4.5 text-primary/70" />
                <span>
                  Duration: <strong>{route.duration}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <Compass className="h-4.5 w-4.5 text-primary/70" />
                <span>
                  Frequency: <strong>{route.departures}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <Users className="h-4.5 w-4.5 text-primary/70" />
                <span>
                  Capacity: <strong>Up to 50 Passengers</strong>
                </span>
              </div>
            </div>

            {/* Route Overview */}
            <section>
              <h2 className="text-xl font-display font-bold tracking-tight text-foreground mb-3">
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
              <h2 className="text-xl font-display font-bold tracking-tight text-foreground mb-5">
                Journey Timeline & Stops
              </h2>
              <div className="relative pl-6 border-l border-primary/20 space-y-8 ml-3">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border-2 border-primary bg-white flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">
                    Departure: {route.from} Terminal
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Please check in 45 minutes before departure time.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border-2 border-muted-foreground/30 bg-white flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">Transit Pitstop</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    15-minute rest, refreshment, and stretch stop midway.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">
                    Arrival: {route.to} Terminal
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Estimated transit duration is {route.duration} subject to traffic conditions.
                  </p>
                </div>
              </div>
            </section>

            {/* Transit Amenities */}
            <section>
              <h2 className="text-xl font-display font-bold tracking-tight text-foreground mb-4">
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
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 text-base font-medium text-foreground"
                  >
                    <Icon className="h-4 w-4 text-primary/70 shrink-0" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Policies and Baggage */}
            <section className="p-5 rounded-2xl border border-amber-500/10 bg-amber-500/5 space-y-4">
              <h3 className="font-bold text-lg text-amber-800 flex items-center gap-2">
                <Info className="h-5 w-5 text-amber-600" /> Baggage & Cancellation Policy
              </h3>
              <ul className="space-y-2.5 text-base text-amber-800/80">
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
            <section className="space-y-6">
              {reviews.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-muted/30">
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="text-4xl font-black text-foreground">
                      {avgRating.toFixed(1)}
                    </span>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= Math.round(avgRating)
                              ? "fill-accent text-accent"
                              : "fill-muted-foreground/20 text-muted-foreground/20",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground mt-1 font-medium">
                      {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {ratingDist.reverse().map(({ star, count, percentage }) => (
                      <div key={star} className="flex items-center gap-2 text-base">
                        <span className="w-3 text-right text-muted-foreground font-medium text-sm">
                          {star}
                        </span>
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <div className="flex-1 h-2 bg-muted-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-sm text-muted-foreground">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <ReviewSection
                listingId={route.id}
                listingName={`${route.from} to ${route.to}`}
                listingType="transport"
                reviews={reviews}
              />
            </section>
          </div>

          {/* Right Side: Interactive Booking Card */}
          <aside className="hidden lg:block lg:sticky lg:top-24">
            <div className="bg-card rounded-2xl card-shadow-lg overflow-hidden">
              <div className="bg-primary px-6 py-5 text-white">
                <p className="text-primary-foreground/80 text-sm font-bold uppercase tracking-widest mb-1">
                  Ticket Rate Starting at
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary-foreground">
                    K{route.price}
                  </span>
                  <span className="text-primary-foreground/75 text-base">/seat</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-primary-foreground/90 text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Instant SMS Ticket confirmation upon booking approval</span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <h3 className="font-black text-xl text-foreground tracking-tight font-display">
                  Invoice Summary
                </h3>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    What&apos;s Included
                  </p>
                  <div className="space-y-2 text-base">
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

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Boarding Amenities
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Air Conditioning", "Reclining Seats", "WiFi", "USB Charging"].map((a) => (
                      <span
                        key={a}
                        className="text-sm bg-muted px-2.5 py-1 rounded-full text-muted-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/40" />

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Price Breakdown
                  </p>
                  <div className="space-y-1.5 text-base">
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

                <Link
                  href={`/checkout/book?type=transport&id=${route.id}`}
                  className="w-full h-12 rounded-xl bg-primary font-black uppercase tracking-widest text-base text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  Proceed to Booking
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <p className="text-center text-sm text-muted-foreground">
                  Free cancellation 24h before departure · Secure seat
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky booking bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/60 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-foreground">K{route.price}</span>
              <span className="text-sm text-muted-foreground">/seat</span>
            </div>
            {reviews.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span>
                  {avgRating.toFixed(1)} · {reviews.length} reviews
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "h-10 w-10 rounded-xl border flex items-center justify-center transition-all",
                isFavorited
                  ? "border-primary/30 text-primary bg-primary/5"
                  : "border-border/60 text-muted-foreground hover:text-primary",
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorited && "fill-primary")} />
            </button>
            <Link
              href={`/checkout/book?type=transport&id=${route.id}`}
              className="h-10 px-5 rounded-xl bg-primary font-bold text-base text-primary-foreground shadow-sm shadow-primary/20 flex items-center justify-center gap-1.5"
            >
              Book Now
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <AuthGuardDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        title="Save to your collections"
        description="Sign in to save this route and access it from any device."
      />
    </div>
  );
}
