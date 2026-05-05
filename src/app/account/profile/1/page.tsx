"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { Star, ShieldCheck, MapPin, Calendar, Share2, Award, User } from "lucide-react";
import { useParams } from "next/navigation";

export default function PublicProfilePage() {
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
                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&fit=crop&w=200&h=200" alt="Avatar" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute bottom-1 right-1 h-8 w-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-extrabold tracking-tight">Mwine Phiri</h1>
                <p className="text-muted-foreground font-bold mt-1 uppercase tracking-widest text-xs">Verified Guest</p>
                
                <div className="grid grid-cols-2 gap-4 mt-10 pt-10 border-t border-border/40">
                  <div className="text-center">
                    <p className="text-xl font-extrabold">24</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-extrabold">3</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Years on site</p>
                  </div>
                </div>

                <div className="space-y-4 mt-10 pt-10 border-t border-border/40 text-left">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Member since April 2021</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Based in Lusaka, Zambia</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>Super Guest • 12 stays</span>
                  </div>
                </div>
                
                <Button className="w-full h-12 rounded-2xl bg-primary font-bold mt-10 shadow-lg flex items-center gap-2">
                   Message Mwine
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-16">
            <section className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-extrabold tracking-tight mb-8">About Mwine</h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                I&apos;m a travel enthusiast who loves exploring the hidden corners of Zambia. From the majestic Victoria Falls to the serene shores of Samfya, I believe our country has so much beauty to offer. I&apos;m always looking for authentic experiences and unique places to stay.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <Card className="border-border/60 bg-muted/20 rounded-3xl p-6">
                  <h3 className="font-bold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Wildlife Photography", "Hiking", "Traditional Food", "Culture"].map(tag => (
                      <span key={tag} className="text-xs font-bold bg-white px-3 py-1.5 rounded-full shadow-sm border border-border/40">{tag}</span>
                    ))}
                  </div>
                </Card>
                <Card className="border-border/60 bg-muted/20 rounded-3xl p-6">
                  <h3 className="font-bold mb-2">Favorite Locations</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Livingstone", "South Luangwa", "Samfya"].map(tag => (
                      <span key={tag} className="text-xs font-bold bg-white px-3 py-1.5 rounded-full shadow-sm border border-border/40">{tag}</span>
                    ))}
                  </div>
                </Card>
              </div>
            </section>

            <section className="border-t border-border/50 pt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Reviews about Mwine</h2>
                <div className="flex items-center gap-1 font-bold">
                  <Star className="h-5 w-5 fill-accent text-accent" /> 5.0 (24 reviews)
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <Card key={i} className="border-border/40 shadow-sm rounded-3xl p-8 bg-card">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Host" />
                      </div>
                      <div>
                        <h4 className="font-bold">Bwalya M.</h4>
                        <p className="text-xs text-muted-foreground">Host • June 2023</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      &quot;Mwine was a fantastic guest! Communication was great, and he left the place spotless. I would definitely host him again anytime.&quot;
                    </p>
                  </Card>
                ))}
              </div>
              <button className="mt-8 font-bold underline hover:no-underline text-sm">Show all 24 reviews</button>
            </section>

            <section className="border-t border-border/50 pt-16">
              <h2 className="text-2xl font-bold tracking-tight mb-8">Saved Listings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listings.slice(0, 2).map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <Link href="/account/wishlist">
                 <Button variant="outline" className="mt-8 rounded-xl font-bold border-2 h-12">View full wishlist</Button>
              </Link>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
