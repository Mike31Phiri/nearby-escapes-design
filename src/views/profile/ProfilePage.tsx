"use client";

import Link from "next/link";
import {
  Star, MapPin, Calendar, BadgeCheck,
  MessageCircle, Briefcase, ArrowRight,
  Settings, Heart, BookOpen, CreditCard,
  Bell, Shield, HelpCircle, LogOut,
  Edit2, Clock, CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const reviews = [
  { id: "r1", from: "Chanda M.", rating: 5, text: "Easy to coordinate with and respectful of house rules. Welcome anytime!", listing: "Mosi-oa-Tunya Lodge", date: "Mar 2026" },
  { id: "r2", from: "Bwalya K.", rating: 5, text: "Quiet, considerate guest. Left the apartment spotless.", listing: "Skyline Boutique Suite", date: "Jan 2026" },
  { id: "r3", from: "Mulenga P.", rating: 4, text: "Communicated clearly and arrived on time.", listing: "Luangwa Tented Camp", date: "Nov 2025" },
];

const mockBookings = [
  {
    id: "bk1",
    listing: "Mosi-oa-Tunya Lodge",
    location: "Livingstone",
    image: "/images/listing-lodge.jpg",
    checkIn: "May 15, 2026",
    checkOut: "May 20, 2026",
    nights: 5,
    total: "ZMW 1,495",
    status: "Upcoming",
    bookingRef: "NE-84291-ZX",
  },
  {
    id: "bk2",
    listing: "Luangwa Tented Camp",
    location: "South Luangwa",
    image: "/images/listing-camp.jpg",
    checkIn: "Mar 12, 2026",
    checkOut: "Mar 15, 2026",
    nights: 3,
    total: "ZMW 1,180",
    status: "Completed",
    bookingRef: "NE-71203-KW",
  },
  {
    id: "bk3",
    listing: "Skyline Boutique Suite",
    location: "Lusaka",
    image: "/images/listing-hotel.jpg",
    checkIn: "Dec 22, 2025",
    checkOut: "Dec 27, 2025",
    nights: 5,
    total: "ZMW 920",
    status: "Completed",
    bookingRef: "NE-60142-MN",
  },
];

const statusColors: Record<string, string> = {
  Upcoming: "bg-primary/10 text-primary border-none",
  Completed: "bg-emerald-50 text-emerald-700 border-none",
  Cancelled: "bg-destructive/10 text-destructive border-none",
};

const settingsGroups = [
  {
    title: "Account",
    items: [
      { icon: CreditCard, label: "Payments & Payouts", href: "/account/payments", sub: "Manage cards and bank accounts" },
      { icon: Bell, label: "Notifications", href: "/account/notifications", sub: "Email and push preferences" },
      { icon: Shield, label: "Privacy & Security", href: "/account/privacy", sub: "Password, 2FA, and data" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center", href: "/help", sub: "FAQs, guides, and contact support" },
      { icon: LogOut, label: "Sign Out", href: "/login", sub: "Sign out of your account", danger: true },
    ],
  },
];

export function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          {/* ── Sidebar ── */}
          <aside>
            <Card className="border-border/60 rounded-3xl overflow-hidden shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 bg-primary text-primary-foreground">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black">
                      MP
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-2 border-background" />
                </div>
                <h1 className="mt-4 text-xl font-black">Mike Phiri</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Lusaka, Zambia
                </p>
                <Badge variant="secondary" className="mt-3 text-[11px] font-bold">
                  <BadgeCheck className="h-3 w-3 mr-1 text-primary" /> ID verified
                </Badge>

                <div className="mt-5 grid grid-cols-3 w-full gap-2 text-center">
                  <div className="p-3 bg-muted/30 rounded-2xl">
                    <p className="text-lg font-black">12</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-0.5">Trips</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-2xl">
                    <p className="text-lg font-black">4.9</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-0.5">Rating</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-2xl">
                    <p className="text-lg font-black">3</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-0.5">Reviews</p>
                  </div>
                </div>

                <Button asChild size="sm" variant="outline" className="mt-5 w-full rounded-2xl font-bold border-2">
                  <Link href="/profile/edit">
                    <Edit2 className="h-3.5 w-3.5 mr-2" /> Edit profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Host switch card */}
            <Card className="mt-4 border-border/60 rounded-3xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black leading-tight">Hosting on Nearby Escapes</p>
                    <p className="text-xs text-muted-foreground">Same account, different mode.</p>
                  </div>
                </div>
                <Button asChild size="sm" className="mt-4 w-full rounded-2xl font-bold">
                  <Link href="/host">
                    Switch to hosting <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="mt-1 w-full text-xs text-muted-foreground">
                  <Link href="/host/become-a-host">Become a host</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* ── Tabs content ── */}
          <section>
            <Tabs defaultValue="bookings">
              <TabsList className="bg-muted/50 p-1.5 rounded-2xl h-auto w-full flex-wrap gap-1">
                {[
                  { value: "bookings", icon: BookOpen, label: "My Bookings" },
                  { value: "saved", icon: Heart, label: "Saved" },
                  { value: "reviews", icon: Star, label: "Reviews" },
                  { value: "settings", icon: Settings, label: "Settings" },
                ].map(({ value, icon: Icon, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="rounded-xl px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* ── My Bookings ── */}
              <TabsContent value="bookings" className="mt-6 space-y-4">
                {mockBookings.length === 0 ? (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-black mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-6">Your upcoming and past trips will appear here.</p>
                    <Link href="/search">
                      <Button className="rounded-2xl px-8 h-12 bg-primary font-black shadow-lg">Browse listings</Button>
                    </Link>
                  </div>
                ) : (
                  mockBookings.map((bk) => (
                    <Card key={bk.id} className="border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-0 flex flex-col sm:flex-row">
                        <div className="h-40 sm:h-auto sm:w-40 flex-shrink-0">
                          <img src={bk.image} alt={bk.listing} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <div>
                                <h3 className="font-black text-base leading-tight">{bk.listing}</h3>
                                <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 mt-1 uppercase tracking-wider">
                                  <MapPin className="h-3 w-3 text-primary" /> {bk.location}
                                </p>
                              </div>
                              <Badge className={cn("flex-shrink-0 font-bold text-xs", statusColors[bk.status])}>
                                {bk.status === "Upcoming" && <Clock className="h-3 w-3 mr-1" />}
                                {bk.status === "Completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {bk.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground font-medium">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                {bk.checkIn} – {bk.checkOut}
                              </div>
                              <span>·</span>
                              <span>{bk.nights} nights</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                            <div>
                              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total paid</span>
                              <p className="font-black text-base">{bk.total}</p>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/checkout/summary`}>
                                <Button variant="outline" size="sm" className="rounded-xl border-2 font-bold text-xs h-9">
                                  View Details
                                </Button>
                              </Link>
                              {bk.status === "Completed" && (
                                <Button size="sm" className="rounded-xl font-bold text-xs h-9 bg-primary shadow-sm">
                                  Leave Review
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* ── Saved ── */}
              <TabsContent value="saved" className="mt-6">
                {listings.length === 0 ? (
                  <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                    <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-black mb-2">Nothing saved yet</h3>
                    <p className="text-muted-foreground mb-6">Tap the heart icon on any listing to save it here.</p>
                    <Link href="/search">
                      <Button className="rounded-2xl px-8 h-12 bg-primary font-black shadow-lg">Explore listings</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 stagger-children">
                    {listings.slice(0, 4).map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* ── Reviews ── */}
              <TabsContent value="reviews" className="mt-6 space-y-4">
                {reviews.map((r) => (
                  <Card key={r.id} className="border-border/60 rounded-3xl shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-black">{r.from}</p>
                          <p className="text-xs text-muted-foreground font-medium">{r.listing} · {r.date}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("h-4 w-4", i < r.rating ? "fill-accent text-accent" : "text-muted-foreground/30")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* ── Settings ── */}
              <TabsContent value="settings" className="mt-6 space-y-6">
                {settingsGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 px-1">{group.title}</p>
                    <Card className="border-border/60 rounded-3xl overflow-hidden shadow-sm">
                      {group.items.map((item, idx) => (
                        <Link key={item.label} href={item.href}>
                          <div className={cn(
                            "flex items-center gap-4 p-5 hover:bg-muted/30 transition-colors cursor-pointer",
                            idx > 0 && "border-t border-border/40",
                            item.danger && "hover:bg-destructive/5"
                          )}>
                            <div className={cn(
                              "h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0",
                              item.danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                            )}>
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("font-black text-sm", item.danger && "text-destructive")}>{item.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </Card>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
