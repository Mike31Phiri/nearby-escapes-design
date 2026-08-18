"use client";

import type { ElementType } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectCardProps {
  icon: ElementType;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  layout?: "compact" | "detailed";
}

export function SelectCard({
  icon: Icon,
  label,
  description,
  selected,
  onSelect,
  layout = "detailed",
}: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex flex-col items-center text-center rounded-xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        layout === "compact" ? "p-4" : "p-5",
        selected
          ? "border-purple bg-purple/5 shadow-md shadow-purple/10"
          : "border-border bg-white hover:border-purple/40 hover:shadow-md hover:shadow-purple/5",
      )}
    >
      {selected && (
        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-gold flex items-center justify-center">
          <CheckCircle2 className="h-3 w-3 text-black" />
        </div>
      )}
      <div
        className={cn(
          "rounded-xl flex items-center justify-center mb-3 transition-colors duration-200",
          layout === "compact" ? "h-11 w-11" : "h-12 w-12",
          selected ? "bg-purple text-white" : "bg-purple/5 text-purple group-hover:bg-purple/10",
        )}
      >
        <Icon className={layout === "compact" ? "h-5 w-5" : "h-6 w-6"} />
      </div>
      <h3 className="text-sm font-bold text-black mb-0.5">{label}</h3>
      {description && layout === "detailed" && (
        <p className="text-[11px] text-black-muted leading-snug">{description}</p>
      )}
    </button>
  );
}
