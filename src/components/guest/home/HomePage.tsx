"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DateRange } from "@/components/ui/DateRangePicker";
import {
  Home,
  ArrowRight,
  Trees,
  Waves,
  Sun,
  Mountain,
  Navigation,
  LayoutGrid,
  Gem,
} from "lucide-react";
import {
  GlobeHemisphereWest,
  Bed,
  Binoculars,
  CarProfile,
  MapTrifold,
  Tent,
  Buildings,
  SealCheck,
  MapPin,
  Factory,
} from "@phosphor-icons/react";
import { SearchBar } from "@/components/shared/SearchBar";
import { ListingCard } from "@/components/guest/ListingCard";
import { mockStays } from "@/lib/mock-data";

import { cn } from "@/lib/utils";

/* 
   DESIGN SYSTEM TOKENS
   ───────────────────────────────────────────────────────────────────────────
   Primary:  #1A0B2E  (Deep Purple) — Premium, African twilight, gemstones
   Gold:     #D4AF37  — Trust, quality, warmth, universal value signal
   Canvas:   #FDFBF7  — Gallery-quality warm white
   Ink:      #111111  — Maximum readability
   Muted:    #6B7280  — Supporting copy
   CTA:      #1A0B2E  — Deep brand purple for interactive elements
   Dark BG:  #1E1B4B  — Deep indigo for immersive sections
 */

//Animated Section Wrapper ────────────────────────────────────────────
function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}

// Destinations — serves as visual discovery. Each card is a direct
// entry point into search results filtered by that region.
const destinations = [
  {
    id: "victoria-falls",
    name: "Victoria Falls",
    region: "Southern Province",
    stayCount: 24,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    icon: Waves,
    href: "/explore/southern/livingstone/victoria-falls",
  },
  {
    id: "south-luangwa",
    name: "South Luangwa",
    region: "Eastern Province",
    stayCount: 18,
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
    icon: Trees,
    href: "/explore/eastern/mfuwe/south-luangwa-national-park",
  },
  {
    id: "lower-zambezi",
    name: "Lower Zambezi",
    region: "Lusaka Province",
    stayCount: 15,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    icon: Sun,
    href: "/explore/lusaka",
  },
  {
    id: "lusaka",
    name: "Lusaka",
    region: "Capital City",
    stayCount: 42,
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    icon: Navigation,
    href: "/explore/lusaka/lusaka",
  },
  {
    id: "lake-kariba",
    name: "Lake Kariba",
    region: "Southern Province",
    stayCount: 11,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    icon: Waves,
    href: "/explore/southern/kariba/lake-kariba",
  },
  {
    id: "kafue",
    name: "Kafue National Park",
    region: "Western Province",
    stayCount: 9,
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80",
    icon: Mountain,
    href: "/explore/central/kafue/kafue-national-park",
  },
];

// Category navigation tabs — platform's main service categories
const categories = [
  { id: "destinations", label: "Destinations", icon: GlobeHemisphereWest },
  { id: "stays", label: "Stays", icon: Bed },
  { id: "experiences", label: "Experiences", icon: Binoculars },
  { id: "transport", label: "Transport", icon: CarProfile },
  { id: "packages", label: "Packages", icon: MapTrifold },
  { id: "local-tours", label: "Local Tours", icon: Factory },
];

// Value propositions — original content, HTML design styling
const valueProps = [
  {
    icon: Tent,
    title: "Hidden Finds",
    desc: "Escapes you won't find on other platforms. Curated, vetted, and waiting to be discovered.",
  },
  {
    icon: Buildings,
    title: "Affordable & Premium",
    desc: "Budget-friendly stays that don't compromise on quality, character or experience.",
  },
  {
    icon: SealCheck,
    title: "Verified Hosts",
    desc: "Every host is verified by our team before going live. You're always in safe hands.",
  },
  {
    icon: MapPin,
    title: "Local Experts",
    desc: "A Zambia-based team with insider knowledge of the best stays, routes, and tours.",
  },
];

