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

// Main wrapper

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("min-h-screen flex flex-col bg-background font-sans", className)}>
      {children}
    </div>
  );
}

// Header with breadcrumbs, title, description, actions

export function PageShellHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageShellHeaderProps) {
  return (
    <div className={cn("mb-10", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-[12px] text-neutral-400 mb-5">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i === 0 && <ChevronLeft className="h-3.5 w-3.5 shrink-0" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-neutral-700 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-600 font-medium truncate">{item.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <span className="text-neutral-300">/</span>}
            </span>
          ))}
        </nav>
      )}

      {/* Title + Actions row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-[28px] font-semibold tracking-[-0.02em] text-neutral-900 leading-snug">
            {title}
          </h1>
          {description && (
            <p className="text-neutral-400 mt-1.5 max-w-2xl text-[13px] leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0 mt-1">{actions}</div>}
      </div>
    </div>
  );
}

// Content area with consistent max-width containers

export function PageShellContent({ children, className, size = "lg" }: PageShellContentProps) {
  return (
    <main className="flex-1 w-full mx-auto px-4 md:px-6 py-10 md:py-14">
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
