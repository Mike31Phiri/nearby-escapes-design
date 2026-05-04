"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star, MapPin, CheckCircle, Calendar, MessageSquare,
  ArrowRight, Briefcase, TrendingUp, Shield, Clock,
  ChevronRight, Home, DollarSign,
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

const perks = [
  { icon: Shield, title: "Verified host", desc: "Identity and property verified by Nearby Escapes" },
  { icon: Clock, title: "Fast responses", desc: "Typically replies within an hour" },
  { icon: TrendingUp, title: "Superhost", desc: "Consistently high ratings and great reviews" },
  { icon: DollarSign, title: "Flexible pricing", desc: "Competitive rates with seasonal discounts" },
];

export function HostProfilePage() {
  const { user, becomeHost } = useAuth();
  const router = useRouter();

  const initials = user?.fullName
    ? user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "H";

  const isHost = user?.role === "host" || user?.role === "admin";
  const hostListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-52 md:h-64 w-full bg-gradient-to-br from-purple-600 via-purple-500 to-violet-400" />
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="relative -mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6">
            <div className="flex items-end gap-5">
              {/* Avatar */}
              <div className="h-28 w-28 rounded-2xl border-4 border-background bg-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  initials
                )}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight">{user?.fullName ?? "Your Name"}</h1>
                  {isHost && (
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-0 text-xs font-semibold">
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified Host
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {user?.location ?? "Lusaka, Zambia"}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pb-1">
              {isHost ? (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/host"><Briefcase className="h-4 w-4 mr-2" />Go to Dashboard</Link>
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                    <Link href="/host/new-listing">+ New listing</Link>
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => { becomeHost(); router.push("/host/dashboard"); }}
                >
                  Become a host
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            <section>
              <h2 className="text-lg font-bold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {user?.bio ?? "Welcome! I'm a passionate host based in Zambia. I love sharing the beauty of this country with travelers from around the world. My properties are carefully maintained to give you the most comfortable and authentic Zambian experience possible."}
              </p>
            </section>

            {/* Stats */}
            <section>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-border/60 bg-card p-5 text-center">
                    <Icon className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Listings */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">My listings</h2>
                <Link href="/accommodations" className="text-sm font-medium text-purple-600 hover:underline flex items-center gap-1">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                {hostListings.map((listing) => (
                  <Link key={listing.id} href={`/accommodations/${listing.id}`} className="group block">
                    <Card className="overflow-hidden border border-border/60 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={listing.image}
                          alt={listing.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="font-semibold text-sm truncate">{listing.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />{listing.location}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{listing.rating}
                          </span>
                          <span className="text-sm font-bold">${listing.price}<span className="text-xs font-normal text-muted-foreground">/night</span></span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <h2 className="text-lg font-bold">Guest reviews</h2>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9
                </div>
                <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
              </div>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <Card key={r.name} className="border border-border/60">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 text-xs font-bold">
                            {r.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{r.name}</p>
                            <p className="text-xs text-muted-foreground">{r.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Right column — sticky card */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">

              {/* Host perks */}
              <Card className="border border-border/60">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-base">Why guests love this host</h3>
                  {perks.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CTA */}
              {isHost ? (
                <Card className="border-0 bg-purple-600 text-white">
                  <CardContent className="p-6 text-center space-y-3">
                    <Briefcase className="h-8 w-8 mx-auto opacity-90" />
                    <p className="font-bold text-base">Manage your business</p>
                    <p className="text-sm text-white/80">View bookings, earnings and performance from your dashboard.</p>
                    <Button asChild className="w-full bg-white text-purple-700 hover:bg-white/90 font-bold">
                      <Link href="/host">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 bg-purple-600 text-white">
                  <CardContent className="p-6 text-center space-y-3">
                    <Home className="h-8 w-8 mx-auto opacity-90" />
                    <p className="font-bold text-base">Start hosting today</p>
                    <p className="text-sm text-white/80">List your property and earn from travelers across Zambia.</p>
                    <Button
                      className="w-full bg-white text-purple-700 hover:bg-white/90 font-bold"
                      onClick={() => { becomeHost(); router.push("/host/dashboard"); }}
                    >
                      Become a host <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Member since */}
              <p className="text-xs text-center text-muted-foreground">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "2024"}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
