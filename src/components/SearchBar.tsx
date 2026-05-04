"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [active, setActive] = useState<"where" | "when" | "who" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setActive(null);
      }
    }
    if (isExpanded) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isExpanded]);

  return (
    <div ref={containerRef} className={cn("mx-auto w-full max-w-3xl relative", className)}>

      {/* Collapsed — single Search pill */}
      {!isExpanded && (
        <button
          type="button"
          onClick={() => { setIsExpanded(true); setActive("where"); }}
          className="flex items-center gap-3 mx-auto rounded-full bg-background shadow-md ring-1 ring-border/40 hover:shadow-lg transition-all duration-200 active:scale-[0.99] px-6 py-4 w-full"
        >
          <Search className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-semibold text-foreground">Search</span>
        </button>
      )}

      {/* Expanded — full Airbnb-style wide bar */}
      {isExpanded && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => { setIsExpanded(false); setActive(null); }}
          />
          <div className="absolute top-0 left-0 right-0 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-stretch w-full rounded-full bg-background shadow-2xl ring-1 ring-border/30 overflow-hidden">

              {/* Where */}
              <button
                type="button"
                onClick={() => setActive("where")}
                className={cn(
                  "flex-1 flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-full",
                  active === "where" ? "bg-white shadow-md ring-1 ring-border/40" : "hover:bg-muted/50"
                )}
              >
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-foreground uppercase tracking-wide">Where</p>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search destinations"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground mt-0.5"
                    onClick={(e) => { e.stopPropagation(); setActive("where"); }}
                  />
                </div>
              </button>

              <div className="w-px my-3 bg-border/50" />

              {/* When */}
              <button
                type="button"
                onClick={() => setActive("when")}
                className={cn(
                  "flex-1 flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-full",
                  active === "when" ? "bg-white shadow-md ring-1 ring-border/40" : "hover:bg-muted/50"
                )}
              >
                <CalendarDays className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-foreground uppercase tracking-wide">When</p>
                  <input
                    type="date"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground mt-0.5"
                    onClick={(e) => { e.stopPropagation(); setActive("when"); }}
                  />
                </div>
              </button>

              <div className="w-px my-3 bg-border/50" />

              {/* Who + Search button */}
              <div className="flex items-center gap-2 pr-3">
                <button
                  type="button"
                  onClick={() => setActive("who")}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 text-left transition-colors rounded-full",
                    active === "who" ? "bg-white shadow-md ring-1 ring-border/40" : "hover:bg-muted/50"
                  )}
                >
                  <Users className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wide">Who</p>
                    <input
                      type="text"
                      placeholder="Add guests"
                      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground mt-0.5"
                      onClick={(e) => { e.stopPropagation(); setActive("who"); }}
                    />
                  </div>
                </button>
                <Button
                  type="submit"
                  className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center p-0 shadow-md shrink-0"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
