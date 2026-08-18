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
  LucideIcon,
} from "lucide-react";
import { BACKDROP_CLASS, cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { HostNotificationsPopover } from "@/components/host/HostNotificationsPopover";
import { HostBookingSearch } from "@/components/host/bookings/HostBookingSearch";

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

// Mobile bottom navigation items
const bottomNavItems: { href: string; label: string; icon: LucideIcon; isMenu?: boolean }[] = [
  { href: "/host", label: "Home", icon: LayoutDashboard },
  { href: "/host/availability", label: "Calendar", icon: CalendarDays },
  { href: "/host/create", label: "New Listing", icon: PlusCircle },
  { href: "/host/finances", label: "Earnings", icon: DollarSign },
  { href: "#menu", label: "Menu", icon: Menu, isMenu: true },
];

// Hamburger menu items
const menuItems = [
  { href: "/host", label: "Overview", icon: LayoutDashboard },
  { href: "/host/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/host/inventory", label: "Inventory", icon: Boxes },
  { href: "/host/availability", label: "Calendar", icon: CalendarDays },
  { href: "/host/create", label: "New Listing", icon: PlusCircle },
  { href: "/host/finances", label: "Earnings", icon: DollarSign },
  { href: "/host/reviews", label: "Reviews", icon: Star },
  { href: "/host/settings", label: "Settings", icon: Settings2 },
];

export function HostNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isHostRoute = pathname.startsWith("/host") || hostRoutes.includes(pathname);
  const isActive = (href: string) => {
    if (href === "/host") return pathname === "/host";
    return pathname.startsWith(href);
  };

  // Show hamburger menu on any host route for desktop sidebar access
  const shouldShowMenu = isHostRoute;

  return (
    <>
      {/*  Top Nav  */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-[56px] flex items-center justify-between">
          <Link
            href="/host"
            className="flex items-center gap-1.5 shrink-0 group no-underline outline-none"
          >
            <span className="text-lg font-semibold text-neutral-900 tracking-tight">Nearby</span>
            <span className="font-script text-purple text-[1.25em] leading-none">Escapes</span>
          </Link>

          {shouldShowMenu && (
            <div className="flex items-center gap-2">
              {/* Global booking search — across Bookings, Calendar, etc. */}
              <HostBookingSearch />

              {/* Notifications popover — GetYourGuide style */}
              <HostNotificationsPopover />

              {/* Help center */}
              <Link
                href="/help"
                className="flex items-center justify-center h-9 w-9 rounded-full border border-neutral-200 hover:border-purple/40 hover:text-purple transition-colors text-neutral-600 bg-white"
                aria-label="Help center"
              >
                <HelpCircle className="h-5 w-5" strokeWidth={2} />
              </Link>

              {/* Profile icon — shown on smaller screens where the hamburger menu is hidden */}
              <Link
                href="/host/account"
                className="lg:hidden flex items-center justify-center h-9 w-9 rounded-full border border-neutral-200 hover:border-purple/40 hover:text-purple transition-colors text-neutral-600 bg-white"
                aria-label="Account"
              >
                <CircleUserRound className="h-5 w-5" strokeWidth={2} />
              </Link>

              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    className="hidden lg:flex items-center justify-center h-9 w-9 rounded-full border border-neutral-200 hover:border-purple/40 hover:text-purple transition-colors text-neutral-600 bg-white"
                    aria-label="Menu"
                  >
                    <Menu className="h-5 w-5" strokeWidth={2} />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  overlayClassName={BACKDROP_CLASS}
                  className="w-[280px] p-0 flex flex-col bg-white border-l border-neutral-200 text-neutral-900"
                >
                  <SheetTitle className="sr-only">Host Menu</SheetTitle>
                  <div className="flex-1 overflow-y-auto px-3 py-6 flex flex-col gap-5">
                    {/* Account Section */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 px-3">
                        Account
                      </p>
                      <div className="flex flex-col gap-0.5">
                        <SheetClose asChild>
                          <Link
                            href="/host/account"
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                              pathname === "/host/account"
                                ? "bg-purple/10 text-purple"
                                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                            )}
                          >
                            <CircleUserRound className="h-4 w-4 shrink-0" /> Account
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    <div className="h-px bg-neutral-100" />

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 px-3">
                        Host Dashboard
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {menuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <SheetClose asChild key={item.href}>
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                                  isActive(item.href)
                                    ? "bg-purple/10 text-purple"
                                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon className="h-4 w-4 shrink-0" />
                                  <span>{item.label}</span>
                                </div>
                              </Link>
                            </SheetClose>
                          );
                        })}
                      </div>
                    </div>

                    <div className="h-px bg-neutral-100" />

                    <SheetClose asChild>
                      <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors w-full text-left">
                        <LogOut className="h-4 w-4 shrink-0" /> Log Out
                      </button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </header>

      {/*  Bottom Navigation  */}
      {isHostRoute && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 lg:hidden">
          <div className="flex items-center justify-around py-2 pb-3.5 px-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = item.isMenu ? false : isActive(item.href);
              if (item.isMenu) {
                return (
                  <button
                    key={item.label}
                    onClick={() => setSheetOpen(true)}
                    className="flex flex-col items-center gap-0.5 min-w-0"
                  >
                    <Menu className="h-[19px] w-[19px] text-neutral-600" />
                    <span className="text-[9px] font-medium text-neutral-600">{item.label}</span>
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
                    className={cn("h-[19px] w-[19px]", active ? "text-purple" : "text-neutral-600")}
                  />
                  <span
                    className={cn(
                      "text-[9px] font-medium",
                      active ? "text-purple font-bold" : "text-neutral-600",
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
