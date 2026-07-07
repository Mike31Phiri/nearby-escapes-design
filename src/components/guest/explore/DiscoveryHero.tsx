"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DiscoveryHeroProps {
  title: string;
  tagline?: string;
  coverImage: string;
  breadcrumbs: BreadcrumbItem[];
  overlayOpacity?: number;
  badge?: string;
}

export function DiscoveryHero({
  title,
  tagline,
  coverImage,
  breadcrumbs,
  badge,
}: DiscoveryHeroProps) {
  return (
    <div className="relative w-full h-[280px] md:h-[380px] overflow-hidden bg-purple-deep">
      {/* Background image — full opacity, overlay handles darkness */}
      <img src={coverImage} alt={title} className="absolute inset-0 w-full h-full object-cover" />

      {/* Gradient rises from bottom only — lets the photo breathe at the top */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/85 via-purple/30 to-transparent" />

      {/* Subtle top vignette for breadcrumb legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-deep/40 to-transparent h-24 pointer-events-none" />

      {/* Bottom fade into canvas */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white-warm to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-5 md:px-8 py-5 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap gap-1.5 text-sm md:text-base">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <li key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && (
                    <span className="text-gold font-bold select-none leading-none">›</span>
                  )}
                  {isLast || !crumb.href ? (
                    <span className="text-white font-semibold">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-white/55 hover:text-white/90 transition-colors duration-200 font-medium"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Title block — sits above the bottom fade */}
        <div className="pb-5">
          {badge && (
            <span className="inline-block mb-3 px-3 py-1 rounded-full text-[11px] font-700 uppercase tracking-widest border border-gold bg-gold-muted text-gold">
              {badge.replace(/-/g, " ")}
            </span>
          )}
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-[1.08] tracking-tight">
            {title}
          </h1>
          {tagline && (
            <p className="mt-2.5 text-white/60 text-base md:text-lg font-normal leading-relaxed max-w-xl">
              {tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
