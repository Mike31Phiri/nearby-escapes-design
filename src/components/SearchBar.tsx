"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Search, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("mx-auto w-full max-w-4xl relative", className)}>
      {/* Mobile Collapsed State */}
      <div className={cn("md:hidden", isExpanded ? "hidden" : "block")}>
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex items-center w-full gap-4 rounded-full bg-background p-3 pl-5 shadow-lg ring-1 ring-border/20 text-left transition-transform active:scale-[0.98]"
        >
          <Search className="h-5 w-5 text-foreground font-bold" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground leading-tight">Where to?</span>
            <span className="text-[11px] text-muted-foreground font-medium mt-0.5">Anywhere • Any week • Add guests</span>
          </div>
        </button>
      </div>

      {/* Expanded / Desktop State */}
      <div
        className={cn(
          "bg-background md:rounded-full md:p-2 md:shadow-lg md:ring-1 md:ring-border/20",
          isExpanded ? "absolute top-0 left-0 right-0 z-50 rounded-3xl shadow-xl ring-1 ring-border/20 p-2" : "hidden md:block"
        )}
      >
        <div className={cn("flex justify-between items-center p-3 mb-2", isExpanded ? "flex md:hidden" : "hidden")}>
          <span className="font-bold text-lg">Search</span>
          <button onClick={() => setIsExpanded(false)} className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-border/50">
          <Field icon={MapPin} label="Where" placeholder="Search destinations" className="flex-[1.5]" />
          <Field icon={CalendarDays} label="When" placeholder="Add dates" type="date" className="flex-1" />
          <Field icon={Users} label="Who" placeholder="Add guests" className="flex-1" />
          <div className="p-2 w-full md:w-auto mt-2 md:mt-0">
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full md:w-12 md:h-12 rounded-xl md:rounded-full bg-primary hover:bg-primary/90 shadow-md text-primary-foreground flex items-center justify-center p-0"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
              <span className="md:hidden ml-2 font-semibold">Search</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Mobile Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  type = "text",
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  placeholder: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={cn("group flex w-full cursor-text items-center gap-3 px-4 py-3 transition-[var(--transition-smooth)] hover:bg-muted/50 rounded-xl md:rounded-full md:py-2 md:px-6", className)}>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold tracking-wide text-foreground">
          {label}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-normal outline-none placeholder:text-muted-foreground truncate mt-0.5"
        />
      </div>
    </label>
  );
}
