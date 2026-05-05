"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { Star, ShieldCheck, MapPin, Calendar, MessageCircle, Share2, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function PublicHostProfilePage() {
  const params = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-8">
            <Card className="border-border/60 shadow-2xl rounded-[40px] overflow-hidden sticky top-32">
              <CardContent className="p-10 text-center">
                <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
                  <div className="h-full w-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-muted">
                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=200&h=200" alt="Host Avatar" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute bottom-1 right-1 h-8 w-8 bg-primary rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-extrabold tracking-tight">Bwalya Mwine</h1>
                <p className="text-muted-foreground font-bold mt-1 uppercase tracking-widest text-xs">Superhost • 4 Years Hosting</p>
                
                <div className="grid grid-cols-2 gap-4 mt-10 pt-10 border-t border-border/40">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <p className="text-xl font-extrabold">4.9</p>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-extrabold">240</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reviews</p>
                  </div>
                </div>
                
                <Button className="w-full h-12 rounded-2xl bg-primary font-bold mt-10 shadow-lg flex items-center gap-2">
                   <MessageCircle className="h-5 w-5" /> Contact Host
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
            <section>
              <h2 className="text-3xl font-extrabold tracking-tight mb-8">About Bwalya</h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                I&apos;m a native of Livingstone with a passion for Zambian wildlife and culture. I started hosting in 2021 to share the beauty of our riverside with travelers from around the world. My goal is to ensure every guest experiences the true &quot;Nearby Escape&quot; feeling.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-border/50">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Highly rated</h4>
                    <p className="text-sm text-muted-foreground">Known for great communication and smooth check-ins.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Fast response</h4>
                    <p className="text-sm text-muted-foreground">Response rate: 100% • Response time: within an hour</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-border/50 pt-16">
              <h2 className="text-2xl font-bold tracking-tight mb-8">Bwalya&apos;s Active Listings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12">
                {listings.slice(0, 4).map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <Button variant="outline" className="mt-12 rounded-xl font-bold border-2 h-12">Show all 8 listings</Button>
            </section>

            <section className="border-t border-border/50 pt-16">
              <h2 className="text-2xl font-bold tracking-tight mb-8">240 Reviews from Guests</h2>
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pb-8 border-b border-border/40 last:border-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                        <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="Guest" />
                      </div>
                      <div>
                        <h4 className="font-bold">Tendai Z.</h4>
                        <p className="text-xs text-muted-foreground">April 2024 • Verified Guest</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                         <Star className="h-3 w-3 fill-accent text-accent" />
                         <Star className="h-3 w-3 fill-accent text-accent" />
                         <Star className="h-3 w-3 fill-accent text-accent" />
                         <Star className="h-3 w-3 fill-accent text-accent" />
                         <Star className="h-3 w-3 fill-accent text-accent" />
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed italic">
                      &quot;Bwalya was an incredible host. The property was even better than the photos and he went above and beyond to help us arrange local transport. Highly recommend staying with him!&quot;
                    </p>
                  </div>
                ))}
              </div>
              <button className="mt-8 font-bold underline hover:no-underline text-sm">Show all reviews about Bwalya</button>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
