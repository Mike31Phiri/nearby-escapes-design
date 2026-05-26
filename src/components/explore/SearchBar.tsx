"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "mx-auto flex w-full max-w-2xl items-stretch",
        /* ── shape: pill at rest, squarer on focus ── */
        "rounded-2xl focus-within:rounded-xl",
        /* ── base: clean glass with light shadow ── */
        "border border-white/20 bg-white/10 backdrop-blur-md",
        "shadow-lg shadow-white/5",
        /* ── active: brighten, primary ring glow (no dark shadows) ── */
        "focus-within:border-white/40 focus-within:bg-white/20",
        "focus-within:shadow-md focus-within:shadow-white/5",
        "focus-within:ring-2 focus-within:ring-primary/35",
        /* ── smooth in & out — ease-out decelerates on un-focus ── */
        "transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-3 pl-4 md:pl-5">
        <Search
          className={cn(
            "h-4 w-4 shrink-0 transition-all duration-500 md:h-5 md:w-5",
            "text-white/40 focus-within:text-primary/60",
          )}
          strokeWidth={2}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations..."
          className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-white/40 outline-none transition-all duration-500 md:py-5 md:text-base"
        />
      </div>
      <button
        type="submit"
        className={cn(
          "m-1.5 flex shrink-0 items-center justify-center gap-2",
          "rounded-xl focus-within:rounded-lg",
          "bg-primary px-4 text-sm font-semibold text-primary-foreground",
          "transition-all duration-500 hover:bg-primary/90",
          "md:px-5",
        )}
        aria-label="Search"
      >
        <Search className="h-4 w-4 md:hidden" strokeWidth={2.5} />
        <span className="hidden md:inline">Search</span>
      </button>
    </form>
  );
}
