"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Star,
  MapPin,
  ArrowRight,
  ChevronLeft,
  Bed,
  Bus,
  Car,
  Home,
  Compass,
  Ticket,
  Zap,
  Search,
  Sparkles,
  Sun,
  Waves,
  Trees,
  Navigation,
  Mountain,
  ShieldCheck,
  Tag,
  Headphones,
  Award,
  Package as PackageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ListingCard } from "@/components/guest/ListingCard";
import { mockStays, mockExperiences, mockTransport } from "@/lib/mock-data";

// Static curated destination data

export const PROVINCES = [
  {
    id: "southern",
    name: "Southern Province",
    desc: "Victoria Falls, Livingstone, Lake Kariba — Zambia's most iconic region.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=70",
    icon: Sun,
    stays: 24,
    experiences: 18,
    cities: [
      {
        id: "livingstone",
        name: "Livingstone",
        provinceId: "southern",
        region: "Southern Province",
        stays: 14,
      },
      {
        id: "kariba",
        name: "Siavonga / Kariba",
        provinceId: "southern",
        region: "Southern Province",
        stays: 10,
      },
    ],
    attractions: [
      {
        id: "vic-falls",
        name: "Victoria Falls",
        provinceId: "southern",
        provinceName: "Southern Province",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=70",
        rating: 5.0,
        reviews: 4200,
      },
      {
        id: "lake-kariba",
        name: "Lake Kariba",
        provinceId: "southern",
        provinceName: "Southern Province",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=70",
        rating: 4.8,
        reviews: 1850,
      },
      {
        id: "lower-zambezi",
        name: "Lower Zambezi NP",
        provinceId: "southern",
        provinceName: "Southern Province",
        image: "https://images.unsplash.com/photo-1534759846116-5799c33ce22a?w=600&q=70",
        rating: 4.9,
        reviews: 980,
      },
    ],
  },
  {
    id: "eastern",
    name: "Eastern Province",
    desc: "South Luangwa — Africa's premier wildlife corridor and walking safari home.",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=70",
    icon: Waves,
    stays: 16,
    experiences: 12,
    cities: [
      {
        id: "mfuwe",
        name: "Mfuwe",
        provinceId: "eastern",
        region: "Eastern Province",
        stays: 10,
      },
      {
        id: "chipata",
        name: "Chipata",
        provinceId: "eastern",
        region: "Eastern Province",
        stays: 6,
      },
    ],
    attractions: [
      {
        id: "south-luangwa",
        name: "South Luangwa NP",
        provinceId: "eastern",
        provinceName: "Eastern Province",
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=70",
        rating: 4.9,
        reviews: 3100,
      },
      {
        id: "luangwa-river",
        name: "Luangwa River",
        provinceId: "eastern",
        provinceName: "Eastern Province",
        image: "https://images.unsplash.com/photo-1534759846116-5799c33ce22a?w=600&q=70",
        rating: 4.7,
        reviews: 760,
      },
    ],
  },
  {
    id: "central",
    name: "Central Province",
    desc: "Kafue National Park — endless plains, river adventures and serene wilderness.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=70",
    icon: Trees,
    stays: 14,
    experiences: 10,
    cities: [
      {
        id: "kafue",
        name: "Kafue",
        provinceId: "central",
        region: "Central Province",
        stays: 9,
      },
      {
        id: "kabwe",
        name: "Kabwe",
        provinceId: "central",
        region: "Central Province",
        stays: 5,
      },
    ],
    attractions: [
      {
        id: "kafue-np",
        name: "Kafue National Park",
        provinceId: "central",
        provinceName: "Central Province",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=70",
        rating: 4.8,
        reviews: 1420,
      },
      {
        id: "blue-lagoon",
        name: "Blue Lagoon NP",
        provinceId: "central",
        provinceName: "Central Province",
        image: "https://images.unsplash.com/photo-1540206395-688085723adb?w=600&q=70",
        rating: 4.5,
        reviews: 380,
      },
    ],
  },
  {
    id: "lusaka",
    name: "Lusaka Province",
    desc: "The vibrant capital — cosmopolitan food, lively markets and safari gateways.",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=70",
    icon: Navigation,
    stays: 32,
    experiences: 20,
    cities: [
      {
        id: "lusaka-cbd",
        name: "Lusaka CBD",
        provinceId: "lusaka",
        region: "Lusaka Province",
        stays: 20,
      },
      {
        id: "kabulonga",
        name: "Kabulonga",
        provinceId: "lusaka",
        region: "Lusaka Province",
        stays: 12,
      },
    ],
    attractions: [
      {
        id: "national-museum",
        name: "National Museum",
        provinceId: "lusaka",
        provinceName: "Lusaka Province",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=70",
        rating: 4.4,
        reviews: 890,
      },
      {
        id: "munda-wanga",
        name: "Munda Wanga Botanical Park",
        provinceId: "lusaka",
        provinceName: "Lusaka Province",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=70",
        rating: 4.3,
        reviews: 640,
      },
    ],
  },
  {
    id: "copperbelt",
    name: "Copperbelt Province",
    desc: "Industrial heritage, urban culture and gateway to northern wildlife reserves.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=70",
    icon: Mountain,
    stays: 18,
    experiences: 8,
    cities: [
      {
        id: "ndola",
        name: "Ndola",
        provinceId: "copperbelt",
        region: "Copperbelt Province",
        stays: 10,
      },
      {
        id: "kitwe",
        name: "Kitwe",
        provinceId: "copperbelt",
        region: "Copperbelt Province",
        stays: 8,
      },
    ],
    attractions: [
      {
        id: "copperbelt-museum",
        name: "Copperbelt Museum",
        provinceId: "copperbelt",
        provinceName: "Copperbelt Province",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=70",
        rating: 4.2,
        reviews: 410,
      },
      {
        id: "dag-hammarskjold",
        name: "Dag Hammarskjöld Memorial",
        provinceId: "copperbelt",
        provinceName: "Copperbelt Province",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=70",
        rating: 4.0,
        reviews: 220,
      },
    ],
  },
  {
    id: "luapula",
    name: "Luapula Province",
    desc: "Bangweulu Swamps, sparkling waterfalls and the iconic shoebill stork.",
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=70",
    icon: Waves,
    stays: 8,
    experiences: 6,
    cities: [
      {
        id: "mansa",
        name: "Mansa",
        provinceId: "luapula",
        region: "Luapula Province",
        stays: 5,
      },
    ],
    attractions: [
      {
        id: "bangweulu",
        name: "Bangweulu Wetlands",
        provinceId: "luapula",
        provinceName: "Luapula Province",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=70",
        rating: 4.9,
        reviews: 340,
      },
    ],
  },
];

// Flat lists for national explore view
const ALL_CITIES = PROVINCES.flatMap((p) =>
  p.cities.map((c) => ({
    ...c,
    provinceId: p.id,
  })),
);

const ALL_ATTRACTIONS = PROVINCES.flatMap((p) =>
  p.attractions.map((a) => ({
    ...a,
    provinceId: p.id,
    provinceName: p.name,
  })),
);

