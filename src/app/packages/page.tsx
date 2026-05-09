"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Star, MapPin, Clock, Users, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const packages = [
  {
    id: "victoria-falls-3",
    title: "Victoria Falls Weekend",
    location: "Livingstone",
    nights: 3,
    includes: ["Accommodation", "Transport", "Falls tour", "Breakfast"],
    price: 1850,
    originalPrice: 2200,
    rating: 4.9,
    image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tag: "Best Seller",
  },
  {
    id: "south-luangwa-5",
    title: "South Luangwa Safari",
    location: "Mfuwe",
    nights: 5,
    includes: ["Tented camp", "Game drives", "All meals", "Return flights"],
    price: 4200,
    originalPrice: 5100,
    rating: 4.8,
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tag: "Premium",
  },
  {
    id: "kafue-4",
    title: "Kafue River Retreat",
    location: "Kafue NP",
    nights: 4,
    includes: ["Eco-lodge", "Boat safari", "Sunset cruise", "Meals"],
    price: 2900,
    originalPrice: 3400,
    rating: 4.7,
    image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tag: "Eco Pick",
  },
  {
    id: "lower-zambezi-6",
    title: "Lower Zambezi Explorer",
    location: "Chirundu",
    nights: 6,
    includes: ["Lodge", "Canoe safari", "Fishing", "All inclusive"],
    price: 5600,
    originalPrice: 6500,
    rating: 5.0,
    image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tag: "Luxury",
  },
];

export default function PackagesPage() {
  const [allPackages, setAllPackages] = useState(packages);

  useEffect(() => {
    try {
      const mock = JSON.parse(localStorage.getItem("mock_host_listings") || "[]");
      const packageMocks = mock.filter((m: any) => m.category === 'package').map((m: any) => ({
        id: m.id,
        title: m.name || m.title || "Custom Package",
        location: m.location || "Unknown",
        nights: 3,
        includes: ["Custom inclusions"],
        price: m.price || 0,
        originalPrice: m.price ? m.price + 500 : 0,
        rating: m.rating || 5.0,
        image: m.image,
        tag: "New"
      }));
      if (packageMocks.length > 0) {
        setAllPackages(prev => [...packageMocks, ...prev]);
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
                <Sparkles className="h-3 w-3 mr-2" /> All-Inclusive Packages
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground font-display leading-[0.9]">
                Everything in <br /><span className="text-primary/40">one booking.</span>
              </h1>
              <p className="text-lg font-bold text-primary/60 max-w-xl leading-relaxed uppercase tracking-tight">
                Stays, transport, tours and meals. Hand-crafted escapes for every type of traveler.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Package Explorer */}
        <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-primary font-display">Curated Escapes</h2>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-2">Hand-picked by our local experts</p>
            </div>
          </div>

          <div className="grid gap-16">
            {allPackages.map((pkg, idx) => (
              <div 
                key={pkg.id} 
                className={cn(
                    "flex flex-col lg:flex-row gap-12 items-center group",
                    idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                )}
              >
                {/* Visual Block */}
                <div className="flex-1 w-full relative">
                    <div className="aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-3xl border-8 border-white ring-1 ring-purple-100 relative">
                        <img src={pkg.image} alt="" className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        
                        <div className="absolute top-8 left-8">
                            <Badge className="bg-white/90 backdrop-blur-md text-primary border-0 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 shadow-xl">
                                {pkg.tag}
                            </Badge>
                        </div>

                        <div className="absolute bottom-8 left-8 flex items-center gap-2">
                             <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                                <Clock className="h-4 w-4" />
                             </div>
                             <span className="text-sm font-black text-white uppercase tracking-widest">{pkg.nights} Nights</span>
                        </div>
                    </div>
                </div>

                {/* Info Block */}
                <div className="flex-1 w-full space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                            <MapPin className="h-4 w-4" /> {pkg.location}
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black tracking-tight font-display text-primary leading-tight">
                            {pkg.title}
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4">
                        {pkg.includes.map((item) => (
                            <div key={item} className="flex items-center gap-3 text-sm font-bold text-primary/70">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="uppercase tracking-tight">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-purple-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Starting from</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-primary font-display">ZMW {pkg.price}</span>
                                <span className="text-sm font-bold text-primary/30 line-through">ZMW {pkg.originalPrice}</span>
                            </div>
                        </div>
                        <Button className="h-14 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                            View Package
                        </Button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white py-24 border-t border-purple-100">
            <div className="mx-auto max-w-7xl px-4 md:px-6 text-center">
                <h2 className="text-3xl font-black tracking-tight font-display text-primary mb-16">The Nearby Standard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="p-10 rounded-[2rem] bg-purple-50/50 border border-purple-100 space-y-4">
                        <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary mx-auto">
                            <Star className="h-6 w-6" />
                        </div>
                        <h4 className="font-black uppercase tracking-widest text-primary text-sm">Best Rate Guarantee</h4>
                        <p className="text-xs font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">We negotiate directly with lodges to get you the lowest possible package price.</p>
                    </div>
                    <div className="p-10 rounded-[2rem] bg-purple-50/50 border border-purple-100 space-y-4">
                        <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary mx-auto">
                            <Users className="h-6 w-6" />
                        </div>
                        <h4 className="font-black uppercase tracking-widest text-primary text-sm">Expert Planning</h4>
                        <p className="text-xs font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">Every package is designed by Zambian travel experts who have visited every spot.</p>
                    </div>
                    <div className="p-10 rounded-[2rem] bg-purple-50/50 border border-purple-100 space-y-4">
                        <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary mx-auto">
                            <Package className="h-6 w-6" />
                        </div>
                        <h4 className="font-black uppercase tracking-widest text-primary text-sm">Hassle-Free</h4>
                        <p className="text-xs font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">One booking, one payment, one point of contact for your entire Zambian journey.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
