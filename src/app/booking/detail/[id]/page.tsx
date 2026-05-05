"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, MapPin, Calendar, Users, 
  MessageCircle, Phone, Printer, Download,
  Star, ShieldCheck, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BookingDetailPage() {
  const params = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <Link 
              href="/account/bookings" 
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to bookings
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">Booking Details</h1>
            <p className="text-muted-foreground">Reference: NE-84291-ZX • Booked on May 2, 2024</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 font-bold text-sm">Confirmed</Badge>
            <Button variant="outline" size="icon" className="rounded-xl border-border/60"><Printer className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="rounded-xl border-border/60"><Download className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <Card className="border-border/60 overflow-hidden rounded-[32px] shadow-sm">
              <div className="h-64 relative">
                <img src="https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=1200&h=400" alt="Listing" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-8 text-white">
                  <h2 className="text-2xl font-bold">Victoria Falls Waterfront Lodge</h2>
                  <p className="flex items-center gap-1.5 opacity-90 font-medium mt-1"><MapPin className="h-4 w-4" /> Livingstone, Zambia</p>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest mb-1">Check-in</p>
                    <p className="font-bold">May 15, 2024</p>
                    <p className="text-xs text-muted-foreground">From 2:00 PM</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest mb-1">Check-out</p>
                    <p className="font-bold">May 20, 2024</p>
                    <p className="text-xs text-muted-foreground">Before 11:00 AM</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest mb-1">Guests</p>
                    <p className="font-bold">2 Adults</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest mb-1">Duration</p>
                    <p className="font-bold">5 Nights</p>
                  </div>
                </div>

                <div className="mt-10 pt-10 border-t border-border/40">
                  <h3 className="font-bold mb-4">Location & Directions</h3>
                  <div className="bg-muted/30 rounded-2xl p-6 border border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <p className="text-sm font-medium">Sichango Road, Livingstone, Zambia</p>
                      <button className="text-primary text-xs font-bold flex items-center gap-1 mt-2 hover:underline">
                        View on Google Maps <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                    <Button variant="secondary" className="rounded-xl font-bold bg-white shadow-sm">Get Directions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-lg">Leave a review</h3>
                <p className="text-sm text-muted-foreground mt-1">Share your experience to help others find the perfect escape.</p>
              </div>
              <Link href="/booking/review/1">
                <Button className="rounded-xl font-bold bg-primary text-white h-12 px-8 shadow-lg">Write a Review</Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="border-border/60 shadow-lg rounded-[32px] p-8">
              <h3 className="font-bold mb-6">Payment Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Standard Rate</span>
                  <span>ZMW 4,250.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Fee</span>
                  <span>ZMW 245.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tourism Levy</span>
                  <span>ZMW 150.00</span>
                </div>
                <div className="flex justify-between font-extrabold text-lg pt-4 border-t border-border/40 text-foreground">
                  <span>Total Paid</span>
                  <span>ZMW 4,645.00</span>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-border/40">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="text-[10px]">
                    <p className="font-bold text-emerald-800 uppercase tracking-widest">Payment Status</p>
                    <p className="text-emerald-700 font-medium">Fully Paid via Visa</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-border/60 shadow-lg rounded-[32px] p-8">
              <h3 className="font-bold mb-6">Host Information</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-primary/20">
                  <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=100&h=100" alt="Host" />
                </div>
                <div>
                  <h4 className="font-bold">Bwalya Mwine</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" /> Superhost</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button variant="outline" className="w-full rounded-xl font-bold flex items-center gap-2 h-12">
                  <MessageCircle className="h-4 w-4" /> Message Host
                </Button>
                <Button variant="outline" className="w-full rounded-xl font-bold flex items-center gap-2 h-12">
                  <Phone className="h-4 w-4" /> Call Host
                </Button>
              </div>
              <Link href="/booking/cancel/1" className="block text-center mt-6 text-xs font-bold text-red-500 hover:underline">
                Cancel booking
              </Link>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
