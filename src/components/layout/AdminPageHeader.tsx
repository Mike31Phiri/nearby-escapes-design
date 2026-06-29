import React from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("bg-[#1A0B2E] w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="text-[10px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-white/70 mt-1 max-w-xl leading-relaxed">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
