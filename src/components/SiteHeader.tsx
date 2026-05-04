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
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Announce sheet open/close to screen readers
  useEffect(() => {
    announceToScreenReader(open ? "Navigation menu opened" : "Navigation menu closed");
    if (open) {
      const cleanupEscape = onEscape(() => setOpen(false));
      return cleanupEscape;
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
      className="sticky top-0 z-50 w-full bg-background border-b border-border"
      role="banner"
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Nearby Escapes - Home"
        >
          <img
            src={logo}
            alt=""
            className="h-9 w-9 rounded-xl object-contain shadow-sm"
          />
          <span className="hidden sm:inline font-bold text-xl tracking-tight text-primary">Nearby Escapes</span>
        </Link>

        <div className="hidden md:flex flex-1" />

        {/* Right side nav */}
        <div className="flex items-center justify-end gap-1 md:gap-2 shrink-0">
          <button
            className="hidden lg:flex items-center gap-1 text-sm font-medium hover:bg-muted/50 rounded-full px-3 py-2 transition-[var(--transition-smooth)]"
            aria-label="Currency"
          >
            <span>ZMW</span>
          </button>
          
          <button
            className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted/50 transition-[var(--transition-smooth)]"
            aria-label="Language"
          >
            <Globe className="h-4 w-4" />
          </button>

          <Link
            href="/help"
            className="hidden lg:flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted/50 transition-[var(--transition-smooth)]"
            aria-label="Help & Support"
          >
            <HelpCircle className="h-4 w-4" />
          </Link>

          <Link
            href="/host"
            className="hidden md:block text-sm font-semibold hover:bg-muted/50 rounded-full px-4 py-2 transition-[var(--transition-smooth)]"
          >
            List your property
          </Link>

          {!user ? (
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Button
                variant="ghost"
                className="rounded-full font-semibold hover:bg-muted/50 transition-[var(--transition-smooth)]"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
              <Button
                className="rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-[var(--transition-smooth)]"
                onClick={() => router.push("/login")}
              >
                Sign in
              </Button>
            </div>
          ) : null}

          {/* Mobile menu / User Profile Pill */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="flex items-center gap-2 border border-border hover:shadow-md transition-[var(--transition-smooth)] rounded-full pl-3 pr-1.5 py-1.5 ml-2 bg-background"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                ref={menuButtonRef}
              >
                <Menu className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary overflow-hidden"
                  aria-hidden="true"
                >
                  {user ? initials || <User className="h-4 w-4" /> : <UserCircle className="h-5 w-5 text-muted-foreground" />}
                </div>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 overflow-y-auto"
              id="mobile-menu"
              aria-label="Navigation menu"
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="mt-6 space-y-6" role="navigation" aria-label="Mobile navigation">
                {user ? (
                  <div className="px-3 pb-4 border-b border-border flex items-center gap-3" role="status">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-bold truncate">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 pb-4 border-b border-border sm:hidden flex flex-col gap-2">
                    <Button
                      className="w-full rounded-xl font-semibold bg-primary hover:bg-primary/90"
                      onClick={() => handleNavClick("/login")}
                    >
                      Sign in
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl font-semibold"
                      onClick={() => handleNavClick("/register")}
                    >
                      Create account
                    </Button>
                  </div>
                )}

                <MobileGroup title="Manage">
                  {user && (
                    <>
                      <MobileRowLink
                        href="/profile"
                        onSelect={() => handleNavClick("/profile")}
                        icon={UserCircle}
                        label="Manage account"
                      />
                      <MobileRowLink
                        href="/account/bookings"
                        onSelect={() => handleNavClick("/account/bookings")}
                        icon={Briefcase}
                        label="Bookings & Trips"
                      />
                    </>
                  )}
                  <MobileRowLink
                    href="/gems"
                    onSelect={() => handleNavClick("/gems")}
                    icon={MapPin}
                    label="Saved Lists"
                  />
                </MobileGroup>

                <MobileGroup title="Hosting">
                  <MobileRowLink
                    href="/host"
                    onSelect={() => handleNavClick("/host")}
                    icon={Home}
                    label="List your property"
                  />
                  {user && (
                    <MobileRowLink
                      href="/host/dashboard"
                      onSelect={() => handleNavClick("/host/dashboard")}
                      icon={SettingsIcon}
                      label="Host dashboard"
                    />
                  )}
                </MobileGroup>

                <MobileGroup title="Support">
                  <MobileRowLink
                    href="/help"
                    onSelect={() => handleNavClick("/help")}
                    icon={HelpCircle}
                    label="Help Center"
                  />
                  <MobileRowLink
                    href="/help/contact"
                    onSelect={() => handleNavClick("/help/contact")}
                    icon={FileText}
                    label="Contact customer service"
                  />
                </MobileGroup>

                {user && (
                  <div className="pt-2 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-muted text-left text-destructive transition-colors"
                      aria-label="Sign out of your account"
                    >
                      <LogOut className="h-5 w-5" aria-hidden="true" />
                      <span>Sign out</span>
                    </button>
                  </div>
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
