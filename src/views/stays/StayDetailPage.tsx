"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Heart,
  Share2,
  Wifi,
  Car,
  Coffee,
  Trees,
  Waves,
  ShieldCheck,
  Award,
  ChevronLeft,
  Users,
  Zap,
  Verified,
  Minus,
  Plus,
  BedDouble,
  Bath,
  Maximize2,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getListing, listings } from "@/lib/mock-data";
import type { Stay } from "@/types/stay";
import { BOOKING_DRAFT_STORAGE_KEY } from "@/store/bookingStore";
import { ListingCard } from "@/components/ListingCard";
import { cn } from "@/lib/utils";

const amenities = [
  { icon: Wifi, label: "Fast Wi-Fi" },
  { icon: Car, label: "Free parking" },
  { icon: Coffee, label: "Breakfast" },
  { icon: Trees, label: "Garden & deck" },
  { icon: Waves, label: "Plunge pool" },
  { icon: ShieldCheck, label: "24/7 security" },
];

const whyBookUs = [
  { icon: ShieldCheck, title: "Secure Bookings", desc: "Verified Zambian hosts and 24/7 support." },
  { icon: Zap, title: "Instant Confirmation", desc: "Get your confirmation in seconds." },
  { icon: Award, title: "Local Expertise", desc: "Hand-picked gems curated for Zambia." },
];

