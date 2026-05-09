"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

export function Breadcrumbs({ items, className }: { items?: BreadcrumbItem[]; className?: string }) {
  const pathname = usePathname();

  // Auto-generate items if not provided
  const generatedItems = items || pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      const href = `/${array.slice(0, index + 1).join("/")}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      return { label, href, active: index === array.length - 1 };
    });

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide", className)}>
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {generatedItems.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
            {item.active ? (
              <span className="font-medium text-foreground truncate max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
