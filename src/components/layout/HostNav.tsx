"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  CalendarCheck,
  DollarSign,
  Star,
  HelpCircle,
  LogOut,
  Menu,
  PlusCircle,
  Boxes,
  CircleUserRound,
  Settings2,
  Building2,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";
import { BACKDROP_CLASS, cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { HostNotificationsPopover } from "@/components/host/HostNotificationsPopover";
import { useAuthStore } from "@/lib/store/authStore";

const hostRoutes = [
  "/host",
  "/host/bookings",
  "/host/availability",
  "/host/inventory",
  "/host/finances",
  "/host/reviews",
  "/host/account",
  "/host/listings",
  "/host/create",
  "/host/help",
];

// Desktop navigation links
const desktopNavLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/host", label: "Home", icon: Home },
  { href: "/host/listings", label: "Listings", icon: Building2 },
  { href: "/host/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/host/availability", label: "Calendar", icon: CalendarDays },
  { href: "/host/inventory", label: "Inventory", icon: Boxes },
  { href: "/host/finances", label: "Finances", icon: DollarSign },
  { href: "/host/reviews", label: "Reviews", icon: Star },
];

// Mobile bottom navigation items
const bottomNavItems: { href: string; label: string; icon: LucideIcon; isMenu?: boolean }[] = [
  { href: "/host", label: "Home", icon: Home },
  { href: "/host/availability", label: "Calendar", icon: CalendarDays },
  { href: "/host/create", label: "New Listing", icon: PlusCircle },
  { href: "/host/finances", label: "Earnings", icon: DollarSign },
  { href: "#menu", label: "Menu", icon: Menu, isMenu: true },
];

export function HostNav() {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  const [sheetOpen, setSheetOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  const isHostRoute = Boolean(pathname && (pathname.startsWith("/host") || hostRoutes.includes(pathname)));
  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/host") return pathname === "/host";
    return pathname.startsWith(href);
  };

  const shouldShowMenu = isHostRoute;

  return (
    <>
      {/* Top Nav (64px height, clean solid white) */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200 shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand logo with Host badge */}
          <div className="flex items-center gap-6 shrink-0">
            <Link
              href="/host"
              className="flex items-center gap-2 no-underline outline-none focus-visible:outline-none shrink-0 group"
            >
              <span className="text-[21px] font-bold text-black tracking-tight">
                Nearby
              </span>
              <span className="font-script text-purple text-[1.35em] leading-none">Escapes</span>
              <span className="ml-1 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide rounded-md bg-purple/10 text-purple border border-purple/20">
                Host
              </span>
            </Link>

            {/* Desktop Center Links */}
            <nav className="hidden xl:flex items-center gap-1.5">
              {desktopNavLinks.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs transition-colors",
                      active
                        ? "bg-purple/10 text-purple font-semibold"
                        : "text-black-subtle hover:text-black hover:bg-neutral-100/80 font-medium",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions */}
          {shouldShowMenu && (
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Notifications popover */}
              <HostNotificationsPopover />

              {/* Help center (accessible on both mobile and desktop) */}
              <Link
                href="/host/help"
                className={cn(
                  "flex items-center justify-center h-9 w-9 rounded-full border transition-colors bg-white",
                  pathname === "/host/help"
                    ? "border-purple text-purple bg-purple/10"
                    : "border-neutral-200 hover:border-purple/40 hover:text-purple text-neutral-600",
                )}
                aria-label="Host Help Center"
              >
                <HelpCircle className="h-4 w-4" strokeWidth={1.8} />
              </Link>

              {/* Drawer menu trigger (Desktop only: hidden xl:flex so mobile relies on the bottom nav Menu button) */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    className="hidden xl:flex items-center justify-center h-9 w-9 rounded-full border border-neutral-200 hover:border-purple/40 hover:text-purple transition-colors text-neutral-600 bg-white cursor-pointer"
                    aria-label="Menu"
                  >
                    <Menu className="h-4.5 w-4.5" strokeWidth={2} />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  overlayClassName={BACKDROP_CLASS}
                  className="w-[290px] p-0 flex flex-col bg-white border-l border-neutral-200 text-neutral-900 shadow-2xl"
                >
                  <SheetTitle className="sr-only">Host Menu</SheetTitle>

                  {/* Top Header */}
                  <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-neutral-900">Host Menu</p>
                      <p className="text-[11px] text-neutral-500">Manage your hosting</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-purple/10 text-purple border border-purple/20">
                      Host Mode
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col justify-between space-y-6">
                    <div className="space-y-5">
                      {/* Section 1: Management (Items not on bottom nav) */}
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 mb-1.5">
                          Management
                        </p>
                        <div className="flex flex-col gap-1">
                          {/* Listings */}
                          <Link
                            href="/host/listings"
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                              pathname === "/host/listings" || pathname.startsWith("/host/listings")
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <Building2 className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>My Listings</span>
                          </Link>

                          {/* Bookings */}
                          <Link
                            href="/host/bookings"
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                              pathname === "/host/bookings" || pathname.startsWith("/host/bookings")
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <CalendarCheck className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Bookings</span>
                          </Link>

                          {/* Inventory */}
                          <Link
                            href="/host/inventory"
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                              pathname === "/host/inventory" || pathname.startsWith("/host/inventory")
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <Boxes className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Inventory</span>
                          </Link>

                          {/* Reviews */}
                          <Link
                            href="/host/reviews"
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                              pathname === "/host/reviews" || pathname.startsWith("/host/reviews")
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <Star className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Reviews</span>
                          </Link>
                        </div>
                      </div>

                      {/* Section 2: Account & Settings */}
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 mb-1.5">
                          Account &amp; Settings
                        </p>
                        <div className="flex flex-col gap-1">
                          {/* Profile */}
                          <Link
                            href="/host/account"
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                              pathname === "/host/account"
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <CircleUserRound className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Profile</span>
                          </Link>

                          {/* Settings */}
                          <Link
                            href="/host/settings"
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                              pathname === "/host/settings"
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <Settings2 className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Settings</span>
                          </Link>

                          {/* Help */}
                          <Link
                            href="/host/help"
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                              pathname === "/host/help"
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <HelpCircle className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Host Help Center</span>
                          </Link>

                          {/* Privacy Policy */}
                          <Link
                            href="/privacy"
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                              pathname === "/privacy"
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <ShieldCheck className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Privacy Policy</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Log out */}
                    <div className="border-t border-neutral-100 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSheetOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors w-full text-left cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation (Clean solid white) */}
      {isHostRoute && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 xl:hidden shadow-xs">
          <div className="flex items-center justify-around py-2 pb-3.5 px-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = item.isMenu ? false : isActive(item.href);
              if (item.isMenu) {
                return (
                  <button
                    key={item.label}
                    onClick={() => setSheetOpen(true)}
                    className="flex flex-col items-center gap-0.5 min-w-0 cursor-pointer"
                  >
                    <Menu className="h-[19px] w-[19px] text-neutral-500" />
                    <span className="text-[10px] font-medium text-neutral-500">{item.label}</span>
                  </button>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 min-w-0"
                >
                  <Icon
                    className={cn("h-[19px] w-[19px]", active ? "text-purple" : "text-neutral-500")}
                  />
                  <span
                    className={cn(
                      "text-[10px]",
                      active ? "text-purple font-semibold" : "text-neutral-500 font-normal",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
