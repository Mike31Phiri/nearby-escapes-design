"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, LayoutDashboard, Eye, Share2, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ListingSuccessPage() {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 py-20">
        <div className="w-full max-w-2xl text-center space-y-12 animate-in fade-in zoom-in duration-700">
          <div className="space-y-4">
             <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto relative">
                <CheckCircle2 className="h-12 w-12 text-primary" />
                <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-accent animate-pulse" />
             </div>
             <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Your escape is live!</h1>
             <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
                Congratulations! &quot;Modern Riverside Villa&quot; is now visible to thousands of travelers on Nearby Escapes.
             </p>
          </div>

          <Card className="border-border/60 shadow-2xl rounded-[40px] overflow-hidden bg-card group transition-all duration-500 hover:shadow-primary/5">
             <CardContent className="p-0">
                <div className="h-56 relative">
                   <img src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&fit=crop&w=800&h=400" alt="Listing" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                   <div className="absolute bottom-6 left-8 text-white text-left">
                      <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">New Listing</p>
                      <h3 className="text-2xl font-bold">Modern Riverside Villa</h3>
                   </div>
                </div>
                <div className="p-8 flex items-center justify-between gap-6">
                   <div className="flex items-center gap-6">
                      <div className="text-left">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
                         <p className="text-emerald-600 font-bold flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Active</p>
                      </div>
                      <div className="text-left">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Visibility</p>
                         <p className="font-bold">Public</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2"><Share2 className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2"><Eye className="h-4 w-4" /></Button>
                   </div>
                </div>
             </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/host/dashboard" className="w-full sm:w-auto">
                <Button className="w-full h-14 rounded-2xl px-12 bg-primary font-extrabold text-lg shadow-xl flex items-center gap-2">
                   <LayoutDashboard className="h-5 w-5" /> Go to Dashboard
                </Button>
             </Link>
             <Link href="/host/create-listing" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full h-14 rounded-2xl px-12 border-2 font-extrabold text-lg flex items-center gap-2">
                   <Plus className="h-5 w-5" /> Create Another
                </Button>
             </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
