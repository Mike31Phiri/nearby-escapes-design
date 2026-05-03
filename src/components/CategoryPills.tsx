"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bed, Bus, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { label: "Stays", icon: Bed, href: "/accommodations" },
  { label: "Transport", icon: Bus, href: "/bus-booking" },
  { label: "Packages", icon: Package, href: "/packages" },
];

export function CategoryPills({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "header";
  className?: string;
}) {
  const pathname = usePathname();
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
      {categories.map(({ label, icon: Icon, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className={cn(
              "group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-[var(--transition-smooth)]",
              isHero
                ? isActive
                  ? "bg-background text-primary"
                  : "text-background hover:bg-background/20"
                : isActive
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-primary-soft hover:text-primary",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
