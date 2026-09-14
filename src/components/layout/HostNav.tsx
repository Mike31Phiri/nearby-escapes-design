"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
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
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { HostNotificationsPopover } from "@/components/host/HostNotificationsPopover";

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
];

// Desktop navigation links
const desktopNavLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/host", label: "Dashboard", icon: LayoutDashboard },
  { href: "/host/listings", label: "Listings", icon: Building2 },
  { href: "/host/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/host/availability", label: "Calendar", icon: CalendarDays },
  { href: "/host/inventory", label: "Inventory", icon: Boxes },
  { href: "/host/finances", label: "Finances", icon: DollarSign },
  { href: "/host/reviews", label: "Reviews", icon: Star },
];

// Mobile bottom navigation items
const bottomNavItems: { href: string; label: string; icon: LucideIcon; isMenu?: boolean }[] = [
  { href: "/host", label: "Home", icon: LayoutDashboard },
  { href: "/host/availability", label: "Calendar", icon: CalendarDays },
  { href: "/host/create", label: "New Listing", icon: PlusCircle },
  { href: "/host/finances", label: "Earnings", icon: DollarSign },
  { href: "#menu", label: "Menu", icon: Menu, isMenu: true },
];

export function HostNav() {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  const [sheetOpen, setSheetOpen] = useState(false);

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
              <span className="text-[21px] font-semibold text-neutral-900 tracking-tight">
                Nearby
              </span>
              <span className="font-script text-purple text-[1.35em] leading-none">Escapes</span>
              <span className="ml-1 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-md bg-purple/10 text-purple border border-purple/20">
                Host
              </span>
            </Link>

            {/* Desktop Center Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {desktopNavLinks.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs transition-all duration-150",
                      active
                        ? "bg-purple text-white font-medium shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 font-normal",
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
                href="/help"
                className="flex items-center justify-center h-9 w-9 rounded-full border border-neutral-200 hover:border-purple/40 hover:text-purple transition-colors text-neutral-600 bg-white"
                aria-label="Help center"
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
                  className="w-[280px] p-0 flex flex-col bg-white border-l border-neutral-200 text-neutral-900"
                >
                  <SheetTitle className="sr-only">Host Menu</SheetTitle>
                  <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col justify-between">
                    <div className="space-y-5">
                      <div className="px-2">
                        <p className="text-xs font-semibold text-neutral-900">Host Account</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">Preferences &amp; legal</p>
                      </div>

                      <div className="flex flex-col gap-1">
                        {/* Profile */}
                        <SheetClose asChild>
                          <Link
                            href="/host/account"
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors",
                              pathname === "/host/account"
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <CircleUserRound className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Profile</span>
                          </Link>
                        </SheetClose>

                        {/* Settings */}
                        <SheetClose asChild>
                          <Link
                            href="/host/settings"
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors",
                              pathname === "/host/settings"
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <Settings2 className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Settings</span>
                          </Link>
                        </SheetClose>

                        {/* Help */}
                        <SheetClose asChild>
                          <Link
                            href="/help"
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors",
                              pathname === "/help"
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <HelpCircle className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Help &amp; Support</span>
                          </Link>
                        </SheetClose>

                        {/* Privacy Policy */}
                        <SheetClose asChild>
                          <Link
                            href="/privacy"
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors",
                              pathname === "/privacy"
                                ? "bg-purple/10 text-purple font-semibold"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <ShieldCheck className="h-4 w-4 shrink-0 text-neutral-500" />
                            <span>Privacy Policy</span>
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    {/* Log out */}
                    <div className="border-t border-neutral-100 pt-4">
                      <SheetClose asChild>
                        <Link
                          href="/auth/login"
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4 shrink-0" />
                          <span>Log Out</span>
                        </Link>
                      </SheetClose>
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
