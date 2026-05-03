"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const logo = "/images/logo.png";
import {
  MapPin,
  Menu,
  User,
  LogOut,
  CircleUser as UserCircle,
  Briefcase,
  Settings as SettingsIcon,
  Globe,
  Circle as HelpCircle,
  Hop as Home,
  FileText,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { CategoryPills } from "@/components/CategoryPills";
import { cn } from "@/lib/utils";
import { onEscape, trapFocus, announceToScreenReader } from "@/lib/accessibility";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isHostArea = pathname?.startsWith("/host");
  const [showCenterPills, setShowCenterPills] = useState(!isHome && !isHostArea);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  // Handle scroll-based pill visibility
  useEffect(() => {
    if (isHostArea) {
      setShowCenterPills(false);
      return;
    }
    if (!isHome) {
      setShowCenterPills(true);
      return;
    }
    const heroPills = document.querySelector("[data-hero-pills]");
    if (!heroPills) {
      const onScroll = () => setShowCenterPills(window.scrollY > 280);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowCenterPills(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(heroPills);
    return () => observer.disconnect();
  }, [isHome, isHostArea]);

  // Trap focus when sheet is open
  useEffect(() => {
    if (open && sheetContentRef.current) {
      const cleanup = trapFocus(sheetContentRef.current);
      announceToScreenReader("Navigation menu opened");

      // Handle escape key
      const cleanupEscape = onEscape(() => setOpen(false));

      return () => {
        cleanup();
        cleanupEscape();
        announceToScreenReader("Navigation menu closed");
      };
    }
  }, [open]);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const handleLogout = useCallback(() => {
    setOpen(false);
    logout();
    router.push("/");
    announceToScreenReader("You have been signed out");
  }, [logout, router]);

  const handleNavClick = useCallback(
    (to: string) => {
      setOpen(false);
      router.push(to);
      announceToScreenReader(`Navigated to ${to}`);
    },
    [router],
  );

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg"
      role="banner"
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Nearby Escapes - Home"
        >
          <img
            src={logo}
            alt=""
            className="h-10 w-10 rounded-xl object-contain bg-white shadow-[var(--shadow-elegant)]"
          />
          <span className="hidden sm:inline font-bold text-lg tracking-tight">Nearby Escapes</span>
        </Link>

        <nav
          className="hidden md:flex items-center justify-center flex-1"
          aria-label="Main navigation"
        >
          <div
            className={cn(
              "transition-all duration-300",
              showCenterPills
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none",
            )}
          >
            <CategoryPills variant="header" />
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-border pl-2 pr-2 py-1 hover:shadow-sm transition"
              aria-label={`Go to your profile, ${user.fullName}`}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-xs font-bold text-primary-foreground"
                aria-hidden="true"
              >
                {initials || <User className="h-4 w-4" />}
              </div>
            </Link>
          ) : (
            <div
              className="hidden sm:flex items-center gap-2"
              role="group"
              aria-label="Authentication"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                aria-label="Sign in to your account"
              >
                Sign in
              </Button>
              <Button
                size="sm"
                className="btn-primary"
                onClick={() => router.push("/register")}
                aria-label="Create a new account"
              >
                Sign up
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                ref={menuButtonRef}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 overflow-y-auto"
              id="mobile-menu"
              ref={sheetContentRef}
            >
              <div className="mt-8 space-y-6" role="navigation" aria-label="Mobile navigation">
                {user && (
                  <div className="px-3 pb-2 border-b border-border" role="status">
                    <p className="text-sm font-semibold truncate">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                )}

                <MobileGroup title="Account">
                  {user ? (
                    <>
                      <MobileRowLink
                        href="/profile"
                        onSelect={() => handleNavClick("/profile")}
                        icon={UserCircle}
                        label="Profile"
                      />
                      <MobileRowLink
                        href="/host"
                        onSelect={() => handleNavClick("/host")}
                        icon={Briefcase}
                        label="Host dashboard"
                      />
                      <MobileRowLink
                        href="/profile/settings"
                        onSelect={() => handleNavClick("/profile/settings")}
                        icon={SettingsIcon}
                        label="Account settings"
                      />
                    </>
                  ) : (
                    <>
                      <MobileRowAction
                        onClick={() => handleNavClick("/login")}
                        icon={UserCircle}
                        label="Sign in"
                      />
                      <MobileRowAction
                        onClick={() => handleNavClick("/register")}
                        icon={Briefcase}
                        label="Sign up"
                      />
                      <MobileRowLink
                        href="/host"
                        onSelect={() => handleNavClick("/host")}
                        icon={Briefcase}
                        label="List your property"
                      />
                    </>
                  )}
                </MobileGroup>

                <MobileGroup title="Explore">
                  <MobileRowLink
                    href="/"
                    onSelect={() => handleNavClick("/")}
                    icon={Home}
                    label="Home"
                  />
                  <MobileRowLink
                    href="/gems"
                    onSelect={() => handleNavClick("/gems")}
                    icon={MapPin}
                    label="Hidden gems"
                  />
                </MobileGroup>

                <MobileGroup title="Support">
                  <MobileRowLink
                    href="/help"
                    onSelect={() => handleNavClick("/help")}
                    icon={HelpCircle}
                    label="Help & support"
                  />
                  <MobileRowLink
                    href="/profile/settings#languages"
                    onSelect={() => handleNavClick("/profile/settings")}
                    icon={Globe}
                    label="Languages & currency"
                  />
                </MobileGroup>

                <MobileGroup title="Legal">
                  <MobileRowLink
                    href="/legal/terms"
                    onSelect={() => handleNavClick("/legal/terms")}
                    icon={FileText}
                    label="Terms of service"
                  />
                  <MobileRowLink
                    href="/legal/privacy"
                    onSelect={() => handleNavClick("/legal/privacy")}
                    icon={FileText}
                    label="Privacy policy"
                  />
                  <MobileRowLink
                    href="/legal/cookies"
                    onSelect={() => handleNavClick("/legal/cookies")}
                    icon={FileText}
                    label="Cookie policy"
                  />
                </MobileGroup>

                {user && (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted text-left text-destructive"
                    aria-label="Sign out of your account"
                  >
                    <LogOut className="h-5 w-5" aria-hidden="true" />
                    <span>Sign out</span>
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
    <div role="group" aria-labelledby={`${title.toLowerCase()}-heading`}>
      <p
        id={`${title.toLowerCase()}-heading`}
        className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function MobileRowLink({
  href,
  icon: Icon,
  label,
  onSelect,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onSelect: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
    >
      <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      <span>{label}</span>
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
      <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
