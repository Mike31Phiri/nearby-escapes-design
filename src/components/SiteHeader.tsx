import { Link, useNavigate } from "@tanstack/react-router";
import { Bed, Bus, MapPin, Package, Menu, User, LogOut, UserCircle, Briefcase } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";

const categories = [
  { label: "Stay", icon: Bed, to: "/accommodations" as const },
  { label: "Transport", icon: Bus, to: "/bus-booking" as const },
  { label: "Gems", icon: MapPin, to: "/gems" as const },
  { label: "Packages", icon: Package, to: "/packages" as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.fullName
    ? user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-bold shadow-[var(--shadow-elegant)]">
            N
          </div>
          <span className="hidden sm:inline font-bold text-lg tracking-tight">Nearby Escapes</span>
        </Link>

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

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border pl-2 pr-1 py-1 hover:shadow-sm transition" aria-label="Account menu">
                  <Menu className="h-4 w-4 text-muted-foreground" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-xs font-bold text-primary-foreground">
                    {initials || <User className="h-4 w-4" />}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold truncate">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                  <UserCircle className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/profile/host" })}>
                  <Briefcase className="h-4 w-4 mr-2" /> Host dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/" }); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/login" })}>
                Sign in
              </Button>
              <Button size="sm" className="bg-[image:var(--gradient-hero)] hover:opacity-95" onClick={() => navigate({ to: "/register" })}>
                Sign up
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl md:hidden" aria-label="Menu">
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
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted">
                      <UserCircle className="h-5 w-5" /> Profile
                    </Link>
                    <button
                      onClick={() => { setOpen(false); logout(); navigate({ to: "/" }); }}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted text-left"
                    >
                      <LogOut className="h-5 w-5" /> Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted">
                      Sign in
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
