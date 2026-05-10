"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Clock, Star, Users, Check,
  Info, ShieldCheck, ArrowRight,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { mockExperiences } from "@/lib/mock-data";
import { useBookingStore } from "@/store/bookingStore";

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const experience = mockExperiences.find((e) => e.id === id) || mockExperiences[0];

  const [date, setDate] = useState("2024-05-15");
  const [guests, setGuests] = useState(1);
  const { setPackageDetails } = useBookingStore();

  const handleBook = () => {
    const subtotal = experience.price * guests;
    const serviceFee = Math.round(subtotal * 0.1);
    const taxes = Math.round(subtotal * 0.05);

    setPackageDetails({
      packageId: experience.id,
      packageName: experience.name,
      packageImage: experience.image,
      travelDate: new Date(date),
      guests,
      pricePerPerson: experience.price,
      duration: experience.duration,
      location: experience.location,
      subtotal,
      serviceFee,
      taxes,
      total: subtotal + serviceFee + taxes,
    });
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 md:px-6 pt-8 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-none font-bold px-3 py-1">Experience</Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display">{experience.name}</h1>
                <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {experience.location}</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {experience.duration}</div>
                  <div className="flex items-center gap-2 text-foreground"><Star className="h-4 w-4 fill-accent text-accent" /> {experience.rating} ({experience.reviews} reviews)</div>
                </div>
              </div>

              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-border/50 shadow-xl">
                <img 
                  src={experience.image} 
                  alt={experience.name} 
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-6 pt-6 border-t border-border/50">
                <h3 className="text-2xl font-bold font-display">What you'll do</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {experience.description}
                </p>
              </div>

              <div className="space-y-6 pt-6 border-t border-border/50">
                <h3 className="text-2xl font-bold font-display">What's included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experience.includes.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="font-medium text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-32 border-border/60 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Price per person</p>
                      <span className="text-3xl font-extrabold text-foreground">ZMW {experience.price}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold uppercase text-muted-foreground px-1">Date</label>
                      <input 
                        type="date" 
                        className="w-full bg-muted/50 border border-border/60 rounded-xl px-4 py-3 font-bold focus:outline-none" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold uppercase text-muted-foreground px-1">Guests</label>
                      <div className="flex items-center justify-between bg-muted/50 border border-border/60 rounded-xl px-4 py-3">
                        <span className="font-bold">{guests} {guests > 1 ? "Guests" : "Guest"}</span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center font-bold"
                          >-</button>
                          <span className="font-bold">{guests}</span>
                          <button 
                            onClick={() => setGuests(guests + 1)}
                            className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center font-bold"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleBook}
                    className="w-full h-14 rounded-2xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-lg font-extrabold text-lg flex items-center justify-center gap-2"
                  >
                    Reserve Experience <ArrowRight className="h-5 w-5" />
                  </Button>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5"><ShieldCheck className="h-3 w-3 text-emerald-600" /></div>
                      <div>
                        <p className="text-xs font-bold">Secure Payment</p>
                        <p className="text-[10px] text-muted-foreground">Your booking is protected by Nearby Escapes Guarantee.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
