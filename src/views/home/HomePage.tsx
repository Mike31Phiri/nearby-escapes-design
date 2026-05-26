"use client";

import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Headset,
  Tag,
  Map,
  Globe,
  Heart,
  TrendingUp,
  Bus,
  Gem,
  Hotel,
  Ticket,
  TrainFront,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { SearchBar } from "@/components/explore/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import {
  mockStays,
  mockTransport,
  mockExperiences,
  mockGems,
  mockDestinations,
} from "@/lib/mock-data";

import { Button } from "@/components/ui/button";

const heroImage = "/images/hero-zambia.jpg";

export function HomePage() {
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
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-10 md:pb-18 flex flex-col items-center">
          <h1 className="font-sans max-w-4xl text-3xl md:text-5xl font-bold tracking-tight leading-tight text-center text-white mb-4">
            Find your next escape
          </h1>
          <p className="font-sans max-w-xl text-base md:text-lg text-white/80 font-normal text-center mb-10">
            Stays, transport, experiences and hidden gems — all across Zambia, in one place.
          </p>
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar />
          </div>

          {/* Trust bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/70 text-xs md:text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <ShieldCheck className="h-3 w-3 text-white" strokeWidth={2.5} />
              </span>
              <span>10,000+ bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <Star className="h-3 w-3 text-white" strokeWidth={2.5} />
              </span>
              <span>4.8★ average rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <Heart className="h-3 w-3 text-white" strokeWidth={2.5} />
              </span>
              <span>Trusted by 5,000+ travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <Globe className="h-3 w-3 text-white" strokeWidth={2.5} />
              </span>
              <span>Zambia-wide coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Links — Restored Style */}
      <div className="bg-background border-b border-border/40 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-center gap-8 md:gap-20 pt-6 pb-2">
            {[
              { id: "stays", label: "Stays", icon: Hotel, href: "/search?category=stays" },
              { id: "transport", label: "Transport", icon: TrainFront, href: "/search?category=transport" },
              { id: "experiences", label: "Experiences", icon: Ticket, href: "/search?category=attractions" },
              { id: "gems", label: "Gems", icon: Gem, href: "/search?category=gems" },
              { id: "packages", label: "Packages", icon: Tag, href: "/search?category=packages" },
            ].map(({ id, label, icon: Icon, href }) => (
              <Link
                key={id}
                href={href}
                className="group flex flex-col items-center justify-center gap-3 pb-4 border-b-2 transition-all duration-300 border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              >
                <Icon
                  className="h-6 w-6 group-hover:scale-110 transition-all duration-300"
                  strokeWidth={2}
                />
                <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections — Mixed Feed */}
      <main className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-12 md:mt-16">

        {/* ── Trending Destinations ── */}
        <section className="mb-16 md:mb-24 section-enter">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" strokeWidth={2.5} />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Trending Now
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">Popular Destinations</h2>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl">
            Where everyone is going this season
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 stagger-children">
            {mockDestinations.map((dest) => (
              <Link
                key={dest.name}
                href={`/search?location=${dest.name}`}
                className="group block text-center"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl mb-3 bg-muted shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <h3 className="absolute bottom-3 left-3 text-white font-bold text-sm md:text-base drop-shadow-md">
                    {dest.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Popular Stays ── */}
        <section className="mb-16 md:mb-24 section-enter">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hotel className="h-4 w-4 text-primary" strokeWidth={2.5} />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Stays
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Popular Stays</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg max-w-xl">
                Top-rated lodges, hotels and camps across Zambia
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14 stagger-children">
            {mockStays.slice(0, 8).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="flex justify-center mt-14">
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl px-12 border-2 font-black uppercase tracking-widest text-xs h-14 hover:bg-primary hover:text-white transition-all shadow-lg"
              asChild
            >
              <Link href="/search?category=stays">See all stays</Link>
            </Button>
          </div>
        </section>

        {/* ── Top Experiences ── */}
        <section className="mb-16 md:mb-24 section-enter">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Experiences
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Top Experiences</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg max-w-xl">
                Iconic adventures and must-do activities
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
            {mockExperiences.map((item) => (
              <Link
                key={item.id}
                href={`/listings/experiences/${item.id}`}
                className="group block"
              >
                <div className="flex flex-col gap-2 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted mb-2 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
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
          <div className="flex justify-center mt-14">
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl px-12 border-2 font-black uppercase tracking-widest text-xs h-14 hover:bg-primary hover:text-white transition-all shadow-lg"
              asChild
            >
              <Link href="/search?category=attractions">See all experiences</Link>
            </Button>
          </div>
        </section>

        {/* ── Popular Transport Routes ── */}
        <section className="mb-16 md:mb-24 section-enter">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bus className="h-4 w-4 text-primary" strokeWidth={2.5} />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Transport
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Popular Routes</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg max-w-xl">
                Get to your destination comfortably
              </p>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-3 stagger-children">
            {mockTransport.map((route) => (
              <Link
                key={route.id}
                href={`/listings/transport/${route.id}`}
                className="group block"
              >
                <div className="flex flex-col gap-2 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-muted mb-2 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                    <img
                      src={route.image}
                      alt={`${route.from} to ${route.to}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
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
          <div className="flex justify-center mt-14">
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl px-12 border-2 font-black uppercase tracking-widest text-xs h-14 hover:bg-primary hover:text-white transition-all shadow-lg"
              asChild
            >
              <Link href="/search?category=transport">Browse all routes</Link>
            </Button>
          </div>
        </section>

        {/* ── Hidden Gems ── */}
        <section className="mb-16 md:mb-24 section-enter">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gem className="h-4 w-4 text-primary" strokeWidth={2.5} />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Hidden Gems
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Hidden Gems</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg max-w-xl">
                Off-the-beaten-path spots only locals know
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
            {mockGems.map((item) => (
              <Link
                key={item.id}
                href={`/listings/experiences/${item.id}`}
                className="group block"
              >
                <div className="flex flex-col gap-2 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted mb-2 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
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
          <div className="flex justify-center mt-14">
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl px-12 border-2 font-black uppercase tracking-widest text-xs h-14 hover:bg-primary hover:text-white transition-all shadow-lg"
              asChild
            >
              <Link href="/search?category=gems">Discover all gems</Link>
            </Button>
          </div>
        </section>

      </main>

      {/* Promo Banner */}
      <section className="w-full bg-gradient-to-r from-primary/5 via-primary/[0.08] to-primary/5 border-y border-primary/10 mt-24 md:mt-32 py-20 md:py-24 section-enter">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
              <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z" clipRule="evenodd" />
            </svg>
            Smart Travel
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Enjoy More and Spend Less with packages
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Bundle stays, transport and experiences into one seamless package — and save big.
          </p>
          <Button
            size="lg"
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 h-14 shadow-lg shadow-primary/25"
            asChild
          >
            <Link href="/search?category=packages">View Packages</Link>
          </Button>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-24 md:mt-32 mb-32 md:mb-40 section-enter">
        <div className="text-center mb-16 md:mb-20 space-y-4">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Trust & Safety
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Why Book With Us
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-normal max-w-xl mx-auto">
            The trusted choice for Zambian travelers
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              className="group flex flex-col items-center text-center p-8 md:p-10 rounded-xl border border-border/60 bg-card hover:bg-secondary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl shadow-sm"
            >
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl mb-6 md:mb-8 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md shadow-sm bg-primary/10 text-primary">
                <Icon className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3 md:mb-4">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex-1" />
    </div>
  );
}
