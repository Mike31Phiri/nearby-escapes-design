"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus, Clock, MapPin, ArrowRight, Users, ChevronRight, Zap, ShieldCheck, Ticket } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const routes = [
  {
    id: "lsk-liv",
    from: "Lusaka",
    to: "Livingstone",
    duration: "6h 30m",
    price: 180,
    operator: "Mazhandu Family Bus",
    departures: ["06:00", "08:30", "12:00", "16:00"],
    seats: 14,
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "lsk-kit",
    from: "Lusaka",
    to: "Kitwe",
    duration: "7h",
    price: 200,
    operator: "Power Tools Bus",
    departures: ["07:00", "10:00", "15:00"],
    seats: 8,
    image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "lsk-chip",
    from: "Lusaka",
    to: "Chipata",
    duration: "5h 45m",
    price: 160,
    operator: "Jonda Bus Services",
    departures: ["06:30", "13:00"],
    seats: 22,
    image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "lsk-mfu",
    from: "Lusaka",
    to: "Mfuwe",
    duration: "8h",
    price: 250,
    operator: "Kobs Transport",
    departures: ["05:00"],
    seats: 5,
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
];

export default function BusBookingPage() {
  const [allRoutes, setAllRoutes] = useState(routes);

  useEffect(() => {
    try {
      const mock = JSON.parse(localStorage.getItem("mock_host_listings") || "[]");
      const transportMocks = mock.filter((m: any) => m.category === 'transport').map((m: any) => ({
        id: m.id,
        from: m.name || m.title || "Custom",
        to: m.location || "Location",
        duration: "Flexible",
        price: m.price || 0,
        operator: "Custom Host",
        departures: ["Flexible"],
        seats: 4,
        image: m.image
      }));
      if (transportMocks.length > 0) {
        setAllRoutes(prev => [...transportMocks, ...prev]);
      }
    } catch(e) {}
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar className="bg-[#F5F3FF] border-purple-100" />
      
      <main className="flex-1">
        {/* Editorial Hero */}
        <section className="bg-[#F5F3FF] border-b border-purple-100 pt-16 pb-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="max-w-3xl space-y-6">
              <Badge className="bg-white text-primary border-purple-100 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Bus className="h-3 w-3 mr-2" /> Intercity Transport
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground font-display leading-[0.9]">
                Connecting Zambia, <br /><span className="text-primary/40">one route at a time.</span>
              </h1>
              <p className="text-lg font-bold text-primary/60 max-w-xl leading-relaxed uppercase tracking-tight">
                Trusted operators. Instant confirmation. Travel comfortably across the heart of Africa.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar (Visual only for now) */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 -mt-10 relative z-10">
            <div className="bg-white rounded-[1.5rem] shadow-2xl p-4 border border-purple-100 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <input type="text" placeholder="Where from?" className="bg-transparent outline-none font-bold text-sm w-full" />
                </div>
                <div className="flex-1 w-full p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <input type="text" placeholder="Where to?" className="bg-transparent outline-none font-bold text-sm w-full" />
                </div>
                <Button className="w-full md:w-auto h-14 px-10 rounded-xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    Find Routes
                </Button>
            </div>
        </div>

        {/* Routes Grid */}
        <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-primary font-display">Popular Connections</h2>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-2">Daily departures across the country</p>
            </div>
            <span className="hidden md:block text-xs font-black uppercase tracking-[0.2em] text-primary/30">{allRoutes.length} verified routes</span>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2">
            {allRoutes.map((route) => (
              <Card key={route.id} className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white border border-purple-50 group">
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="relative h-56 sm:w-64 overflow-hidden shrink-0">
                    <img src={route.image} alt="" className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-white/95 text-primary border-0 backdrop-blur-md font-black text-[10px] uppercase tracking-tighter shadow-sm px-3 py-1">
                            {route.operator.split(' ')[0]}
                        </Badge>
                    </div>
                  </div>
                  <CardContent className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Available Today</p>
                        </div>
                        <p className="text-2xl font-black text-primary font-display">ZMW {route.price}</p>
                      </div>
                      
                      <h3 className="text-3xl font-black tracking-tighter font-display text-primary leading-none">
                        {route.from} <span className="text-primary/20">→</span> {route.to}
                      </h3>
                      
                      <div className="mt-6 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary/40" /> {route.duration}
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary/40" /> {route.seats} Seats
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                        <Button className="flex-1 h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 text-[10px]">
                            Book Escape
                        </Button>
                        <Button variant="outline" className="h-12 w-12 rounded-xl border-2 border-purple-100 text-primary p-0 flex items-center justify-center hover:bg-primary/5">
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Book Transport Section */}
        <section className="bg-white py-24 border-y border-purple-100">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="space-y-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                            <Zap className="h-7 w-7" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-black tracking-tight font-display text-primary">Instant Ticketing</h3>
                        <p className="text-sm font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">No more bus station queues. Receive your e-ticket instantly via WhatsApp and Email.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                            <ShieldCheck className="h-7 w-7" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-black tracking-tight font-display text-primary">Verified Operators</h3>
                        <p className="text-sm font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">We only partner with Zambia's most reliable and safety-conscious bus companies.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                            <Ticket className="h-7 w-7" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-black tracking-tight font-display text-primary">Secure Payments</h3>
                        <p className="text-sm font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">Pay securely using Mobile Money or Cards with our enterprise-grade security.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
