"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star, MapPin, CheckCircle, Calendar, MessageSquare,
  ArrowRight, Briefcase, TrendingUp, Shield, Clock,
  ChevronRight, Home, DollarSign, Award, Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { listings } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total listings", value: "3", icon: Home },
  { label: "Avg. rating", value: "4.9", icon: Star },
  { label: "Bookings", value: "47", icon: Calendar },
  { label: "Response rate", value: "98%", icon: MessageSquare },
];

const reviews = [
  { name: "Chanda M.", date: "March 2026", rating: 5, text: "Absolutely wonderful host. The lodge was exactly as described and the welcome was warm. Will definitely return!" },
  { name: "Bwalya K.", date: "February 2026", rating: 5, text: "Spotless property, great location and the host was super responsive. Highly recommend." },
  { name: "Joyce S.", date: "January 2026", rating: 4, text: "Great stay overall. The host went above and beyond to make us feel at home." },
];

const hostFeatures = [
  { icon: Award, label: "Superhost", value: "4+ years" },
  { icon: CheckCircle, label: "Identity", value: "Verified" },
  { icon: Users, label: "Guests", value: "240+ served" },
];

export function HostProfilePage() {
  const { user, becomeHost } = useAuth();
  const router = useRouter();

  const initials = user?.fullName
    ? user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "H";

  const isHost = user?.role === "host" || user?.role === "admin";
  const hostListings = listings.slice(0, 4); // Show 4 listings for the grid

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Hero / Top Section (Centered) */}
        <section className="relative pt-16 pb-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="mx-auto max-w-4xl text-center space-y-8">
            {/* Avatar Cluster */}
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-40 w-40 rounded-full border-4 border-background bg-card flex items-center justify-center text-primary text-5xl font-bold shadow-2xl overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="absolute bottom-2 right-2 h-10 w-10 bg-primary text-primary-foreground rounded-full border-4 border-background flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>

            {/* Name & Title */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
                {user?.fullName ?? "Your Name"}
              </h1>
              <div className="flex items-center justify-center gap-4 text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  {user?.location ?? "Lusaka, Zambia"}
                </span>
                <span className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
                <span className="flex items-center gap-1.5 text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  4.9 Superhost
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {user?.bio ?? "Welcome! I'm a passionate host based in Zambia. I love sharing the beauty of this country with travelers from around the world. My properties are carefully maintained to give you the most comfortable and authentic Zambian experience possible."}
              </p>
            </div>

            {/* Feature Bar */}
            <div className="flex flex-wrap justify-center gap-8 pt-4">
              {hostFeatures.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{f.label}</p>
                    <p className="text-sm font-semibold">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {isHost ? (
                <>
                  <Button size="lg" className="rounded-full px-8 bg-primary text-white hover:bg-primary/90" asChild>
                    <Link href="/host/new-listing">+ New listing</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                    <Link href="/host">Dashboard</Link>
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg" 
                  className="rounded-full px-8 bg-primary text-white hover:bg-primary/90"
                  onClick={() => { becomeHost(); router.push("/host/dashboard"); }}
                >
                  Become a host
                </Button>
              )}
              <Button variant="ghost" size="lg" className="rounded-full px-8">
                <MessageSquare className="h-4 w-4 mr-2" /> Message
              </Button>
            </div>
          </div>
        </section>

        {/* Listings Section (Grid of 4) */}
        <section className="bg-muted/30 py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight font-display">My Listings</h2>
                <p className="text-muted-foreground mt-1">Explore properties managed by {user?.fullName?.split(" ")[0] ?? "this host"}</p>
              </div>
              <Link href="/accommodations" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 group">
                See all {stats[0].value} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hostListings.map((listing) => (
                <Link key={listing.id} href={`/accommodations/${listing.id}`} className="group block">
                  <div className="space-y-3">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300">
                      <img
                        src={listing.image}
                        alt={listing.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-black border-0 backdrop-blur-md font-bold text-[10px] uppercase tracking-tighter">
                          Verified
                        </Badge>
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-bold truncate text-foreground">{listing.name}</span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {listing.rating}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {listing.location}
                      </p>
                      <p className="text-sm font-bold text-primary">
                        ${listing.price} <span className="text-xs font-normal text-muted-foreground">/ night</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Ratings and Reviews Section */}
        <section className="py-20 px-4 bg-background">
          <div className="mx-auto max-w-4xl">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight font-display">Ratings & Reviews</h2>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-foreground">4.9</p>
                  <div className="flex items-center justify-center gap-0.5 mt-1 text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                </div>
                <div className="h-12 w-px bg-muted" />
                <div className="text-center">
                  <p className="text-4xl font-bold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">Recommended</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.map((r, i) => (
                <div key={i} className="group relative p-8 rounded-3xl border border-border/60 bg-card hover:bg-muted/20 transition-colors duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-center gap-4 shrink-0 md:w-48">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                        {r.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex-grow space-y-3">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(r.rating)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-current" />)}
                      </div>
                      <p className="text-muted-foreground leading-relaxed italic">
                        "{r.text}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" className="rounded-full px-10 border-muted-foreground/20 hover:bg-muted/30">
                Show all 147 reviews
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
