"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageShellHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

interface PageShellContentProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

// ── Main wrapper ──

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("min-h-screen flex flex-col bg-background font-sans", className)}>
      {children}
    </div>
  );
}

// ── Header with breadcrumbs, title, description, actions ──

export function PageShellHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageShellHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i === 0 && <ChevronLeft className="h-4 w-4 shrink-0" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-primary transition-colors font-medium">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-semibold truncate">{item.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <span className="text-muted-foreground/30">/</span>}
            </span>
          ))}
        </nav>
      )}

      {/* Title + Actions row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm md:text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0 mt-1">{actions}</div>}
      </div>
    </div>
  );
}

// ── Content area with consistent max-width containers ──

export function PageShellContent({ children, className, size = "lg" }: PageShellContentProps) {
  return (
    <main className="flex-1 w-full mx-auto px-4 md:px-6 py-6 md:py-8">
      <div
        className={cn(
          size === "sm" && "max-w-3xl",
          size === "md" && "max-w-5xl",
          size === "lg" && "max-w-7xl",
          size === "full" && "max-w-none",
          "mx-auto",
          className,
        )}
      >
        {children}
      </div>
    </main>
  );
}
