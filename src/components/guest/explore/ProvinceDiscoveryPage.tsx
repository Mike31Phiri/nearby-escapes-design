"use client";

import Link from "next/link";
import {
  type ProvinceData,
  getCitiesByProvince,
  getAttractionsByProvince,
} from "@/lib/mock-explore-data";
import { mockStays, mockExperiences, mockTransport, mockPackages } from "@/lib/mock-data";
import { DiscoveryHero } from "@/components/guest/explore/DiscoveryHero";
import { DiscoverySection } from "@/components/guest/explore/DiscoverySection";
import { AttractionCard } from "@/components/guest/explore/AttractionCard";
import { MiniCard, TransportMiniCard, PackageMiniCard } from "@/components/guest/explore/MiniCard";
import {
  ExploreFilterBar,
  type ExploreFilterType,
} from "@/components/guest/explore/ExploreFilterBar";
import { useState } from "react";

interface ProvinceDiscoveryPageProps {
  province: ProvinceData;
}

export function ProvinceDiscoveryPage({ province }: ProvinceDiscoveryPageProps) {
  const [globalFilter, setGlobalFilter] = useState<ExploreFilterType>("popular");

  const cities = getCitiesByProvince(province.id);
  let filteredAttractions = getAttractionsByProvince(province.id);

  const cityNames = cities.map((c) => c.name.toLowerCase());
  const provinceName = province.name.toLowerCase();

  const inProvince = (str: string) =>
    cityNames.some((cn) => str.toLowerCase().includes(cn)) ||
    str.toLowerCase().includes(provinceName);

  let filteredStays = mockStays.filter((s) => inProvince(s.location));
  let filteredExperiences = mockExperiences.filter((e) => inProvince(e.location));
  const filteredTransport = mockTransport.filter((t) => inProvince(t.from) || inProvince(t.to));
  const filteredPackages = mockPackages.filter((p) => inProvince(p.location));

  // Apply global filter logic
  if (globalFilter === "popular") {
    filteredStays = filteredStays.filter((s) => s.rating >= 4.7);
    filteredExperiences = filteredExperiences.filter((e) => e.rating >= 4.7);
  } else if (globalFilter === "hidden-gems") {
    filteredStays = filteredStays.filter((s) =>
      ["farm", "eco-camp", "lodge"].some((t) => s.type.toLowerCase().includes(t)),
    );
    filteredExperiences = filteredExperiences.filter((e) =>
      ["farm", "general"].includes(e.category),
    );
    filteredAttractions = filteredAttractions.filter((a) =>
      ["other", "natural-landmark"].includes(a.category),
    );
  } else if (globalFilter === "adventure") {
    filteredExperiences = filteredExperiences.filter((e) =>
      ["adventure", "wildlife"].includes(e.category),
    );
    filteredAttractions = filteredAttractions.filter((a) =>
      ["game-reserve", "waterfall"].includes(a.category),
    );
  } else if (globalFilter === "history") {
    filteredExperiences = filteredExperiences.filter((e) =>
      ["cultural", "industrial"].includes(e.category),
    );
    filteredAttractions = filteredAttractions.filter((a) => a.category === "heritage-site");
  } else if (globalFilter === "family") {
    filteredStays = filteredStays.filter((s) =>
      s.amenities.some((a) => a.toLowerCase().includes("pool")),
    );
    filteredExperiences = filteredExperiences.filter((e) => e.category !== "adventure");
  } else if (globalFilter === "relaxation") {
    filteredStays = filteredStays.filter((s) =>
      s.amenities.some((a) => a.toLowerCase().includes("spa") || a.toLowerCase().includes("pool")),
    );
    filteredExperiences = filteredExperiences.filter((e) =>
      ["water", "cultural"].includes(e.category),
    );
    filteredAttractions = filteredAttractions.filter((a) =>
      ["lake", "waterfall", "viewpoint"].includes(a.category),
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Hero */}
      <DiscoveryHero
        title={province.name}
        tagline={province.tagline}
        coverImage={province.coverImage}
        breadcrumbs={[{ label: "Zambia", href: "/explore" }, { label: province.name }]}
      />

      {/* City pills */}
      {cities.length > 0 && (
        <div className="px-5 md:px-8 max-w-7xl mx-auto py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9AB3A8] mb-3">
            Cities in {province.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/explore/${province.id}/${city.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] border-[#1C3A2F]/18 bg-white text-[13px] font-semibold text-[#1C3A2F] hover:bg-[#1C3A2F] hover:text-white hover:border-[#1C3A2F] transition-all duration-200"
              >
                {city.name}
                <span className="text-[11px] font-normal text-[#9AB3A8]">
                  {city.stayCount} stays
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] md:top-[80px] z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#1C3A2F]/08 shadow-[0_1px_0_rgba(28,58,47,0.06)]">
        <ExploreFilterBar active={globalFilter} onChange={setGlobalFilter} />
      </div>

      {/* Attractions */}
      <DiscoverySection
        title="Attractions"
        emoji="🏛️"
        seeAllHref={`/explore/${province.id}/attractions`}
        seeAllLabel={`See all in ${province.name}`}
        isEmpty={filteredAttractions.length === 0}
        emptyMessage="No attractions found for this filter."
      >
        {filteredAttractions.map((attraction) => (
          <AttractionCard
            key={attraction.id}
            attraction={attraction}
            href={`/explore/${province.id}/${attraction.city}/${attraction.id}`}
          />
        ))}
      </DiscoverySection>

      {/* Stays */}
      <DiscoverySection
        title="Places to Stay"
        emoji="🏡"
        seeAllHref={`/stays?province=${province.id}`}
        seeAllLabel="See all stays"
        isEmpty={filteredStays.length === 0}
        emptyMessage="No stays found for this filter."
      >
        {filteredStays.map((stay) => (
          <MiniCard
            key={stay.id}
            href={`/listings/stays/${stay.id}`}
            image={stay.image}
            name={stay.name}
            location={stay.location}
            rating={stay.rating}
            price={stay.price}
            priceUnit="/ night"
            badge={stay.type}
          />
        ))}
      </DiscoverySection>

      {/* Experiences */}
      <DiscoverySection
        title="Experiences"
        emoji="🎭"
        seeAllHref={`/experiences?province=${province.id}`}
        seeAllLabel="See all experiences"
        isEmpty={filteredExperiences.length === 0}
        emptyMessage="No experiences found for this filter."
      >
        {filteredExperiences.map((exp) => (
          <MiniCard
            key={exp.id}
            href={`/experiences/${exp.id}`}
            image={exp.image}
            name={exp.name}
            location={exp.location}
            rating={exp.rating}
            price={exp.price}
            priceUnit="/ person"
          />
        ))}
      </DiscoverySection>

      {/* Transport */}
      <DiscoverySection
        title="Getting There"
        emoji="🚌"
        seeAllHref={`/transport?province=${province.id}`}
        seeAllLabel="See all transport"
        isEmpty={filteredTransport.length === 0}
        emptyMessage="No transport routes found for this filter."
      >
        {filteredTransport.map((t) => (
          <TransportMiniCard key={t.id} {...t} />
        ))}
      </DiscoverySection>

      {/* Packages */}
      <DiscoverySection
        title="Packages"
        emoji="📦"
        seeAllHref={`/packages?province=${province.id}`}
        seeAllLabel="See all packages"
        isEmpty={filteredPackages.length === 0}
        emptyMessage="No packages found for this filter."
      >
        {filteredPackages.map((pkg) => (
          <PackageMiniCard key={pkg.id} {...pkg} />
        ))}
      </DiscoverySection>

      <div className="h-12" />
    </div>
  );
}
