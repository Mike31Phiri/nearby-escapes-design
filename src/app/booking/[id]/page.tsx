"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Users, Star, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { listings } from "@/lib/mock-data";

export default function BookingPage() {
  const params = useParams();
  const id = params.id as string;
  const listing = listings.find(l => l.id === id) || listings[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10">
        <Link 
          href={`/listings/stays/${listing.id}`} 
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listing
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-10">Request to book</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            {/* Dates & Guests */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Your trip</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Dates</h3>
                    <p className="text-muted-foreground text-sm">May 15 – 20, 2024</p>
                  </div>
                  <button className="text-sm font-bold underline hover:no-underline">Edit</button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Guests</h3>
                    <p className="text-muted-foreground text-sm">2 guests</p>
                  </div>
                  <button className="text-sm font-bold underline hover:no-underline">Edit</button>
                </div>
              </div>
            </section>

            {/* Travel Insurance */}
            <section className="bg-muted/30 p-8 rounded-3xl border border-border/40">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold tracking-tight">Protect your trip</h2>
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Get peace of mind for your trip. Coverage includes trip cancellation, medical emergencies, and travel delays.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">ZMW 120.00</p>
                  <p className="text-xs text-muted-foreground">Recommended for your group</p>
                </div>
                <Button variant="outline" className="rounded-xl font-bold border-2">Add protection</Button>
              </div>
            </section>

            {/* Ground Rules */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Ground rules</h2>
              <p className="text-sm text-muted-foreground">We ask every guest to remember a few simple things about what makes a great guest.</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li>Follow the house rules</li>
                <li>Treat the host&apos;s home like your own</li>
              </ul>
            </section>

            <div className="pt-8 border-t border-border/50">
              <p className="text-xs text-muted-foreground leading-relaxed">
                By selecting the button below, I agree to the <Link href="/terms" className="underline font-bold">Host&apos;s House Rules</Link>, <Link href="/terms" className="underline font-bold">Nearby Escapes&apos;s Rebooking and Refund Policy</Link>, and that Nearby Escapes can <Link href="/terms" className="underline font-bold">charge my payment method</Link> if I&apos;m responsible for damage.
              </p>
              <Link href="/checkout/summary">
                <Button className="w-full md:w-auto mt-8 h-14 rounded-2xl px-12 bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-lg font-extrabold text-lg">
                  Confirm and Pay
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-32 border-border/60 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
              <CardContent className="p-8">
                <div className="flex gap-4 mb-8">
                  <div className="h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{listing.location}</p>
                      <h3 className="font-bold leading-tight">{listing.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <Star className="h-3 w-3 fill-accent text-accent" /> {listing.rating} <span className="text-muted-foreground">({listing.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-border/50">
                  <h3 className="text-lg font-bold">Price details</h3>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="underline">ZMW {listing.price} x 5 nights</span>
                    <span>ZMW {listing.price * 5}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="underline">Cleaning fee</span>
                    <span>ZMW 150</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="underline">Nearby Escapes service fee</span>
                    <span>ZMW 245</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-lg pt-4 border-t border-border/50">
                    <span>Total (ZMW)</span>
                    <span>ZMW {listing.price * 5 + 395}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
