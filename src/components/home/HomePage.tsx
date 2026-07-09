"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  ArrowRight,
  BadgeCheck,
  Compass,
  Sparkles,
  MapPin,
  Trees,
  Waves,
  Sun,
  Mountain,
  Navigation,
  LayoutGrid,
  Gem,
} from "lucide-react";
import { SearchBar } from "@/components/explore/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import { mockStays } from "@/lib/mock-data";

import { cn } from "@/lib/utils";

/*
   DESIGN SYSTEM TOKENS
   
   Primary:  #3D2463  (Deep Purple) — Premium, African twilight, gemstones
   Gold:     #C9A84C  — Trust, quality, warmth, universal value signal
   Canvas:   #FDFBF7  — Gallery-quality warm white
   Ink:      #111111  — Maximum readability
   Muted:    #6B7280  — Supporting copy
   CTA:      #3D2463  — Deep brand purple for interactive elements
   Dark BG:  #1E1B4B  — Deep indigo for immersive sections
═══════════════════════════════════════════════════════════════════════════ */

// ── Scroll-triggered entrance animation hook ────────────────────────────
function useInView(
  options?: IntersectionObserverInit,
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}

// ── Animated Section Wrapper ────────────────────────────────────────────
function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
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
  },
  {
    id: "south-luangwa",
    name: "South Luangwa",
    region: "Eastern Province",
    stayCount: 18,
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
    icon: Trees,
  },
  {
    id: "lower-zambezi",
    name: "Lower Zambezi",
    region: "Lusaka Province",
    stayCount: 15,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    icon: Sun,
  },
  {
    id: "lusaka",
    name: "Lusaka",
    region: "Capital City",
    stayCount: 42,
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    icon: Navigation,
  },
  {
    id: "lake-kariba",
    name: "Lake Kariba",
    region: "Southern Province",
    stayCount: 11,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    icon: Waves,
  },
  {
    id: "kafue",
    name: "Kafue National Park",
    region: "Western Province",
    stayCount: 9,
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80",
    icon: Mountain,
  },
];

// Category navigation tabs — platform's main service categories
const categories = [
  { id: "destinations", label: "Destinations", icon: LayoutGrid },
  { id: "stays", label: "Stays", icon: Home },
  { id: "experiences", label: "Experiences", icon: Gem },
  { id: "transport", label: "Transport", icon: Navigation },
  { id: "packages", label: "Packages", icon: Sparkles },
];

// Value propositions — original content, HTML design styling
const valueProps = [
  {
    icon: Compass,
    title: "Hidden Finds",
    desc: "Escapes you won't find on other platforms. Curated, vetted, and waiting to be discovered.",
  },
  {
    icon: Sparkles,
    title: "Affordable & Premium",
    desc: "Budget-friendly stays that don't compromise on quality, character or experience.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Hosts",
    desc: "Every host is verified by our team before going live. You're always in safe hands.",
  },
  {
    icon: MapPin,
    title: "Local Experts",
    desc: "A Zambia-based team with insider knowledge of the best stays, routes, and tours.",
  },
];