const EXPLORE_CATEGORIES = [
  {
    label: "Stays & Lodges",
    desc: "Safari lodges & lake villas",
    icon: Bed,
    href: "/stays",
    count: "60+ stays",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=70",
  },
  {
    label: "Safaris & Wildlife",
    desc: "Walking safaris & game drives",
    icon: Sparkles,
    href: "/experiences?cat=wildlife",
    count: "40+ safaris",
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&q=70",
  },
  {
    label: "Holiday Packages",
    desc: "All-inclusive bundled tours",
    icon: PackageIcon,
    href: "/packages",
    count: "15+ packages",
    img: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=500&q=70",
  },
  {
    label: "Adventures & Day Trips",
    desc: "Devil's Pool & gorge swings",
    icon: Zap,
    href: "/experiences?cat=adventure",
    count: "50+ activities",
    img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&q=70",
  },
  {
    label: "Water & River Cruises",
    desc: "Sunset cruises & houseboats",
    icon: Waves,
    href: "/experiences?cat=water",
    count: "25+ escapes",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&q=70",
  },
  {
    label: "City & Culture",
    desc: "Local food tours & markets",
    icon: Navigation,
    href: "/experiences?cat=cultural",
    count: "30+ tours",
    img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=70",
  },
  {
    label: "Transport & Transfers",
    desc: "Airport shuttles & coaches",
    icon: Bus,
    href: "/transport",
    count: "20+ routes",
    img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&q=70",
  },
  {
    label: "National Parks",
    desc: "South Luangwa & Kafue",
    icon: Trees,
    href: "/experiences?cat=wildlife",
    count: "10+ parks",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=70",
  },
];

// Curated all-inclusive packages
export const CURATED_PACKAGES = [
  {
    id: "p1",
    name: "Victoria Falls Weekend Getaway",
    provinceId: "southern",
    location: "Livingstone, Southern Province",
    rating: 4.8,
    price: 3850,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    duration: "3 Days / 2 Nights",
  },
  {
    id: "p2",
    name: "South Luangwa Walking Safari Expedition",
    provinceId: "eastern",
    location: "South Luangwa, Eastern Province",
    rating: 4.9,
    price: 8400,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
    duration: "5 Days / 4 Nights",
  },
  {
    id: "p3",
    name: "Lake Kariba Houseboat Retreat",
    provinceId: "southern",
    location: "Siavonga / Kariba, Southern Province",
    rating: 4.7,
    price: 2650,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    duration: "3 Days / 2 Nights",
  },
  {
    id: "p4",
    name: "Kafue Wilderness & River Camp Escape",
    provinceId: "central",
    location: "Kafue NP, Central Province",
    rating: 4.8,
    price: 4900,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    duration: "4 Days / 3 Nights",
  },
  {
    id: "p5",
    name: "Lusaka Heritage & Culinary City Break",
    provinceId: "lusaka",
    location: "Lusaka Province",
    rating: 4.6,
    price: 1800,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    duration: "2 Days / 1 Night",
  },
  {
    id: "p6",
    name: "Bangweulu Shoebill Stork Wetlands Trek",
    provinceId: "luapula",
    location: "Luapula Province",
    rating: 4.9,
    price: 5200,
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
    duration: "4 Days / 3 Nights",
  },
  {
    id: "p7",
    name: "Livingstone & Chobe Day Tour Circuit",
    provinceId: "southern",
    location: "Livingstone, Southern Province",
    rating: 4.8,
    price: 2100,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    duration: "Full Day",
  },
  {
    id: "p8",
    name: "Copperbelt Industrial & Forest Trail",
    provinceId: "copperbelt",
    location: "Ndola & Kitwe, Copperbelt",
    rating: 4.5,
    price: 2200,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    duration: "3 Days / 2 Nights",
  },
];

// Flash deals
const FLASH_DEALS = [
  {
    id: "deal-1",
    name: "Kafue River Lodge",
    location: "Kafue National Park",
    originalPrice: 380,
    dealPrice: 266,
    discount: 30,
    badge: "Flash Sale",
    ends: "2 days left",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
  },
  {
    id: "deal-2",
    name: "Bush Camp Adventure",
    location: "South Luangwa",
    originalPrice: 280,
    dealPrice: 210,
    discount: 25,
    badge: "Weekend Deal",
    ends: "5 days left",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
  },
  {
    id: "deal-3",
    name: "Lusaka Boutique Stay",
    location: "Lusaka",
    originalPrice: 120,
    dealPrice: 90,
    discount: 25,
    badge: "Last Minute",
    ends: "1 day left",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
  },
  {
    id: "deal-4",
    name: "Lake Kariba Retreat",
    location: "Kariba",
    originalPrice: 195,
    dealPrice: 146,
    discount: 25,
    badge: "Limited Spots",
    ends: "3 days left",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
  },
  {
    id: "deal-5",
    name: "Victoria Falls Hotel",
    location: "Livingstone",
    originalPrice: 320,
    dealPrice: 256,
    discount: 20,
    badge: "Hot Deal",
    ends: "4 days left",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  },
];

type Tab = "explore" | "stays" | "experiences" | "packages" | "transport";

// Section Heading

