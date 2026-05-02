import Link from "next/link";
import { Bed, Bus, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { label: "Stays", icon: Bed, to: "/accommodations" as const },
  { label: "Transport", icon: Bus, to: "/bus-booking" as const },
  { label: "Packages", icon: Package, to: "/packages" as const },
];

export function CategoryPills({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "header";
  className?: string;
}) {
  const isHero = variant === "hero";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border p-1 backdrop-blur-md",
        isHero
          ? "border-white/30 bg-background/20 shadow-[var(--shadow-elegant)]"
          : "border-border bg-background/80 shadow-sm",
        className,
      )}
    >
      {categories.map(({ label, icon: Icon, to }) => (
        <Link
          key={label}
          to={to}
          aria-label={label}
          className={cn(
            "group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-[var(--transition-smooth)]",
            isHero
              ? "text-background hover:bg-background/20"
              : "text-muted-foreground hover:bg-primary-soft hover:text-primary",
          )}
          activeProps={{
            className: isHero
              ? "bg-background text-primary"
              : "bg-primary-soft text-primary",
          }}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}
    </div>
  );
}
