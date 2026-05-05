"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, MapPin, Clock, Calendar, 
  Hotel, Bus, Gem, Star, 
  ArrowRight, CheckCircle2, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PackageDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const itinerary = [
    { day: 1, title: "Arrival & Sunset Cruise", desc: "Arrive in Livingstone and check into your luxury lodge. Enjoy a relaxed afternoon followed by a breathtaking Zambezi sunset cruise." },
    { day: 2, title: "Victoria Falls Tour", desc: "A guided walking tour of the Victoria Falls, followed by an optional helicopter flight over the falls (Flight of Angels)." },
    { day: 3, title: "Chobe Day Trip", desc: "Cross the border into Botswana for a full day safari in Chobe National Park, including a boat cruise and a game drive." },
    { day: 4, title: "Departure", desc: "Enjoy a final Zambian breakfast before your transfer to the airport for your flight home." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 md:px-6 pt-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-100 text-indigo-700 border-none font-bold px-3 py-1">Featured Package</Badge>
                  <Badge variant="outline" className="rounded-full gap-1 border-indigo-200 text-indigo-700"><Package className="h-3 w-3" /> All-Inclusive</Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">The Ultimate Victoria Falls & Safari Escape</h1>
                <div className="flex items-center gap-4 text-sm font-bold">
                  <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-muted-foreground" /> Livingstone & Chobe</div>
                  <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-muted-foreground" /> 4 Days / 3 Nights</div>
                  <div className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-accent text-accent border-none" /> 4.9 (156 reviews)</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[400px]">
                <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-lg">
                  <img src="https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=800&h=600" className="h-full w-full object-cover" />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg">
                  <img src="https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=300" className="h-full w-full object-cover" />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg relative">
                  <img src="https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=400&h=300" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">+8</div>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight">Package Components</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-border/60 bg-muted/20 rounded-2xl p-6">
                    <Hotel className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-bold">Accommodation</h3>
                    <p className="text-xs text-muted-foreground mt-2">3 Nights at Royal Livingstone Hotel</p>
                  </Card>
                  <Card className="border-border/60 bg-muted/20 rounded-2xl p-6">
                    <Bus className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-bold">Transport</h3>
                    <p className="text-xs text-muted-foreground mt-2">All airport & activity transfers included</p>
                  </Card>
                  <Card className="border-border/60 bg-muted/20 rounded-2xl p-6">
                    <Gem className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-bold">Experiences</h3>
                    <p className="text-xs text-muted-foreground mt-2">Sunset cruise, Falls tour, Chobe safari</p>
                  </Card>
                </div>
              </div>

              <div className="space-y-8 border-t border-border/50 pt-10">
                <h2 className="text-2xl font-bold tracking-tight">Itinerary Breakdown</h2>
                <div className="space-y-4">
                  {itinerary.map((item) => (
                    <div key={item.day} className="group bg-muted/20 border border-border/40 rounded-2xl p-6 hover:bg-muted/40 transition-all cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {item.day}
                          </div>
                          <h3 className="font-bold text-lg">{item.title}</h3>
                        </div>
                        <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="mt-4 text-muted-foreground leading-relaxed pl-14">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-32 border-border/60 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <CardContent className="p-8">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Package Price</p>
                      <span className="text-3xl font-extrabold text-foreground">ZMW 8,500</span>
                      <span className="text-muted-foreground"> / person</span>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="font-bold">2 Persons</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Travel Date</span>
                      <span className="font-bold">Choose Date</span>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-2xl border border-border/60">
                      <p className="text-[10px] font-extrabold uppercase text-muted-foreground mb-2">Package Savings</p>
                      <p className="text-sm font-bold text-emerald-600">Save ZMW 1,200 vs booking separately</p>
                    </div>
                  </div>

                  <Link href="/checkout/summary">
                    <Button className="w-full h-14 rounded-2xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-lg font-extrabold text-lg">
                      Book Full Package
                    </Button>
                  </Link>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <p className="text-xs font-medium text-muted-foreground">Zero hidden booking fees</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <p className="text-xs font-medium text-muted-foreground">Dedicated travel assistant</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <p className="text-xs font-medium text-muted-foreground">Complimentary travel insurance</p>
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
