"use client";

import { useEffect, useState } from "react";

/** Tailwind `sm` breakpoint — matches the codebase's mobile/desktop split. */
export const SM_AND_UP = "(min-width: 640px)";

/**
 * SSR-safe media query hook. Returns true once the query matches on the client.
 * Safe to use before hydration because the initial state is `false` and matches
 * is only updated inside an effect.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
