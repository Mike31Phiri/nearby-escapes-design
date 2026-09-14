"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HostPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function HostPageHeader({ title, description, actions }: HostPageHeaderProps) {
  return (
    <div className="bg-white border-b border-neutral-200/80 w-full shadow-2xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-neutral-900 leading-snug">
              {title}
            </h1>
            {description && (
              <p className="text-neutral-500 mt-0.5 sm:mt-1 text-xs sm:text-sm max-w-xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
