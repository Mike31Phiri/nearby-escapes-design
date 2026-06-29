"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Star, MapPin, Clock, Users, ChevronLeft, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Experience, ExperienceCategory } from "@/lib/mock-data";
import { categoryLabels, categoryIcons } from "@/lib/mock-data";

interface ExperienceCategoryPageProps {
  category: ExperienceCategory;
  experiences: Experience[];
}

// Category-specific hero configs
const categoryHero: Record<
  ExperienceCategory,
  {
    title: string;
    tagline: string;
    description: string;
    gradient: string;
    image: string;
  }
> = {
  farm: {
    title: "Farm Visits & Agri-Tourism",
    tagline: "🌾 Countryside living",
    description:
      "Escape to the countryside and experience Zambian farm life. Milk cows, harvest crops, tour organic farms, and taste the freshest produce straight from the earth.",
    gradient: "from-[#2D4A2D] via-[#3D5A3D] to-[#2D4A2D]",
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1200&q=80",
  },
  wildlife: {
    title: "Wildlife & Nature Day Trips",
    tagline: "🦁 Into the wild",
    description:
      "Get up close with Zambia's incredible wildlife. From walking safaris in South Luangwa to game drives in Kafue — these are experiences you'll carry forever.",
    gradient: "from-[#3A2810] via-[#4A3820] to-[#3A2810]",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
  },
  cultural: {
    title: "Cultural & Community Experiences",
    tagline: "🎭 Meet the people",
    description:
      "Connect with Zambia's rich cultural heritage. Visit traditional villages, learn ancient crafts, taste local cuisine, and dance to the rhythm of African drums.",
    gradient: "from-[#4A2A1A] via-[#5A3A2A] to-[#4A2A1A]",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
  },
  industrial: {
    title: "Industrial Heritage Tours",
    tagline: "⚙️ Mining & engineering marvels",
    description:
      "Discover Zambia's industrial backbone. Tour active copper mines, stand at the foot of the massive Kariba Dam, and learn how engineering shaped the nation.",
    gradient: "from-[#3A3020] via-[#4A4030] to-[#3A3020]",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
  },
  adventure: {
    title: "Adventure & Tours",
    tagline: "🧗 Thrills & excitement",
    description:
      "For the adrenaline seekers and explorers. Raft the Zambezi's legendary rapids, soar above Victoria Falls in a helicopter, or hike to hidden waterfalls.",
    gradient: "from-[#1A0B2E] via-[#3A2B4D] to-[#1A0B2E]",
    image: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=1200&q=80",
  },
  water: {
    title: "Water Sports & Lakes",
    tagline: "🌊 Lakes, rivers & adventure",
    description:
      "Zambia's lakes and rivers offer world-class water experiences. Snorkel in Lake Tanganyika, canoe the Zambezi, or cruise the serene waters of Lake Kariba at sunset.",
    gradient: "from-[#1A3A4A] via-[#2A4A5A] to-[#1A3A4A]",
    image: "https://images.unsplash.com/photo-1540206395-688085723adb?w=1200&q=80",
  },
  general: {
    title: "General Attractions",
    tagline: "📍 Discover Zambia",
    description:
      "Browse all experiences, tours, and activities across Zambia. From city tours to wilderness adventures — find your next unforgettable experience.",
    gradient: "from-[#1A0B2E] via-[#3A2B4D] to-[#1A0B2E]",
    image: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=1200&q=80",
  },
};

// All category slugs for the filter bar
const allCategorySlugs: ExperienceCategory[] = [
  "wildlife",
  "farm",
  "cultural",
  "industrial",
  "adventure",
  "water",
];

export function ExperienceCategoryPage({ category, experiences }: ExperienceCategoryPageProps) {
  const hero = categoryHero[category];
  const icon = categoryIcons[category];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/*  Hero Banner  */}
      <section className={cn("relative overflow-hidden pt-16 pb-16 md:pb-20")}>
        {/* Background gradient + image */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", hero.gradient)} />
        <div className="absolute inset-0 opacity-30">
          <img src={hero.image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 mb-6">
          <Link
            href="/search?category=attractions"
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white/90 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            All experiences
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <p className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-3">
              {hero.tagline}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-black text-white leading-[1.1] mb-4">
              {hero.title}
            </h1>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xl">{hero.description}</p>
          </div>
        </div>
      </section>

      {/*  Category Filter Tabs  */}
      <div className="border-b border-[#E0DBD0] bg-white sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
            {allCategorySlugs.map((slug) => (
              <Link
                key={slug}
                href={`/experiences/category/${slug}`}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200",
                  slug === category
                    ? "bg-[#1A0B2E] text-white shadow-sm"
                    : "text-[#64748B] hover:text-[#1A0B2E] hover:bg-[#F9F7F2]",
                )}
              >
                <span>{categoryIcons[slug]}</span>
                {categoryLabels[slug]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/*  Experience Grid  */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-8 py-8 md:py-10">
        {experiences.length === 0 ? (
          <div className="text-center py-20">
            <Compass className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">No experiences found</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We couldn&apos;t find any experiences in this category yet. Check back soon or explore
              other categories.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{experiences.length}</strong>{" "}
                {experiences.length === 1 ? "experience" : "experiences"} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {experiences.map((exp) => (
                <Link
                  key={exp.id}
                  href={`/listings/experiences/${exp.id}`}
                  className="group block rounded-2xl bg-white overflow-hidden transition-all duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(42,27,61,0.14)] hover:-translate-y-1 ring-1 ring-black/[0.04]"
                  style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                >
                  <div className="relative aspect-[16/10] bg-muted overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 bg-[#1A0B2E]/80 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md backdrop-blur-sm">
                        {categoryIcons[exp.category]} {categoryLabels[exp.category]}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-[15px] tracking-tight text-[#334155] line-clamp-1 mb-1">
                      {exp.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[13px] text-[#64748B] mb-3">
                      <MapPin className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                      <span className="line-clamp-1">{exp.location}</span>
                    </div>

                    {/* Duration + Group size chips */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exp.duration && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#64748B] bg-[#F9F7F2] px-2 py-1 rounded-full">
                          <Clock className="h-3 w-3" />
                          {exp.duration}
                        </span>
                      )}
                      {exp.groupSize && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#64748B] bg-[#F9F7F2] px-2 py-1 rounded-full">
                          <Users className="h-3 w-3" />
                          {exp.groupSize}
                        </span>
                      )}
                    </div>

                    {/* Price + Rating */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[15px] font-bold text-[#1A0B2E]">
                          ZMW {exp.price}
                        </span>
                        <span className="text-[12px] text-[#64748B]">/ person</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                        <span className="text-[13px] font-semibold text-[#64748B]">
                          {exp.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
