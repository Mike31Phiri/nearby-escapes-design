"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Calendar, MapPin, Printer, Download, ArrowRight, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function BookingSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#0f766e", "#2dd4bf", "#5eead4"]
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Booking Confirmed!</h1>
          <p className="text-muted-foreground text-lg">Your escape is locked in. Get ready for an amazing trip!</p>
          <p className="text-sm font-bold text-primary mt-2 uppercase tracking-widest">Booking ID: NE-84291-ZX</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="md:col-span-2 border-border/60 shadow-xl rounded-[32px] overflow-hidden">
            <CardContent className="p-0">
              <div className="h-48 md:h-64 relative">
                <img src="https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=1200&h=400" alt="Stay" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-2xl font-bold">Victoria Falls Waterfront Lodge</h2>
                  <p className="flex items-center gap-1.5 opacity-90 font-medium mt-1"><MapPin className="h-4 w-4" /> Livingstone, Zambia</p>
                </div>
              </div>
              <div className="p-8 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Check-in</p>
                  <p className="font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> May 15, 2024</p>
                  <p className="text-sm text-muted-foreground mt-1">From 2:00 PM</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Check-out</p>
                  <p className="font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> May 20, 2024</p>
                  <p className="text-sm text-muted-foreground mt-1">Before 11:00 AM</p>
                </div>
                <div className="col-span-2 pt-6 border-t border-border/40">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Paid</p>
                  <p className="text-2xl font-extrabold text-foreground">ZMW 4,645.00</p>
                  <p className="text-xs text-muted-foreground mt-1">Receipt sent to john@example.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/60 shadow-lg rounded-[32px] p-6 bg-primary/5 border-primary/10">
              <h3 className="font-bold mb-4">What&apos;s next?</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
                  <p className="text-muted-foreground">The host will reach out with check-in instructions.</p>
                </li>
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
                  <p className="text-muted-foreground">View your booking details and manage your trip in your account.</p>
                </li>
                <li className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold mt-0.5">3</div>
                  <p className="text-muted-foreground">Download the Nearby Escapes app for offline itinerary access.</p>
                </li>
              </ul>
            </Card>
            
            <div className="flex flex-col gap-3">
              <Link href="/checkout/receipt" className="block w-full">
                <Button variant="outline" className="w-full h-12 rounded-2xl border-2 font-bold flex items-center gap-2">
                  <Download className="h-4 w-4" /> Download Receipt
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-12 rounded-2xl border-2 font-bold flex items-center gap-2">
                <Printer className="h-4 w-4" /> Print Booking
              </Button>
              <Button variant="outline" className="w-full h-12 rounded-2xl border-2 font-bold flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Share Itinerary
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/account/bookings" className="w-full sm:w-auto">
            <Button className="w-full h-14 rounded-2xl px-12 bg-primary font-extrabold text-lg shadow-xl">
              View My Bookings
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full h-14 rounded-2xl px-12 border-2 font-extrabold text-lg flex items-center gap-2">
              Browse more <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