// Curated collections — thematic browsing experiences
const collections = [
  {
    id: "farms-near-lusaka",
    title: "Farms near Lusaka",
    desc: "Escape the city to working farmsteads in Chisamba, Chongwe, and beyond.",
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&q=80",
    stayCount: 12,
    color: "#2D4A2D",
  },
  {
    id: "lakeside-retreats",
    title: "Lakeside Retreats",
    desc: "Wake up to shimmering water views on Lake Kariba and Lake Tanganyika.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    stayCount: 8,
    color: "#1A3A4A",
  },
  {
    id: "bush-wilderness",
    title: "Bush & Wilderness",
    desc: "Deep safari camps in South Luangwa, Kafue, and Lower Zambezi.",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80",
    stayCount: 15,
    color: "#3A2810",
  },
  {
    id: "urban-stays",
    title: "Urban Stays",
    desc: "Boutique hotels and city pads in Lusaka, Ndola, and Kitwe.",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
    stayCount: 22,
    color: "#1A0B2E",
  },
  {
    id: "copperbelt-heritage",
    title: "Copperbelt Heritage",
    desc: "Industrial history tours and stays in Zambia's mining heartland.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    stayCount: 6,
    color: "#4A3020",
  },
];

// Flash deals — limited-time discounted escapes
const flashDeals = [
  {
    id: "deal-1",
    name: "Kafue River Lodge",
    location: "Kafue National Park",
    originalPrice: 380,
    dealPrice: 266,
    discount: 30,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    badge: "Flash Sale",
    ends: "2 days left",
  },
  {
    id: "deal-2",
    name: "Bush Camp Adventure",
    location: "South Luangwa",
    originalPrice: 280,
    dealPrice: 210,
    discount: 25,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
    badge: "Weekend Deal",
    ends: "5 days left",
  },
  {
    id: "deal-3",
    name: "Lusaka Boutique Stay",
    location: "Lusaka",
    originalPrice: 120,
    dealPrice: 90,
    discount: 25,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
    badge: "Last Minute",
    ends: "1 day left",
  },
  {
    id: "deal-4",
    name: "Lake Kariba Retreat",
    location: "Kariba",
    originalPrice: 195,
    dealPrice: 146,
    discount: 25,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    badge: "Limited Spots",
    ends: "3 days left",
  },
  {
    id: "deal-5",
    name: "Victoria Falls Hotel",
    location: "Livingstone",
    originalPrice: 320,
    dealPrice: 256,
    discount: 20,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    badge: "Hot Deal",
    ends: "4 days left",
  },
];

