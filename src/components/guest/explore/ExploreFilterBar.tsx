"use client";

import { cn } from "@/lib/utils";
import { Fire, Sparkle, Mountains, BookOpen, Baby, Coffee } from "@phosphor-icons/react";

export type ExploreFilterType =
  | "popular"
  | "hidden-gems"
  | "adventure"
  | "history"
  | "family"
  | "relaxation";

interface ExploreFilterBarProps {
  active: ExploreFilterType;
  onChange: (filter: ExploreFilterType) => void;
}

export function ExploreFilterBar({ active, onChange }: ExploreFilterBarProps) {
  const filters = [
    { id: "popular",      label: "Popular",          icon: Fire      },
    { id: "hidden-gems",  label: "Hidden Gems",      icon: Sparkle   },
    { id: "adventure",    label: "Adventure",        icon: Mountains },
    { id: "history",      label: "History & Culture",icon: BookOpen  },
    { id: "family",       label: "Family Friendly",  icon: Baby      },
    { id: "relaxation",   label: "Relaxation",       icon: Coffee    },
  ] as const;

  return (
    <div className="w-full max-w-7xl mx-auto px-5 md:px-8 py-2.5">
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1 snap-x"
        style={{ scrollbarWidth: "none" }}
      >
        {filters.map((f) => {
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id as ExploreFilterType)}
              className={cn(
                "snap-start flex items-center gap-2 px-4 py-2 rounded-full border-[1.5px] text-[13px] font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3A2F]/40",
                isActive
                  ? "border-[#1C3A2F] bg-[#1C3A2F] text-white shadow-sm"
                  : "border-[#1C3A2F]/15 bg-white text-[#6B8A7E] hover:border-[#1C3A2F]/40 hover:text-[#1C3A2F]"
              )}
            >
              <f.icon
                className="h-[15px] w-[15px] shrink-0"
                weight={isActive ? "fill" : "regular"}
              />
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
