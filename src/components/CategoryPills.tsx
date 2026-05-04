"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bed, Bus, Package, Tent, Building, TreePine, Waves, Camera, Coffee, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { label: "Stays", icon: Bed, href: "/accommodations" },
  { label: "Transport", icon: Bus, href: "/bus-booking" },
  { label: "Packages", icon: Package, href: "/packages" },
  { label: "Safari", icon: Camera, href: "/accommodations?category=safari" },
  { label: "Lakeside", icon: Waves, href: "/accommodations?category=lakeside" },
  { label: "Camping", icon: Tent, href: "/accommodations?category=camping" },
  { label: "City", icon: Building, href: "/accommodations?category=city" },
  { label: "Nature", icon: TreePine, href: "/accommodations?category=nature" },
  { label: "Experiences", icon: Coffee, href: "/experiences" },
  { label: "Dining", icon: Utensils, href: "/dining" },
];

export function CategoryPills({
  variant = "hero", // We keep variant prop for compatibility if needed, though we will mainly use one style now
  className,
}: {
  variant?: "hero" | "header";
  className?: string;
}) {
  const pathname = usePathname();
  // We'll treat all variants similarly now, focusing on the Airbnb tab style
  
  return (
    <div className={cn("w-full overflow-x-auto no-scrollbar pb-2", className)}>
      <div className="flex items-center gap-6 md:gap-8 px-4 md:px-6 min-w-max">
        {categories.map(({ label, icon: Icon, href }) => {
          // For mock purposes, we'll just check if href matches pathname exactly, or if it's the default "Stays" on the homepage.
          const isActive = pathname === href || (pathname === "/" && label === "Stays");
          
          return (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className={cn(
                "group flex flex-col items-center justify-center gap-2 pb-2 min-w-[64px] transition-[var(--transition-smooth)] border-b-2",
                isActive
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="text-xs font-semibold whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
