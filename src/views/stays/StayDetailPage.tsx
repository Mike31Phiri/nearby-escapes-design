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
  ChevronRight,
  Check,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getListing, listings } from "@/lib/mock-data";
import { BOOKING_DRAFT_STORAGE_KEY } from "@/store/bookingStore";
import { ListingCard } from "@/components/ListingCard";

const amenities = [
  { icon: Wifi, label: "Fast Wi-Fi" },
  { icon: Car, label: "Free parking" },
  { icon: Coffee, label: "Breakfast included" },
  { icon: Trees, label: "Garden & deck" },
  { icon: Waves, label: "Plunge pool" },
  { icon: ShieldCheck, label: "24/7 security" },
];

const reviews = [
  {
    id: "r1",
    from: "Bwalya K.",
    rating: 5,
    text: "Spectacular setting. The host arranged a sunrise hike that made the trip.",
    date: "Mar 2026",
  },
  {
    id: "r2",
    from: "Joyce S.",
    rating: 5,
    text: "Quiet, comfortable and impeccably clean. We didn't want to leave.",
    date: "Feb 2026",
  },
  {
    id: "r3",
    from: "Mulenga P.",
    rating: 4,
    text: "Loved everything except the slow Wi-Fi in the back room.",
    date: "Jan 2026",
  },
];

const rooms = [
  { id: "deluxe", name: "Deluxe river view", beds: "1 extra-large double bed", price: 220, sleeps: 2, features: ["River view", "Balcony", "Air conditioning"] },
  { id: "family", name: "Family suite", beds: "1 king + 2 single beds", price: 295, sleeps: 4, features: ["Private suite", "Kitchenette", "Garden view"] },
  { id: "garden", name: "Garden cabin", beds: "1 queen bed", price: 175, sleeps: 2, features: ["Patio", "Ensuite bathroom", "Free WiFi"] },
];