function SectionHeading({
  title,
  subtitle,
  href,
  cta = "See all",
  onAction,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  cta?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div className="flex items-start gap-3">
        <div className="w-1 h-7 rounded-full bg-[#6b2bb8] mt-0.5 shrink-0" />
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-neutral-900 tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-neutral-500 mt-0.5 font-normal">{subtitle}</p>}
        </div>
      </div>
      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#6b2bb8] hover:text-[#5a1f9e] transition-colors group shrink-0 cursor-pointer"
        >
          <span>{cta}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      ) : href ? (
        <Link
          href={href}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#6b2bb8] hover:text-[#5a1f9e] transition-colors group shrink-0"
        >
          <span>{cta}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

// Horizontal Carousel with Arrow Navigation

function Carousel({
  children,
  seeAllHref,
  onSeeAll,
}: {
  children: React.ReactNode;
  seeAllHref?: string;
  onSeeAll?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  };

  return (
    <div className="relative group/carousel">
      {/* Prev arrow */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 text-neutral-700 hover:text-[#6b2bb8] hover:border-[#6b2bb8] hover:scale-105 active:scale-95 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 md:-mx-8 px-4 md:px-8 snap-x snap-mandatory scroll-smooth"
      >
        {children}
      </div>

      {/* Next arrow */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 text-neutral-700 hover:text-[#6b2bb8] hover:border-[#6b2bb8] hover:scale-105 active:scale-95 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Mobile see-all */}
      {onSeeAll ? (
        <div className="mt-4 text-center md:hidden">
          <button
            type="button"
            onClick={onSeeAll}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6b2bb8] hover:text-[#5a1f9e] transition-colors cursor-pointer"
          >
            <span>See all</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : seeAllHref ? (
        <div className="mt-4 text-center md:hidden">
          <Link
            href={seeAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6b2bb8] hover:text-[#5a1f9e] transition-colors"
          >
            <span>See all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

// Card Components

function ProvinceCard({
  province,
  featured,
}: {
  province: (typeof PROVINCES)[0];
  featured?: boolean;
}) {
  return (
    <Link
      key={province.id}
      href={`/explore/${province.id}`}
      className="group relative block overflow-hidden rounded-2xl min-w-[220px] sm:min-w-[240px] md:min-w-[260px] shrink-0 aspect-[4/3] bg-white-bone shadow-sm transition-all hover:shadow-lg snap-start"
    >
      <img
        src={province.image}
        alt={province.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {featured && (
        <div className="absolute top-3 right-3 bg-amber-400 text-neutral-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-2xs">
          Featured
        </div>
      )}
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="font-display text-white font-bold text-lg leading-tight">{province.name}</h3>
        <p className="text-white/70 text-[11px] mt-0.5">
          {province.stays} stays · {province.experiences} tours
        </p>
      </div>
    </Link>
  );
}

// Sleek, text-only city destination cards (NO images)
function PlaceCard({
  place,
}: {
  place: {
    id: string;
    name: string;
    provinceId: string;
    region: string;
    stays: number;
  };
}) {
  return (
    <Link
      key={place.id}
      href={`/explore/${place.provinceId}/${place.id}`}
      className="group flex items-center gap-3 bg-white border border-neutral-200/90 rounded-2xl px-5 py-3.5 shrink-0 snap-start shadow-sm hover:shadow-md hover:border-[#6b2bb8] hover:bg-[#f3eafb]/40 transition-all duration-200 min-w-[180px] sm:min-w-[200px]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3eafb] text-[#6b2bb8] group-hover:scale-105 transition-transform shrink-0">
        <MapPin className="h-5 w-5" />
      </div>
      <div className="pr-1 min-w-0">
        <h3 className="font-bold text-sm sm:text-base text-[#1a1a1f] group-hover:text-[#6b2bb8] transition-colors leading-tight whitespace-nowrap">
          {place.name}
        </h3>
        <p className="text-[11px] text-[#5a5a66] mt-0.5 whitespace-nowrap">
          {place.stays} stays · {place.region}
        </p>
      </div>
    </Link>
  );
}

function CategoryCard({ cat }: { cat: (typeof EXPLORE_CATEGORIES)[0] }) {
  const Icon = cat.icon;
  return (
    <Link
      href={cat.href}
      className="group relative block overflow-hidden rounded-2xl min-w-[200px] sm:min-w-[220px] md:min-w-[240px] shrink-0 aspect-[4/3] bg-white-bone shadow-sm transition-all hover:shadow-lg snap-start"
    >
      <img
        src={cat.img}
        alt={cat.label}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/25 shadow-sm">
        <Icon className="h-3.5 w-3.5 text-[#f2ba0d]" />
      </div>
      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white/90 text-[10px] font-bold px-2 py-0.5 rounded-md">
        {cat.count}
      </div>
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="font-display text-white font-bold text-base leading-tight">{cat.label}</h3>
        <p className="text-white/70 text-[11px] mt-0.5 line-clamp-1">{cat.desc}</p>
      </div>
    </Link>
  );
}

// Map attraction IDs to their best available explore hub (city-level where possible)
const ATTRACTION_HUB_MAP: Record<string, string> = {
  "vic-falls": "/explore/southern/livingstone",
  "lake-kariba": "/explore/southern/kariba",
  "lower-zambezi": "/explore/southern/livingstone",
  "south-luangwa": "/explore/eastern/mfuwe",
  "luangwa-river": "/explore/eastern/mfuwe",
  "kafue-np": "/explore/central/kafue",
  "blue-lagoon": "/explore/central",
  "national-museum": "/explore/lusaka/lusaka-cbd",
  "munda-wanga": "/explore/lusaka/lusaka-cbd",
  "copperbelt-museum": "/explore/copperbelt/ndola",
  "dag-hammarskjold": "/explore/copperbelt/ndola",
  bangweulu: "/explore/luapula/mansa",
};

function PackageCard({
  pkg,
  isGrid = false,
}: {
  pkg: (typeof CURATED_PACKAGES)[0];
  isGrid?: boolean;
}) {
  return (
    <Link
      key={pkg.id}
      href={`/listings/experiences/${pkg.id}`}
      className={cn(
        "group block snap-start",
        isGrid ? "w-full" : "w-[260px] sm:w-[280px] md:w-[300px] shrink-0",
      )}
    >
      <div className="relative aspect-[16/10] bg-white-bone rounded-xl overflow-hidden transition-shadow group-hover:shadow-sm">
        <img
          src={pkg.image}
          alt={pkg.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10">
          {pkg.duration}
        </span>
      </div>
      <div className="pt-2.5 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-semibold text-black-soft leading-snug line-clamp-1 flex-1">
            {pkg.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-purple text-purple" strokeWidth={1.5} />
            <span className="text-[12px] font-semibold text-black-muted">
              {pkg.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-black-muted mt-0.5 line-clamp-1">{pkg.location}</p>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className="text-[14px] font-bold text-purple">ZMW {pkg.price}</span>
          <span className="text-[11px] text-black-muted">/ package</span>
        </div>
      </div>
    </Link>
  );
}

function AttractionCard({
  attraction,
}: {
  attraction: (typeof PROVINCES)[0]["attractions"][0] & {
    provinceId?: string;
    provinceName?: string;
  };
}) {
  // Resolve to the most specific hub: city-level first, then province, then national explore
  const targetHref =
    ATTRACTION_HUB_MAP[attraction.id] ??
    (attraction.provinceId ? `/explore/${attraction.provinceId}` : `/explore`);
  return (
    <Link href={targetHref} className="group w-[240px] sm:w-[260px] shrink-0 snap-start block">
      <div className="relative aspect-[16/10] bg-white-bone rounded-xl overflow-hidden transition-shadow group-hover:shadow-sm">
        <img
          src={attraction.image}
          alt={attraction.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {attraction.rating >= 4.8 && (
          <div className="absolute top-2.5 right-2.5 bg-amber-400 text-neutral-900 text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-2xs">
            Top Pick
          </div>
        )}
      </div>
      <div className="pt-2.5 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-semibold text-black-soft leading-snug line-clamp-1 flex-1">
            {attraction.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-purple text-purple" strokeWidth={1.5} />
            <span className="text-[12px] font-semibold text-black-muted">
              {attraction.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-black-muted mt-0.5">
          {attraction.provinceName ?? "Landmark"} · {attraction.reviews.toLocaleString()} reviews
        </p>
      </div>
    </Link>
  );
}

function ExperienceItemCard({
  exp,
  isGrid = false,
}: {
  exp: (typeof mockExperiences)[0];
  isGrid?: boolean;
}) {
  return (
    <Link
      href={`/listings/experiences/${exp.id}`}
      className={cn(
        "group block snap-start",
        isGrid ? "w-full" : "w-[260px] sm:w-[280px] md:w-[300px] shrink-0",
      )}
    >
      <div className="relative aspect-[16/10] bg-white-bone rounded-xl overflow-hidden transition-shadow group-hover:shadow-sm">
        <img
          src={exp.image}
          alt={exp.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="pt-2.5 px-0.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14px] font-semibold text-black-soft leading-snug line-clamp-1 flex-1">
            {exp.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-purple text-purple" strokeWidth={1.5} />
            <span className="text-[12px] font-semibold text-black-muted">
              {exp.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-black-muted mt-1">{exp.location}</p>
        <div className="flex items-baseline gap-0.5 mt-1.5">
          <span className="text-[14px] font-bold text-purple">ZMW {exp.price}</span>
          <span className="text-[11px] text-black-muted">/ person</span>
        </div>
      </div>
    </Link>
  );
}

function TransportItemCard({
  route,
  isGrid = false,
}: {
  route: (typeof mockTransport)[0];
  isGrid?: boolean;
}) {
  return (
    <Link
      href={`/listings/transport/${route.id}`}
      className={cn(
        "group bg-white rounded-xl border border-purple-border overflow-hidden transition-all hover:shadow-[0_4px_16px_rgba(31,20,51,0.10)] block snap-start",
        isGrid ? "w-full" : "w-[280px] sm:w-[300px] shrink-0",
      )}
    >
      <div className="relative aspect-[16/9] bg-white-bone">
        <img
          src={route.image}
          alt={`${route.from} to ${route.to}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-black font-bold text-sm sm:text-base">
            <span>{route.from}</span>
            <span className="text-black-muted text-xs">→</span>
            <span>{route.to}</span>
          </div>
          <span className="text-[14px] font-bold text-purple shrink-0">ZMW {route.price}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <p className="font-semibold text-black-soft truncate">{route.operator}</p>
          <div className="flex items-center gap-1.5 text-black-muted text-[11px] shrink-0">
            <span>{route.duration}</span>
            <span>·</span>
            <span>{route.departures}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FlashDealCard({ deal }: { deal: (typeof FLASH_DEALS)[0] }) {
  return (
    <Link
      href={`/listings/stays/${deal.id.replace("deal-", "")}`}
      className="group relative block overflow-hidden rounded-2xl w-[260px] sm:w-[280px] shrink-0 aspect-[4/3] bg-white-bone shadow-[0_2px_12px_rgba(31,20,51,0.10)] transition-all hover:shadow-[0_12px_32px_rgba(31,20,51,0.18)] snap-start"
    >
      <img
        src={deal.image}
        alt={deal.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-2xs">
          -{deal.discount}% {deal.badge}
        </span>
      </div>
      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center bg-black/50 backdrop-blur-sm text-white/90 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
          {deal.ends}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="font-display text-white font-bold text-base leading-tight mb-1.5 line-clamp-1">
          {deal.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-base">ZMW {deal.dealPrice}</span>
          <span className="text-white/70 text-[11px] line-through">ZMW {deal.originalPrice}</span>
        </div>
      </div>
    </Link>
  );
}

// Destination Index & Direct Resolver

interface DestinationMatch {
  title: string;
  subtitle: string;
  type: "city" | "landmark" | "province";
  href: string;
}

const DESTINATION_INDEX: DestinationMatch[] = [
  // Cities / Gateway Towns
  {
    title: "Livingstone",
    subtitle: "Victoria Falls Gateway · Southern Province",
    type: "city",
    href: "/explore/southern/livingstone",
  },
  {
    title: "Siavonga / Lake Kariba",
    subtitle: "Lakeside Retreats & Houseboats · Southern Province",
    type: "city",
    href: "/explore/southern/kariba",
  },
  {
    title: "Lusaka CBD",
    subtitle: "Capital Hub & Culture · Lusaka Province",
    type: "city",
    href: "/explore/lusaka/lusaka-cbd",
  },
  {
    title: "Kabulonga",
    subtitle: "Boutique Stays & Diplomatic Quarter · Lusaka",
    type: "city",
    href: "/explore/lusaka/kabulonga",
  },
  {
    title: "Mfuwe",
    subtitle: "South Luangwa Wildlife Gateway · Eastern Province",
    type: "city",
    href: "/explore/eastern/mfuwe",
  },
  {
    title: "Chipata",
    subtitle: "Eastern Gateway & Border Town · Eastern Province",
    type: "city",
    href: "/explore/eastern/chipata",
  },
  {
    title: "Kafue",
    subtitle: "National Park River Camps · Central Province",
    type: "city",
    href: "/explore/central/kafue",
  },
  {
    title: "Kabwe",
    subtitle: "Historic Central Transit Hub · Central Province",
    type: "city",
    href: "/explore/central/kabwe",
  },
  {
    title: "Ndola",
    subtitle: "Industrial Heritage & Urban Base · Copperbelt",
    type: "city",
    href: "/explore/copperbelt/ndola",
  },
  {
    title: "Kitwe",
    subtitle: "Copperbelt Commercial Hub · Copperbelt Province",
    type: "city",
    href: "/explore/copperbelt/kitwe",
  },
  {
    title: "Samfya",
    subtitle: "Lake Bangweulu White Sands · Luapula Province",
    type: "city",
    href: "/explore/luapula/samfya",
  },
  {
    title: "Mansa",
    subtitle: "Waterfalls & Wetlands Hub · Luapula Province",
    type: "city",
    href: "/explore/luapula/mansa",
  },

  // Famous Landmarks & Attractions
  {
    title: "Victoria Falls",
    subtitle: "World Wonder & Mosi-oa-Tunya · Livingstone",
    type: "landmark",
    href: "/explore/southern/livingstone",
  },
  {
    title: "Devil's Pool",
    subtitle: "Edge of Victoria Falls · Livingstone",
    type: "landmark",
    href: "/explore/southern/livingstone",
  },
  {
    title: "South Luangwa National Park",
    subtitle: "Walking Safaris & Leopard Valley · Mfuwe",
    type: "landmark",
    href: "/explore/eastern/mfuwe",
  },
  {
    title: "Lake Kariba",
    subtitle: "Houseboat Cruises & Tiger Fishing · Siavonga",
    type: "landmark",
    href: "/explore/southern/kariba",
  },
  {
    title: "Kafue National Park",
    subtitle: "Busanga Plains & River Safaris · Central Province",
    type: "landmark",
    href: "/explore/central/kafue",
  },
  {
    title: "Lower Zambezi National Park",
    subtitle: "Canoe Safaris & Riverfront Suites · Southern Province",
    type: "landmark",
    href: "/explore/southern",
  },
  {
    title: "Bangweulu Wetlands",
    subtitle: "Shoebill Storks & Black Lechwe · Luapula",
    type: "landmark",
    href: "/explore/luapula/samfya",
  },
  {
    title: "Blue Lagoon National Park",
    subtitle: "Kafue Flats Birding Haven · Central Province",
    type: "landmark",
    href: "/explore/central",
  },
  {
    title: "National Museum",
    subtitle: "Zambian Heritage & Culture · Lusaka",
    type: "landmark",
    href: "/explore/lusaka/lusaka-cbd",
  },
  {
    title: "Munda Wanga Botanical Park",
    subtitle: "Wildlife Sanctuary & Gardens · Lusaka",
    type: "landmark",
    href: "/explore/lusaka",
  },

  // Provinces
  {
    title: "Southern Province",
    subtitle: "Victoria Falls, Livingstone & Lake Kariba",
    type: "province",
    href: "/explore/southern",
  },
  {
    title: "Eastern Province",
    subtitle: "South Luangwa Safaris & Chipata",
    type: "province",
    href: "/explore/eastern",
  },
  {
    title: "Central Province",
    subtitle: "Kafue National Park & Blue Lagoon",
    type: "province",
    href: "/explore/central",
  },
  {
    title: "Lusaka Province",
    subtitle: "Urban City Escapes & Safari Gateways",
    type: "province",
    href: "/explore/lusaka",
  },
  {
    title: "Copperbelt Province",
    subtitle: "Industrial Heritage & Northern Gateway",
    type: "province",
    href: "/explore/copperbelt",
  },
  {
    title: "Luapula Province",
    subtitle: "Lake Bangweulu Beaches & Waterfalls",
    type: "province",
    href: "/explore/luapula",
  },
];

const POPULAR_DESTINATIONS = [
  { label: "Livingstone", href: "/explore/southern/livingstone" },
  { label: "South Luangwa", href: "/explore/eastern/mfuwe" },
  { label: "Lusaka", href: "/explore/lusaka/lusaka-cbd" },
  { label: "Lake Kariba", href: "/explore/southern/kariba" },
  { label: "Kafue", href: "/explore/central/kafue" },
];

function resolveDestination(query: string): string {
  const q = query.trim().toLowerCase();
  if (!q) return "/explore";

  // Check specific alias keywords
  if (q.includes("victoria") || q.includes("vic falls") || q.includes("devil")) {
    return "/explore/southern/livingstone";
  }
  if (q.includes("south luangwa") || q.includes("luangwa") || q.includes("mfuwe")) {
    return "/explore/eastern/mfuwe";
  }
  if (q.includes("kariba") || q.includes("siavonga")) {
    return "/explore/southern/kariba";
  }
  if (q.includes("kafue") || q.includes("busanga")) {
    return "/explore/central/kafue";
  }
  if (q.includes("bangweulu") || q.includes("samfya") || q.includes("shoebill")) {
    return "/explore/luapula/samfya";
  }
  if (q.includes("kabulonga")) {
    return "/explore/lusaka/kabulonga";
  }
  if (q.includes("lusaka")) {
    return "/explore/lusaka/lusaka-cbd";
  }
  if (q.includes("livingstone")) {
    return "/explore/southern/livingstone";
  }

  // Exact or partial match in curated destination index
  const match = DESTINATION_INDEX.find(
    (item) =>
      item.title.toLowerCase() === q ||
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      q.includes(item.title.toLowerCase()),
  );
  if (match) return match.href;

  // Search dynamic provinces and cities
  for (const prov of PROVINCES) {
    for (const city of prov.cities) {
      if (city.name.toLowerCase().includes(q) || q.includes(city.name.toLowerCase())) {
        return `/explore/${prov.id}/${city.id}`;
      }
    }
    for (const attr of prov.attractions) {
      if (attr.name.toLowerCase().includes(q) || q.includes(attr.name.toLowerCase())) {
        return `/explore/${prov.id}`;
      }
    }
    if (prov.name.toLowerCase().includes(q) || q.includes(prov.name.toLowerCase())) {
      return `/explore/${prov.id}`;
    }
  }

  // Fallback to stays search query
  return `/stays?q=${encodeURIComponent(query.trim())}`;
}

// Level 0: All Provinces (National Explore Hub)

function ProvinceGrid() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Filter suggestions as the user types
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return DESTINATION_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        q.includes(item.title.toLowerCase()),
    ).slice(0, 6);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const targetUrl = resolveDestination(searchQuery);
    router.push(targetUrl);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-10 md:pt-16 md:pb-14 bg-white border-b border-neutral-100">
        <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-8 text-center">
          <h1 className="font-display text-3xl md:text-5xl lg:text-[54px] font-semibold text-neutral-900 leading-[1.15] tracking-tight mb-3">
            Where would you like <span className="text-[#6b2bb8]">to venture?</span>
          </h1>
          <p className="mt-2 text-base md:text-lg text-neutral-600 leading-relaxed max-w-xl mx-auto mb-8 font-normal">
            Explore Zambia&apos;s breathtaking wonders — from Victoria Falls safaris to lake
            retreats & city hideouts.
          </p>

          {/* Direct Destination Search Box */}
          <div className="relative max-w-2xl mx-auto text-left">
            <form onSubmit={handleSearchSubmit} className="relative z-30">
              <div className="flex items-center bg-white rounded-2xl shadow-[0_4px_24px_rgba(31,20,51,0.08)] overflow-hidden border border-neutral-200 focus-within:border-[#6b2bb8] focus-within:ring-2 focus-within:ring-[#6b2bb8]/15 transition-all">
                <div className="flex items-center gap-2 flex-1 px-5 py-4">
                  <MapPin className="h-5 w-5 text-[#6b2bb8] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      // Slight delay to allow clicks on suggestion items
                      setTimeout(() => setIsFocused(false), 200);
                    }}
                    placeholder="Search a province, town, or landmark…"
                    className="flex-1 bg-transparent text-[15px] text-black placeholder:text-neutral-400 focus:outline-none font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="pr-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#6b2bb8] hover:bg-[#5a1f9e] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Explore</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Floating Autocomplete Suggestions Dropdown */}
            {isFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 bg-[#f8f5fc] text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Matching Destinations & Landmarks
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onMouseDown={() => {
                      router.push(item.href);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f3eafb]/40 text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-[#f3eafb] text-[#6b2bb8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {item.type === "city" ? (
                          <MapPin className="h-4 w-4" />
                        ) : item.type === "province" ? (
                          <Mountain className="h-4 w-4" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-[#1a1a1f] group-hover:text-[#6b2bb8] transition-colors truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#6b2bb8] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Quick recommendation chips — navigate directly to destination explore page */}
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap text-xs text-neutral-600">
              <span className="text-black font-bold">Popular:</span>
              {POPULAR_DESTINATIONS.map((dest) => (
                <Link
                  key={dest.label}
                  href={dest.href}
                  className="bg-neutral-100 hover:bg-[#f3eafb] border border-neutral-200 hover:border-[#6b2bb8]/30 px-3 py-1 rounded-full font-semibold transition-all text-black hover:text-[#6b2bb8] cursor-pointer"
                >
                  {dest.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: All Carousels */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14 space-y-12 md:space-y-16">
        {/* 1. Browse by Province Carousel */}
        <section>
          <SectionHeading
            title="Top Provinces"
            subtitle="Explore Zambia's most popular regions"
            href="/explore"
            cta="See all"
          />
          <Carousel seeAllHref="/explore">
            {PROVINCES.map((prov, i) => (
              <ProvinceCard key={prov.id} province={prov} featured={i === 0} />
            ))}
          </Carousel>
        </section>

        {/* 2. Top Experiences & Safaris Carousel (At the top) */}
        <section>
          <SectionHeading
            title="Popular Experiences"
            subtitle="Top-rated safaris, cultural tours, adventures and activities"
            href="/experiences?cat=popular"
            cta="See all experiences"
          />
          <Carousel seeAllHref="/experiences?cat=popular">
            {mockExperiences.slice(0, 8).map((exp) => (
              <ExperienceItemCard key={exp.id} exp={exp} />
            ))}
          </Carousel>
        </section>

        {/* 3. Popular Stays Carousel (At the top) */}
        <section>
          <SectionHeading
            title="Popular Stays"
            subtitle="Explore highly-rated safari lodges, city guesthouses, and farm retreats"
            href="/stays?type=Popular"
            cta="See all stays"
          />
          <Carousel seeAllHref="/stays?type=Popular">
            {mockStays.slice(0, 8).map((stay) => (
              <div
                key={stay.id}
                className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start"
              >
                <ListingCard listing={stay} />
              </div>
            ))}
          </Carousel>
        </section>

        {/* 4. Explore by Category / Travel Styles Carousel */}
        <section>
          <SectionHeading
            title="Explore by Category"
            subtitle="Find escapes tailored to your travel style"
          />
          <Carousel>
            {EXPLORE_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.label} cat={cat} />
            ))}
          </Carousel>
        </section>

        {/* 5. Packages across Zambia Carousel */}
        <section>
          <SectionHeading
            title="Curated Holiday Packages"
            subtitle="Bundled multi-day safaris and weekend getaways across Zambia"
            href="/packages"
            cta="See all packages"
          />
          <Carousel seeAllHref="/packages">
            {CURATED_PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </Carousel>
        </section>

        {/* 6. Flash Deals Carousel */}
        <section>
          <SectionHeading
            title="Flash Deals"
            subtitle="Limited-time discounts on hand-picked stays. Book now before they're gone"
            href="/stays?type=Popular"
            cta="See all deals"
          />
          <Carousel seeAllHref="/stays?type=Popular">
            {FLASH_DEALS.map((deal) => (
              <FlashDealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </section>

        {/* 7. Places to Visit / Gateway Cities Carousel */}
        <section>
          <SectionHeading
            title="Places to Visit"
            subtitle="Explore popular cities and gateway departure hubs across Zambia"
            href="/explore"
            cta="See all"
          />
          <Carousel seeAllHref="/explore">
            {ALL_CITIES.map((city) => (
              <PlaceCard key={city.id} place={city} />
            ))}
          </Carousel>
        </section>

        {/* 8. Must-See Attractions Carousel (informational — moved to bottom) */}
        <section>
          <SectionHeading
            title="Must-See Attractions"
            subtitle="Iconic landmarks, parks and natural wonders across Zambia"
          />
          <Carousel>
            {ALL_ATTRACTIONS.map((a) => (
              <AttractionCard key={a.id} attraction={a} />
            ))}
          </Carousel>
        </section>

        {/* 9. Transport Routes Carousel */}
        <section>
          <SectionHeading
            title="Popular Transport Routes"
            subtitle="Reliable bus and shuttle connections between Zambia's major hubs"
            href="/transport"
            cta="See all routes"
          />
          <Carousel seeAllHref="/transport">
            {mockTransport.slice(0, 6).map((route) => (
              <TransportItemCard key={route.id} route={route} />
            ))}
          </Carousel>
        </section>

        {/* 10. Trust & Value Banner */}
        <section className="bg-white rounded-2xl border border-neutral-100 p-6 md:p-10 shadow-sm">
          <div className="max-w-2xl mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">
              Why book your escape with us
            </h2>
            <p className="text-xs text-black-muted mt-1 leading-relaxed">
              Curated, verified stays and safaris across Zambia with best local rates and insider
              guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Curated & Verified",
                desc: "Every stay and tour partner is hand-inspected by local experts.",
              },
              {
                icon: Tag,
                title: "Best Local Price",
                desc: "Direct local rates with zero hidden markups or surprise fees.",
              },
              {
                icon: Award,
                title: "Instant Confirmation",
                desc: "Digital vouchers and seamless check-in for hassle-free travel.",
              },
              {
                icon: Headphones,
                title: "Local Concierge",
                desc: "Zambia-based support team ready to assist anytime.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-muted text-purple">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-black mb-0.5">{title}</h3>
                  <p className="text-xs text-black-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// Filter Pills Configurations (Matching Search Results Pages)

const STAY_PILLS = [
  { label: "Popular", type: "Popular" },
  { label: "Unique", type: "Unique" },
  { label: "Lodge", type: "Lodge" },
  { label: "Hotel", type: "Hotel" },
  { label: "Camp", type: "Camp" },
  { label: "Resort", type: "Resort" },
  { label: "Boutique", type: "Boutique" },
  { label: "Guesthouse", type: "Guesthouse" },
  { label: "Chalet", type: "Chalet" },
  { label: "Farm Stay", type: "Farm Stay" },
  { label: "Apartment", type: "Apartment" },
  { label: "Boat Stay", type: "Boat Stay" },
];

const EXPERIENCE_PILLS = [
  { label: "Popular", type: "popular" },
  { label: "Unique", type: "unique" },
  { label: "Wildlife & Safari", type: "wildlife" },
  { label: "Farm Visits", type: "farm" },
  { label: "Cultural & Heritage", type: "cultural" },
  { label: "Hidden Gems & Adventure", type: "adventure" },
  { label: "Water & Lakes", type: "water" },
  { label: "Industrial Tours", type: "industrial" },
];

const PACKAGE_PILLS = [
  { label: "All Packages", type: "all" },
  { label: "Safari & Wildlife", type: "safari" },
  { label: "Weekend Getaway", type: "weekend" },
  { label: "Adventure & Expedition", type: "adventure" },
  { label: "Lake & Water", type: "lake" },
];

const TRANSPORT_PILLS = [
  { label: "All Routes", type: "all" },
  { label: "Bus & Coach", type: "bus" },
  { label: "Shuttle", type: "shuttle" },
  { label: "Airport Transfer", type: "airport" },
];

// Level 1 & 2: Province / City Hub

function LocationHub({
  province,
  city,
}: {
  province: (typeof PROVINCES)[0];
  city?: (typeof PROVINCES)[0]["cities"][0];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [stayFilter, setStayFilter] = useState<string>("Popular");
  const [experienceFilter, setExperienceFilter] = useState<string>("popular");
  const [packageFilter, setPackageFilter] = useState<string>("all");
  const [transportFilter, setTransportFilter] = useState<string>("all");
  const tabsRef = useRef<HTMLDivElement>(null);

  const locationName = city?.name ?? province.name;

  const handleSwitchTab = (tab: Tab, filter?: string) => {
    setActiveTab(tab);
    if (tab === "stays" && filter) setStayFilter(filter);
    if (tab === "experiences" && filter) setExperienceFilter(filter);
    if (tab === "packages" && filter) setPackageFilter(filter);
    if (tab === "transport" && filter) setTransportFilter(filter);

    if (tabsRef.current) {
      const topOffset = tabsRef.current.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "explore", label: "Explore", icon: <Compass className="h-4 w-4" /> },
    { key: "stays", label: "Stays", icon: <Bed className="h-4 w-4" /> },
    { key: "experiences", label: "Experiences", icon: <Ticket className="h-4 w-4" /> },
    { key: "packages", label: "Packages", icon: <PackageIcon className="h-4 w-4" /> },
    { key: "transport", label: "Transport", icon: <Bus className="h-4 w-4" /> },
  ];

  const crumbs = [
    { label: "Explore", href: "/explore" },
    { label: province.name, href: `/explore/${province.id}` },
    ...(city ? [{ label: city.name, href: `#` }] : []),
  ];

  // Filter cities / towns (without images)
  const placesToVisit = city ? province.cities.filter((c) => c.id !== city.id) : province.cities;

  // Stays in this destination
  const destinationStays = useMemo(() => {
    const locLower = (city?.name ?? province.name).toLowerCase().replace("province", "").trim();
    const matched = mockStays.filter(
      (s) =>
        (s.location?.toLowerCase().includes(locLower) ?? false) ||
        (s.name?.toLowerCase().includes(locLower) ?? false),
    );
    return matched.length > 0 ? matched : mockStays;
  }, [province, city]);

  const filteredStays = useMemo(() => {
    if (!stayFilter) return destinationStays;
    if (stayFilter === "Popular") return destinationStays.filter((s) => s.rating >= 4.7);
    if (stayFilter === "Unique")
      return destinationStays.filter(
        (s) =>
          s.type === "Boutique" ||
          s.type === "Farm Stay" ||
          s.type === "Boat Stay" ||
          s.type === "Chalet",
      );
    const matched = destinationStays.filter((s) => s.type === stayFilter);
    return matched.length > 0 ? matched : destinationStays;
  }, [destinationStays, stayFilter]);

  // Experiences in this destination
  const destinationExperiences = useMemo(() => {
    const locLower = (city?.name ?? province.name).toLowerCase().replace("province", "").trim();
    const matched = mockExperiences.filter(
      (e) =>
        (e.location?.toLowerCase().includes(locLower) ?? false) ||
        (e.name?.toLowerCase().includes(locLower) ?? false),
    );
    return matched.length > 0 ? matched : mockExperiences;
  }, [province, city]);

  const filteredExperiences = useMemo(() => {
    if (!experienceFilter) return destinationExperiences;
    if (experienceFilter === "popular")
      return destinationExperiences.filter((e) => e.rating >= 4.8);
    if (experienceFilter === "unique")
      return destinationExperiences.filter((e) => e.rating >= 4.9 || e.category === "cultural");
    const matched = destinationExperiences.filter((e) => e.category === experienceFilter);
    return matched.length > 0 ? matched : destinationExperiences;
  }, [destinationExperiences, experienceFilter]);

  // Packages in and around destination
  const destinationPackages = useMemo(() => {
    return CURATED_PACKAGES.filter(
      (pkg) =>
        pkg.provinceId === province.id ||
        pkg.location.toLowerCase().includes(locationName.toLowerCase()),
    );
  }, [province.id, locationName]);

  const nearbyPackages = useMemo(() => {
    return CURATED_PACKAGES.filter(
      (pkg) =>
        pkg.provinceId !== province.id &&
        !pkg.location.toLowerCase().includes(locationName.toLowerCase()),
    );
  }, [province.id, locationName]);

  const allPackages = useMemo(() => {
    return [...destinationPackages, ...nearbyPackages];
  }, [destinationPackages, nearbyPackages]);

  const filteredPackages = useMemo(() => {
    if (!packageFilter || packageFilter === "all") return allPackages;
    if (packageFilter === "safari")
      return allPackages.filter(
        (p) =>
          p.name.toLowerCase().includes("safari") ||
          p.location.toLowerCase().includes("park") ||
          p.location.toLowerCase().includes("luangwa") ||
          p.location.toLowerCase().includes("kafue"),
      );
    if (packageFilter === "weekend")
      return allPackages.filter(
        (p) =>
          p.duration.toLowerCase().includes("weekend") ||
          p.duration.toLowerCase().includes("2") ||
          p.duration.toLowerCase().includes("3"),
      );
    if (packageFilter === "adventure")
      return allPackages.filter(
        (p) =>
          p.name.toLowerCase().includes("trek") ||
          p.name.toLowerCase().includes("circuit") ||
          p.name.toLowerCase().includes("trail") ||
          p.name.toLowerCase().includes("expedition"),
      );
    if (packageFilter === "lake")
      return allPackages.filter(
        (p) =>
          p.name.toLowerCase().includes("lake") ||
          p.name.toLowerCase().includes("kariba") ||
          p.name.toLowerCase().includes("river") ||
          p.location.toLowerCase().includes("kariba"),
      );
    return allPackages;
  }, [allPackages, packageFilter]);

  // Transport connections
  const destinationTransport = useMemo(() => {
    const locLower = (city?.name ?? province.name).toLowerCase().replace("province", "").trim();
    const matched = mockTransport.filter(
      (t) =>
        (t.from?.toLowerCase().includes(locLower) ?? false) ||
        (t.to?.toLowerCase().includes(locLower) ?? false),
    );
    return matched.length > 0 ? matched : mockTransport;
  }, [province, city]);

  const filteredTransport = useMemo(() => {
    if (!transportFilter || transportFilter === "all") return destinationTransport;
    if (transportFilter === "bus")
      return destinationTransport.filter(
        (t) =>
          t.operator.toLowerCase().includes("bus") || t.operator.toLowerCase().includes("coach"),
      );
    if (transportFilter === "shuttle")
      return destinationTransport.filter(
        (t) => t.operator.toLowerCase().includes("shuttle") || t.duration.includes("hr"),
      );
    if (transportFilter === "airport")
      return destinationTransport.filter(
        (t) =>
          t.to.toLowerCase().includes("airport") ||
          t.from.toLowerCase().includes("airport") ||
          t.operator.toLowerCase().includes("express"),
      );
    return destinationTransport;
  }, [destinationTransport, transportFilter]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-8 md:pt-14 md:pb-10 bg-white border-b border-neutral-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-4 pb-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 mb-5 flex-wrap" aria-label="Breadcrumb">
            {crumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />}
                {i === crumbs.length - 1 ? (
                  <span className="text-black text-xs font-bold">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-neutral-500 hover:text-[#6b2bb8] text-xs font-semibold transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <h1 className="font-display font-semibold text-3xl md:text-4xl text-neutral-900 leading-tight tracking-tight max-w-2xl mb-2">
            {locationName}
          </h1>
          <p className="text-neutral-600 text-sm md:text-base max-w-xl leading-relaxed font-normal">
            {province.desc}
          </p>
        </div>
      </section>

      {/* Sticky Primary Tabs */}
      <div
        ref={tabsRef}
        className="sticky top-[64px] z-20 bg-white border-b border-neutral-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-6 md:gap-8 overflow-x-auto scrollbar-hide -mb-[1px]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleSwitchTab(tab.key)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2 py-3.5 text-sm font-bold transition-all duration-150 cursor-pointer border-b-2 whitespace-nowrap",
                  activeTab === tab.key
                    ? "border-[#6b2bb8] text-[#6b2bb8]"
                    : "border-transparent text-neutral-500 hover:text-[#6b2bb8]",
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Secondary Filter Line (Pills line matching search results pages) */}
      {activeTab === "stays" && (
        <div className="sticky top-[115px] z-10 bg-white border-b border-neutral-200 shadow-xs">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div
              className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {STAY_PILLS.map((pill) => {
                const active = stayFilter === pill.type;
                return (
                  <button
                    key={pill.type}
                    type="button"
                    onClick={() => setStayFilter(active ? "" : pill.type)}
                    className={cn(
                      "flex-none whitespace-nowrap px-6 py-2 rounded-full border text-sm transition-all duration-150 active:scale-95 select-none cursor-pointer",
                      active
                        ? "bg-[#6b2bb8] text-white border-[#6b2bb8] shadow-sm font-bold scale-[1.02]"
                        : "bg-white border-neutral-200 text-neutral-700 font-semibold hover:border-[#6b2bb8]/50 hover:text-[#6b2bb8] hover:bg-[#6b2bb8]/[0.03] hover:shadow-xs",
                    )}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "experiences" && (
        <div className="sticky top-[115px] z-10 bg-white border-b border-neutral-200 shadow-xs">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div
              className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {EXPERIENCE_PILLS.map((pill) => {
                const active = experienceFilter === pill.type;
                return (
                  <button
                    key={pill.type}
                    type="button"
                    onClick={() => setExperienceFilter(active ? "" : pill.type)}
                    className={cn(
                      "flex-none whitespace-nowrap px-6 py-2 rounded-full border text-sm transition-all duration-150 active:scale-95 select-none cursor-pointer",
                      active
                        ? "bg-[#6b2bb8] text-white border-[#6b2bb8] shadow-sm font-bold scale-[1.02]"
                        : "bg-white border-neutral-200 text-neutral-700 font-semibold hover:border-[#6b2bb8]/50 hover:text-[#6b2bb8] hover:bg-[#6b2bb8]/[0.03] hover:shadow-xs",
                    )}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "packages" && (
        <div className="sticky top-[115px] z-10 bg-white border-b border-neutral-200 shadow-xs">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div
              className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {PACKAGE_PILLS.map((pill) => {
                const active = packageFilter === pill.type;
                return (
                  <button
                    key={pill.type}
                    type="button"
                    onClick={() => setPackageFilter(pill.type)}
                    className={cn(
                      "flex-none whitespace-nowrap px-6 py-2 rounded-full border text-sm transition-all duration-150 active:scale-95 select-none cursor-pointer",
                      active
                        ? "bg-[#6b2bb8] text-white border-[#6b2bb8] shadow-sm font-bold scale-[1.02]"
                        : "bg-white border-neutral-200 text-neutral-700 font-semibold hover:border-[#6b2bb8]/50 hover:text-[#6b2bb8] hover:bg-[#6b2bb8]/[0.03] hover:shadow-xs",
                    )}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "transport" && (
        <div className="sticky top-[115px] z-10 bg-white border-b border-neutral-200 shadow-xs">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div
              className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {TRANSPORT_PILLS.map((pill) => {
                const active = transportFilter === pill.type;
                return (
                  <button
                    key={pill.type}
                    type="button"
                    onClick={() => setTransportFilter(pill.type)}
                    className={cn(
                      "flex-none whitespace-nowrap px-6 py-2 rounded-full border text-sm transition-all duration-150 active:scale-95 select-none cursor-pointer",
                      active
                        ? "bg-[#6b2bb8] text-white border-[#6b2bb8] shadow-sm font-bold scale-[1.02]"
                        : "bg-white border-neutral-200 text-neutral-700 font-semibold hover:border-[#6b2bb8]/50 hover:text-[#6b2bb8] hover:bg-[#6b2bb8]/[0.03] hover:shadow-xs",
                    )}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT */}

      {/* 1. EXPLORE OVERVIEW TAB */}
      {activeTab === "explore" && (
        <div className="pb-16 space-y-4">
          {/* 1. Popular Experiences Carousel (At the top) */}
          {destinationExperiences.length > 0 && (
            <section className="py-8 md:py-10">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <SectionHeading
                  title="Popular Experiences"
                  subtitle={`${destinationExperiences.length} experiences available in this region`}
                  cta="See all"
                  onAction={() => handleSwitchTab("experiences", "popular")}
                />
                <Carousel onSeeAll={() => handleSwitchTab("experiences", "popular")}>
                  {destinationExperiences.slice(0, 6).map((exp) => (
                    <ExperienceItemCard key={exp.id} exp={exp} />
                  ))}
                </Carousel>
              </div>
            </section>
          )}

          {/* 2. Popular Stays Carousel (At the top) */}
          {destinationStays.length > 0 && (
            <section className="py-8 md:py-10 bg-white">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <SectionHeading
                  title="Where to Stay"
                  subtitle={`${destinationStays.length} vetted safari lodges, villas and guesthouses`}
                  cta="See all stays"
                  onAction={() => handleSwitchTab("stays", "Popular")}
                />
                <Carousel onSeeAll={() => handleSwitchTab("stays", "Popular")}>
                  {destinationStays.slice(0, 6).map((stay) => (
                    <div
                      key={stay.id}
                      className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start"
                    >
                      <ListingCard listing={stay} />
                    </div>
                  ))}
                </Carousel>
              </div>
            </section>
          )}

          {/* 3. Packages in the Destination Carousel */}
          {destinationPackages.length > 0 && (
            <section className="py-8 md:py-10">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <SectionHeading
                  title={`Packages in ${locationName}`}
                  subtitle={`All-inclusive bundled itineraries and holiday getaways in ${locationName}`}
                  cta="See all packages"
                  onAction={() => handleSwitchTab("packages", "all")}
                />
                <Carousel onSeeAll={() => handleSwitchTab("packages", "all")}>
                  {destinationPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </Carousel>
              </div>
            </section>
          )}

          {/* 4. Packages Around the Destination Carousel */}
          {nearbyPackages.length > 0 && (
            <section className="py-8 md:py-10 bg-white">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <SectionHeading
                  title={`Packages Around ${locationName}`}
                  subtitle="Regional safari circuits, national park extensions and nearby adventures"
                  cta="Browse packages"
                  onAction={() => handleSwitchTab("packages", "all")}
                />
                <Carousel onSeeAll={() => handleSwitchTab("packages", "all")}>
                  {nearbyPackages.slice(0, 6).map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </Carousel>
              </div>
            </section>
          )}

          {/* 5. More Experiences Carousel */}
          {destinationExperiences.length > 3 && (
            <section className="py-8 md:py-10">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <SectionHeading
                  title="More Things to Do"
                  subtitle="Active adventures, wildlife encounters and cultural tours"
                  cta="Browse all"
                  onAction={() => handleSwitchTab("experiences", "unique")}
                />
                <Carousel onSeeAll={() => handleSwitchTab("experiences", "unique")}>
                  {destinationExperiences.slice(3, 9).map((exp) => (
                    <ExperienceItemCard key={exp.id} exp={exp} />
                  ))}
                </Carousel>
              </div>
            </section>
          )}

          {/* 6. Flash Deals Carousel */}
          <section className="py-8 md:py-10 bg-white">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <SectionHeading
                title="Flash Deals"
                subtitle="Special discounted stays currently available"
                cta="View deals"
                onAction={() => handleSwitchTab("stays", "Popular")}
              />
              <Carousel onSeeAll={() => handleSwitchTab("stays", "Popular")}>
                {FLASH_DEALS.map((deal) => (
                  <FlashDealCard key={deal.id} deal={deal} />
                ))}
              </Carousel>
            </div>
          </section>

          {/* 7. Places to Visit (Cities & Gateway Towns) */}
          {placesToVisit.length > 0 && (
            <section className="py-8 md:py-10">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <SectionHeading
                  title="Places to Visit"
                  subtitle="Explore cities and gateway towns around this region"
                />
                <Carousel>
                  {placesToVisit.map((place) => (
                    <PlaceCard key={place.id} place={{ ...place, provinceId: province.id }} />
                  ))}
                </Carousel>
              </div>
            </section>
          )}

          {/* 8. Transport Carousel */}
          {destinationTransport.length > 0 && (
            <section className="py-8 md:py-10 bg-white">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <SectionHeading
                  title="Getting Around"
                  subtitle={`${destinationTransport.length} connections, shuttles and airport routes`}
                  cta="See all routes"
                  onAction={() => handleSwitchTab("transport", "all")}
                />
                <Carousel onSeeAll={() => handleSwitchTab("transport", "all")}>
                  {destinationTransport.slice(0, 6).map((route) => (
                    <TransportItemCard key={route.id} route={route} />
                  ))}
                </Carousel>
              </div>
            </section>
          )}

          {/* 9. Top Attractions — informational discovery, kept at the bottom */}
          {province.attractions.length > 0 && (
            <section className="py-8 md:py-10">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <SectionHeading
                  title="Top Attractions"
                  subtitle="Iconic landmarks and natural highlights in this region"
                />
                <Carousel>
                  {province.attractions.map((a) => (
                    <AttractionCard
                      key={a.id}
                      attraction={{ ...a, provinceId: province.id, provinceName: province.name }}
                    />
                  ))}
                </Carousel>
              </div>
            </section>
          )}
        </div>
      )}

      {/* 2. STAYS TAB (Full Grid with Active Pill Filter) */}
      {activeTab === "stays" && (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">
                {stayFilter === "Popular"
                  ? `Popular Stays in ${locationName}`
                  : stayFilter
                    ? `${stayFilter} Stays in ${locationName}`
                    : `All Stays in ${locationName}`}
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 mt-1 font-normal">
                Showing {filteredStays.length} vetted safari lodges, villas and guesthouses
              </p>
            </div>
            {stayFilter && (
              <button
                type="button"
                onClick={() => setStayFilter("")}
                className="text-xs font-medium text-purple hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredStays.map((stay) => (
              <ListingCard key={stay.id} listing={stay} />
            ))}
          </div>
        </main>
      )}

      {/* 3. EXPERIENCES TAB (Full Grid with Active Pill Filter) */}
      {activeTab === "experiences" && (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">
                {experienceFilter === "popular"
                  ? `Popular Experiences in ${locationName}`
                  : experienceFilter
                    ? `${experienceFilter.charAt(0).toUpperCase() + experienceFilter.slice(1)} Experiences in ${locationName}`
                    : `All Experiences in ${locationName}`}
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 mt-1 font-normal">
                Showing {filteredExperiences.length} guided tours, safaris and authentic activities
              </p>
            </div>
            {experienceFilter && (
              <button
                type="button"
                onClick={() => setExperienceFilter("")}
                className="text-xs font-medium text-purple hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredExperiences.map((exp) => (
              <ExperienceItemCard key={exp.id} exp={exp} isGrid />
            ))}
          </div>
        </main>
      )}

      {/* 4. PACKAGES TAB (Full Grid with Active Pill Filter) */}
      {activeTab === "packages" && (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">
                {packageFilter === "all"
                  ? `Holiday Packages in & around ${locationName}`
                  : `${packageFilter.charAt(0).toUpperCase() + packageFilter.slice(1)} Packages in ${locationName}`}
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 mt-1 font-normal">
                Showing {filteredPackages.length} curated multi-day itineraries and safari getaways
              </p>
            </div>
            {packageFilter !== "all" && (
              <button
                type="button"
                onClick={() => setPackageFilter("all")}
                className="text-xs font-medium text-purple hover:underline cursor-pointer"
              >
                Show all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} isGrid />
            ))}
          </div>
        </main>
      )}

      {/* 5. TRANSPORT TAB (Full Grid with Active Pill Filter) */}
      {activeTab === "transport" && (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 tracking-tight">
                Transport &amp; Connections for {locationName}
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 mt-1 font-normal">
                Showing {filteredTransport.length} routes, scheduled buses and private shuttles
              </p>
            </div>
            {transportFilter !== "all" && (
              <button
                type="button"
                onClick={() => setTransportFilter("all")}
                className="text-xs font-medium text-purple hover:underline cursor-pointer"
              >
                Show all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredTransport.map((route) => (
              <TransportItemCard key={route.id} route={route} isGrid />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

// Main Route Export

export function ExplorePage({ slug }: { slug: string[] }) {
  const [provinceSlug, citySlug] = slug;

  // Level 0 — All provinces national hub
  if (!provinceSlug) return <ProvinceGrid />;

  const province = PROVINCES.find((p) => p.id === provinceSlug);
  if (!province) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <MapPin className="h-6 w-6 text-red-400" />
        </div>
        <div className="text-center">
          <p className="font-bold text-[#1a1a1f] text-lg mb-1">Province not found</p>
          <p className="text-sm text-[#5a5a66] max-w-xs">
            We couldn&apos;t find &quot;{provinceSlug}&quot;. Try browsing from the explore page.
          </p>
        </div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 bg-[#6b2bb8] hover:bg-[#5a1f9e] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  // Level 1 — Province hub
  if (!citySlug) return <LocationHub province={province} />;

  // Level 2 — City hub
  const city = province.cities.find((c) => c.id === citySlug);
  return <LocationHub province={province} city={city} />;
}
