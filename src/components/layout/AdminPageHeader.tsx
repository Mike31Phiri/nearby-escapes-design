"use client";

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
    <div className={cn("bg-white border-b border-neutral-200/80 w-full shadow-2xs", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-5 md:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && (
              <span className="inline-block text-[11px] font-semibold text-purple uppercase tracking-wider mb-1.5 px-2 py-0.5 rounded-md bg-purple/10 border border-purple/15">
                {eyebrow}
              </span>
            )}
            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 leading-snug">
              {title}
            </h1>
            {description && (
              <p className="text-neutral-500 mt-1 text-sm max-w-xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3 shrink-0 flex-wrap">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
