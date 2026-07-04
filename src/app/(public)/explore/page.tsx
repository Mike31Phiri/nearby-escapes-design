'use client';

import Link from "next/link";
import { SearchBar } from "@/components/shared/SearchBar";
import { ArrowRight, Waves, Trees, Sun, Compass } from "lucide-react";

// Curated theme collections matching the aesthetic palette
const featuredCollections = [
  {
    id: "farms-near-lusaka",
    title: "Farms near Lusaka",
    desc: "Escape the city to working farmsteads in Chisamba, Chongwe, and beyond.",
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&q=80",
    count: 12,
    color: "#2D4A2D",
  },
  {
    id: "lakeside-retreats",
    title: "Lakeside Retreats",
    desc: "Wake up to shimmering water views on Lake Kariba and Lake Tanganyika.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    count: 8,
    color: "#1A3A4A",
  },
  {
    id: "bush-wilderness",
    title: "Bush & Wilderness",
    desc: "Deep safari camps in South Luangwa, Kafue, and Lower Zambezi.",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80",
    count: 15,
    color: "#3A2810",
  },
];

// Highlighted provinces acting as visual macro entry-points
const discoverProvinces = [
  {
    slug: "lusaka",
    name: "Lusaka Province",
    eyebrow: "Urban & Farm Escapes",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    icon: Sun,
  },
  {
    slug: "southern",
    name: "Southern Province",
    eyebrow: "Adventure & Heritage",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    icon: Waves,
  },
  {
    slug: "northern",
    name: "Northern Province",
    eyebrow: "Hidden Waterfalls & Lakes",
    image: "https://images.unsplash.com/photo-1546703565-373809930f78?w=800&q=80",
    icon: Trees,
  },
];

export default function ExploreCountryPage() {
  const handleGlobalSearch = (term: string) => {
    // Handled client side via search bar integration logic
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#111111] overflow-x-hidden">
      {/* 1. Hero Cover */}
      <section className="relative pt-16 pb-24 text-center bg-[#1A0B2E]">
        <div className="max-w-3xl mx-auto px-4">
          <p className="font-script text-2xl text-[#D4AF37] mb-3">Zambia Travel Guide</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            Where would you like to venture?
          </h1>
          <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-md mx-auto">
            Select a specific province loop below, or alter the global toggle to filter localized spaces contextually.
          </p>
        </div>
      </section>

      {/* 2. Overlapping Unified Search & Filter Control */}
      <div className="relative z-20 -mt-8 mx-auto max-w-2xl px-4">
        <SearchBar onSearch={handleGlobalSearch} activeCategory="destinations" />
      </div>

      {/* 3. Main Curation Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-20">
        
        {/* Regional Structural Pillars */}
        <section>
          <div className="mb-8">
            <p className="font-script text-xl text-[#D4AF37] mb-1">Regional Routes</p>
            <h2 className="font-display text-2xl font-bold text-[#1A0B2E]">Explore by Province</h2>
            <p className="text-[#6B7280] text-sm mt-1">Uncover distinct landscapes, localized cities, and verified landmarks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discoverProvinces.map((prov) => {
              const IconComponent = prov.icon;
              return (
                <Link
                  key={prov.slug}
                  href={`/explore/${prov.slug}`}
                  className="group relative block overflow-hidden rounded-2xl bg-gray-100 aspect-[16/10] shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <img
                    src={prov.image}
                    alt={prov.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30">
                    <IconComponent className="h-4 w-4 text-[#D4AF37]" />
                  </div>

                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-1">
                      {prov.eyebrow}
                    </p>
                    <h3 className="font-display text-white font-bold text-lg flex items-center gap-2">
                      {prov.name} <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Thematic Browsing Vectors */}
        <section className="border-t border-[#E0DBD0] pt-14">
          <div className="mb-8">
            <p className="font-script text-xl text-[#D4AF37] mb-1">Curated Visions</p>
            <h2 className="font-display text-2xl font-bold text-[#1A0B2E]">Explore by Theme</h2>
            <p className="text-[#6B7280] text-sm mt-1">Hand-picked collections mapped across boundaries and districts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCollections.map((col) => (
              <div
                key={col.id}
                className="group relative block overflow-hidden rounded-2xl aspect-[4/3] shadow-sm bg-gray-100"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
                  style={{
                    background: `linear-gradient(to top, ${col.color}EE, ${col.color}55, transparent)`,
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 bg-[#D4AF37] text-[#1A0B2E] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    {col.count} verified spots
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 p-5 w-full text-white">
                  <h3 className="font-display font-bold text-lg mb-1">{col.title}</h3>
                  <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{col.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}