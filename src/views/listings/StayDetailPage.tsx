"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  BedDouble,
  Bath,
  Users,
  Maximize2,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Waves,
  Sparkles,
  Compass,
  Coffee,
  Dumbbell,
  UtensilsCrossed,
  CheckCircle2,
  CalendarDays,
  Phone,
  User,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/lib/auth";
import { AuthGuardDialog } from "@/components/auth/AuthGuardDialog";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { cn } from "@/lib/utils";
import type { Stay } from "@/lib/mock-data";

// Map amenity labels to icons
const amenityIconMap: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  Pool: <Waves className="h-4 w-4" />,
  Spa: <Sparkles className="h-4 w-4" />,
  "Guided Tours": <Compass className="h-4 w-4" />,
  Breakfast: <Coffee className="h-4 w-4" />,
  "Meals Included": <UtensilsCrossed className="h-4 w-4" />,
  Gym: <Dumbbell className="h-4 w-4" />,
  Restaurant: <UtensilsCrossed className="h-4 w-4" />,
  Bar: <Coffee className="h-4 w-4" />,
  "Water Sports": <Waves className="h-4 w-4" />,
  Fishing: <Compass className="h-4 w-4" />,
  "Wildlife Viewing": <Compass className="h-4 w-4" />,
  "Boat Safaris": <Waves className="h-4 w-4" />,
  "Bird Watching": <Compass className="h-4 w-4" />,
  "Guided Walks": <Compass className="h-4 w-4" />,
  "City Views": <Maximize2 className="h-4 w-4" />,
};

interface StayDetailPageProps {
  stay: Stay;
  backHref?: string;
}

