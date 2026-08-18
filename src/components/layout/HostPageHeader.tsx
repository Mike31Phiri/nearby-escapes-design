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
    <div className="bg-white border-b border-neutral-200 w-full">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 md:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-lg md:text-xl font-bold tracking-tight text-neutral-900 leading-[1.2]">
              {title}
            </h1>
            {description && (
              <p className="text-neutral-500 mt-0.5 text-sm max-w-lg leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
