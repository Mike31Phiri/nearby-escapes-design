"use client";

import type { ElementType } from "react";
import { cn } from "@/lib/utils";

interface SelectCardProps {
  icon: ElementType;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  layout?: "compact" | "detailed";
  onDoubleClick?: () => void;
}

export function SelectCard({
  icon: Icon,
  label,
  description,
  selected,
  onSelect,
  layout = "detailed",
  onDoubleClick,
}: SelectCardProps) {
  if (layout === "compact") {
    return (
      <button
        type="button"
        onClick={onSelect}
        onDoubleClick={onDoubleClick}
        aria-pressed={selected}
        className={cn(
          "flex flex-col items-center justify-center text-center p-3.5 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[88px] sm:min-h-[96px]",
          selected
            ? "border-2 border-purple bg-purple/[0.02]"
            : "border-neutral-300 hover:border-neutral-900",
        )}
      >
        <Icon
          className={cn(
            "h-7 w-7 mb-2 transition-colors shrink-0",
            selected ? "text-purple" : "text-neutral-800",
          )}
          strokeWidth={1.5}
        />
        <span
          className={cn(
            "text-xs sm:text-sm font-semibold leading-tight line-clamp-2 text-center transition-colors",
            selected ? "text-purple font-semibold" : "text-neutral-900",
          )}
        >
          {label}
        </span>
        {description && (
          <span className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
            {description}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[104px] sm:min-h-[116px]",
        selected
          ? "border-2 border-purple bg-purple/[0.02]"
          : "border-neutral-300 hover:border-neutral-900",
      )}
    >
      <Icon
        className={cn(
          "h-8 w-8 mb-2.5 transition-colors shrink-0",
          selected ? "text-purple" : "text-neutral-800",
        )}
        strokeWidth={1.5}
      />
      <span
        className={cn(
          "text-xs sm:text-sm font-semibold transition-colors leading-tight",
          selected ? "text-purple font-semibold" : "text-neutral-900",
        )}
      >
        {label}
      </span>
      {description && (
        <p className="text-[11px] text-neutral-400 mt-1 max-w-[200px] leading-relaxed line-clamp-2">
          {description}
        </p>
      )}
    </button>
  );
}
