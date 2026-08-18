"use client";

import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBackNavigation } from "@/hooks/useBackNavigation";

/**
 * Single-icon back button, expected at the top-left corner of a page.
 * Navigates to the previous in-site page, falling back to the provided path.
 */
export function BackButton({
  fallback = "/host",
  className,
  ariaLabel = "Go back",
}: {
  fallback?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const goBack = useBackNavigation(fallback);

  return (
    <button
      onClick={goBack}
      aria-label={ariaLabel}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-sm transition-colors hover:border-purple/40 hover:text-purple",
        className,
      )}
    >
      <ChevronLeft className="h-5 w-5" strokeWidth={2} />
    </button>
  );
}
