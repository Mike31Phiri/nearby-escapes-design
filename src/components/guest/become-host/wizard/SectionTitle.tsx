"use client";

import type { ElementType } from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  icon?: ElementType;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("text-center mb-6", className)}>
      {Icon && (
        <div className="inline-flex h-10 w-10 rounded-xl bg-purple/10 items-center justify-center text-purple mb-2">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      )}
      {eyebrow && (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-purple mb-1 block">
          {eyebrow}
        </span>
      )}
      <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs text-black-subtle mt-1.5 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
