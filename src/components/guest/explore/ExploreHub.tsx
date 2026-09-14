"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  MapPin,
  ArrowRight,
  Clock,
  Users,
  Bed,
  Bus,
  Car,
  Home,
  Compass,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StayCard, ExperienceCard, TransportCard } from "@/components/shared/ListingCards";
import type { Stay, Experience, Transport, PlaceToVisit, AttractionItem } from "@/lib/api/explore";

interface ExploreHubProps {
  provinceId?: string;
  cityId?: string;
  attractionId?: string;
  provinceName?: string;
  cityName?: string;
  attractionName?: string;
  coverImage?: string;
  stays: Stay[];
  experiences: Experience[];
  transport: Transport[];
  placesToVisit?: PlaceToVisit[];
  attractions?: AttractionItem[];
}

type Tab = "explore" | "stays" | "experiences" | "transport";

// Tab config
const TAB_ICONS: Record<Tab, React.ReactNode> = {
  explore: <Compass className="h-4 w-4" />,
  stays: <Bed className="h-4 w-4" />,
  experiences: <Zap className="h-4 w-4" />,
  transport: <Bus className="h-4 w-4" />,
};

// Section Heading
function SectionHeading({
  title,
  subtitle,
  href,
  cta,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div className="flex items-start gap-3">
        {/* Colored left accent bar */}
        <div className="w-1 h-8 rounded-full bg-[#6b2bb8] mt-0.5 shrink-0" />
        <div>
          <h2 className="text-lg md:text-xl font-black text-[#1a1a1f] tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-[#5a5a66] mt-0.5 font-medium">{subtitle}</p>}
        </div>
      </div>
      {href && cta && (
        <Link
          href={href}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#6b2bb8] hover:text-[#5a1f9e] transition-colors group"
        >
          {cta}{" "}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

// Horizontal Carousel
function Carousel({ children, seeAllHref }: { children: React.ReactNode; seeAllHref?: string }) {
  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
        {children}
      </div>
      {seeAllHref && (
        <div className="mt-4 text-center md:hidden">
          <Link
            href={seeAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6b2bb8] hover:text-[#5a1f9e] transition-colors"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

// Place Card (City / area card)
function PlaceCard({ place }: { place: PlaceToVisit }) {
  return (
    <Link
      href={`/explore/${place.id}`}
      className="group block min-w-[160px] sm:min-w-[180px] md:min-w-[200px] shrink-0 rounded-2xl overflow-hidden shadow-sm border border-neutral-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 snap-start"
    >
      <div className="relative aspect-[3/4]">
        <img
          src={place.image}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-black text-white text-sm leading-tight">{place.name}</h3>
          <p className="text-white/60 text-[11px] mt-0.5 font-medium">{place.stays} stays</p>
        </div>
      </div>
    </Link>
  );
}

// Attraction Card
function AttractionCard({ attraction }: { attraction: AttractionItem }) {
  return (
    <Link
      href="#"
      className="group block min-w-[240px] sm:min-w-[260px] md:min-w-[280px] shrink-0 rounded-2xl bg-white shadow-sm border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 snap-start"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* rating pill overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
          <Star className="h-3 w-3 fill-[#f2ba0d] text-[#f2ba0d]" />
          <span className="text-white text-[11px] font-bold">{attraction.rating}</span>
        </div>
        {/* Travelers' choice badge */}
        {attraction.rating >= 4.8 && (
          <div className="absolute top-3 right-3 bg-[#f2ba0d] text-[#1a1a1f] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm">
            Top Pick
          </div>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-bold text-sm text-[#1a1a1f] group-hover:text-[#6b2bb8] transition-colors line-clamp-1 leading-tight">
          {attraction.name}
        </h3>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "h-2.5 w-2.5",
                  i <= Math.floor(attraction.rating)
                    ? "fill-[#f2ba0d] text-[#f2ba0d]"
                    : "fill-neutral-200 text-neutral-200",
                )}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#5a5a66] font-medium">({attraction.reviews})</span>
        </div>
      </div>
    </Link>
  );
}

// Search Results Banner (isolated to its own Suspense-safe component)
function SearchResultsBanner() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  if (!q) return null;
  return <span className="text-white/60 text-sm">Results for &quot;{q}&quot;</span>;
}

// Main Component

export function ExploreHub({
  provinceId,
  cityId,
  attractionId,
  provinceName,
  cityName,
  attractionName,
  coverImage,
  stays,
  experiences,
  transport,
  placesToVisit = [],
  attractions = [],
}: ExploreHubProps) {
  const [activeTab, setActiveTab] = useState<Tab>("explore");

  const locationName = attractionName ?? cityName ?? provinceName ?? "Explore";
  const pageTitle = locationName;

  const tabs: { key: Tab; label: string }[] = [
    { key: "explore", label: "Explore" },
    { key: "stays", label: "Stays" },
    { key: "experiences", label: "Experiences" },
    { key: "transport", label: "Transport" },
  ];

  const showStays = activeTab === "explore" || activeTab === "stays";
  const showExperiences = activeTab === "explore" || activeTab === "experiences";
  const showTransport = activeTab === "explore" || activeTab === "transport";

  // Breadcrumb trail
  const crumbs = [
    { label: "Explore", href: "/explore" },
    provinceName && { label: provinceName, href: `/explore/${provinceId}` },
    cityName && { label: cityName, href: `/explore/${provinceId}/${cityId}` },
    attractionName && { label: attractionName, href: "#" },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden pt-16" style={{ minHeight: 340 }}>
        {/* Background image */}
        {coverImage ? (
          <img
            src={coverImage}
            alt={locationName}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A0B2E] to-[#2D1060]" />
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-8 pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-6 flex-wrap" aria-label="Breadcrumb">
            {crumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/40" />}
                {i === crumbs.length - 1 ? (
                  <span className="text-white/90 text-xs font-semibold">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-white/50 hover:text-white/80 text-xs font-medium transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Title */}
          <h1 className="font-black text-3xl md:text-5xl text-white leading-[1.1] tracking-tight max-w-2xl mb-4">
            {pageTitle}
          </h1>

          <Suspense fallback={null}>
            <SearchResultsBanner />
          </Suspense>
        </div>
      </section>

      {/* STICKY TAB NAV */}
      <div className="sticky top-[64px] z-20 bg-white border-b border-neutral-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer",
                  activeTab === tab.key
                    ? "bg-[#6b2bb8] text-white shadow-sm shadow-[#6b2bb8]/30"
                    : "text-[#5a5a66] hover:text-[#1a1a1f] hover:bg-neutral-100",
                )}
              >
                {TAB_ICONS[tab.key]}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT SECTIONS */}

      {/* Popular Experiences */}
      {showExperiences && experiences.length > 0 && (
        <section className="py-8 md:py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              title="Popular Experiences"
              subtitle={`${experiences.length} experiences available`}
              href="/experiences"
              cta="See all"
            />
            <Carousel seeAllHref="/experiences">
              {experiences.slice(0, 6).map((exp) => (
                <div
                  key={exp.id}
                  className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] shrink-0 snap-start"
                >
                  <ExperienceCard exp={exp} />
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* Places to Visit */}
      {placesToVisit.length > 0 && (
        <section className="py-8 md:py-10 bg-white border-y border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading title="Places to Visit" subtitle="Explore the surrounding area" />
            <Carousel>
              {placesToVisit.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* Top Attractions */}
      {attractions.length > 0 && (
        <section className="py-8 md:py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading title="Top Attractions" subtitle="Must-see landmarks & highlights" />
            <Carousel>
              {attractions.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* Where to Stay */}
      {showStays && stays.length > 0 && (
        <section className="py-8 md:py-10 bg-white border-y border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              title="Where to Stay"
              subtitle={`${stays.length} properties found`}
              href="/stays"
              cta="See all"
            />
            <Carousel seeAllHref="/stays">
              {stays.slice(0, 6).map((stay) => (
                <div
                  key={stay.id}
                  className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] shrink-0 snap-start"
                >
                  <StayCard stay={stay} />
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* Things To Do (secondary experiences block) */}
      {showExperiences && experiences.length > 3 && (
        <section className="py-8 md:py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              title="Things to Do"
              subtitle="More ways to experience this destination"
              href="/experiences"
              cta="Browse all"
            />
            <Carousel seeAllHref="/experiences">
              {experiences.slice(3, 9).map((exp) => (
                <div
                  key={exp.id}
                  className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] shrink-0 snap-start"
                >
                  <ExperienceCard exp={exp} />
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* Getting Around */}
      {showTransport && transport.length > 0 && (
        <section className="py-8 md:py-10 bg-white border-y border-neutral-100">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              title="Getting Around"
              subtitle={`${transport.length} transport options available`}
              href="/transport"
              cta="See all"
            />
            <Carousel seeAllHref="/transport">
              {transport.slice(0, 6).map((route) => (
                <div
                  key={route.id}
                  className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] shrink-0 snap-start"
                >
                  <TransportCard route={route} />
                </div>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* MORE IN LOCATION card */}
      {activeTab === "explore" && (
        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading title={`More in ${locationName}`} subtitle="Keep discovering" />
            <Link
              href={`/${provinceId ? `explore/${provinceId}` : "#"}`}
              className="group relative flex overflow-hidden rounded-2xl bg-neutral-100 h-44 shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              {coverImage && (
                <img
                  src={coverImage}
                  alt={locationName}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 flex flex-col justify-center px-8">
                <p className="text-[#f2ba0d] text-xs font-bold uppercase tracking-widest mb-2">
                  Continue exploring
                </p>
                <h3 className="font-black text-white text-2xl md:text-3xl flex items-center gap-3">
                  {locationName}
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 group-hover:bg-[#6b2bb8] transition-colors">
                    <ChevronRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5" />
                  </span>
                </h3>
                <p className="text-white/50 text-sm mt-1.5">Explore all categories</p>
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
