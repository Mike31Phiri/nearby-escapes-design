"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface HostPageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

export function HostPageHeader({ title, description, eyebrow, actions }: HostPageHeaderProps) {
  return (
    <div className="bg-[#1A0B2E] shadow-lg relative z-10 w-full">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1.5 drop-shadow-sm">
              {eyebrow || "Overview"}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.15]">
              {title}
            </h1>
            {description && (
              <p className="text-[#64748B] mt-1.5 text-sm max-w-lg leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
