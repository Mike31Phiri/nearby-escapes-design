"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hotel, TrainFront, Ticket, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { label: "Stays", icon: Hotel, href: "/accommodations" },
  { label: "Transport", icon: TrainFront, href: "/bus-booking" },
  { label: "Attractions", icon: Ticket, href: "/experiences" },
  { label: "Gems", icon: Gem, href: "/gems" },
];

export function CategoryPills({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "header";
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div className={cn("w-full pb-2", className)}>
      <div className="flex items-center justify-center gap-8 md:gap-16">
        {categories.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href || (pathname === "/" && label === "Stays");

          return (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className={cn(
                "group flex flex-col items-center justify-center gap-2 pb-2 border-b-2 transition-all duration-200",
                isActive
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-colors duration-200",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className="text-xs font-semibold whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
