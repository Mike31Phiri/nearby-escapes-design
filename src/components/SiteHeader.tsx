import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { MapPin, Menu, User, LogOut, UserCircle, Briefcase, ShieldCheck, Settings as SettingsIcon, Globe, HelpCircle, Home, FileText } from "lucide-react";
import { useEffect, useState } from "react";
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
import { CategoryPills } from "@/components/CategoryPills";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [showCenterPills, setShowCenterPills] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setShowCenterPills(true);
      return;
    }
    const onScroll = () => setShowCenterPills(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const initials = user?.fullName
    ? user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={logo}
            alt="Nearby Escapes Travel Agency"
            className="h-10 w-10 rounded-xl object-contain bg-white shadow-[var(--shadow-elegant)]"
          />
          <span className="hidden sm:inline font-bold text-lg tracking-tight">Nearby Escapes</span>
        </Link>

        <nav className="hidden md:flex items-center justify-center flex-1">
          <div
            className={`transition-all duration-300 ${showCenterPills ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
          >
            <CategoryPills variant="header" />
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border pl-2 pr-2 py-1 hover:shadow-sm transition" aria-label="Account menu">
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
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                    <ShieldCheck className="h-4 w-4 mr-2" /> Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/profile/settings" })}>
                  <SettingsIcon className="h-4 w-4 mr-2" /> Account settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/profile/settings" })}>
                  <SettingsIcon className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/profile/settings", hash: "languages" })}>
                  <Globe className="h-4 w-4 mr-2" /> Languages & currency
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/help" })}>
                  <HelpCircle className="h-4 w-4 mr-2" /> Help Center
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
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <div className="mt-8 space-y-6">
                <MobileGroup title="Discover">
                  <MobileRowLink to="/" onSelect={() => setOpen(false)} icon={Home} label="Home" />
                  <MobileRowLink to="/gems" onSelect={() => setOpen(false)} icon={MapPin} label="Hidden gems" />
                </MobileGroup>

                <MobileGroup title="Account">
                  {user ? (
                    <>
                      <MobileRowLink to="/profile" onSelect={() => setOpen(false)} icon={UserCircle} label="Profile" />
                      <MobileRowLink to="/profile/host" onSelect={() => setOpen(false)} icon={Briefcase} label="List your property" />
                      {user.role === "admin" && (
                        <MobileRowLink to="/admin" onSelect={() => setOpen(false)} icon={ShieldCheck} label="Admin" />
                      )}
                    </>
                  ) : (
                    <>
                      <MobileRowAction onClick={() => { setOpen(false); navigate({ to: "/register" }); }} icon={Briefcase} label="List your property" />
                      <MobileRowAction onClick={() => { setOpen(false); navigate({ to: "/login" }); }} icon={UserCircle} label="Sign in" />
                    </>
                  )}
                </MobileGroup>

                <MobileGroup title="Support">
                  <MobileRowLink to="/help" onSelect={() => setOpen(false)} icon={HelpCircle} label="Help & support" />
                  <MobileRowLink to="/profile/settings" onSelect={() => setOpen(false)} icon={SettingsIcon} label="Settings" />
                  <MobileRowLink to="/profile/settings" hash="languages" onSelect={() => setOpen(false)} icon={Globe} label="Languages & currency" />
                </MobileGroup>

                <MobileGroup title="Legal">
                  <MobileRowLink to="/help" onSelect={() => setOpen(false)} icon={FileText} label="Terms of service" />
                  <MobileRowLink to="/help" onSelect={() => setOpen(false)} icon={FileText} label="Privacy policy" />
                  <MobileRowLink to="/help" onSelect={() => setOpen(false)} icon={FileText} label="Cookie policy" />
                </MobileGroup>

                {user && (
                  <button
                    onClick={() => { setOpen(false); logout(); navigate({ to: "/" }); }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted text-left text-destructive"
                  >
                    <LogOut className="h-5 w-5" /> Sign out
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function MobileRowLink({
  to,
  hash,
  icon: Icon,
  label,
  onSelect,
}: {
  to: string;
  hash?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onSelect: () => void;
}) {
  return (
    <Link
      to={to}
      hash={hash}
      onClick={onSelect}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      {label}
    </Link>
  );
}

function MobileRowAction({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted text-left"
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      {label}
    </button>
  );
}
