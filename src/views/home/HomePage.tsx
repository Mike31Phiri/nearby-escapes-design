"use client";

import Link from "next/link";
import { useState } from "react";
import { Bus, ArrowRight, Clock, Hotel, TrainFront, Ticket, Gem, MapPin, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/explore/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroImage = "/images/hero-zambia.jpg";

const categories = [
  { id: "stays", label: "Stays", icon: Hotel, href: "/accommodations" },
  { id: "transport", label: "Transport", icon: TrainFront, href: "/bus-booking" },
  { id: "attractions", label: "Attractions", icon: Ticket, href: "/experiences" },
  { id: "gems", label: "Gems", icon: Gem, href: "/gems" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

const popularRoutes = [
  {
    id: "lusaka-livingstone",
    from: "Lusaka",
    to: "Livingstone",
    duration: "6h 30m",
    price: 180,
    operator: "Mazhandu Family Bus",
    departures: "4 daily",
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=250",
  },
  {
    id: "lusaka-kitwe",
    from: "Lusaka",
    to: "Kitwe",
    duration: "7h",
    price: 200,
    operator: "Power Tools",
    departures: "3 daily",
    image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=250",
  },
  {
    id: "lusaka-chipata",
    from: "Lusaka",
    to: "Chipata",
    duration: "5h 45m",
    price: 160,
    operator: "Jonda Bus",
    departures: "2 daily",
    image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=400&h=250",
  },
];

const attractions = [
  { id: "vic-falls", name: "Victoria Falls", location: "Livingstone", rating: 4.9, reviews: 1240, price: 35, image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=300" },
  { id: "south-luangwa", name: "South Luangwa Safari", location: "Chipata", rating: 4.8, reviews: 876, price: 120, image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=300" },
  { id: "kafue-park", name: "Kafue National Park", location: "Kafue", rating: 4.7, reviews: 543, price: 80, image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=400&h=300" },
  { id: "lower-zambezi", name: "Lower Zambezi Canoe", location: "Lower Zambezi", rating: 4.9, reviews: 312, price: 95, image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=300" },
];

const gems = [
  { id: "mutinondo", name: "Mutinondo Wilderness", location: "Mpika", rating: 5.0, reviews: 89, price: 45, image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=300" },
  { id: "shiwa-ngandu", name: "Shiwa Ng'andu Estate", location: "Chinsali", rating: 4.9, reviews: 134, price: 60, image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=400&h=300" },
  { id: "bangweulu", name: "Bangweulu Wetlands", location: "Samfya", rating: 4.8, reviews: 67, price: 55, image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=300" },
  { id: "blue-lagoon", name: "Blue Lagoon National Park", location: "Kafue Flats", rating: 4.7, reviews: 45, price: 40, image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=300" },
];

const sectionMeta: Record<CategoryId, { heading: string; sub: string; cta: string; href: string }> = {
  stays: { heading: "Popular stays", sub: "Hand-picked lodges, hotels and camps across Zambia", cta: "Explore all stays", href: "/accommodations" },
  transport: { heading: "Popular bus routes", sub: "Get to your destination comfortably", cta: "Browse all routes", href: "/bus-booking" },
  attractions: { heading: "Top attractions", sub: "Iconic experiences and must-see destinations", cta: "See all attractions", href: "/experiences" },
  gems: { heading: "Hidden gems", sub: "Off-the-beaten-path spots only locals know", cta: "Discover all gems", href: "/gems" },
};

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("stays");
  const meta = sectionMeta[activeCategory];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative z-40 bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Victoria Falls at sunset, Zambia"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-black/20 to-black/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-8 md:pb-16 flex flex-col items-center">
          <h1 className="font-sans max-w-4xl text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] drop-shadow-xl text-center text-white mb-4">
            Find your next escape, just nearby
          </h1>
          <p className="font-sans max-w-xl text-base md:text-xl text-white/90 drop-shadow-md font-medium text-center mb-10">
            Stays, transport, hidden gems and curated packages — all in one place.
          </p>
          <div className="w-full px-2 mt-4 md:mt-8 transform translate-y-4 md:translate-y-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-20 z-30 bg-background border-b border-border/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-center gap-8 md:gap-16 pt-5 pb-1">
            {categories.map(({ id, label, icon: Icon }) => {
              const isActive = activeCategory === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={cn(
                    "group flex flex-col items-center justify-center gap-2 pb-3 border-b-2 transition-all duration-200",
                    isActive
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-colors duration-200",
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                    )}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  <span className="text-xs font-semibold whitespace-nowrap">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Content Section */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-10 md:mt-14 section-enter" key={activeCategory}>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{meta.heading}</h2>
            <p className="text-muted-foreground mt-1">{meta.sub}</p>
          </div>
        </div>

        {/* Stays */}
        {activeCategory === "stays" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 stagger-children">
            {listings.slice(0, 8).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Transport */}
        {activeCategory === "transport" && (
          <div className="grid gap-6 md:grid-cols-3 stagger-children">
            {popularRoutes.map((route) => (
              <Link key={route.id} href="/bus-booking" className="group block">
                <Card className="border border-border/60 overflow-hidden hover:shadow-lg rounded-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={route.image}
                      alt={`${route.from} to ${route.to}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <p className="text-lg font-bold text-white drop-shadow-md">{route.from} → {route.to}</p>
                      <div className="flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold backdrop-blur-sm shadow-sm">
                        <Bus className="h-3.5 w-3.5" /> {route.operator}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {route.duration}</span>
                        <span>{route.departures}</span>
                      </div>
                      <span className="font-bold text-foreground">ZMW {route.price}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Attractions */}
        {activeCategory === "attractions" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
            {attractions.map((item) => (
              <Link key={item.id} href="/experiences" className="group block">
                <Card className="overflow-hidden border border-border/60 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <CardContent className="p-4">
                    <p className="font-semibold text-sm leading-snug">{item.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{item.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" />{item.rating} <span className="text-muted-foreground">({item.reviews})</span></span>
                      <span className="text-sm font-bold">${item.price}<span className="text-xs font-normal text-muted-foreground"> /person</span></span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Gems */}
        {activeCategory === "gems" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
            {gems.map((item) => (
              <Link key={item.id} href="/gems" className="group block">
                <Card className="overflow-hidden border border-border/60 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">Hidden Gem</div>
                  </div>
                  <CardContent className="p-4">
                    <p className="font-semibold text-sm leading-snug">{item.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{item.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" />{item.rating} <span className="text-muted-foreground">({item.reviews})</span></span>
                      <span className="text-sm font-bold">${item.price}<span className="text-xs font-normal text-muted-foreground"> /person</span></span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link href={meta.href}>
            <Button size="lg" className="rounded-full px-8 bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-md">
              {meta.cta} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-20 mb-16 section-enter">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why Book With Us</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "fa-shield-alt", title: "Secure Booking", desc: "Your bookings are safe with our secure payment system" },
            { icon: "fa-headset", title: "24/7 Support", desc: "Our customer service team is always ready to help" },
            { icon: "fa-tags", title: "Best Prices", desc: "We guarantee the best prices for your stays and travels" },
            { icon: "fa-map-marked-alt", title: "Wide Coverage", desc: "Covering all major Zambian cities and tourist attractions" },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-4 rounded-2xl bg-purple-600 dark:bg-purple-700 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white text-2xl">
                <i className={`fas ${icon}`} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
              <p className="text-sm text-white/80 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
}