export function StayDetailPage({ stay, backHref = "/search?category=stays" }: StayDetailPageProps) {
  const images = stay.images && stay.images.length > 0 ? stay.images : [stay.image];
  const [activeImg, setActiveImg] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const { isAuthenticated } = useAuth();
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = isSaved(stay.id);



  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    if (isFavorited) {
      removeItem(stay.id);
      toast.success(`Removed from collections`);
    } else {
      addItem(stay);
      toast.success(`Saved to collections`, {
        icon: <Heart className="h-4 w-4 fill-primary text-primary" />,
      });
    }
  };



  const prevImg = () => setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));

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
          <span className="text-foreground font-semibold truncate">{stay.name}</span>
        </div>

        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                {stay.type}
              </span>
              {stay.rating >= 4.8 && (
                <span className="text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full">
                  Top Rated
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-1">
              {stay.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                <strong className="text-foreground">{stay.rating.toFixed(1)}</strong>
                <span>({stay.reviews} reviews)</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
                {stay.location}, Zambia
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
              aria-label={isFavorited ? "Remove from wishlist" : "Save"}
            >
              <Heart className={cn("h-4 w-4", isFavorited && "fill-primary")} />
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-8">
          {/* Main gallery grid */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
            {/* Large main image */}
            <div
              className="col-span-2 row-span-2 relative cursor-pointer group"
              onClick={() => {
                setActiveImg(0);
                setShowAllPhotos(true);
              }}
            >
              <img
                src={images[0]}
                alt={stay.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Side thumbnails */}
            {images.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden cursor-pointer group"
                onClick={() => {
                  setActiveImg(idx + 1);
                  setShowAllPhotos(true);
                }}
              >
                <img
                  src={img}
                  alt={`${stay.name} ${idx + 2}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {idx === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      +{images.length - 5} photos
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: swipeable carousel */}
          <div className="md:hidden relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img src={images[activeImg]} alt={stay.name} className="h-full w-full object-cover" />
            <button
              onClick={prevImg}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImg}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === activeImg ? "w-5 bg-white" : "w-1.5 bg-white/50",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Full-screen photo lightbox */}
        {showAllPhotos && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
            onClick={() => setShowAllPhotos(false)}
          >
            <button
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => setShowAllPhotos(false)}
            >
              ✕
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                prevImg();
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <img
              src={images[activeImg]}
              alt={stay.name}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                nextImg();
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImg(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === activeImg ? "w-6 bg-white" : "w-2 bg-white/40",
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main content + booking sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Left: details */}
          <div className="space-y-10">
            {/* Quick stats */}
            <div className="flex flex-wrap gap-5 py-5 border-y border-border/40">
              {stay.beds && (
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <BedDouble className="h-4.5 w-4.5 text-primary/70" />
                  <span>
                    {stay.beds} {stay.beds === 1 ? "Bed" : "Beds"}
                  </span>
                </div>
              )}
              {stay.baths && (
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Bath className="h-4.5 w-4.5 text-primary/70" />
                  <span>
                    {stay.baths} {stay.baths === 1 ? "Bath" : "Baths"}
                  </span>
                </div>
              )}
              {stay.sqft && (
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Maximize2 className="h-4.5 w-4.5 text-primary/70" />
                  <span>{stay.sqft} sq ft</span>
                </div>
              )}
              {stay.guests && (
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Users className="h-4.5 w-4.5 text-primary/70" />
                  <span>Up to {stay.guests} guests</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground ml-auto">
                <Share2 className="h-4.5 w-4.5 text-muted-foreground/60" />
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                  className="hover:text-primary transition-colors"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Overview */}
            {stay.description && (
              <section>
                <h2 className="text-xl font-black tracking-tight text-foreground mb-3">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  {stay.description}
                </p>
              </section>
            )}

            {/* Amenities */}
            <section>
              <h2 className="text-xl font-black tracking-tight text-foreground mb-4">
                Room Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stay.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 border border-border/40 text-sm font-medium text-foreground"
                  >
                    <span className="text-primary/70">
                      {amenityIconMap[amenity] ?? <CheckCircle2 className="h-4 w-4" />}
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            {/* Booking Rules */}
            {(stay.checkInRules || stay.checkOutRules) && (
              <section>
                <h2 className="text-xl font-black tracking-tight text-foreground mb-4">
                  Booking Rules
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {stay.checkInRules && (
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" /> Check In
                      </h3>
                      <ul className="space-y-2">
                        {stay.checkInRules.map((rule, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {stay.checkOutRules && (
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" /> Check Out
                      </h3>
                      <ul className="space-y-2">
                        {stay.checkOutRules.map((rule, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Location map embed */}
            <section>
              <h2 className="text-xl font-black tracking-tight text-foreground mb-4">Location</h2>
              <div className="rounded-2xl overflow-hidden border border-border/40 shadow-sm">
                <iframe
                  title={`Map for ${stay.name}`}
                  width="100%"
                  height="280"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${(stay.lng ?? 28) - 0.5}%2C${(stay.lat ?? -15) - 0.5}%2C${(stay.lng ?? 28) + 0.5}%2C${(stay.lat ?? -15) + 0.5}&layer=mapnik&marker=${stay.lat ?? -15}%2C${stay.lng ?? 28}`}
                  style={{ border: 0 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {stay.location}, Zambia
              </p>
            </section>

            {/* Guest Reviews */}
            <ReviewSection
              listingId={stay.id}
              listingName={stay.name}
              listingType="stay"
            />
          </div>

          {/* Right: Booking card */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-card border border-border/40 rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Price header */}
              <div className="bg-primary px-6 py-5">
                <p className="text-primary-foreground/80 text-xs font-bold uppercase tracking-widest mb-1">
                  Starting from
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary-foreground">K{stay.price}</span>
                  <span className="text-primary-foreground/70 text-sm">/night</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3.5 w-3.5 fill-primary-foreground/80 text-primary-foreground/80" />
                  <span className="text-primary-foreground/90 text-xs font-semibold">
                    {stay.rating.toFixed(1)} · {stay.reviews} reviews
                  </span>
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
                    {stay.beds && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BedDouble className="h-4 w-4 text-primary/70" />
                        <span>
                          {stay.beds} {stay.beds === 1 ? "Bed" : "Beds"} · {stay.baths}{" "}
                          {stay.baths === 1 ? "Bath" : "Baths"}
                        </span>
                      </div>
                    )}
                    {stay.guests && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 text-primary/70" />
                        <span>Up to {stay.guests} guests</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-4 w-4 text-primary/70" />
                      <span>Check-in 14:00+ · Check-out 11:00</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/40" />

                {/* Amenities Preview */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {stay.amenities.slice(0, 4).map((a) => (
                      <span
                        key={a}
                        className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground"
                      >
                        {a}
                      </span>
                    ))}
                    {stay.amenities.length > 4 && (
                      <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                        +{stay.amenities.length - 4} more
                      </span>
                    )}
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
                      <span>Room rate</span>
                      <span className="font-semibold text-foreground">K{stay.price}/night</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Service fee (est.)</span>
                      <span className="font-semibold text-foreground">5%</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic">
                    Final total calculated after selecting dates
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href={`/checkout/book?type=stay&id=${stay.id}`}
                  className="w-full h-12 rounded-xl bg-primary font-black uppercase tracking-widest text-sm text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  Proceed to Booking
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <p className="text-center text-xs text-muted-foreground">
                  Free cancellation · No charge until confirmed
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <AuthGuardDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        title="Save to your collections"
        description="Sign in to save this property and access it from any device."
      />
    </div>
  );
}
