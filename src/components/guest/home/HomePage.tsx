"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DateRange } from "@/components/ui/DateRangePicker";
import { Home, ArrowRight, Star, Trees, Waves, Sun, Mountain, Navigation } from "lucide-react";
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
import { mockStays, mockExperiences, mockTransport, mockPackages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────────

const destinations = [
  { id: "victoria-falls", name: "Victoria Falls",      region: "Southern Province", stayCount: 24, icon: Waves,      href: "/explore/southern/livingstone/victoria-falls",    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80" },
  { id: "south-luangwa",  name: "South Luangwa",       region: "Eastern Province",  stayCount: 18, icon: Trees,      href: "/explore/eastern/mfuwe/south-luangwa-national-park", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80" },
  { id: "lower-zambezi",  name: "Lower Zambezi",       region: "Lusaka Province",   stayCount: 15, icon: Sun,        href: "/explore/lusaka",                                  image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80" },
  { id: "lusaka",         name: "Lusaka",              region: "Capital City",      stayCount: 42, icon: Navigation, href: "/explore/lusaka/lusaka",                            image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80" },
  { id: "lake-kariba",    name: "Lake Kariba",         region: "Southern Province", stayCount: 11, icon: Waves,      href: "/explore/southern/kariba/lake-kariba",             image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80" },
  { id: "kafue",          name: "Kafue National Park", region: "Western Province",  stayCount: 9,  icon: Mountain,   href: "/explore/central/kafue/kafue-national-park",        image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80" },
];

const cities = [
  { name: "Lusaka",      province: "lusaka",        region: "Capital Region",       slug: "lusaka",       image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80" },
  { name: "Livingstone", province: "southern",      region: "Southern Province",    slug: "livingstone",  image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80" },
  { name: "Ndola",       province: "copperbelt",    region: "Copperbelt Province",  slug: "ndola",        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80" },
  { name: "Kabwe",       province: "central",       region: "Central Province",     slug: "kabwe",        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80" },
  { name: "Chipata",     province: "eastern",       region: "Eastern Province",     slug: "chipata",      image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80" },
  { name: "Kasama",      province: "northern",      region: "Northern Province",    slug: "kasama",       image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80" },
  { name: "Solwezi",     province: "north-western", region: "North-Western",        slug: "solwezi",      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80" },
  { name: "Mongu",       province: "western",       region: "Western Province",     slug: "mongu",        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80" },
];

const hiddenGems = [
  { tag: "Farm life",  title: "We spent a weekend milking cows in Chisamba",  meta: "5 min read · Real guest story", href: "/gems", image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&q=70" },
  { tag: "Industrial", title: "Inside Zambia's copper mining heritage",        meta: "8 min read · Hidden gem guide", href: "/gems", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=70" },
  { tag: "Wildlife",   title: "The Kafue day trip nobody talks about",         meta: "6 min read · Local insider",    href: "/gems", image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=70" },
];

const categories = [
  { id: "destinations", label: "Destinations", icon: GlobeHemisphereWest },
  { id: "stays",        label: "Stays",        icon: Bed },
  { id: "experiences",  label: "Experiences",  icon: Binoculars },
  { id: "transport",    label: "Transport",    icon: CarProfile },
  { id: "packages",     label: "Packages",     icon: MapTrifold },
  { id: "local-tours",  label: "Local Tours",  icon: Factory },
];

const valueProps = [
  { icon: Tent,      title: "Hidden Finds",        desc: "Escapes you won't find on other platforms. Curated, vetted, and waiting to be discovered." },
  { icon: Buildings, title: "Affordable & Premium", desc: "Budget-friendly stays that don't compromise on quality, character or experience." },
  { icon: SealCheck, title: "Verified Hosts",       desc: "Every host is verified by our team before going live. You're always in safe hands." },
  { icon: MapPin,    title: "Local Experts",        desc: "A Zambia-based team with insider knowledge of the best stays, routes, and tours." },
];

const flashDeals = [
  { id: "deal-1", name: "Kafue River Lodge",    location: "Kafue National Park", originalPrice: 380, dealPrice: 266, discount: 30, badge: "Flash Sale",    ends: "2 days left", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80" },
  { id: "deal-2", name: "Bush Camp Adventure",  location: "South Luangwa",       originalPrice: 280, dealPrice: 210, discount: 25, badge: "Weekend Deal",  ends: "5 days left", image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80" },
  { id: "deal-3", name: "Lusaka Boutique Stay", location: "Lusaka",              originalPrice: 120, dealPrice: 90,  discount: 25, badge: "Last Minute",   ends: "1 day left",  image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80" },
  { id: "deal-4", name: "Lake Kariba Retreat",  location: "Kariba",              originalPrice: 195, dealPrice: 146, discount: 25, badge: "Limited Spots", ends: "3 days left", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80" },
  { id: "deal-5", name: "Victoria Falls Hotel", location: "Livingstone",         originalPrice: 320, dealPrice: 256, discount: 20, badge: "Hot Deal",      ends: "4 days left", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  desc,
  href,
  seeAllLabel = "See all",
  as: Heading = "h2",
  hideDescOnMobile = false,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  href?: string;
  seeAllLabel?: string;
  as?: "h2" | "h3";
  hideDescOnMobile?: boolean;
}) {
  return (
    <div className="flex items-end justify-between mb-6 md:mb-7">
      <div>
        <p className="font-script text-xl md:text-2xl text-gold mb-1">{eyebrow}</p>
        <Heading className="font-display text-xl md:text-2xl font-bold tracking-tight text-black leading-[1.15]">
          {title}
        </Heading>
        <p className={cn("text-black-muted mt-1.5 text-base max-w-lg leading-relaxed", hideDescOnMobile && "hidden md:block")}>
          {desc}
        </p>
      </div>
      {href && (
        <Link
          href={href}
          className="hidden md:inline-flex items-center gap-1.5 text-base font-semibold text-purple hover:text-purple-hover transition-all duration-200 group shrink-0"
        >
          <span>{seeAllLabel}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

function MobileSeeAll({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-5 text-center md:hidden">
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-base font-semibold text-purple hover:text-purple-hover transition-all duration-200 group"
      >
        <span>{label}</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function HomePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("stays");

  const handleSearch = (term: string, _dates: DateRange, _guests: number) => {
    const targetRoute = activeCategory === "destinations" ? "explore" : activeCategory;
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    router.push(`/${targetRoute}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white-warm overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-white-warm">
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-script text-2xl text-gold mb-4">Discover your backyard</p>
            <h1 className="font-display text-[1.75rem] md:text-[2.75rem] lg:text-[3rem] font-bold tracking-tight text-black leading-[1.15]">
              <span className="md:hidden">
                Find your next{" "}
                <span className="font-script text-[1.3em] font-normal text-gold lowercase relative -top-0.5">escape</span>{" "}
                nearby
              </span>
              <span className="hidden md:inline">
                Find your hidden{" "}
                <span className="font-script text-[1.3em] font-normal text-gold lowercase relative -top-0.5">escape</span>
                <br />near a gem you&apos;ve never seen
              </span>
            </h1>
            <p className="mt-4 text-[14px] md:text-[15px] text-black-muted leading-relaxed max-w-lg mx-auto">
              Lodges, camps, and guesthouses within reach — curated around Zambia&apos;s secret spots.
            </p>
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ───────────────────────────────────────────────── */}
      <div className="relative z-20 -mt-12 md:-mt-14 mx-auto max-w-2xl px-4">
        <SearchBar onSearch={handleSearch} activeCategory={activeCategory} />
      </div>

      {/* ── CATEGORY TABS ────────────────────────────────────────────── */}
      <div className="border-b border-purple-border">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8 py-5">
          <div className="flex items-start gap-5 overflow-x-auto scrollbar-hide">
            {categories.map(({ id, label, icon: Icon }) => (
              <span
                key={id}
                onClick={() => setActiveCategory(id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-4 px-6 border-b-2 text-base font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-all duration-200",
                  activeCategory === id
                    ? "border-purple text-purple"
                    : "border-transparent text-black-muted hover:text-purple hover:border-purple",
                )}
              >
                <Icon className="h-5 w-5" weight="duotone" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <main className="flex-1">
        <section className="pt-5 pb-12">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-8">

            {/* DESTINATIONS */}
            {activeCategory === "destinations" && (
              <>
                <SectionHeader
                  eyebrow="Explore Zambia"
                  title="Popular Destinations"
                  desc="Not sure where to go? Discover top-rated stays, local tours, and seamless transport options around Zambia's most sought-after locations."
                  href="/explore"
                />

                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                  {destinations.map((destination) => {
                    const Icon = destination.icon;
                    return (
                      <Link
                        key={destination.id}
                        href={destination.href || "/explore"}
                        className="group relative block overflow-hidden rounded-2xl bg-white-bone w-[200px] sm:w-[220px] md:w-[240px] shrink-0 aspect-[16/10] shadow-[0_2px_12px_rgba(31,20,51,0.10)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(31,20,51,0.18)] hover:-translate-y-1 snap-start"
                        style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                      >
                        <img src={destination.image} alt={destination.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-gold-muted backdrop-blur-sm border border-purple-border">
                          <Icon className="h-3.5 w-3.5 text-purple" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                          <p className="text-gold text-[9px] font-bold uppercase tracking-widest mb-1">{destination.region}</p>
                          <h3 className="font-display text-white font-bold text-base leading-tight mb-1">{destination.name}</h3>
                          {destination.stayCount && (
                            <p className="text-white/50 text-[10px] font-medium flex items-center gap-1">
                              <Home className="h-3 w-3" /> {destination.stayCount} stays
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Popular Cities */}
                <div className="mt-14 md:mt-16">
                  <SectionHeader
                    eyebrow="Urban & Gateway"
                    title="Popular Cities"
                    desc="Explore Zambia's vibrant cities and gateway towns — from the capital to the adventure hubs."
                    href="/explore"
                    seeAllLabel="All cities"
                  />
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                    {cities.map((city) => (
                      <Link
                        key={city.name}
                        href={`/explore/${city.province}/${city.slug}`}
                        className="group relative block overflow-hidden rounded-2xl w-[180px] sm:w-[200px] shrink-0 aspect-[4/5] bg-white-bone shadow-[0_2px_8px_rgba(31,20,51,0.08)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(31,20,51,0.15)] hover:-translate-y-1 snap-start"
                      >
                        <img src={city.image} alt={city.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-3.5 w-full">
                          <h3 className="font-display text-white font-bold text-sm leading-tight mb-0.5">{city.name}</h3>
                          <p className="text-white/50 text-[10px] font-medium">{city.region}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <MobileSeeAll href="/explore" label="All cities" />
                </div>

                {/* Hidden Gems */}
                <div className="mt-14 md:mt-16">
                  <SectionHeader
                    eyebrow="Hidden Zambia"
                    title="Discover Hidden Gems"
                    desc="Off-the-beaten-path spots, farm stays, and local secrets only insiders know about."
                    href="/explore"
                    seeAllLabel="Explore all"
                  />
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                    {hiddenGems.map(({ tag, title, meta, image, href }) => (
                      <Link
                        key={title}
                        href={href}
                        className="group relative block overflow-hidden rounded-2xl w-[260px] sm:w-[300px] md:w-[340px] shrink-0 aspect-[4/3] bg-white-bone shadow-[0_2px_12px_rgba(31,20,51,0.10)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(31,20,51,0.18)] hover:-translate-y-1 snap-start"
                      >
                        <img src={image} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                          <p className="text-gold text-[9px] font-bold uppercase tracking-[1.2px] mb-1">{tag}</p>
                          <h3 className="font-display text-white font-bold text-base leading-snug mb-1.5">{title}</h3>
                          <p className="text-white/50 text-[11px]">{meta}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <MobileSeeAll href="/explore" label="Explore all gems" />
                </div>
              </>
            )}

            {/* STAYS */}
            {activeCategory === "stays" && (
              <>
                <SectionHeader
                  eyebrow="Accommodation"
                  title="Popular Stays"
                  desc="Explore highly-rated safari lodges, city guesthouses, and farm retreats that our guests love returning to."
                  href="/stays"
                  seeAllLabel="See all stays"
                  as="h3"
                  hideDescOnMobile
                />
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                  {mockStays.slice(0, 6).map((listing) => (
                    <div key={listing.id} className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start">
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
                <MobileSeeAll href="/stays" label="See all stays" />

                {/* Flash Deals */}
                <div className="mt-14 md:mt-16">
                  <SectionHeader
                    eyebrow="Weekend Escapes"
                    title="Flash Deals"
                    desc="Limited-time discounts on hand-picked stays. Book now before they're gone."
                    href="/stays"
                    seeAllLabel="See all deals"
                  />
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                    {flashDeals.map((deal) => (
                      <Link
                        key={deal.id}
                        href={`/listings/stays/${deal.id.replace("deal-", "")}`}
                        className="group relative block overflow-hidden rounded-2xl w-[260px] sm:w-[280px] shrink-0 aspect-[4/3] bg-white-bone shadow-[0_2px_12px_rgba(31,20,51,0.10)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(31,20,51,0.18)] hover:-translate-y-1 snap-start"
                        style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                      >
                        <img src={deal.image} alt={deal.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
                            -{deal.discount}% {deal.badge}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center bg-black/40 backdrop-blur-sm text-white/90 text-[9px] font-bold px-2 py-1 rounded-md">
                            {deal.ends}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                          <p className="text-gold text-[9px] font-bold uppercase tracking-widest mb-1">{deal.location}</p>
                          <h3 className="font-display text-white font-bold text-base leading-tight mb-1.5">{deal.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-base">ZMW {deal.dealPrice}</span>
                            <span className="text-white/40 text-[11px] line-through">ZMW {deal.originalPrice}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <MobileSeeAll href="/stays" label="View all deals" />
                </div>
              </>
            )}

            {/* EXPERIENCES */}
            {activeCategory === "experiences" && (
              <div>
                <SectionHeader
                  eyebrow="Things to Do"
                  title="Popular Experiences"
                  desc="Top-rated safaris, cultural tours, adventures and activities hand-picked for you."
                  href="/experiences"
                  seeAllLabel="See all experiences"
                  as="h3"
                  hideDescOnMobile
                />
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                  {mockExperiences.slice(0, 6).map((exp) => (
                    <Link key={exp.id} href={`/experiences/${exp.id}`} className="group w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start">
                      <div className="relative aspect-[16/10] bg-white-bone rounded-xl overflow-hidden transition-shadow duration-300 group-hover:shadow-sm">
                        <img src={exp.image} alt={exp.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="pt-2.5 px-0.5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-[14px] font-semibold text-black-soft leading-snug line-clamp-1 flex-1">{exp.name}</h3>
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="h-3 w-3 fill-purple text-purple" strokeWidth={1.5} />
                            <span className="text-[12px] font-semibold text-black-muted">{exp.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-black-muted mt-1">{exp.location}</p>
                        <div className="flex items-baseline gap-0.5 mt-1.5">
                          <span className="text-[14px] font-bold text-purple">ZMW {exp.price}</span>
                          <span className="text-[11px] text-black-muted">/ person</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <MobileSeeAll href="/experiences" label="See all experiences" />
              </div>
            )}

            {/* TRANSPORT */}
            {activeCategory === "transport" && (
              <div>
                <SectionHeader
                  eyebrow="Getting Around"
                  title="Popular Transport Routes"
                  desc="Reliable bus and shuttle connections between Zambia's major hubs and gateway towns."
                  href="/transport"
                  seeAllLabel="See all routes"
                  as="h3"
                  hideDescOnMobile
                />
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                  {mockTransport.slice(0, 6).map((t) => (
                    <Link key={t.id} href="/transport" className="group w-[280px] sm:w-[300px] shrink-0 snap-start bg-white rounded-xl border border-purple-border overflow-hidden transition-all duration-300 hover:shadow-[0_4px_16px_rgba(31,20,51,0.10)] hover:-translate-y-0.5">
                      <div className="relative aspect-[16/9] bg-white-bone">
                        <img src={t.image} alt={`${t.from} to ${t.to}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-3 right-3">
                          <div className="flex items-center justify-between text-white text-sm font-bold">
                            <span>{t.from}</span>
                            <span className="text-[10px] mx-1">→</span>
                            <span>{t.to}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3.5 flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-semibold text-black-soft">{t.operator}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-black-muted">{t.duration}</span>
                            <span className="text-[10px] text-black-faint">·</span>
                            <span className="text-[11px] text-black-muted">{t.departures}</span>
                          </div>
                        </div>
                        <span className="text-[14px] font-bold text-purple">ZMW {t.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <MobileSeeAll href="/transport" label="See all routes" />
              </div>
            )}

            {/* PACKAGES */}
            {activeCategory === "packages" && (
              <div>
                <SectionHeader
                  eyebrow="Bundle & Save"
                  title="Popular Packages"
                  desc="Curated weekend escapes and multi-day adventures bundled for the best value."
                  href="/packages"
                  seeAllLabel="See all packages"
                  as="h3"
                  hideDescOnMobile
                />
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory">
                  {mockPackages.slice(0, 6).map((pkg) => (
                    <Link key={pkg.id} href="/packages" className="group w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start">
                      <div className="relative aspect-[16/10] bg-white-bone rounded-xl overflow-hidden transition-shadow duration-300 group-hover:shadow-sm">
                        <img src={pkg.image} alt={pkg.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="pt-2.5 px-0.5">
                        <h3 className="text-[14px] font-semibold text-black-soft leading-snug line-clamp-1">{pkg.name}</h3>
                        <p className="text-[11px] text-black-muted mt-0.5">{pkg.location} · {pkg.duration}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-purple text-purple" strokeWidth={1.5} />
                            <span className="text-[12px] font-semibold text-black-muted">{pkg.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-[14px] font-bold text-purple">ZMW {pkg.price}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <MobileSeeAll href="/packages" label="See all packages" />
              </div>
            )}

            {/* LOCAL TOURS */}
            {activeCategory === "local-tours" && (
              <div className="text-center py-16">
                <p className="font-script text-2xl text-gold mb-2">Coming Soon</p>
                <h3 className="font-display text-xl font-bold text-black">Popular Local Tours</h3>
                <p className="text-black-muted text-sm mt-3 max-w-md mx-auto leading-relaxed">
                  Guided tours by local experts are on their way. Check back soon for walking tours,
                  cultural immersions, and day trips led by Zambian insiders.
                </p>
              </div>
            )}

          </div>
        </section>
      </main>

      {/* ── EXPLORE ZAMBIA BANNER ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-16">
        <Link
          href="/explore"
          className="group relative block overflow-hidden rounded-2xl min-h-[280px] md:min-h-[320px] bg-purple shadow-[0_4px_24px_rgba(31,20,51,0.12)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(31,20,51,0.20)] hover:-translate-y-0.5"
        >
          <img
            src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80"
            alt="Zambian landscape"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple/80 via-purple/50 to-transparent" />
          <div className="relative h-full flex flex-col justify-center px-6 md:px-10 py-10 md:py-14">
            <p className="text-gold text-[10px] font-bold uppercase tracking-[1.5px] mb-2">Discover Zambia</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-[1.15] mb-3 max-w-xl">
              There&apos;s more than one way to escape
            </h2>
            <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed mb-6">
              Browse provinces, cities, and hidden gems across Zambia. Explore curated stays,
              authentic experiences, and reliable transport around every corner of the country.
            </p>
            <span className="btn-cta px-6 py-3 text-sm w-fit group-hover:gap-3">
              Explore Zambia <ArrowRight className="h-4 w-4 transition-transform duration-200" />
            </span>
          </div>
        </Link>
      </section>

      {/* ── BECOME A HOST CTA ─────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-8 mb-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-white-soft rounded-2xl overflow-hidden border border-purple-border">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[280px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80" alt="Cozy safari lodge interior" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
          </div>
          <div className="px-6 md:px-0 md:pr-10 py-8">
            <p className="text-[10px] font-bold text-purple tracking-[1px] uppercase mb-2">Become a host</p>
            <h2 className="font-display text-xl md:text-2xl font-bold text-black leading-snug mb-3">
              Turn your passion into profit
            </h2>
            <p className="text-[13px] text-black-muted leading-relaxed max-w-md mb-6">
              List your stays, experiences, or transport on Nearby Escapes. Fair commissions, real
              earnings, and a team that&apos;s got your back.
            </p>
            <Link href="/become-host" className="btn-cta px-8 py-3 text-base w-full sm:w-auto">
              List your escape <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY BOOK WITH US ──────────────────────────────────────────── */}
      <section className="pt-14 pb-8 md:pt-[56px] md:pb-8 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-black mb-8 md:mb-[32px] text-center md:text-left">
            Why book with us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-[32px]">
            {valueProps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-purple-muted text-purple">
                  <Icon className="h-[22px] w-[22px]" weight="regular" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-black mb-1">{title}</h3>
                  <p className="text-[13px] text-black-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
