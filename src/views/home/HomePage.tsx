"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bus,
  ArrowRight,
  Clock,
  Hotel,
  TrainFront,
  Ticket,
  Gem,
  MapPin,
  Star,
  ShieldCheck,
  Headset,
  Tag,
  Map,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { SearchBar } from "@/components/explore/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import {
  mockStays,
  mockTransport,
  mockExperiences,
  mockGems,
  mockPackages,
  mockDestinations,
} from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroImage = "/images/hero-zambia.jpg";

const categories = [
  { id: "stays", label: "Stays", icon: Hotel, href: "/search?category=stays" },
  { id: "attractions", label: "Attractions", icon: Ticket, href: "/search?category=attractions" },
  { id: "transport", label: "Transport", icon: TrainFront, href: "/search?category=transport" },
  { id: "gems", label: "Gems", icon: Gem, href: "/search?category=gems" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

const popularRoutes = mockTransport;
const attractions = mockExperiences;
const gems = mockGems;
const packagesList = mockPackages.map((p) => ({
  id: p.id,
  name: p.name,
  location: p.location,
  rating: p.rating,
  price: p.price,
  image: p.image,
  duration: p.duration.split(" / ")[0],
}));

const sectionMeta: Record<CategoryId, { heading: string; sub: string; cta: string; href: string }> =
  {
    stays: {
      heading: "Stays in Lusaka",
      sub: "Hand-picked lodges, hotels and camps across Zambia",
      cta: "Explore all stays",
      href: "/search?category=stays",
    },
    transport: {
      heading: "Transport in Lusaka",
      sub: "Get to your destination comfortably",
      cta: "Browse all routes",
      href: "/search?category=transport",
    },
    attractions: {
      heading: "Attractions in Lusaka",
      sub: "Iconic experiences and must-see destinations",
      cta: "See all attractions",
      href: "/search?category=attractions",
    },
    gems: {
      heading: "Hidden gems in Lusaka",
      sub: "Off-the-beaten-path spots only locals know",
      cta: "Discover all gems",
      href: "/search?category=gems",
    },
  };

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("stays");
  const meta = sectionMeta[activeCategory];

  const handleCategoryChange = (id: CategoryId) => {
    setActiveCategory(id);
    // Add a slight delay to allow the DOM to update if needed, though scroll-mt should handle the offset.
    setTimeout(() => {
      document.getElementById("category-content")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

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
          <h1 className="font-sans max-w-4xl text-4xl md:text-6xl font-black tracking-tight leading-[1.1] drop-shadow-2xl text-center text-white mb-6">
            Find your next escape, just nearby
          </h1>
          <p className="font-sans max-w-xl text-lg md:text-2xl text-white/90 drop-shadow-md font-bold text-center mb-12">
            Stays, transport, hidden gems and curated packages — all in one place.
          </p>
          <div className="w-full px-2 mt-4 md:mt-8 transform translate-y-8 md:translate-y-12">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-16 z-30 bg-background border-b border-border/50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-center gap-8 md:gap-20 pt-6 pb-2">
            {categories.map(({ id, label, icon: Icon }) => {
              const isActive = activeCategory === id;
              return (
                <button
                  key={id}
                  onClick={() => handleCategoryChange(id)}
                  className={cn(
                    "group flex flex-col items-center justify-center gap-3 pb-4 border-b-2 transition-all duration-300",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-primary scale-110" : "text-muted-foreground",
                    )}
                    strokeWidth={isActive ? 3 : 1.5}
                  />
                  <span
                    className={cn(
                      "text-xs font-black uppercase tracking-widest whitespace-nowrap",
                      isActive ? "opacity-100" : "opacity-60",
                    )}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Content Section */}
      <section
        id="category-content"
        className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-4 md:mt-6 section-enter scroll-mt-40"
        key={activeCategory}
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">{meta.heading}</h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium">{meta.sub}</p>
          </div>
        </div>

        {/* Stays */}
        {activeCategory === "stays" && (
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14 stagger-children">
              {mockStays.slice(0, 8).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl px-12 border-2 font-black uppercase tracking-widest text-xs h-14 hover:bg-primary hover:text-white transition-all shadow-lg"
                asChild
              >
                <Link href="/search?category=stays">See all stays</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Transport */}
        {activeCategory === "transport" && (
          <div className="space-y-16">
            <div className="grid gap-8 md:grid-cols-3 stagger-children">
              {popularRoutes.map((route) => (
                <Link
                  key={route.id}
                  href={`/listings/transport/${route.id}`}
                  className="group block"
                >
                  <div className="flex flex-col gap-2">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-muted mb-2">
                      <img
                        src={route.image}
                        alt={`${route.from} to ${route.to}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">
                        {route.from} to {route.to}
                      </p>
                      <span className="font-semibold text-sm text-foreground">
                        ZMW {route.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {route.operator} • {route.duration}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl px-12 border-2 font-black uppercase tracking-widest text-xs h-14 hover:bg-primary hover:text-white transition-all shadow-lg"
                asChild
              >
                <Link href="/search?category=transport">See all transport</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Attractions */}
        {activeCategory === "attractions" && (
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
              {attractions.map((item) => (
                <Link
                  key={item.id}
                  href={`/listings/experiences/${item.id}`}
                  className="group block"
                >
                  <div className="flex flex-col gap-2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                      />
                    </div>
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-bold text-foreground line-clamp-1">{item.name}</p>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs font-semibold text-foreground">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.location}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl px-12 border-2 font-black uppercase tracking-widest text-xs h-14 hover:bg-primary hover:text-white transition-all shadow-lg"
                asChild
              >
                <Link href="/search?category=attractions">See all attractions</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Gems */}
        {activeCategory === "gems" && (
          <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
              {gems.map((item) => (
                <Link
                  key={item.id}
                  href={`/listings/experiences/${item.id}`}
                  className="group block"
                >
                  <div className="flex flex-col gap-2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                      />
                    </div>
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-bold text-foreground line-clamp-1">{item.name}</p>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs font-semibold text-foreground">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.location}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      ${item.price}
                      <span className="text-xs font-normal text-muted-foreground ml-1">/pp</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl px-12 border-2 font-black uppercase tracking-widest text-xs h-14 hover:bg-primary hover:text-white transition-all shadow-lg"
                asChild
              >
                <Link href="/search?category=gems">See all gems</Link>
              </Button>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <Link href={meta.href}>
            <Button
              size="lg"
              className="rounded-full px-12 h-14 bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-xl font-black uppercase tracking-widest text-sm"
            >
              {meta.cta} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Travel Destinations */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-32 section-enter">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Travel Destinations</h2>
            <p className="text-muted-foreground mt-2 text-lg font-medium">
              Explore the most sought-after locations in Zambia
            </p>
          </div>
          <Link
            href="/search?category=destinations"
            className="text-primary font-black uppercase tracking-widest text-xs hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 stagger-children">
          {mockDestinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/search?location=${dest.name}`}
              className="group block text-center"
            >
              <div className="relative aspect-square overflow-hidden rounded-md mb-3 bg-muted">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
              </div>
              <h3 className="font-bold text-sm text-foreground">{dest.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="w-full bg-purple-50 border-y border-border/50 mt-32 py-20 section-enter">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-center flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8 text-foreground">
            Enjoy More and Spend Less with packages
          </h2>
          <Button
            size="lg"
            className="rounded-md bg-primary text-primary-foreground hover:opacity-90 font-bold px-12 h-14"
            asChild
          >
            <Link href="/search?category=packages">View Packages</Link>
          </Button>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-32 mb-40 section-enter">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display">
            Why Book With Us
          </h2>
          <p className="text-xl text-muted-foreground font-medium">
            The trusted choice for Zambian travelers
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Secure Booking",
              desc: "Your bookings are safe with our encrypted payment system",
            },
            {
              icon: Headset,
              title: "24/7 Support",
              desc: "Our local support team is always ready to help you",
            },
            {
              icon: Tag,
              title: "Best Prices",
              desc: "We guarantee the best rates for all Zambian properties",
            },
            {
              icon: Map,
              title: "Wide Coverage",
              desc: "Access to the most remote gems and major cities",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex flex-col items-center text-center p-10 rounded-md border border-border/50 bg-[#e0e0e0] hover:bg-[#d0d0d0] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-sm"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] mb-8 transition-transform group-hover:scale-110 shadow-sm bg-white text-primary">
                <Icon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-4 font-display">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex-1" />
    </div>
  );
}
