"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star, MapPin, Share2, Heart,
  Wifi, Coffee, Car, Wind,
  ShieldCheck, ChevronLeft,
  Trees, Dumbbell, Utensils, Lock,
  Users, BedDouble, Bath, Maximize2,
  Zap, Award, Verified, Minus, Plus,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { listings, type Listing } from "@/lib/mock-data";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ListingCard } from "@/components/ListingCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useBookingStore } from "@/store/bookingStore";
import { useAuth } from "@/lib/auth";
import { AuthGuardDialog } from "@/components/auth/AuthGuardDialog";
import { useWishlistStore } from "@/store/wishlistStore";

const amenities = [
  { icon: Wifi, label: "Fast Wi-Fi" },
  { icon: Coffee, label: "Breakfast included" },
  { icon: Car, label: "Free parking" },
  { icon: Wind, label: "Air conditioning" },
  { icon: Trees, label: "Private garden" },
  { icon: Dumbbell, label: "Gym access" },
  { icon: Utensils, label: "Full kitchen" },
  { icon: ShieldCheck, label: "24/7 Security" },
  { icon: Lock, label: "Safe deposit box" },
];

const defaultPhotos = [
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&fit=crop&w=800&h=600",
  "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&fit=crop&w=800&h=600",
  "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&fit=crop&w=800&h=600",
  "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&fit=crop&w=800&h=600",
];

