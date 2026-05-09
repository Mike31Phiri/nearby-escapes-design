"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { CalendarDays, MapPin, Search, Users, X, Minus, Plus, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function SearchBar({ className }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [active, setActive] = useState<"where" | "when" | "who" | null>(null);
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>("recent-searches", []);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (searchValue.trim()) {
      const updated = [searchValue.trim(), ...recentSearches.filter(s => s !== searchValue.trim())].slice(0, 5);
      setRecentSearches(updated);
    }
    setIsExpanded(false);
    setActive(null);
    // Add router.push here for actual search navigation
  };

  const removeRecentSearch = (e: React.MouseEvent, search: string) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter(s => s !== search));
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!document.contains(target)) return;
      if (containerRef.current && !containerRef.current.contains(target)) {
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
      const relatedTarget = e.relatedTarget as Node | null;
      if (!relatedTarget) return;
      if (containerRef.current && !containerRef.current.contains(relatedTarget)) {
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
    <div ref={containerRef} className={cn("mx-auto w-full relative z-50 px-2 md:px-0", className)}>
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
          isExpanded ? "max-w-4xl rounded-[2rem] p-2" : "w-full max-w-md rounded-full p-1"
        )}
      >
        <div className={cn(
            "flex relative transition-all duration-500",
            isExpanded ? "flex-col md:flex-row gap-2 md:gap-0 h-auto md:h-16" : "flex-row items-center h-12 md:h-16"
        )}>
          
          {/* Where Section */}
          <div 
            onClick={() => { setIsExpanded(true); setActive("where"); }}
            className={cn(
              "flex items-center gap-3 md:gap-4 px-4 md:px-6 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-full md:flex-1",
              isExpanded ? (active === "where" ? "bg-purple-50 shadow-inner md:bg-white md:shadow-md md:ring-1 md:ring-border/20 h-16 md:h-16" : "h-16 md:h-16") : "h-full hover:bg-muted/40"
            )}
          >
            <MapPin className={cn("hidden md:block h-4.5 w-4.5 shrink-0 transition-colors duration-500", isExpanded ? "text-primary" : "text-muted-foreground")} />
            <div className="flex-1 min-w-0 relative flex flex-col justify-center h-full">
              <p className={cn(
                "absolute left-0 text-[10px] font-black uppercase tracking-widest transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                isExpanded ? "top-3 md:top-2 text-primary opacity-100 translate-y-0" : "top-1/2 -translate-y-1/2 text-muted-foreground opacity-0 pointer-events-none"
              )}>
                Where
              </p>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={isExpanded ? "Search destinations" : "Search your next escape..."}
                className={cn(
                  "w-full bg-transparent font-bold outline-none placeholder:text-muted-foreground/60 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative",
                  isExpanded ? "text-sm translate-y-2 md:translate-y-2" : "text-sm md:text-base translate-y-0"
                )}
                onFocus={() => { setIsExpanded(true); setActive("where"); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
              <div className="min-w-0 text-left">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">When</p>
                <div className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                  <span className={cn("text-sm font-bold", date?.from ? "text-foreground" : "text-muted-foreground")}>
                    {date?.from ? format(date.from, "MMM d") : "From"}
                  </span>
                  <span className="text-muted-foreground text-sm font-bold">-</span>
                  <span className={cn("text-sm font-bold", date?.to ? "text-foreground" : "text-muted-foreground")}>
                    {date?.to ? format(date.to, "MMM d") : "To"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Who Section */}
          <div 
            className={cn(
              "transition-all duration-500 ease-in-out flex flex-col md:flex-row items-stretch md:items-center overflow-hidden",
              isExpanded ? "h-16 md:h-auto md:w-auto opacity-100" : "h-0 md:w-0 opacity-0 pointer-events-none"
            )}
          >
            <div className="hidden md:block w-px h-8 bg-border/40 shrink-0" />
            <div 
              className={cn(
                "flex-1 h-full flex items-center justify-between gap-4 px-6 transition-all duration-300 rounded-full min-w-[200px]"
              )}
            >
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Who</p>
                  <p className="text-sm font-bold text-foreground mt-0.5 whitespace-nowrap">
                    Guests
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 rounded-full border-border/60 hover:border-primary shrink-0"
                  onClick={(e) => { e.stopPropagation(); setGuests(Math.max(1, guests - 1)); }}
                  disabled={guests <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-4 text-center font-bold text-sm shrink-0">{guests}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 rounded-full border-border/60 hover:border-primary shrink-0"
                  onClick={(e) => { e.stopPropagation(); setGuests(guests + 1); }}
                  disabled={guests >= 16}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className={cn(
            "flex items-center transition-all duration-500",
            isExpanded ? "px-2 pb-2 md:pb-0 h-16 md:h-auto" : "pr-1 h-full"
          )}>
            <Button
              onClick={handleSearch}
              className={cn(
                "bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-500 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 overflow-hidden",
                isExpanded ? "w-full md:w-auto md:px-8 h-12 md:h-12 rounded-2xl" : "w-10 h-10 p-0 rounded-full"
              )}
            >
              <Search className="h-4.5 w-4.5 shrink-0" strokeWidth={3} />
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

        {/* Unified Data Collection Panel */}
        <div className={cn(
          "absolute left-0 right-0 top-full mt-4 bg-white rounded-3xl shadow-2xl ring-1 ring-border/40 transition-all duration-500 overflow-hidden transform origin-top z-50",
          (active === "where" || active === "when") && isExpanded ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        )}>
          <div className="p-6 md:p-8">
            {active === "where" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Recent Searches</h3>
                {recentSearches.length > 0 ? (
                  <div className="space-y-1">
                    {recentSearches.map((search) => (
                      <div 
                        key={search} 
                        onClick={() => { setSearchValue(search); setActive("when"); }}
                        className="flex items-center justify-between group px-3 py-3 hover:bg-muted/50 rounded-2xl cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <History className="h-4 w-4 text-muted-foreground" />
                          <span className="font-bold text-sm">{search}</span>
                        </div>
                        <button 
                          onClick={(e) => removeRecentSearch(e, search)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 rounded-lg text-destructive transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-medium italic px-3">No recent searches yet</p>
                )}
                
                <div className="mt-6 pt-6 border-t border-border/40">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Popular Nearby</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Lusaka", "Livingstone", "Siavonga", "Chongwe"].map(loc => (
                      <button 
                        key={loc}
                        onClick={() => { setSearchValue(loc); setActive("when"); }}
                        className="px-4 py-2 rounded-full border border-border/60 hover:border-primary hover:text-primary font-bold text-xs transition-all"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {active === "when" && (
              <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                <h3 className="text-lg font-bold mb-4 w-full text-center md:text-left">Select your dates</h3>
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="rounded-xl border shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