//Section Header Component ────────────────────────────────────────────
function SectionHeader({
  eyebrow,
  title,
  desc,
  href,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-7">
      <div>
        <p className="font-script text-xl md:text-2xl text-[#D4AF37] mb-1">{eyebrow}</p>
        <h2 className="font-display text-2xl font-bold tracking-tight text-[#1A0B2E] leading-[1.15]">
          {title}
        </h2>
        <p className="text-[#64748B] mt-1.5 text-sm max-w-lg leading-relaxed">{desc}</p>
      </div>
      {href && (
        <Link
          href={href}
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A0B2E] hover:text-[#2A154A] transition-all duration-200 group"
        >
          <span>See all</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

// MAIN COMPONENT

export function HomePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("stays");

  const handleSearch = (term: string, dates: DateRange, guests: number) => {
    const targetRoute = activeCategory === "destinations" ? "explore" : activeCategory;
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    router.push(`/${targetRoute}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* 
          HERO — Borrowing the auth page's big header layout.
          Taller hero, eyebrow → headline → subtext hierarchy, and the
          search bar floats as a card below the hero (overlapping the edge).
       */}
      <section className="relative pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#1A0B2E]">
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow — gold uppercase, matching auth page style */}
            <p className="font-script text-2xl text-[#D4AF37] mb-4">Discover your backyard</p>

            {/* Headline — bold but respectful sizing */}
            <h1 className="font-display text-[1.75rem] md:text-[2.75rem] lg:text-[3rem] font-bold tracking-tight text-white leading-[1.15]">
              {/* Mobile: short version */}
              <span className="md:hidden">
                Find your next{" "}
                <span className="font-script text-[1.3em] font-normal text-[#D4AF37] lowercase relative top-1">
                  escape
                </span>{" "}
                nearby
              </span>
              {/* Desktop: full version */}
              <span className="hidden md:inline">
                Find your hidden{" "}
                <span className="font-script text-[1.3em] font-normal text-[#D4AF37] lowercase relative top-1">
                  escape
                </span>
                <br />
                near a gem you&apos;ve never seen
              </span>
            </h1>

            {/* Subtext — respectful size like auth page */}
            <p className="mt-4 text-[14px] md:text-[15px] text-white/60 leading-relaxed max-w-lg mx-auto">
              Lodges, camps, and guesthouses within reach — curated around Zambia&apos;s secret
              spots.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar — floats below the hero as a card, overlapping the edge */}
      <div className="relative z-20 -mt-12 md:-mt-14 mx-auto max-w-2xl px-4">
        <SearchBar onSearch={handleSearch} activeCategory={activeCategory} />
      </div>

      {/* Category tabs — matching HTML design's .cats-section */}
      <div className="border-b border-[#E0DBD0]">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-5">
          <div className="flex items-start gap-5 md:gap-5 overflow-x-auto scrollbar-hide">
            {categories.map(({ id, label, icon: Icon }) => (
              <span
                key={id}
                onClick={() => setActiveCategory(id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-4 px-6 border-b-2 text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all duration-200",
                  activeCategory === id
                    ? "border-[#1A0B2E] text-[#1A0B2E]"
                    : "border-transparent text-[#64748B] hover:text-[#1A0B2E] hover:border-[#1A0B2E]",
                )}
              >
                <Icon className="h-5 w-5" weight="duotone" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 
          MAIN CONTENT — Destinations, vibes, and popular stays
       */}
      <main className="flex-1">
        <section className="pt-5 pb-12">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
            <SectionHeader
              eyebrow="Explore Zambia"
              title="Popular Destinations"
              desc="Not sure where to go? Discover top-rated stays, local tours, and seamless transport options around Zambia's most sought-after locations."
              href="/explore"
            />

            {/* Horizontal scroll — all screen sizes, like Airbnb */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
              {destinations.map((destination) => {
                const Icon = destination.icon;
                return (
                  <Link
                    key={destination.id}
                    href={destination.href || "/explore"}
                    className="group relative block overflow-hidden rounded-2xl bg-gray-100 w-[200px] sm:w-[220px] md:w-[240px] shrink-0 aspect-[16/10] shadow-[0_2px_12px_rgba(0,0,0,0.10)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(42,27,61,0.18)] hover:-translate-y-1 snap-start"
                    style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                  >
                    <img
                      src={destination.image}
                      alt={destination.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30">
                      <Icon className="h-3.5 w-3.5 text-[#D4AF37]" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <p className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest mb-1">
                        {destination.region}
                      </p>
                      <h3 className="font-display text-white font-bold text-sm leading-tight mb-1">
                        {destination.name}
                      </h3>
                      {destination.stayCount && (
                        <p className="text-white/50 text-[10px] font-medium flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          {destination.stayCount} stays
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Popular stays row */}
            <AnimatedSection delay={150}>
              <div className="mt-14 md:mt-16">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="font-script text-xl md:text-2xl text-[#D4AF37] mb-1">
                      Accommodation
                    </p>
                    <h3 className="font-display text-xl md:text-[1.5rem] font-bold tracking-tight text-[#1A0B2E]">
                      Popular Stays
                    </h3>
                    <p className="hidden md:block text-[#64748B] mt-1 text-sm max-w-lg leading-relaxed">
                      Explore highly-rated safari lodges, city guesthouses, and farm retreats that
                      our guests love returning to time and time again.
                    </p>
                  </div>
                  <Link
                    href="/stays"
                    className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A0B2E] hover:text-[#2A154A] transition-all duration-200 group shrink-0"
                  >
                    <span>See all stays</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Horizontal scroll — all screen sizes, like Airbnb */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                  {mockStays.slice(0, 6).map((listing, idx) => (
                    <div
                      key={listing.id}
                      className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start"
                    >
                      <ListingCard listing={listing} isExclusive={idx < 2} />
                    </div>
                  ))}
                </div>

                {/* Mobile "See all" link */}
                <div className="mt-5 text-center md:hidden">
                  <Link
                    href="/stays"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A0B2E] hover:text-[#2A154A] transition-all duration-200 group"
                  >
                    <span>See all stays</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* 
          CURATED COLLECTIONS — Themed browsing experiences
       */}
      <AnimatedSection delay={100}>
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8 pb-14 md:pb-16">
          <SectionHeader
            eyebrow="Collections"
            title="Explore by theme"
            desc="Hand-picked groups of escapes — whether you're after farm life, lakeside views, or the wild bush."
          />

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
            {collections.map(({ id, title, desc, image, stayCount, color }) => (
              <Link
                key={id}
                href="/explore"
                className="group relative block overflow-hidden rounded-2xl w-[260px] sm:w-[280px] shrink-0 aspect-[4/3] shadow-[0_2px_12px_rgba(0,0,0,0.10)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(42,27,61,0.18)] hover:-translate-y-1 snap-start"
                style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
              >
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${color}DD, ${color}33, transparent)`,
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 bg-[#D4AF37] text-[#1A0B2E] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                    {stayCount} escapes
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="font-display text-white font-bold text-sm leading-tight mb-1">
                    {title}
                  </h3>
                  <p className="text-white/60 text-[11px] leading-relaxed line-clamp-2">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* 
          STORY — Dark background to make gold pop, grid split with image
       */}
      <section className="bg-[#1A0B2E]">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-10 md:py-14">
          <AnimatedSection delay={80}>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Text side */}
              <div>
                <p className="font-script text-xl md:text-2xl md:text-[1.6rem] text-[#D4AF37] mb-3">
                  A note on hidden gems
                </p>
                <div className="w-12 h-0.5 bg-[#D4AF37] mb-6" />
                <p className="text-[15px] md:text-[17px] text-white/70 leading-[1.8] md:leading-[1.85] font-light">
                  Every hidden gem has a story — and we believe you should get to know it before you
                  go. From the farmstead in Chisamba where roosters wake you instead of alarms, to
                  the artists&apos; lodge in Livingstone where walls double as canvases, each place
                  on Nearby Escapes was chosen because it has something to say. Something authentic.
                  Something you won&apos;t find on the usual booking sites. These aren&apos;t just
                  stays. They&apos;re chapters waiting to be lived — and we&apos;re here to help you
                  find yours.
                </p>
              </div>
              {/* Image side */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1A1030] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <img
                  src="https://images.unsplash.com/photo-1546703565-373809930f78?w=800&q=80"
                  alt="Hidden waterfall in the Zambian wilderness"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 
          DISCOVER HIDDEN GEMS
       */}
      <AnimatedSection delay={100}>
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 md:py-16">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="font-script text-xl md:text-2xl text-[#D4AF37] mb-1">Hidden Zambia</p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#1A0B2E] leading-[1.15]">
                Discover Hidden Gems
              </h2>
              <p className="text-[#64748B] mt-1.5 text-sm max-w-lg leading-relaxed">
                Off-the-beaten-path spots, farm stays, and local secrets only insiders know about.
              </p>
            </div>
            <Link
              href="/explore"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A0B2E] hover:text-[#2A154A] transition-all duration-200 group"
            >
              <span>Explore all</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Horizontal scroll — all screen sizes, like Airbnb */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
            {[
              {
                tag: "Farm life",
                title: "We spent a weekend milking cows in Chisamba",
                meta: "5 min read · Real guest story",
                bg: "#1C3020",
                image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&q=70",
                href: "/gems",
              },
              {
                tag: "Industrial",
                title: "Inside Zambia's copper mining heritage",
                meta: "8 min read · Hidden gem guide",
                bg: "#2A1C3A",
                image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=70",
                href: "/gems",
              },
              {
                tag: "Wildlife",
                title: "The Kafue day trip nobody talks about",
                meta: "6 min read · Local insider",
                bg: "#3A2808",
                image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=70",
                href: "/gems",
              },
            ].map(({ tag, title, meta, image, href }) => (
              <Link
                key={title}
                href={href}
                className="group relative block overflow-hidden rounded-2xl w-[260px] sm:w-[300px] md:w-[340px] shrink-0 aspect-[4/3] bg-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.10)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(42,27,61,0.18)] hover:-translate-y-1 snap-start"
              >
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <p className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-[1.2px] mb-1">
                    {tag}
                  </p>
                  <h3 className="font-display text-white font-bold text-sm leading-snug mb-1.5">
                    {title}
                  </h3>
                  <p className="text-white/50 text-[11px]">{meta}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 text-center md:hidden">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A0B2E] group"
            >
              <span>Explore all gems</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* 
          FOR PROPERTY OWNERS CTA — Grid split layout: image on left, content on right
       */}
      <AnimatedSection delay={100}>
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-8">
          <SectionHeader
            eyebrow="Weekend Escapes"
            title="Flash Deals"
            desc="Limited-time discounts on hand-picked stays. Book now before they're gone."
            href="/stays"
          />

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
            {flashDeals.map((deal) => (
              <Link
                key={deal.id}
                href={`/listings/stays/${deal.id.replace("deal-", "")}`}
                className="group relative block overflow-hidden rounded-2xl w-[260px] sm:w-[280px] shrink-0 aspect-[4/3] bg-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.10)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(42,27,61,0.18)] hover:-translate-y-1 snap-start"
                style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
              >
                <img
                  src={deal.image}
                  alt={deal.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                {/* Discount badge — top-left */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                    -{deal.discount}% {deal.badge}
                  </span>
                </div>
                {/* Urgency cue — top-right */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white/90 text-[9px] font-bold px-2 py-1 rounded-md">
                    {deal.ends}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <p className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest mb-1">
                    {deal.location}
                  </p>
                  <h3 className="font-display text-white font-bold text-sm leading-tight mb-1.5">
                    {deal.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">ZMW {deal.dealPrice}</span>
                    <span className="text-white/40 text-[11px] line-through">
                      ZMW {deal.originalPrice}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 text-center md:hidden">
            <Link
              href="/stays"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A0B2E] group"
            >
              <span>View all deals</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* 
          FOR PROPERTY OWNERS CTA — Grid split layout: image on left, content on right
       */}
      <AnimatedSection delay={100}>
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-[#F9F7F2] rounded-2xl overflow-hidden border border-[#D4AF37]/60">
            {/* Image side */}
            <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[280px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
                alt="Cozy safari lodge interior"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
            </div>
            {/* Content side */}
            <div className="px-6 md:px-0 md:pr-10 py-8">
              <p className="text-[10px] font-bold text-[#D4AF37] tracking-[1px] uppercase mb-2">
                For property owners
              </p>
              <h2 className="font-display text-xl md:text-2xl font-bold text-[#334155] leading-snug mb-3">
                Your guest house deserves to be discovered
              </h2>
              <p className="text-[13px] text-[#64748B] leading-relaxed max-w-md mb-6">
                List your property with fair commissions. We grow together.
              </p>
              <Link
                href="/become-host"
                className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#d5b069] text-[#111111] text-sm font-bold px-8 py-3 rounded-xl transition-all duration-200 w-full sm:w-auto"
              >
                List your escape <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* 
          WHY BOOK WITH US — Matching HTML design's value-strip section.
          Dark plum background with white text, gold icon containers,
          and a 3-column horizontal layout for value props.
       */}
      <section className="pt-14 pb-8 md:pt-[56px] md:pb-8 bg-[#1A0B2E]">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <AnimatedSection delay={0}>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 md:mb-[32px] text-center md:text-left">
              Why book with us
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-[32px]">
            {valueProps.map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 100}>
                <div className="flex gap-4 items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(201,168,76,0.15)] text-[#D4AF37]">
                    <Icon className="h-[22px] w-[22px]" weight="regular" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-white mb-1">{title}</h3>
                    <p className="text-[13px] text-[#9B95A8] leading-relaxed">{desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="h-0" />
    </div>
  );
}
