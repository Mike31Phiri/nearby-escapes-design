"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  X,
  Home,
} from "lucide-react";
import { EnvelopeSimple as MessageSquare } from "@phosphor-icons/react";

import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/lib/auth";
import { AuthGuardDialog } from "@/components/auth/AuthGuardDialog";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { cn } from "@/lib/utils";
import type { Stay } from "@/lib/mock-data";
import { mockListingReviews } from "@/lib/mock-listing-reviews";
import { mockStayHosts, type StayHost } from "@/lib/mock-profile-data";
import { TrustBadge, type TrustBadgeTier } from "@/components/ui/TrustBadge";

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

// Deterministic mock assignment of trust badges based on listing ID
const getMockBadgeTier = (id: string): TrustBadgeTier | null => {
  const num = parseInt(id.replace(/\D/g, "") || "0", 10);
  if (num % 5 === 0) return "new-host";
  if (num % 4 === 0) return "inspected";
  if (num % 3 === 0) return "verified";
  if (num % 2 === 0) return "top-rated";
  return "top-rated"; // Fallback for detail pages to always show a badge for demo
};

interface StayDetailPageProps {
  stay: Stay;
  backHref?: string;
}

// Rating distribution helper
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

export function StayDetailPage({ stay, backHref = "/search?category=stays" }: StayDetailPageProps) {
  const images = stay.images && stay.images.length > 0 ? stay.images : [stay.image];
  const host: StayHost | undefined = mockStayHosts[stay.id] || mockStayHosts["1"];
  const hostName = host?.name || "Beatrice Mwansa";
  const [activeImg, setActiveImg] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const router = useRouter();
  const [showReadMore, setShowReadMore] = useState(false);
  const [checkIn, setCheckIn] = useState("Fri 18 Jul");
  const [checkOut, setCheckOut] = useState("Sun 20 Jul");
  const [guestCount, setGuestCount] = useState(2);
  const [addTransport, setAddTransport] = useState(true);

  const { isAuthenticated } = useAuth();
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = isSaved(stay.id);
  const badgeTier = getMockBadgeTier(stay.id);

  const reviews = mockListingReviews[stay.id] || [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : stay.rating;
  const ratingDist = getRatingDistribution(reviews);

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

  // Format price for display
  const price = `K${stay.price}`;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans pb-20 md:pb-0">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Breadcrumbs row */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
          <Link
            href={backHref}
            className="hover:text-primary transition-colors font-medium flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-muted-foreground">Stays</span>
          <span className="text-muted-foreground/30">/</span>
          <span className="text-foreground font-semibold truncate max-w-[200px]">{stay.name}</span>
        </div>

        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                {stay.type}
              </span>
              {badgeTier && <TrustBadge tier={badgeTier} size="md" />}
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-foreground mb-1.5">
              {stay.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <strong className="text-foreground">{avgRating.toFixed(1)}</strong>
                <span>
                  ({reviews.length || stay.reviews} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground/60" />
                {stay.location}, Zambia
              </span>
              {stay.closestAttraction && (
                <span className="flex items-center gap-1 text-xs">
                  <Compass className="h-3.5 w-3.5 text-muted-foreground/40" />
                  Near {stay.closestAttraction}
                </span>
              )}
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
        <div className="mb-7">
          {/* Desktop: Grid gallery */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[440px] rounded-2xl overflow-hidden">
            <div
              className="col-span-2 row-span-2 relative cursor-pointer group overflow-hidden"
              onClick={() => {
                setActiveImg(0);
                setShowAllPhotos(true);
              }}
            >
              <img
                src={images[0]}
                alt={stay.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
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
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
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

          {/* Mobile: swipeable carousel with thumbnail strip */}
          <div className="md:hidden">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={images[activeImg]} alt={stay.name} className="h-full w-full object-cover" />
              <button
                onClick={prevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
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

            {/* Mobile thumbnail strip */}
            <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "shrink-0 h-14 w-18 rounded-lg overflow-hidden border-2 transition-all",
                    i === activeImg
                      ? "border-primary ring-1 ring-primary/30"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
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
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <span className="text-white/60 text-sm font-medium">
                {activeImg + 1} / {images.length}
              </span>
              <button
                className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                onClick={() => setShowAllPhotos(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
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

            {/* Lightbox thumbnail strip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 items-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImg(i);
                  }}
                  className={cn(
                    "shrink-0 h-12 w-16 rounded-lg overflow-hidden border-2 transition-all",
                    i === activeImg
                      ? "border-white"
                      : "border-transparent opacity-50 hover:opacity-80",
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main content + booking sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Left: details */}
          <div className="space-y-10">
            {/* Quick Facts Grid */}
            <div className="grid grid-cols-2 gap-3 py-5 border-y border-border/40">
              <div className="bg-card border border-border/60 rounded-xl p-3.5 flex items-center gap-3">
                <Home className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Property type
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    {stay.type || "Private guesthouse"}
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border/60 rounded-xl p-3.5 flex items-center gap-3">
                <Users className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Sleeps
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    Up to {stay.guests || 8} guests
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border/60 rounded-xl p-3.5 flex items-center gap-3">
                <BedDouble className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Bedrooms
                  </div>
                  <div className="text-xs font-bold text-foreground">{stay.beds || 3} bedrooms</div>
                </div>
              </div>
              <div className="bg-card border border-border/60 rounded-xl p-3.5 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    Cancellation
                  </div>
                  <div className="text-xs font-bold text-foreground">Free · 48 hrs</div>
                </div>
              </div>
            </div>

            {/* Overview / About this escape */}
            {stay.description && (
              <section>
                <h2 className="text-lg font-display font-bold tracking-tight text-foreground mb-3">
                  About this escape
                </h2>
                <p
                  className={cn(
                    "text-muted-foreground leading-relaxed text-[13px] transition-all duration-300",
                    !showReadMore && "line-clamp-3",
                  )}
                >
                  {stay.description}
                </p>
                {stay.description.length > 150 && (
                  <button
                    onClick={() => setShowReadMore(!showReadMore)}
                    className="text-xs font-bold text-primary mt-2 flex items-center hover:underline focus:outline-none"
                  >
                    {showReadMore ? "Show less" : "Read more"}
                  </button>
                )}
              </section>
            )}

            {/* Amenities */}
            <section>
              <h2 className="text-xl font-display font-bold tracking-tight text-foreground mb-4">
                Room Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stay.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 text-sm font-medium text-foreground"
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
                <h2 className="text-xl font-display font-bold tracking-tight text-foreground mb-4">
                  Booking Rules
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {stay.checkInRules && (
                    <div className="p-5 rounded-2xl bg-muted/30">
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
                    <div className="p-5 rounded-2xl bg-muted/30">
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

            {/* Meet the Host — Full profile card */}
            <section className="pt-2">
              <h2 className="text-lg font-display font-bold tracking-tight text-foreground mb-4">
                Meet your host
              </h2>
              <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                {/* Host header — avatar + name + superhost badge */}
                <div className="flex items-start gap-4 p-5 pb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-sm"
                    style={{ backgroundColor: host?.avatarColor || "#1A0B2E" }}
                  >
                    {host?.avatarInitials || "NE"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-bold text-foreground">{hostName}</h3>
                      {host?.superhost && (
                        <span className="inline-flex items-center gap-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#D4AF37]/20">
                          <Star className="h-2.5 w-2.5 fill-[#D4AF37]" />
                          Superhost
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Host since {host?.joined || "2023"} · {stay.location}
                    </p>
                    {/* Verified badges inline */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {host?.verifiedBadges.slice(0, 2).map((badge) => (
                        <span
                          key={badge}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {badge}
                        </span>
                      ))}
                      {host && host.verifiedBadges.length > 2 && (
                        <span className="text-[10px] text-muted-foreground font-medium">
                          +{host.verifiedBadges.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      toast.success(`Chat with ${hostName.split(" ")[0]} coming soon!`)
                    }
                    className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 hover:bg-primary/10 transition-colors text-primary border border-primary/10"
                    aria-label={`Message ${hostName}`}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>

                {/* Host bio */}
                {host?.bio && (
                  <div className="px-5 pb-3">
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{host.bio}</p>
                  </div>
                )}

                {/* Stats grid */}
                <div className="mx-5 mb-4 grid grid-cols-3 gap-px bg-border/30 rounded-xl overflow-hidden">
                  <div className="bg-muted/30 py-2.5 text-center">
                    <p className="text-[13px] font-bold text-foreground">
                      {host ? host.rating.toFixed(2) : "4.9"}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">Rating</p>
                  </div>
                  <div className="bg-muted/30 py-2.5 text-center">
                    <p className="text-[13px] font-bold text-foreground">
                      {host?.reviewCount || 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">Reviews</p>
                  </div>
                  <div className="bg-muted/30 py-2.5 text-center">
                    <p className="text-[13px] font-bold text-foreground">
                      {host?.totalListings || 0}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">Listings</p>
                  </div>
                </div>

                {/* Response stats + Languages */}
                <div className="px-5 pb-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="font-semibold text-foreground">
                        {host?.responseRate || 98}%
                      </span>
                      <span>response rate</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary/60" />
                    <span className="font-semibold text-foreground">
                      {host?.responseTime || "within 1 hour"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Speaks</span>
                    <span className="font-semibold text-foreground">
                      {host?.languages?.join(" · ") || "English"}
                    </span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="border-t border-border/40 p-4 flex gap-2">
                  <button
                    onClick={() =>
                      toast.success(`Chat with ${hostName.split(" ")[0]} coming soon!`)
                    }
                    className="flex-1 h-9 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Message {hostName.split(" ")[0]}
                  </button>
                  <button
                    onClick={() => toast.success("Full host profile coming soon!")}
                    className="flex-1 h-9 rounded-xl border border-border/60 text-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-muted/50 transition-colors"
                  >
                    View full profile
                  </button>
                </div>
              </div>
            </section>

            {/* Location map embed */}
            <section>
              <h2 className="text-lg font-display font-bold tracking-tight text-foreground mb-3">
                Location
              </h2>
              <div className="rounded-2xl overflow-hidden border border-border/40 shadow-sm relative h-40 bg-muted">
                <iframe
                  title={`Map for ${stay.name}`}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${(stay.lng ?? 28) - 0.05}%2C${(stay.lat ?? -15) - 0.05}%2C${(stay.lng ?? 28) + 0.05}%2C${(stay.lat ?? -15) + 0.05}&layer=mapnik&marker=${stay.lat ?? -15}%2C${stay.lng ?? 28}`}
                  style={{ border: 0, filter: "contrast(0.9) brightness(0.95)" }}
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {stay.location}, Central Province · Exact location shared after booking
              </p>
            </section>

            {/* Experiences Nearby */}
            <section>
              <h2 className="text-lg font-display font-bold tracking-tight text-foreground mb-3">
                Add experiences nearby
              </h2>
              <div className="flex gap-3.5 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex-shrink-0 w-[150px] bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-20 bg-[#1C2A1A] flex items-center justify-center text-[#5A8A40]">
                    <Compass className="h-8 w-8" />
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold text-foreground line-clamp-1">
                      Farm tour & milking
                    </div>
                    <div className="text-[11px] text-[#D4AF37] font-semibold mt-1">
                      +K150/person
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-[150px] bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-20 bg-[#2A1A08] flex items-center justify-center text-[#D4AF37]">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold text-foreground line-clamp-1">
                      Bush braai evening
                    </div>
                    <div className="text-[11px] text-[#D4AF37] font-semibold mt-1">
                      +K200/person
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 w-[150px] bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-20 bg-[#0A1A2A] flex items-center justify-center text-[#4A8AAA]">
                    <Waves className="h-8 w-8" />
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold text-foreground line-clamp-1">
                      Kafue river fishing
                    </div>
                    <div className="text-[11px] text-[#D4AF37] font-semibold mt-1">
                      +K300/person
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Guest Reviews — Enhanced with aggregation */}
            <section className="space-y-6">
              {/* Review summary header */}
              {reviews.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-muted/30">
                  {/* Left: Big rating */}
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
                    <span className="text-xs text-muted-foreground mt-1 font-medium">
                      {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </div>

                  {/* Right: Distribution bars */}
                  <div className="flex-1 space-y-1.5">
                    {ratingDist.reverse().map(({ star, count, percentage }) => (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-3 text-right text-muted-foreground font-medium text-xs">
                          {star}
                        </span>
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <div className="flex-1 h-2 bg-muted-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-xs text-muted-foreground">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review cards */}
              <ReviewSection
                listingId={stay.id}
                listingName={stay.name}
                listingType="stay"
                reviews={reviews}
              />
            </section>

            {/* Mobile Booking Bar - inline calculator (visible on mobile only) */}
            <div
              id="booking-calculator"
              className="lg:hidden bg-[#1A0B2E] rounded-2xl p-5 text-[#F9F7F2] space-y-4 shadow-lg border border-primary/20 mt-6"
            >
              <div className="flex justify-between items-baseline">
                <div className="text-xl font-bold text-[#F9F7F2]">
                  K{stay.price} <span className="text-xs font-normal text-[#9B95A8]">/ night</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#9B95A8]">
                  <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  {avgRating.toFixed(1)} · {reviews.length || stay.reviews} reviews
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 border border-[#D4AF37]/30 rounded-xl p-3">
                  <div className="text-[10px] text-[#9B95A8] font-bold uppercase tracking-wider mb-1">
                    Check-in
                  </div>
                  <div className="text-xs font-semibold text-[#F9F7F2]">{checkIn}</div>
                </div>
                <div className="bg-white/5 border border-[#D4AF37]/30 rounded-xl p-3">
                  <div className="text-[10px] text-[#9B95A8] font-bold uppercase tracking-wider mb-1">
                    Check-out
                  </div>
                  <div className="text-xs font-semibold text-[#F9F7F2]">{checkOut}</div>
                </div>
              </div>

              {/* Guests Selector */}
              <div className="bg-white/5 border border-[#D4AF37]/30 rounded-xl p-3 flex justify-between items-center">
                <div className="text-[10px] text-[#9B95A8] font-bold uppercase tracking-wider font-semibold">
                  Guests
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                    className="w-7 h-7 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors font-bold text-sm"
                  >
                    −
                  </button>
                  <span className="text-xs font-bold text-[#F9F7F2] min-w-4 text-center">
                    {guestCount}
                  </span>
                  <button
                    onClick={() => setGuestCount((g) => Math.min(stay.guests || 8, g + 1))}
                    className="w-7 h-7 rounded-full border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Transport Toggle */}
              <div className="flex items-center justify-between bg-white/5 border border-[#D4AF37]/30 rounded-xl p-3">
                <div>
                  <div className="text-xs font-bold text-[#F9F7F2]">Add transport pickup</div>
                  <div className="text-[10px] text-[#9B95A8] mt-0.5">Lusaka CBD → Farm & back</div>
                </div>
                <button
                  onClick={() => setAddTransport(!addTransport)}
                  className={cn(
                    "w-9 h-5 rounded-full p-0.5 transition-colors relative shrink-0",
                    addTransport ? "bg-[#D4AF37]" : "bg-white/20",
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full bg-[#1A0B2E] transition-transform",
                      addTransport ? "translate-x-4" : "translate-x-0",
                    )}
                  />
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-white/10 pt-3.5 space-y-2">
                <div className="flex justify-between text-xs text-[#9B95A8]">
                  <span>K{stay.price} × 2 nights</span>
                  <span>K{(stay.price * 2).toLocaleString()}</span>
                </div>
                {addTransport && (
                  <div className="flex justify-between text-xs text-[#9B95A8]">
                    <span>Transport (return)</span>
                    <span>K280</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-[#9B95A8]">
                  <span>Service fee (5%)</span>
                  <span>K{Math.round(stay.price * 2 * 0.05)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#F9F7F2] font-bold border-t border-white/10 pt-3">
                  <span>Total</span>
                  <span>
                    K
                    {(
                      stay.price * 2 +
                      (addTransport ? 280 : 0) +
                      Math.round(stay.price * 2 * 0.05)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  toast.success("Redirecting to checkout...");
                  router.push(
                    `/checkout/book?type=stay&id=${stay.id}&guests=${guestCount}&transport=${addTransport}`,
                  );
                }}
                className="w-full bg-[#D4AF37] text-[#334155] hover:bg-[#D4AF37]/90 rounded-xl py-3 text-xs font-bold transition-colors uppercase tracking-wider"
              >
                Reserve now — K
                {(
                  stay.price * 2 +
                  (addTransport ? 280 : 0) +
                  Math.round(stay.price * 2 * 0.05)
                ).toLocaleString()}
              </button>
            </div>
          </div>

          {/* Right: Booking card (desktop sticky) */}
          <aside className="hidden lg:block lg:sticky lg:top-24">
            <div className="bg-card rounded-2xl card-shadow-lg overflow-hidden">
              {/* Price header */}
              <div className="bg-primary px-6 py-5">
                <p className="text-primary-foreground/80 text-xs font-bold uppercase tracking-widest mb-1">
                  Starting from
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary-foreground">{price}</span>
                  <span className="text-primary-foreground/70 text-sm">/night</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3.5 w-3.5 fill-primary-foreground/80 text-primary-foreground/80" />
                  <span className="text-primary-foreground/90 text-xs font-semibold">
                    {avgRating.toFixed(1)} · {reviews.length || stay.reviews} reviews
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <h3 className="font-black text-lg text-foreground tracking-tight font-display">
                  Invoice Summary
                </h3>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    What&apos;s Included
                  </p>
                  <div className="space-y-2 text-sm">
                    {stay.beds && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BedDouble className="h-4 w-4 text-primary/70 shrink-0" />
                        <span>
                          {stay.beds} {stay.beds === 1 ? "Bed" : "Beds"} · {stay.baths}{" "}
                          {stay.baths === 1 ? "Bath" : "Baths"}
                        </span>
                      </div>
                    )}
                    {stay.guests && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 text-primary/70 shrink-0" />
                        <span>Up to {stay.guests} guests</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-4 w-4 text-primary/70 shrink-0" />
                      <span>Check-in 14:00+ · Check-out 11:00</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/40" />

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Price Breakdown
                  </p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Room rate</span>
                      <span className="font-semibold text-foreground">{price}/night</span>
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

      {/* Mobile sticky booking bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/60 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-foreground">{price}</span>
              <span className="text-xs text-muted-foreground">/night</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span>
                {avgRating.toFixed(1)} · {reviews.length || stay.reviews} reviews
              </span>
            </div>
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
            <button
              onClick={() => {
                const el = document.getElementById("booking-calculator");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-10 px-5 rounded-xl bg-primary font-bold text-sm text-primary-foreground shadow-sm shadow-primary/20 flex items-center justify-center gap-1.5"
            >
              Book Now
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AuthGuardDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        title="Save to your collections"
        description="Sign in to save this property and access it from any device."
      />
    </div>
  );
}
