import { cn } from "@/lib/utils";
import type { ListingVertical } from "@/types/listing";

interface VerticalBadgeProps {
  vertical: ListingVertical;
  className?: string;
}

const VERTICAL_STYLES: Record<ListingVertical, string> = {
  stay: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  experience: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  transport: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  package: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

const VERTICAL_LABELS: Record<ListingVertical, string> = {
  stay: "Stay",
  experience: "Experience",
  transport: "Transport",
  package: "Package",
};

export function VerticalBadge({ vertical, className }: VerticalBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors",
        VERTICAL_STYLES[vertical],
        className,
      )}
    >
      {VERTICAL_LABELS[vertical]}
    </span>
  );
}
