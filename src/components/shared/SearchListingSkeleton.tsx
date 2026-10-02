"use client";

import { cn } from "@/lib/utils";

interface SearchListingSkeletonProps {
  count?: number;
  className?: string;
}

export function SearchListingSkeleton({ count = 6, className }: SearchListingSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3 w-full",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-xs border border-neutral-100 overflow-hidden flex flex-col"
        >
          {/* Image placeholder with shimmer */}
          <div className="relative aspect-[16/10] bg-neutral-200/70 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="absolute top-3 left-3 w-16 h-5 rounded-full bg-white/80" />
          </div>

          {/* Card body */}
          <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              {/* Rating stars placeholder */}
              <div className="flex items-center gap-1.5">
                <div className="w-20 h-3 rounded bg-neutral-200/80" />
                <div className="w-6 h-3 rounded bg-neutral-200/50" />
              </div>

              {/* Title placeholder */}
              <div className="w-4/5 h-4.5 rounded bg-neutral-200/90" />

              {/* Location placeholder */}
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full bg-neutral-200/70 shrink-0" />
                <div className="w-1/2 h-3.5 rounded bg-neutral-200/60" />
              </div>

              {/* Amenity / tag chips */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="w-14 h-4 rounded-full bg-neutral-100" />
                <div className="w-16 h-4 rounded-full bg-neutral-100" />
                <div className="w-12 h-4 rounded-full bg-neutral-100" />
              </div>
            </div>

            {/* Bottom price row */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between mt-2">
              <div className="flex items-baseline gap-1">
                <div className="w-16 h-4.5 rounded bg-neutral-200/90" />
                <div className="w-8 h-3 rounded bg-neutral-200/50" />
              </div>
              <div className="w-16 h-3.5 rounded bg-neutral-200/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