// ── Section Header Component ────────────────────────────────────────────
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
        <p className="font-script text-xl md:text-2xl text-gold mb-1">{eyebrow}</p>
        <h2 className="font-display text-2xl font-bold tracking-tight text-[#3D2463] leading-[1.15]">
          {title}
        </h2>
        <p className="text-[#8A8480] mt-1.5 text-base max-w-lg leading-relaxed">{desc}</p>
      </div>
      {href && (
        <Link
          href={href}
          className="hidden md:inline-flex items-center gap-1.5 text-base font-semibold text-[#3D2463] hover:text-[#2A154A] transition-all duration-200 group"
        >
          <span>See all</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* ════════════════════════════════════════════════════════════════════
          HERO — Dark ink/purple background from the inspiration HTML.
          White text, gold overline & script accent, search bar on dark.
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-14 pb-16 md:pt-20 md:pb-16 overflow-hidden bg-[#1C1030]">
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 text-center">
          {/* Headline */}
          <h1 className="font-display text-4xl md:text-[3.25rem] lg:text-[3.25rem] font-bold tracking-tight text-white leading-[1.1] mb-4 max-w-4xl mx-auto text-center">
            {/* Mobile: short version */}
            <span className="md:hidden">
              Find your next{" "}
              <span className="font-script text-[1.3em] font-normal text-gold lowercase relative top-1">
                escape
              </span>{" "}
              nearby
            </span>
            {/* Desktop: full version */}
            <span className="hidden md:inline">
              Find your hidden{" "}
              <span className="font-script text-[1.3em] font-normal text-gold lowercase relative top-1">
                escape
              </span>
              <br />
              near a gem you&apos;ve never seen
            </span>
          </h1>



          {/* ── Search Bar ── */}
          <div className="mx-auto max-w-4xl relative z-20 mt-2">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ── Category tabs — matching HTML design's .cats-section ── */}
      <div className="border-b border-[#E0DBD0]">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-5">
          <div className="flex items-start gap-5 md:gap-5 overflow-x-auto scrollbar-hide">
            {categories.map(({ id, label, icon: Icon }) => (
              <span
                key={id}
                className="flex flex-col items-center gap-1.5 py-4 px-6 border-b-2 border-transparent text-[#8A8480] hover:text-[#3D2463] hover:border-[#3D2463] text-base font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all duration-200"
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MAIN CONTENT — Destinations, vibes, and popular stays
      ════════════════════════════════════════════════════════════════════ */}
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
                    href="/explore"
                    className="group relative block overflow-hidden rounded-2xl w-[160px] sm:w-[200px] shrink-0 aspect-[4/3] bg-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.10)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(61,36,99,0.18)] hover:-translate-y-1 snap-start"
                    style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                  >
                    <img
                      src={destination.image}
                      alt={destination.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A84C]/20 backdrop-blur-sm border border-[#C9A84C]/30">
                      <Icon className="h-3.5 w-3.5 text-[#C9A84C]" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-widest mb-1">
                        {destination.region}
                      </p>
                      <h3 className="font-display text-white font-bold text-base leading-tight mb-1">
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

            {/* ── Popular stays row ── */}
            <AnimatedSection delay={150}>
              <div className="mt-14 md:mt-16">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="font-script text-xl md:text-2xl text-gold mb-1">
                      Accommodation
                    </p>
                    <h3 className="font-display text-xl md:text-[1.5rem] font-bold tracking-tight text-[#3D2463]">
                      Popular Stays
                    </h3>
                    <p className="hidden md:block text-[#8A8480] mt-1 text-base max-w-lg leading-relaxed">
                      Explore highly-rated safari lodges, city guesthouses, and farm retreats that
                      our guests love returning to time and time again.
                    </p>
                  </div>
                  <Link
                    href="/stays"
                    className="hidden md:inline-flex items-center gap-1.5 text-base font-semibold text-[#3D2463] hover:text-[#2A154A] transition-all duration-200 group shrink-0"
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
                    className="inline-flex items-center gap-1.5 text-base font-semibold text-[#3D2463] hover:text-[#2A154A] transition-all duration-200 group"
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
          STORY — Short narrative connecting users to Hidden Gems
      */}
      <AnimatedSection delay={80}>
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8 pt-8 md:pt-12 pb-2 md:pb-4">
          <div className="relative max-w-3xl mx-auto">
            {/* Gold eyebrow */}
            <p className="font-script text-xl md:text-2xl text-gold mb-2 text-center md:text-left">
              A note on hidden gems
            </p>
            {/* Decorative gold line */}
            <div className="w-12 h-0.5 bg-[#C9A84C] mb-5 mx-auto md:mx-0" />
            <p className="text-[15px] md:text-[17px] text-[#55504B] leading-[1.8] md:leading-[1.85] font-light text-center md:text-left">
              Every hidden gem has a story — and we believe you should get to know it before you go.
              From the farmstead in Chisamba where roosters wake you instead of alarms, to the
              artists&apos; lodge in Livingstone where walls double as canvases, each place on
              Nearby Escapes was chosen because it has something to say. Something authentic.
              Something you won&apos;t find on the usual booking sites. These aren&apos;t just
              stays. They&apos;re chapters waiting to be lived — and we&apos;re here to help you
              find yours.
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* 
          DISCOVER HIDDEN GEMS
      */}
      <AnimatedSection delay={100}>
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8 py-12 md:py-16">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="font-script text-xl md:text-2xl text-gold mb-1">Hidden Zambia</p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#3D2463] leading-[1.15]">
                Discover Hidden Gems
              </h2>
              <p className="text-[#8A8480] mt-1.5 text-base max-w-lg leading-relaxed">
                Off-the-beaten-path spots, farm stays, and local secrets only insiders know about.
              </p>
            </div>
            <Link
              href="/gems"
              className="hidden md:inline-flex items-center gap-1.5 text-base font-semibold text-[#3D2463] hover:text-[#2A154A] transition-all duration-200 group"
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
                meta: "5 min read · Real traveller story",
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
                className="group relative block overflow-hidden rounded-2xl w-[260px] sm:w-[300px] md:w-[340px] shrink-0 aspect-[4/3] bg-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.10)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(61,36,99,0.18)] hover:-translate-y-1 snap-start"
              >
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[1.2px] mb-1">
                    {tag}
                  </p>
                  <h3 className="font-display text-white font-bold text-base leading-snug mb-1.5">
                    {title}
                  </h3>
                  <p className="text-white/50 text-[11px]">{meta}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 text-center md:hidden">
            <Link
              href="/gems"
              className="inline-flex items-center gap-1.5 text-base font-semibold text-[#3D2463] group"
            >
              <span>Explore all gems</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* ════════════════════════════════════════════════════════════════════
          BECOME A HOST CTA — Single constant section
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection delay={100}>
        <section className="mx-4 md:mx-auto md:max-w-7xl md:px-8 mb-16">
          <div className="border-[1.5px] border-[#C9A84C] rounded-2xl px-6 py-7 md:flex md:items-center md:justify-between md:gap-10 bg-[#FAF7F2]">
            <div className="mb-5 md:mb-0">
              <p className="text-[10px] font-bold text-[#C9A84C] tracking-[1px] uppercase mb-1.5">
                Become a host
              </p>
              <h2 className="font-display text-xl md:text-2xl font-bold text-[#1C1030] leading-snug mb-2">
                Turn your passion into profit
              </h2>
              <p className="text-[13px] text-[#8A8480] leading-relaxed max-w-md">
                List your stays, experiences, or transport on Nearby Escapes. Fair commissions, real
                earnings, and a team that&apos;s got your back.
              </p>
            </div>
            <Link
              href="/become-host"
              className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#B48E3E] text-[#1C1030] text-base font-bold px-8 py-3 rounded-xl transition-all duration-200 shrink-0 w-full md:w-auto"
            >
              List your escape <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* ════════════════════════════════════════════════════════════════════
          WHY BOOK WITH US — White background with purple hue contrast.
      ════════════════════════════════════════════════════════════════════ */}
      <section className="pt-14 pb-0 md:py-[56px] bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <AnimatedSection delay={0}>
            <h2 className="text-xl md:text-2xl font-bold text-[#3D2463] mb-8 md:mb-[32px] text-center md:text-left">
              Why book with us
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-[32px]">
            {valueProps.map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 100}>
                <div className="flex gap-4 items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#3D2463]/10 text-[#3D2463]">
                    <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-[#3D2463] mb-1">{title}</h3>
                    <p className="text-[13px] text-[#8A8480] leading-relaxed">{desc}</p>
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