export function StayDetailPage() {
  const params = useParams();
  const id = (params.id as string) ?? "";
  const router = useRouter();
  const stay = getListing(id) ?? listings[0];
  const similar = listings.filter((l) => l.id !== stay.id).slice(0, 4);

  const [saved, setSaved] = useState(false);
  const [duration, setDuration] = useState(3);
  const [guests, setGuests] = useState(2);
  const [barVisible, setBarVisible] = useState(false);
  const bookingRef = useRef<HTMLDivElement>(null);

  // Gallery
  const galleryImages = useMemo(() =>
    (stay as unknown as Stay).images?.length
      ? (stay as unknown as Stay).images
      : [
          stay.image,
          listings[(listings.indexOf(stay) + 1) % listings.length].image,
          listings[(listings.indexOf(stay) + 2) % listings.length].image,
          listings[(listings.indexOf(stay) + 3) % listings.length].image,
          listings[(listings.indexOf(stay) + 4) % listings.length].image,
        ]
  , [stay]);

  const [mainImage, setMainImage] = useState(stay.image);

  // Pricing
  const pricePerNight = stay.price * 18;
  const serviceFee = 450;
  const totalCost = pricePerNight * duration + serviceFee;

  // Show sticky bar only after hero scrolled past
  useEffect(() => {
    const onScroll = () => setBarVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function reserve() {
    const draft = {
      stayId: stay.id,
      stayName: stay.name,
      pricePerNight: stay.price,
      checkIn: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      checkOut: new Date(Date.now() + (7 + duration) * 86400000).toISOString().slice(0, 10),
      guests,
    };
    try { localStorage.setItem(BOOKING_DRAFT_STORAGE_KEY, JSON.stringify(draft)); } catch { /* noop */ }
    router.push("/booking");
  }

  function scrollToBooking() {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar className="bg-background/80 backdrop-blur-md border-border/40" />

      {/* ── CINEMATIC HERO ── */}
      <section className="relative w-full h-[92dvh] overflow-hidden">
        {/* Photo */}
        <img
          src={mainImage}
          alt={stay.name}
          key={mainImage}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 animate-in fade-in zoom-in-95"
        />

        {/* Gradient veil — bottom title area */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Top-left back nav */}
        <div className="absolute top-20 left-6 z-20">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-full border border-white/20 hover:bg-white/25 transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back
          </Link>
        </div>

        {/* Top-right actions */}
        <div className="absolute top-20 right-6 z-20 flex items-center gap-2">
          <button
            onClick={() => setSaved((s) => !s)}
            className={cn(
              "p-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all",
              saved && "bg-primary/80 border-primary"
            )}
            aria-label="Save to wishlist"
          >
            <Heart className={cn("h-5 w-5 text-white", saved && "fill-white")} />
          </button>
          <button className="p-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all" aria-label="Share">
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Bottom overlay: title, location, rating, CTA */}
        <div className="absolute bottom-0 inset-x-0 z-10 px-6 pb-10 md:px-12 md:pb-14">
          <div className="mx-auto max-w-5xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Title block */}
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Badge className="bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full w-fit">
                <Award className="h-3 w-3 mr-1.5" /> Zambian Superhost
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white font-display leading-[0.95] drop-shadow-2xl">
                {stay.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                <span className="flex items-center gap-1.5 text-sm font-bold">
                  <MapPin className="h-4 w-4" /> {stay.location}, Zambia
                </span>
                <span className="flex items-center gap-1.5 text-sm font-bold bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {stay.rating.toFixed(1)}
                  <span className="text-white/60">· {stay.reviews} reviews</span>
                </span>
              </div>
            </div>

            {/* Price + CTA */}
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

      {/* ── MAIN CONTENT — single centered column ── */}
      <main className="mx-auto w-full max-w-5xl px-4 md:px-6 py-14 space-y-14">

        {/* ── GALLERY: main image + thumbnails below ── */}
        <section aria-label="Property gallery" className="space-y-3">
          <div className="aspect-[16/9] w-full relative overflow-hidden rounded-[1.5rem] shadow-xl bg-muted">
            <img
              src={mainImage}
              alt={stay.name}
              key={mainImage}
              className="object-cover w-full h-full transition-all duration-700 animate-in fade-in zoom-in-95"
            />
          </div>
          {/* Thumbnails inline below main image */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                aria-label={`View photo ${idx + 1}`}
                className={cn(
                  "relative h-20 w-32 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  mainImage === img
                    ? "ring-2 ring-primary opacity-100 scale-[0.97]"
                    : "opacity-50 hover:opacity-90 hover:ring-1 hover:ring-primary/50"
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* ── QUICK STATS STRIP ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Guests", value: `${guests} people` },
            { icon: BedDouble, label: "Bedrooms", value: "3 rooms" },
            { icon: Bath, label: "Bathrooms", value: "2 baths" },
            { icon: Maximize2, label: "Area", value: "120 m²" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <s.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="text-sm font-black text-foreground">{s.value}</p>
            </div>
          ))}
        </section>

        {/* ── NARRATIVE ── */}
        <section className="max-w-3xl space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">The Story</p>
          <p className="text-2xl md:text-3xl font-black tracking-tight text-foreground font-display leading-snug">
            {stay.description}
          </p>
          <p className="text-base text-muted-foreground font-medium leading-relaxed">
            Experience the true essence of Zambian hospitality in this meticulously crafted space. Every corner tells a story of local craft and modern luxury, designed for those who seek more than just a place to sleep.
          </p>
        </section>

        {/* ── AMENITIES ── */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-6">The Essentials</p>
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

        {/* ── HOST BYLINE ── */}
        <section className="flex items-center gap-5 py-6 border-y border-border/40">
          <div className="relative shrink-0">
            <Avatar className="h-16 w-16 ring-2 ring-primary/10">
              <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl">
                {((stay as unknown as Stay).host?.displayName ?? "NE")[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-1 shadow">
              <Verified className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Hosted by</p>
            <p className="text-xl font-black text-foreground font-display truncate">
              {(stay as unknown as Stay).host?.displayName ?? "Nearby Escapes Host"}
            </p>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {(stay as unknown as Stay).host?.location ?? "Zambia"} · Typically replies within 1 hour
            </p>
          </div>
        </section>

        {/* ── INLINE BOOKING SECTION ── */}
        <section ref={bookingRef} id="booking" className="rounded-[2rem] border border-border/40 bg-card shadow-xl overflow-hidden">
          {/* Header */}
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

          {/* Controls */}
          <div className="p-8 space-y-6">
            {/* Duration */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Stay Duration</p>
              <div className="flex items-center gap-4 bg-secondary/50 rounded-2xl px-6 py-4 border border-border/40">
                <button
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 shrink-0"
                  aria-label="Decrease nights"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-black text-primary font-display">{duration}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nights</p>
                </div>
                <button
                  onClick={() => setDuration(duration + 1)}
                  className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 shrink-0"
                  aria-label="Increase nights"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Guests */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Guests</p>
              <div className="flex items-center gap-4 bg-secondary/50 rounded-2xl px-6 py-4 border border-border/40">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 shrink-0"
                  aria-label="Decrease guests"
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
                  className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary border border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 shrink-0"
                  aria-label="Increase guests"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 pt-4 border-t border-border/40">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>ZMW {pricePerNight} × {duration} nights</span>
                <span className="text-foreground font-bold">ZMW {pricePerNight * duration}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Service fee</span>
                <span className="text-foreground font-bold">ZMW {serviceFee}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border/40">
                <span className="font-black text-foreground uppercase tracking-wider text-sm">Total</span>
                <span className="text-3xl font-black text-primary font-display">ZMW {totalCost}</span>
              </div>
            </div>

            <Button
              className="w-full h-14 text-sm font-black bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/25 transition-all active:scale-[0.98] uppercase tracking-widest"
              onClick={reserve}
            >
              Reserve Now
            </Button>
          </div>
        </section>

        {/* ── TRUST BAND ── */}
        <section className="rounded-[1.5rem] border border-border/40 bg-card px-8 py-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center text-muted-foreground mb-10">The Nearby Guarantee</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {whyBookUs.map((item) => (
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

        {/* ── SIMILAR STAYS ── */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <p className="text-2xl font-black tracking-tight font-display text-foreground">Similar Explorations</p>
            <Button variant="ghost" className="font-black text-primary hover:bg-primary/5 rounded-xl text-sm" asChild>
              <Link href="/accommodations">View All</Link>
            </Button>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* ── STICKY BOTTOM BOOKING BAR ── */}
      <div
        className={cn(
          "fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ease-out",
          barVisible ? "translate-y-0" : "translate-y-full"
        )}
        aria-label="Booking summary bar"
      >
        <div className="bg-background/80 backdrop-blur-xl border-t border-border/50 shadow-2xl">
          <div className="mx-auto max-w-5xl px-4 md:px-6 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground truncate">{stay.name}</p>
              <p className="text-xl font-black text-primary font-display">
                ZMW {pricePerNight}
                <span className="text-xs font-bold text-muted-foreground ml-1">/ night</span>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {stay.rating.toFixed(1)}
              </div>
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
    </div>
  );
}
