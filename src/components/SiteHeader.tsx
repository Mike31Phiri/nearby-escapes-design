import { Link } from "@tanstack/react-router";
import { Bed, Bus, MapPin, Package, Menu, User } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const categories = [
  { label: "Stay", icon: Bed, to: "/accommodations" as const },
  { label: "Transport", icon: Bus, to: "/bus-booking" as const },
  { label: "Gems", icon: MapPin, to: "/gems" as const },
  { label: "Packages", icon: Package, to: "/packages" as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-bold shadow-[var(--shadow-elegant)]">
            N
          </div>
          <span className="hidden sm:inline font-bold text-lg tracking-tight">Nearby Escapes</span>
        </Link>

        {/* Category tiles - desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {categories.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="group flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground transition-[var(--transition-smooth)] hover:bg-primary-soft hover:text-primary"
              activeProps={{ className: "bg-primary-soft text-primary" }}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: profile + menu */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 border border-border"
            aria-label="Profile"
          >
            <User className="h-4 w-4" />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                {categories.map(({ label, icon: Icon, to }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-primary-soft hover:text-primary"
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                ))}
                <div className="my-3 h-px bg-border" />
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                >
                  Home
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
