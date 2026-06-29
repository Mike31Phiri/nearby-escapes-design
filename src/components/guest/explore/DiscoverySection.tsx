"use client";

import Link from "next/link";
import React from "react";

interface DiscoverySectionProps {
  title: string;
  emoji?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export function DiscoverySection({
  title,
  emoji,
  seeAllHref,
  seeAllLabel,
  children,
  isEmpty = false,
  emptyMessage = "Nothing here yet — check back soon.",
}: DiscoverySectionProps) {
  return (
    <section className="py-6 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-baseline justify-between px-5 md:px-8 mb-4">
          <h2 className="text-[17px] md:text-[19px] font-bold text-[#1C3A2F] tracking-tight flex items-center gap-2">
            {emoji && (
              <span aria-hidden="true" className="text-[16px]">
                {emoji}
              </span>
            )}
            {title}
          </h2>
          {seeAllHref && !isEmpty && (
            <Link
              href={seeAllHref}
              className="text-[13px] font-semibold text-[#E8952E] hover:text-[#C97720] transition-colors duration-150 flex items-center gap-0.5 shrink-0 ml-4"
            >
              {seeAllLabel ?? "See all"}
              <span aria-hidden="true" className="ml-0.5">→</span>
            </Link>
          )}
        </div>

        {isEmpty ? (
          <p className="text-sm text-[#9AB3A8] py-8 text-center px-5">
            {emptyMessage}
          </p>
        ) : (
          <div className="relative">
            <div
              className="flex gap-3.5 overflow-x-auto pb-3 px-5 md:px-8"
              style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
            >
              {children}
            </div>
            {/* Right fade hint */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#FAF7F2] to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
