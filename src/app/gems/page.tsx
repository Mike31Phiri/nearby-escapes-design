"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Compass, ArrowRight, Gem, Trees, Waves, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const metadata = { title: "Hidden Gems — Nearby Escapes" };

const gems = [
  {
    id: "mutinondo",
    name: "Mutinondo Wilderness",
    location: "Mpika",
    tagline: "Granite domes, black water streams and zero crowds.",
    category: "Nature Reserve",
    rating: 5.0,
    image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "chisimba",
    name: "Chisimba Falls",
    location: "Kasama",
    tagline: "Three sacred waterfalls hidden in miombo woodland.",
    category: "Waterfall",
    rating: 4.7,
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "shiwa-ngandu",
    name: "Shiwa Ng'andu",
    location: "Mpika",
    tagline: "Africa's most romantic manor house, set in wild bush.",
    category: "Heritage",
    rating: 4.8,
    image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "ntumbachushi",
    name: "Ntumbachushi Falls",
    location: "Kawambwa",
    tagline: "Twin falls that few tourists ever find.",
    category: "Waterfall",
    rating: 4.6,
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "samfya-beach",
    name: "Samfya Beach",
    location: "Lake Bangweulu",
    tagline: "Freshwater beach with powder-white sand.",
    category: "Beach",
    rating: 4.9,
    image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
];

export default function GemsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar className="bg-[#F5F3FF] border-purple-100" />
      
      <main className="flex-1">
        {/* Editorial Hero */}
        <section className="bg-[#F5F3FF] border-b border-purple-100 pt-16 pb-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="max-w-3xl space-y-6">
              <Badge className="bg-white text-primary border-purple-100 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Gem className="h-3 w-3 mr-2" /> Curated Collection
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground font-display leading-[0.9]">
                Places most <br /><span className="text-primary/40">never find.</span>
              </h1>
              <p className="text-lg font-bold text-primary/60 max-w-xl leading-relaxed uppercase tracking-tight">
                Offbeat Zambia. Secret waterfalls, empty beaches, and wilderness retreats only locals know.
              </p>
            </div>
          </div>
        </section>

        {/* Gems Masonry-like Grid */}
        <section className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 items-start">
            {gems.map((gem, idx) => (
              <Card 
                key={gem.id} 
                className={cn(
                    "border-none shadow-none bg-transparent group cursor-pointer",
                    idx % 2 === 1 ? "md:mt-12" : ""
                )}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-2xl mb-8 border-4 border-white ring-1 ring-purple-100">
                  <img src={gem.image} alt="" className="h-full w-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute top-6 right-6">
                      <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                          <Compass className="h-5 w-5" />
                      </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8">
                      <Badge className="bg-white text-primary border-0 font-black text-[10px] uppercase tracking-widest mb-3">
                          {gem.category}
                      </Badge>
                      <h3 className="text-3xl font-black text-white font-display leading-tight">{gem.name}</h3>
                      <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                          <MapPin className="h-3 w-3" /> {gem.location}
                      </p>
                  </div>
                </div>

                <div className="px-4 space-y-4">
                  <p className="text-lg font-bold text-primary/80 leading-relaxed font-display">
                    "{gem.tagline}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-purple-100">
                      <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-primary fill-primary" />
                          <span className="text-sm font-black text-primary">{gem.rating}</span>
                      </div>
                      <Button variant="link" className="p-0 h-auto text-xs font-black uppercase tracking-[0.2em] text-primary group-hover:translate-x-2 transition-transform">
                          Read Story <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* The Gem Philosophy */}
        <section className="bg-white py-32 border-t border-purple-100">
            <div className="mx-auto max-w-3xl px-4 md:px-6 text-center space-y-8">
                <h2 className="text-4xl font-black tracking-tight font-display text-primary">The Philosophy of Discovery</h2>
                <p className="text-xl font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">
                    We believe the most transformative journeys happen away from the crowds. Our "Gems" collection is a hand-picked directory of Zambia's most soulful, untouched destinations. No tourists, just truth.
                </p>
                <div className="flex justify-center gap-12 pt-8">
                    <div className="flex flex-col items-center gap-3">
                        <Trees className="h-8 w-8 text-primary/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Wilderness</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <Waves className="h-8 w-8 text-primary/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Waterfalls</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <Map className="h-8 w-8 text-primary/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Exploration</span>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