export default function StayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isAuthenticated } = useAuth();
  const { setStayDetails, resetBooking } = useBookingStore();

  const searchParams = useSearchParams();
  const searchGuests = searchParams.get("guests");
  const searchCheckIn = searchParams.get("checkIn");
  const searchCheckOut = searchParams.get("checkOut");

  const [listing, setListing] = useState<Listing | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  const initialGuests = searchGuests ? parseInt(searchGuests, 10) : 2;
  const initialDuration = searchCheckIn && searchCheckOut
    ? Math.max(1, Math.ceil((new Date(searchCheckOut).getTime() - new Date(searchCheckIn).getTime()) / 86400000))
    : 3;

  const [duration, setDuration] = useState(initialDuration);
  const [guests, setGuests] = useState(initialGuests);
  const [barVisible, setBarVisible] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authAction, setAuthAction] = useState<"save" | "reserve">("reserve");
  const bookingRef = useRef<HTMLDivElement>(null);
  
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = listing ? isSaved(listing.id) : false;

  // Load listing from localStorage (host uploads) or static mock data
  useEffect(() => {
    try {
      const mock = JSON.parse(localStorage.getItem("mock_host_listings") || "[]");
      const found = mock.find((l: Listing) => l.id === id);
      if (found) { setListing(found); return; }
    } catch { /* noop */ }
    setListing(listings.find((l) => l.id === id) || listings[0]);
  }, [id]);

  // Sticky bottom bar on scroll
  useEffect(() => {
    const onScroll = () => setBarVisible(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-bold animate-pulse">Loading…</p>
      </div>
    );
  }

  const photos = (listing as any).photos || (listing as any).images || [];
  const galleryImages = (photos.length > 0
    ? [...photos, ...defaultPhotos].slice(0, 5)
    : [listing.image, ...defaultPhotos].slice(0, 5));

  const similar = listings.filter((l) => l.id !== listing.id).slice(0, 4);
  const pricePerNight = listing.price;
  const cleaningFee = 150;
  const serviceFee = 450;
  const nights = duration;
  const subtotal = pricePerNight * nights;
  const total = subtotal + cleaningFee + serviceFee;

  // ── ACTIONS ──────────────────────────────────────────────────────────────

  function handleSave() {
    if (!isAuthenticated) {
      setAuthAction("save");
      setShowAuthDialog(true);
      return;
    }
    if (!listing) return;
    
    if (isFavorited) {
      removeItem(listing.id);
      toast.success("Removed from saved", {
        icon: <Heart className="h-4 w-4 fill-primary text-primary" />,
      });
    } else {
      addItem(listing);
      toast.success("Saved to your collections", {
        icon: <Heart className="h-4 w-4 fill-primary text-primary" />,
      });
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  }

  function handleReserve() {
    if (!isAuthenticated) {
      setAuthAction("reserve");
      setShowAuthDialog(true);
      return;
    }
    resetBooking();
    setStayDetails({
      listingId: listing.id,
      listingName: listing.name,
      listingImage: listing.image,
      checkIn: searchCheckIn ? new Date(searchCheckIn) : new Date(Date.now() + 7 * 86400000),
      checkOut: searchCheckIn ? new Date(new Date(searchCheckIn).getTime() + duration * 86400000) : new Date(Date.now() + (7 + duration) * 86400000),
      guests,
      pricePerNight,
      nights,
      subtotal,
      cleaningFee,
      serviceFee,
      taxes: Math.round(subtotal * 0.1),
      total: subtotal + cleaningFee + serviceFee + Math.round(subtotal * 0.1),
    });
    router.push("/booking");
  }

  function scrollToBooking() {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar className="bg-background/80 backdrop-blur-md border-border/40" />

      {/* ── CINEMATIC HERO ─────────────────────────────────────────────────── */}
      <section className="relative w-full h-[92dvh] overflow-hidden">
        <img
          src={activeImage || listing.image}
          alt={listing.name}
          key={activeImage || listing.image}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 animate-in fade-in zoom-in-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Back — goes to accommodations (the listings browse page) */}
        <div className="absolute top-20 left-6 z-20">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-full border border-white/20 hover:bg-white/25 transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
        </div>

        {/* Save + Share */}
        <div className="absolute top-20 right-6 z-20 flex gap-2">
          <button
            onClick={handleSave}
            aria-label="Save to collections"
            className={cn(
              "p-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all",
              isFavorited && "bg-primary/80 border-primary"
            )}
          >
            <Heart className={cn("h-5 w-5 text-white", isFavorited && "fill-white")} />
          </button>
          <button
            onClick={handleShare}
            aria-label="Share listing"
            className="p-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all"
          >
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Title + Price overlay */}
        <div className="absolute bottom-0 inset-x-0 z-10 px-6 pb-10 md:px-12 md:pb-14">
          <div className="mx-auto max-w-5xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Badge className="bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full w-fit">
                <Award className="h-3 w-3 mr-1.5" /> Zambian Superhost
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white font-display leading-[0.95] drop-shadow-2xl">
                {listing.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <span className="flex items-center gap-1.5 text-sm font-bold">
                  <MapPin className="h-4 w-4" /> {listing.location}, Zambia
                </span>
                <span className="flex items-center gap-1.5 text-sm font-bold bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {listing.rating.toFixed(1)}
                  <span className="text-white/60">· {listing.reviews} reviews</span>
                </span>
                <Badge variant="secondary" className="bg-white/10 border-white/20 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-sm">
                  {listing.category}
                </Badge>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-start md:items-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <div className="text-right">
                <p className="text-white/60 text-[11px] font-black uppercase tracking-widest">from</p>
                <p className="text-4xl font-black text-white font-display">
                  ZMW {pricePerNight}
                  <span className="text-base font-bold text-white/60 ml-1">/ night</span>
                </p>
              </div>
              <Button
                onClick={scrollToBooking}
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/40 transition-all active:scale-[0.97]"
              >
                Check Availability
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-5xl px-4 md:px-6 py-14 space-y-14">

        {/* GALLERY */}
        <section aria-label="Property gallery" className="space-y-3">
          <div className="aspect-[16/9] w-full relative overflow-hidden rounded-[1.5rem] shadow-xl bg-muted">
            <img
              src={activeImage || listing.image}
              alt={listing.name}
              key={activeImage || listing.image}
              className="object-cover w-full h-full transition-all duration-700 animate-in fade-in zoom-in-95"
            />
          </div>
          {/* Thumbnails inline below */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                aria-label={`View photo ${idx + 1}`}
                className={cn(
                  "relative h-20 w-32 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  (activeImage === img || (!activeImage && idx === 0))
                    ? "ring-2 ring-primary opacity-100 scale-[0.97]"
                    : "opacity-50 hover:opacity-90 hover:ring-1 hover:ring-primary/50"
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Guests", value: "4 max" },
            { icon: BedDouble, label: "Bedrooms", value: "2 rooms" },
            { icon: Bath, label: "Bathrooms", value: "2 baths" },
            { icon: Maximize2, label: "Area", value: "120 m²" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <s.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="text-sm font-black text-foreground">{s.value}</p>
            </div>
          ))}
        </section>

        {/* NARRATIVE */}
        <section className="max-w-3xl space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">The Story</p>
          <p className="text-2xl md:text-3xl font-black tracking-tight text-foreground font-display leading-snug">
            {listing.description}
          </p>
          <p className="text-base text-muted-foreground font-medium leading-relaxed">
            Experience the true essence of Zambian hospitality in this meticulously crafted space. Every corner tells a story of local craft and modern luxury, designed for those who seek more than just a place to sleep.
          </p>
        </section>

        {/* AMENITIES */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-6">What's Included</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {amenities.map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card px-5 py-4 shadow-sm hover:border-primary/40 hover:shadow-md transition-all group cursor-default"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <a.icon className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black text-foreground">{a.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* HOST BYLINE — links to host profile */}
        <section className="flex items-center justify-between gap-5 py-6 border-y border-border/40">
          <div className="flex items-center gap-5 min-w-0">
            <div className="relative shrink-0">
              <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl">BC</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-1 shadow">
                <Verified className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Hosted by</p>
              <p className="text-xl font-black text-foreground font-display">Bwalya Chisanga</p>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {listing.location}, Zambia · Typically replies within 1 hour
              </p>
            </div>
          </div>
          <Link
            href="/host/profile/bwalya-chisanga"
            className="shrink-0 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
          >
            View Profile <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* INLINE BOOKING SECTION */}
        <section ref={bookingRef} id="booking" className="rounded-[2rem] border border-border/40 bg-card shadow-xl overflow-hidden">
          {/* Purple header */}
          <div className="bg-primary px-8 py-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/70">Standard Rate</p>
              <p className="text-4xl font-black text-primary-foreground font-display">
                ZMW {pricePerNight}
                <span className="text-base font-bold text-primary-foreground/60 ml-1">/ night</span>
              </p>
            </div>
            <Badge className="bg-primary-foreground/15 border border-primary-foreground/20 text-primary-foreground font-black text-[9px] uppercase tracking-widest rounded-full px-3 py-1">
              Best Value
            </Badge>
          </div>

          <div className="p-8 space-y-6">
            {/* Stay Duration stepper */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Stay Duration</p>
              <div className="flex items-center gap-4 bg-secondary/50 rounded-2xl px-6 py-4 border border-border/40">
                <button
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  aria-label="Decrease nights"
                  className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 shrink-0"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-black text-primary font-display">{duration}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nights</p>
                </div>
                <button
                  onClick={() => setDuration(duration + 1)}
                  aria-label="Increase nights"
                  className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Guests stepper */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Guests</p>
              <div className="flex items-center gap-4 bg-secondary/50 rounded-2xl px-6 py-4 border border-border/40">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  aria-label="Decrease guests"
                  className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 shrink-0"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-black text-primary font-display">{guests}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {guests === 1 ? "Person" : "People"}
                  </p>
                </div>
                <button
                  onClick={() => setGuests(guests + 1)}
                  aria-label="Increase guests"
                  className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 pt-4 border-t border-border/40">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>ZMW {pricePerNight} × {duration} nights</span>
                <span className="text-foreground font-bold">ZMW {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Cleaning fee</span>
                <span className="text-foreground font-bold">ZMW {cleaningFee}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Service fee</span>
                <span className="text-foreground font-bold">ZMW {serviceFee}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border/40">
                <span className="font-black text-foreground uppercase tracking-wider text-sm">Total</span>
                <span className="text-3xl font-black text-primary font-display">ZMW {total}</span>
              </div>
            </div>

            <Button
              id="reserve-btn"
              className="w-full h-14 text-sm font-black bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/25 transition-all active:scale-[0.98] uppercase tracking-widest"
              onClick={handleReserve}
            >
              Reserve Now
            </Button>
            <p className="text-center text-xs text-muted-foreground">You won&apos;t be charged yet</p>
          </div>
        </section>

        {/* TRUST BAND */}
        <section className="rounded-[1.5rem] border border-border/40 bg-card px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center text-muted-foreground mb-10">
            The Nearby Guarantee
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Secure Bookings", desc: "Verified Zambian hosts and 24/7 support." },
              { icon: Zap, title: "Instant Confirmation", desc: "Get your booking confirmation in seconds." },
              { icon: Award, title: "Local Expertise", desc: "Hand-picked gems curated for Zambia." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-4 group">
                <div className="h-14 w-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <item.icon className="h-7 w-7" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-black text-foreground tracking-tight">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SIMILAR STAYS */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <p className="text-2xl font-black tracking-tight font-display text-foreground">Similar Explorations</p>
            <Button variant="ghost" className="font-black text-primary hover:bg-primary/5 rounded-xl text-sm" asChild>
              <Link href="/accommodations">View All Stays</Link>
            </Button>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {similar.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>
      </main>

      <Footer />

      {/* STICKY BOTTOM BAR */}
      <div
        className={cn(
          "fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ease-out",
          barVisible ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="bg-background/80 backdrop-blur-xl border-t border-border/50 shadow-2xl">
          <div className="mx-auto max-w-5xl px-4 md:px-6 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground truncate">
                {listing.name}
              </p>
              <p className="text-xl font-black text-primary font-display">
                ZMW {pricePerNight}
                <span className="text-xs font-bold text-muted-foreground ml-1">/ night</span>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {listing.rating.toFixed(1)}
              </span>
              <Button
                onClick={scrollToBooking}
                className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/25 transition-all active:scale-95"
              >
                Reserve
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AUTH GUARD DIALOG */}
      <AuthGuardDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        title={authAction === "save" ? "Save to your collections" : "Sign in to reserve"}
        description={
          authAction === "save"
            ? "Sign in to save this property and access it from any device."
            : "You need to be signed in to make a reservation. Your details will be saved."
        }
      />
    </div>
  );
}
