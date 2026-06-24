import { ShieldCheck, Star, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TrustBadgeTier = "new-host" | "verified" | "inspected" | "top-rated";

interface TrustBadgeProps {
  tier: TrustBadgeTier;
  className?: string;
  size?: "sm" | "md";
}

export function TrustBadge({ tier, className, size = "sm" }: TrustBadgeProps) {
  const isSm = size === "sm";
  const baseClasses = cn(
    "inline-flex items-center gap-1 font-bold uppercase tracking-widest rounded-full border backdrop-blur-sm",
    isSm ? "px-2 py-0.5 text-[9px]" : "px-3 py-1 text-[11px]",
    className,
  );

  const iconClasses = isSm ? "h-3 w-3" : "h-4 w-4";

  switch (tier) {
    case "top-rated":
      return (
        <span className={cn(baseClasses, "bg-amber-500/10 text-amber-600 border-amber-500/20")}>
          <Star className={cn(iconClasses, "fill-amber-500")} />
          Top Rated
        </span>
      );
    case "inspected":
      return (
        <span className={cn(baseClasses, "bg-accent/10 text-accent border-accent/20")}>
          <ShieldCheck className={cn(iconClasses)} />
          Inspected
        </span>
      );
    case "verified":
      return (
        <span className={cn(baseClasses, "bg-primary/10 text-primary border-primary/20")}>
          <CheckCircle2 className={cn(iconClasses)} />
          Verified
        </span>
      );
    case "new-host":
      return (
        <span className={cn(baseClasses, "bg-muted/80 text-muted-foreground border-border/50")}>
          <Sparkles className={cn(iconClasses)} />
          New Host
        </span>
      );
  }
}
