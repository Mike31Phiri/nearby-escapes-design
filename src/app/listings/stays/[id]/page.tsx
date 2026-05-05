"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, MapPin, Share2, Heart, 
  Wifi, Coffee, Car, Wind, 
  User, ShieldCheck, ArrowRight,
  ChevronLeft, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { listings } from "@/lib/mock-data";
import { useParams } from "next/navigation";

export default function StayDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  // Use first listing as default if not found
  const listing = listings.find(l => l.id === id) || listings[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="mx-auto max-w-7xl px-4 md:px-6 pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{listing.title}</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="rounded-xl gap-2 font-semibold">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl gap-2 font-semibold">
                <Heart className="h-4 w-4" /> Save
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span>{listing.rating}</span>
              <span className="text-muted-foreground underline">({listing.reviews} reviews)</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="underline">{listing.location}</span>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="mx-auto max-w-7xl px-4 md:px-6 mb-10">
          <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[300px] md:h-[500px] rounded-3xl overflow-hidden">
            <div className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer">
              <img src={listing.image} alt="Main view" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer">
              <img src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&fit=crop&w=400&h=300" alt="View 2" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer rounded-tr-3xl">
              <img src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&fit=crop&w=400&h=300" alt="View 3" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer">
              <img src="https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&fit=crop&w=400&h=300" alt="View 4" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer rounded-br-3xl">
              <img src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&fit=crop&w=400&h=300" alt="View 5" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-sm">
                +12 photos
              </div>
            </div>
          </div>
        </section>

        {/* Content & Sidebar */}
        <section className="mx-auto max-w-7xl px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between border-b border-border/50 pb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Entire lodge hosted by Bwalya</h2>
                <p className="text-muted-foreground mt-1">4 guests • 2 bedrooms • 2 beds • 1 bath</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-muted overflow-hidden border-2 border-primary/20">
                <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=100&h=100" alt="Host" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1"><Wifi className="h-6 w-6 text-muted-foreground" /></div>
                <div>
                  <h3 className="font-bold">Fast Wi-Fi</h3>
                  <p className="text-sm text-muted-foreground">At 50 Mbps, you can take video calls and stream videos for your whole group.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><MapPin className="h-6 w-6 text-muted-foreground" /></div>
                <div>
                  <h3 className="font-bold">Great location</h3>
                  <p className="text-sm text-muted-foreground">95% of recent guests gave the location a 5-star rating.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><ShieldCheck className="h-6 w-6 text-muted-foreground" /></div>
                <div>
                  <h3 className="font-bold">Highly rated host</h3>
                  <p className="text-sm text-muted-foreground">Bwalya has received 5-star ratings from 100% of recent guests.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 pt-8">
              <p className="text-muted-foreground leading-relaxed">
                Experience the beauty of the Zambian wilderness in this luxurious lodge. Located just minutes from the main park entrance, our lodge offers the perfect blend of comfort and adventure. 
                <br /><br />
                The interior is thoughtfully designed with local materials and traditional Zambian art, creating a warm and inviting atmosphere. Enjoy stunning sunset views from your private deck or relax by the fire pit under the starlit sky.
              </p>
              <button className="mt-4 font-bold underline flex items-center gap-1">Show more <ArrowRight className="h-4 w-4" /></button>
            </div>

            <div className="border-t border-border/50 pt-8">
              <h2 className="text-xl font-bold mb-6">What this place offers</h2>
              <div className="grid grid-cols-2 gap-y-4">
                {[
                  { icon: Wifi, label: "Fast Wi-Fi" },
                  { icon: Coffee, label: "Breakfast included" },
                  { icon: Car, label: "Free parking on premises" },
                  { icon: Wind, label: "Air conditioning" },
                  { icon: User, label: "Dedicated workspace" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-8 rounded-xl font-bold border-2 h-12 px-8">Show all 32 amenities</Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-32 border-border/60 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-2xl font-extrabold text-foreground">ZMW {listing.price}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Star className="h-4 w-4 fill-accent text-accent" /> {listing.rating}
                  </div>
                </div>

                <div className="grid grid-cols-2 border border-border rounded-2xl overflow-hidden mb-6">
                  <div className="p-3 border-r border-b border-border hover:bg-muted/30 cursor-pointer transition-colors">
                    <p className="text-[10px] font-extrabold uppercase text-foreground">Check-in</p>
                    <p className="text-sm font-medium">Add date</p>
                  </div>
                  <div className="p-3 border-b border-border hover:bg-muted/30 cursor-pointer transition-colors">
                    <p className="text-[10px] font-extrabold uppercase text-foreground">Check-out</p>
                    <p className="text-sm font-medium">Add date</p>
                  </div>
                  <div className="col-span-2 p-3 hover:bg-muted/30 cursor-pointer transition-colors">
                    <p className="text-[10px] font-extrabold uppercase text-foreground">Guests</p>
                    <p className="text-sm font-medium">1 guest</p>
                  </div>
                </div>

                <Link href={`/booking/${listing.id}`}>
                  <Button className="w-full h-14 rounded-2xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-lg font-extrabold text-lg mb-4">
                    Reserve
                  </Button>
                </Link>
                
                <p className="text-center text-xs text-muted-foreground">You won&apos;t be charged yet</p>

                <div className="space-y-4 mt-8 pt-8 border-t border-border/50">
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
                    <span>Total</span>
                    <span>ZMW {listing.price * 5 + 395}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
