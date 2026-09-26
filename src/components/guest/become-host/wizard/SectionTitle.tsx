"use client";

import type { ElementType } from "react";

interface SectionTitleProps {
  icon: ElementType;
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function SectionTitle({ icon: Icon, eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="h-11 w-11 rounded-xl bg-purple/5 flex items-center justify-center text-purple shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        {eyebrow && (
          <p className="font-bold tracking-wide text-lg md:text-xl text-gold mb-0.5 leading-none">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-black">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-black-muted mt-1.5 leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
