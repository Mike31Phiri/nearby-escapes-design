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
  Check,
  Users,
  Calendar,
  Info,
  ArrowRight,
  Verified,
  Zap,
  Plus,
  Minus,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getListing, listings } from "@/lib/mock-data";
import { BOOKING_DRAFT_STORAGE_KEY } from "@/store/bookingStore";
import { ListingCard } from "@/components/ListingCard";
import { cn } from "@/lib/utils";

const amenities = [
  { icon: Wifi, label: "Fast Wi-Fi" },
  { icon: Car, label: "Free parking" },
  { icon: Coffee, label: "Breakfast included" },
  { icon: Trees, label: "Garden & deck" },
  { icon: Waves, label: "Plunge pool" },
  { icon: ShieldCheck, label: "24/7 security" },
];

const whyBookUs = [
  { 
    icon: ShieldCheck, 
    title: "Secure Bookings", 
    description: "Verified Zambian hosts and 24/7 support for peace of mind." 
  },
  { 
    icon: Zap, 
    title: "Instant Confirmation", 
    description: "No more waiting. Get your booking confirmation in seconds." 
  },
  { 
    icon: Award, 
    title: "Local Expertise", 
    description: "Hand-picked gems curated by experts who know Zambia best." 
  },
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

  // Gallery Images List
  const galleryImages = useMemo(() => [
    stay.image,
    listings[(listings.indexOf(stay) + 1) % listings.length].image,
    listings[(listings.indexOf(stay) + 2) % listings.length].image,
    listings[(listings.indexOf(stay) + 3) % listings.length].image,
    listings[(listings.indexOf(stay) + 4) % listings.length].image,
  ], [stay]);

  const [mainImage, setMainImage] = useState(stay.image);

  const pricePerNight = stay.price * 18;
  const serviceFee = 450;
  const totalCost = (pricePerNight * duration) + serviceFee;

  function reserve() {
    const draft = {
      stayId: stay.id,
      stayName: stay.name,
      pricePerNight: stay.price,
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      checkOut: new Date(Date.now() + (7 + duration) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      guests: guests,
    };
    try {
      localStorage.setItem(BOOKING_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* noop */
    }
    router.push("/booking");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar className="bg-[#F5F3FF] border-purple-100" />
      
      <header className="bg-[#F5F3FF] border-b border-purple-100 pt-10 pb-20">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-8 hover:opacity-70 transition-all"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-4 max-w-4xl">
              <Badge className="bg-white text-primary border border-purple-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter w-fit">
                <Award className="h-3 w-3 mr-1.5" /> Zambian Superhost
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground font-display leading-[0.95]">
                {stay.name}
              </h1>
              
              <div className="flex items-center gap-2 text-base font-bold text-primary/80">
                <MapPin className="h-5 w-5" />
                <span className="underline decoration-primary/20 underline-offset-8">{stay.location}, Zambia</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className={cn(
                    "rounded-full h-14 w-14 border-purple-200 bg-white shadow-sm transition-all",
                    saved ? "text-primary border-primary bg-primary/5" : "text-muted-foreground"
                )}
                onClick={() => setSaved((s) => !s)}
              >
                <Heart className={cn("h-5 w-5", saved && "fill-primary")} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 md:px-6 -mt-12 relative z-10 pb-20">
        {/* Gallery Section - Centralized */}
        <div className="space-y-6">
          <div className="aspect-[16/9] w-full relative overflow-hidden rounded-[1.25rem] shadow-2xl bg-white p-2 border border-purple-100">
            <img
              src={mainImage}
              alt={stay.name}
              key={mainImage}
              className="object-cover w-full h-full rounded-[1rem] transition-all duration-700 animate-in fade-in zoom-in-95"
            />
          </div>
          
          <div className="flex items-center justify-center gap-4 overflow-x-auto pb-2 no-scrollbar">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setMainImage(img)}
                className={cn(
                  "relative h-20 w-32 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ring-primary/40",
                  mainImage === img ? "ring-4 scale-[0.95] opacity-100" : "opacity-60 hover:opacity-100 hover:ring-2"
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 space-y-16">
          {/* 1. Narrative */}
          <section className="bg-white p-10 rounded-[1.25rem] border border-border/40 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-3xl font-black tracking-tight mb-6 font-display text-primary">The Narrative</h2>
            <div className="prose prose-lg text-muted-foreground/90 font-medium leading-relaxed max-w-none">
              <p className="text-foreground font-bold text-xl leading-snug mb-4">
                {stay.description}
              </p>
              <p>
                Experience the true essence of Zambian hospitality in this meticulously crafted space. Every corner tells a story of local craft and modern luxury, designed for those who seek more than just a place to sleep.
              </p>
            </div>
          </section>

          {/* 2. Host Profile */}
          <section className="bg-white p-10 rounded-[1.25rem] border border-border/40 shadow-sm flex items-center gap-8 max-w-4xl mx-auto">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-primary/5">
                <AvatarFallback className="bg-primary text-primary-foreground font-black text-3xl">CH</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md">
                <Verified className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight font-display text-primary">Chanda Mwenya</h2>
              <p className="text-base font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Lusaka, Zambia
              </p>
            </div>
          </section>

          {/* 3. The Essentials - Now back in the flow */}
          <section className="bg-white p-10 rounded-[1.25rem] border border-border/40 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-xl font-black tracking-tight mb-10 uppercase tracking-widest text-primary/60 font-display">The Essentials</h2>
            <div className="grid grid-cols-2 gap-y-10 gap-x-8">
              {amenities.map((a) => (
                <div key={a.label} className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white">
                      <a.icon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-black text-foreground uppercase tracking-tight">{a.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Booking Card */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-none shadow-3xl rounded-[2rem] overflow-hidden bg-white border border-purple-100 ring-1 ring-primary/5 relative">
                <div className="absolute top-0 right-0 p-6">
                    <Badge className="bg-primary text-white font-black px-3 py-1 text-[10px] uppercase tracking-widest rounded-full">Best Value</Badge>
                </div>
                
                <CardContent className="p-10">
                  <div className="mb-10">
                    <p className="text-[12px] font-black text-primary uppercase tracking-[0.2em] mb-2">Standard Rate</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tighter font-display text-primary">ZMW {pricePerNight}</span>
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">/ night</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 rounded-[1.5rem] bg-purple-50/50 border border-purple-100/50">
                        <div className="flex items-center justify-between mb-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-primary/60">Stay Duration</Label>
                            <span className="text-sm font-black text-primary">{duration} Nights</span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-2xl p-2 border border-purple-100 shadow-sm">
                            <button 
                                onClick={() => setDuration(Math.max(1, duration - 1))}
                                className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                            >
                                <Minus className="h-5 w-5" />
                            </button>
                            <span className="text-xl font-black font-display text-primary">{duration}</span>
                            <button 
                                onClick={() => setDuration(duration + 1)}
                                className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-[#FAFBFC] border border-border/40">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Check-In</p>
                            <p className="text-sm font-black">Oct 12, 2026</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-[#FAFBFC] border border-border/40">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Guests</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-black">{guests} People</span>
                                <div className="flex gap-1">
                                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="text-primary hover:opacity-50"><Minus className="h-3 w-3" /></button>
                                    <button onClick={() => setGuests(guests + 1)} className="text-primary hover:opacity-50"><Plus className="h-3 w-3" /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-purple-100">
                        <div className="flex justify-between text-sm font-bold text-muted-foreground">
                            <span>ZMW {pricePerNight} × {duration} nights</span>
                            <span className="text-foreground">ZMW {pricePerNight * duration}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-muted-foreground">
                            <span>Service Fee</span>
                            <span className="text-foreground">ZMW {serviceFee}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-purple-100">
                            <span className="text-lg font-black text-primary uppercase tracking-wider">Total</span>
                            <span className="text-3xl font-black text-primary font-display">ZMW {totalCost}</span>
                        </div>
                    </div>

                    <Button 
                        className="w-full h-16 text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] uppercase tracking-widest mt-4" 
                        onClick={reserve}
                    >
                        Reserve Now
                    </Button>
                  </div>
                </CardContent>
            </Card>
          </div>

          {/* 5. The Nearby Guarantee - Now just above the footer */}
          <section className="bg-white p-12 rounded-[1.25rem] border border-border/40 shadow-sm relative overflow-hidden group max-w-5xl mx-auto">
             <h2 className="text-xl font-black tracking-tight mb-12 uppercase tracking-[0.3em] text-center text-primary/40">The Nearby Guarantee</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {whyBookUs.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center space-y-6">
                      <div className="h-16 w-16 rounded-2xl bg-primary text-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                         <item.icon className="h-8 w-8" strokeWidth={2.5} />
                      </div>
                      <div>
                          <h3 className="font-black text-primary tracking-tight text-lg mb-2 font-display">{item.title}</h3>
                          <p className="text-xs font-bold text-primary/60 leading-relaxed uppercase tracking-wider max-w-[200px]">{item.description}</p>
                      </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Similar Explorations */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black tracking-tight font-display text-primary">Similar Explorations</h2>
            <Button variant="ghost" className="font-black text-primary hover:bg-primary/5 rounded-xl" asChild>
                <Link href="/accommodations">View All Stays</Link>
            </Button>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