export function StayDetailPage() {
  const params = useParams();
  const stayId = (params.stayId as string) ?? "";
  const router = useRouter();
  const stay = getListing(stayId) ?? listings[0];
  const similar = listings.filter((l) => l.id !== stay.id).slice(0, 4);
  const [saved, setSaved] = useState(false);

  function reserve() {
    const draft = {
      stayId: stay.id,
      stayName: stay.name,
      pricePerNight: stay.price,
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      guests: 2,
    };
    try {
      localStorage.setItem(BOOKING_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* noop */
    }
    router.push("/booking");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
        <Link
          href="/"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2 transition-colors"
        >
          <ChevronRight className="h-4 w-4 rotate-180" /> Home
        </Link>

        {/* Header - Hybrid Styling */}
        <header className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold border-0">
                <Award className="h-3.5 w-3.5 mr-1" /> Superhost
              </Badge>
              <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-foreground font-semibold">{stay.rating}</span> ({stay.reviews} reviews)
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{stay.name}</h1>
            
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-primary" /> 
              <span className="font-medium underline decoration-border underline-offset-4 cursor-pointer hover:text-foreground transition-colors">{stay.location}, Zambia</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:pt-4">
            <div className="flex items-center gap-2 bg-primary/5 rounded-lg p-2 mr-2 border border-primary/10 hidden md:flex">
               <div className="flex flex-col items-end">
                 <span className="font-bold text-primary text-sm leading-none">Exceptional</span>
                 <span className="text-xs text-muted-foreground mt-1 leading-none">{stay.reviews} reviews</span>
               </div>
               <div className="bg-primary text-primary-foreground font-bold text-lg rounded-md px-2 py-1 flex items-center justify-center">
                 {stay.rating.toFixed(1)}
               </div>
            </div>

            <Button size="icon" variant="outline" className="rounded-full h-10 w-10">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full h-10 w-10 border-border"
              onClick={() => setSaved((s) => !s)}
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            </Button>
          </div>
        </header>

        {/* Gallery */}
        <div className="mt-6 grid gap-2 sm:grid-cols-4 sm:grid-rows-2 rounded-2xl overflow-hidden h-[300px] sm:h-[460px]">
          <img
            src={stay.image}
            alt={stay.name}
            className="object-cover w-full h-full sm:row-span-2 sm:col-span-2 transition-transform duration-700 hover:scale-[1.02] cursor-pointer"
          />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden group">
              <img
                src={listings[(listings.indexOf(stay) + i + 1) % listings.length].image}
                alt=""
                className="hidden sm:block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div className="space-y-10">
            {/* Host Info */}
            <section className="flex items-center justify-between pb-6 border-b border-border/50">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Hosted by Chanda</h2>
                <p className="text-sm text-muted-foreground mt-1">Superhost · 4 years hosting</p>
              </div>
              <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                  CH
                </AvatarFallback>
              </Avatar>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-4">About this stay</h2>
              <div className="prose prose-sm md:prose-base text-muted-foreground max-w-none">
                <p>
                  {stay.description}
                </p>
                <p>
                  A small, owner-run property with thoughtful touches — fresh
                  flowers, a stocked pantry and a host who knows the area like family.
                </p>
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-6">What this place offers</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                {amenities.map((a) => (
                  <div key={a.label} className="flex items-center gap-4">
                    <a.icon className="h-6 w-6 text-foreground/70" strokeWidth={1.5} />
                    <span className="text-[15px] text-foreground">{a.label}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-6 rounded-xl font-semibold">
                Show all amenities
              </Button>
            </section>

            <Separator className="my-8" />

            {/* Rooms Functional Table (Booking.com style) */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-6">Availability</h2>
              <div className="border border-border/80 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/50 text-foreground border-b border-border/80">
                        <th className="p-4 font-bold border-r border-border/80">Room type</th>
                        <th className="p-4 font-bold border-r border-border/80">Guests</th>
                        <th className="p-4 font-bold border-r border-border/80 w-32">Price per night</th>
                        <th className="p-4 font-bold w-32">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/80">
                      {rooms.map((r) => (
                        <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 align-top border-r border-border/80">
                            <p className="font-bold text-foreground text-[15px] underline decoration-primary/30 underline-offset-4 cursor-pointer hover:decoration-primary">{r.name}</p>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">{r.beds}</p>
                            <ul className="mt-3 space-y-1">
                              {r.features.map(f => (
                                <li key={f} className="text-xs flex items-center gap-1.5 text-foreground/80">
                                  <Check className="h-3 w-3 text-green-600" /> {f}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-4 align-top border-r border-border/80">
                            <div className="flex items-center gap-1 text-foreground/80">
                              {Array.from({ length: r.sleeps }).map((_, i) => (
                                <Users key={i} className="h-4 w-4" />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground mt-1 block">Sleeps {r.sleeps}</span>
                          </td>
                          <td className="p-4 align-top border-r border-border/80">
                            <p className="font-bold text-lg">${r.price}</p>
                            <p className="text-xs text-muted-foreground">Includes taxes</p>
                          </td>
                          <td className="p-4 align-top">
                            <Button size="sm" className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                              Select
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Reviews */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                 <Star className="h-6 w-6 fill-foreground text-foreground" />
                 <h2 className="text-2xl font-bold tracking-tight">
                   {stay.rating} · {stay.reviews} reviews
                 </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {reviews.map((r) => (
                  <div key={r.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-muted text-foreground font-semibold">{r.from[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-[15px]">{r.from}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                    </div>
                    <p className="text-[15px] leading-relaxed text-foreground/90">{r.text}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-8 rounded-xl font-semibold">
                Show all {stay.reviews} reviews
              </Button>
            </section>
          </div>

          {/* Booking Widget (Pure & Clean) */}
          <aside className="lg:sticky lg:top-28 self-start z-10">
            <Card className="border border-border shadow-xl rounded-2xl overflow-hidden bg-background">
              <CardContent className="p-6">
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-2xl font-bold">${stay.price}</span>
                  <span className="text-muted-foreground font-medium pb-1">night</span>
                </div>
                
                <div className="border border-border rounded-xl overflow-hidden mb-4">
                  <div className="flex divide-x divide-border border-b border-border">
                    <div className="flex-1 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">Check-in</p>
                      <p className="text-sm font-medium mt-0.5 text-muted-foreground">Add date</p>
                    </div>
                    <div className="flex-1 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">Checkout</p>
                      <p className="text-sm font-medium mt-0.5 text-muted-foreground">Add date</p>
                    </div>
                  </div>
                  <div className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">Guests</p>
                    <p className="text-sm font-medium mt-0.5">1 guest</p>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-[15px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-transform active:scale-[0.98]" 
                  onClick={reserve}
                >
                  Reserve
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  You won't be charged yet
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-[15px] text-foreground/90 underline decoration-border underline-offset-4 cursor-pointer hover:text-foreground hover:decoration-muted-foreground">
                    <span>${stay.price} × 5 nights</span>
                    <span className="no-underline">${stay.price * 5}</span>
                  </div>
                  <div className="flex justify-between text-[15px] text-foreground/90 underline decoration-border underline-offset-4 cursor-pointer hover:text-foreground hover:decoration-muted-foreground">
                    <span>Cleaning fee</span>
                    <span className="no-underline">$45</span>
                  </div>
                  <div className="flex justify-between text-[15px] text-foreground/90 underline decoration-border underline-offset-4 cursor-pointer hover:text-foreground hover:decoration-muted-foreground">
                    <span>Service fee</span>
                    <span className="no-underline">${Math.round(stay.price * 5 * 0.1)}</span>
                  </div>
                </div>

                <Separator className="my-5" />
                
                <div className="flex justify-between font-bold text-[15px]">
                  <span>Total before taxes</span>
                  <span>${(stay.price * 5) + 45 + Math.round(stay.price * 5 * 0.1)}</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Similar Stays */}
        <section className="mt-16 pt-10 border-t border-border/50">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Similar stays</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
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
