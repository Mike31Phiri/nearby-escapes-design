"use client";

import Link from "next/link";
import { MapPin, Star, Clock, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { packages } from "@/lib/mock-data";

export function PackagesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar />
      <main className="flex-1">
        <header className="relative h-[400px] sm:h-[500px] overflow-hidden">
          <img 
            src="/images/hero-zambia.jpg" 
            alt="Curated Packages" 
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="relative mx-auto max-w-7xl h-full px-4 md:px-6 flex flex-col justify-end pb-16 text-white animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Badge className="self-start bg-primary text-white font-black uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full mb-4">
              All-Inclusive
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight font-display leading-tight">Curated Packages</h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/90 font-medium leading-relaxed">
              Experience the best of Zambia with our expertly crafted, all-inclusive travel packages.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Our Best Deals</h2>
              <p className="text-muted-foreground mt-2 font-medium">Hand-picked experiences for every type of traveler.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full font-bold border-border/60">
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
              </Button>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Link key={pkg.id} href={`/packages/${pkg.id}`} className="group">
                <Card className="overflow-hidden border-border/60 bg-white rounded-[32px] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/95 text-primary backdrop-blur-md border-none font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                        {pkg.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xl font-black tracking-tight mb-1 group-hover:text-primary transition-colors">{pkg.name}</p>
                        <p className="text-[10px] font-black text-muted-foreground flex items-center gap-1.5 uppercase tracking-widest">
                          <MapPin className="h-4 w-4 text-primary" /> {pkg.location}
                        </p>
                      </div>
                      <span className="shrink-0 flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-black">
                        <Star className="h-3.5 w-3.5 fill-accent" />
                        {pkg.rating}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground font-medium line-clamp-2 mb-6 flex-1">
                      {pkg.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-border/40">
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Starting from</p>
                        <p className="text-2xl font-black text-primary">
                          ${pkg.price}
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">/ person</span>
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-full h-12 w-12 p-0 text-primary hover:bg-primary/5 transition-all group-hover:translate-x-1">
                        <ArrowRight className="h-6 w-6" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
