"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays, MapPin, Search, Users, X } from "lucide-react";
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
    
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsExpanded(false);
        setActive(null);
      }
    }

    function handleFocusOut(e: FocusEvent) {
      if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
        setIsExpanded(false);
        setActive(null);
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKeyDown);
      containerRef.current?.addEventListener("focusout", handleFocusOut);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
      containerRef.current?.removeEventListener("focusout", handleFocusOut);
    };
  }, [isExpanded]);

  return (
    <div ref={containerRef} className={cn("mx-auto w-full relative z-50 px-4 md:px-0", className)}>
      {/* Backdrop for expanded state */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 pointer-events-none z-[-1]",
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}
        onClick={() => { setIsExpanded(false); setActive(null); }}
      />

      <div 
        className={cn(
          "mx-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden bg-white shadow-2xl ring-1 ring-border/40",
          isExpanded ? "max-w-4xl rounded-[2rem] p-2" : "max-w-md rounded-full p-1.5"
        )}
      >
        <div className={cn(
            "flex flex-col md:flex-row md:items-stretch relative transition-all duration-500",
            isExpanded ? "gap-2 md:gap-0 h-auto md:h-16" : "h-14 md:h-16"
        )}>
          
          {/* Where Section */}
          <div 
            onClick={() => { setIsExpanded(true); setActive("where"); }}
            className={cn(
              "flex items-center gap-4 px-6 cursor-pointer transition-all duration-300 rounded-full h-16 md:h-auto md:flex-1",
              isExpanded && active === "where" ? "bg-purple-50 shadow-inner md:bg-white md:shadow-md md:ring-1 md:ring-border/20" : "hover:bg-muted/40"
            )}
          >
            <MapPin className={cn("h-5 w-5 shrink-0 transition-colors", isExpanded ? "text-primary" : "text-muted-foreground")} />
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                isExpanded ? "text-primary opacity-100 translate-y-0" : "text-muted-foreground opacity-0 -translate-y-1 absolute"
              )}>
                Where
              </p>
              <input
                type="text"
                placeholder={isExpanded ? "Search destinations" : "Search your next escape..."}
                className={cn(
                  "w-full bg-transparent text-sm font-bold outline-none placeholder:text-muted-foreground/60 transition-all duration-300",
                  isExpanded ? "mt-0.5" : "text-base"
                )}
                onFocus={() => { setIsExpanded(true); setActive("where"); }}
              />
            </div>
          </div>

          {/* When Section */}
          <div 
            className={cn(
              "transition-all duration-500 ease-in-out flex flex-col md:flex-row items-stretch md:items-center overflow-hidden",
              isExpanded ? "h-16 md:h-auto md:w-64 opacity-100" : "h-0 md:w-0 opacity-0 pointer-events-none"
            )}
          >
            <div className="hidden md:block w-px h-8 bg-border/40 shrink-0" />
            <div 
              onClick={() => setActive("when")}
              className={cn(
                "flex-1 h-full flex items-center gap-4 px-6 cursor-pointer transition-all duration-300 rounded-full",
                active === "when" ? "bg-purple-50 shadow-inner md:bg-white md:shadow-md md:ring-1 md:ring-border/20" : "hover:bg-muted/40"
              )}
            >
              <CalendarDays className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">When</p>
                <p className="text-sm font-bold text-foreground mt-0.5 whitespace-nowrap">Add dates</p>
              </div>
            </div>
          </div>

          {/* Who Section */}
          <div 
            className={cn(
              "transition-all duration-500 ease-in-out flex flex-col md:flex-row items-stretch md:items-center overflow-hidden",
              isExpanded ? "h-16 md:h-auto md:w-64 opacity-100" : "h-0 md:w-0 opacity-0 pointer-events-none"
            )}
          >
            <div className="hidden md:block w-px h-8 bg-border/40 shrink-0" />
            <div 
              onClick={() => setActive("who")}
              className={cn(
                "flex-1 h-full flex items-center gap-4 px-6 cursor-pointer transition-all duration-300 rounded-full",
                active === "who" ? "bg-purple-50 shadow-inner md:bg-white md:shadow-md md:ring-1 md:ring-border/20" : "hover:bg-muted/40"
              )}
            >
              <Users className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Who</p>
                <p className="text-sm font-bold text-foreground mt-0.5 whitespace-nowrap">Add guests</p>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className={cn(
            "flex items-center px-2 pb-2 md:pb-0 transition-all duration-500",
            isExpanded ? "h-16 md:h-auto" : "h-auto"
          )}>
            <Button
              className={cn(
                "bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-500 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 overflow-hidden",
                isExpanded ? "w-full md:w-auto md:px-8 h-12 md:h-12 rounded-2xl" : "w-11 h-11 p-0 rounded-full"
              )}
            >
              <Search className="h-5 w-5 shrink-0" strokeWidth={3} />
              <span className={cn(
                "font-black tracking-widest text-xs uppercase transition-all duration-500 whitespace-nowrap",
                isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute"
              )}>
                Explore
              </span>
            </Button>
          </div>

          {/* Mobile Quick Close */}
          {isExpanded && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(false); setActive(null); }}
              className="absolute top-4 right-4 md:hidden text-primary/40 p-2 rounded-full hover:bg-primary/5 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
