"use client";

import Link from "next/link";
import type { AttractionData } from "@/lib/mock-explore-data";

const CATEGORY_LABELS: Record<AttractionData["category"], string> = {
  waterfall: "Waterfall",
  "game-reserve": "Game Reserve",
  "heritage-site": "Heritage Site",
  viewpoint: "Viewpoint",
  "natural-landmark": "Natural Landmark",
  lake: "Lake",
  dam: "Dam",
  other: "Attraction",
};

interface AttractionCardProps {
  attraction: AttractionData;
  href: string;
  distanceLabel?: string;
}

export function AttractionCard({ attraction, href, distanceLabel }: AttractionCardProps) {
  return (
    <Link
      href={href}
      aria-label={`Explore ${attraction.name}`}
      className={[
        "group relative flex-none w-[240px]",
        "bg-white rounded-[14px] overflow-hidden",
        "border-[1.5px] border-[#1C3A2F]/07",
        "transition-all duration-200",
        "hover:-translate-y-[3px]",
        "hover:border-[#1C3A2F]/20",
        "hover:shadow-[0_8px_24px_rgba(28,58,47,0.10)]",
        "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px]",
        "after:bg-[#E8952E] after:rounded-b-[14px]",
        "after:scale-x-0 after:origin-left after:transition-transform after:duration-250",
        "hover:after:scale-x-100",
      ].join(" ")}
    >
      {/* Image — slightly taller ratio for attractions (more portrait/scenic) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E8E2D8]">
        <img
          src={attraction.coverImage}
          alt={attraction.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-450 group-hover:scale-[1.06]"
        />
        <span className="absolute top-2.5 left-2.5 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E8952E]/90 text-[#3D1F00] backdrop-blur-sm">
          {CATEGORY_LABELS[attraction.category]}
        </span>
      </div>

      {/* Content */}
      <div className="px-3.5 pt-3 pb-3.5">
        <h3 className="text-[14px] font-bold text-[#1C3A2F] leading-snug line-clamp-1">
          {attraction.name}
        </h3>
        <p className="mt-1.5 text-[12px] text-[#7E9E95] leading-relaxed line-clamp-2">
          {attraction.description}
        </p>
        {distanceLabel && (
          <p className="mt-2 text-[12px] font-semibold text-[#E8952E]">📍 {distanceLabel}</p>
        )}
      </div>
    </Link>
  );
}
