"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  DollarSign,
  Star,
  User,
  Settings,
  LogOut,
  Menu,
  Bell,
  PlusCircle,
  LucideIcon,
} from "lucide-react";
import { EnvelopeSimple as MessageSquare } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";

const hostRoutes = [
  "/host",
  "/host/bookings",
  "/host/availability",
  "/host/finances",
  "/host/reviews",
  "/host/notifications",
  "/host/profile",
  "/host/settings",
  "/host/listings",
  "/host/create",
];

// Bottom navigation items - matches reference .h-bnav design EXACTLY
const bottomNavItems: {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}[] = [
  { href: "/host", label: "Home", icon: LayoutDashboard },
  { href: "/host/availability", label: "Calendar", icon: CalendarDays },
  { href: "/host/create", label: "New Listing", icon: PlusCircle },
  { href: "/host/finances", label: "Earnings", icon: DollarSign },
  { href: "/host/profile", label: "Profile", icon: User },
];

// Hamburger menu items
const menuItems = [
  { href: "/host", label: "Overview", icon: LayoutDashboard },
  { href: "/host/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/host/availability", label: "Calendar", icon: CalendarDays },
  { href: "/host/create", label: "New Listing", icon: PlusCircle },
  { href: "/host/notifications", label: "Notifications", icon: Bell, badge: 2 },
  { href: "/host/finances", label: "Earnings", icon: DollarSign },
  { href: "/host/reviews", label: "Reviews", icon: Star },
];

export function HostNav() {
  const pathname = usePathname();

  const isHostRoute = hostRoutes.includes(pathname);
  const isActive = (href: string) => {
    if (href === "/host") return pathname === "/host";
    return pathname.startsWith(href);
  };

  // Show hamburger menu on any host route for desktop sidebar access
  const shouldShowMenu = isHostRoute;

  return (
    <>
      {/*  Top Nav  */}
      <header className="sticky top-0 z-40 w-full bg-[#3D2463] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-[56px] flex items-center justify-between">
          <Link
            href="/host"
            className="flex items-center gap-2 shrink-0 group no-underline outline-none"
          >
            <span className="text-lg font-semibold text-white tracking-tight">Nearby</span>
            <span className="font-script text-[#C9A84C] text-[1.2em] leading-none">
              Escapes
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {shouldShowMenu && (
            <nav className="hidden lg:flex items-center gap-2">
              {bottomNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 no-underline outline-none",
                      active
                        ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                        : "text-white/80 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {shouldShowMenu && (
            <div className="flex items-center gap-2">
              <Link
                href="/host/notifications"
                className={cn(
                  "relative flex items-center justify-center h-9 w-9 rounded-full border transition-all",
                  isActive("/host/notifications")
                    ? "border-[#C9A84C] bg-white/10 text-[#C9A84C]"
                    : "border-[#C9A84C]/20 hover:bg-white/5 text-[#C9A84C] hover:text-white",
                )}
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center shadow-sm">
                  2
                </span>
              </Link>

              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="flex items-center justify-center h-9 w-9 rounded-full border border-[#C9A84C]/20 hover:bg-white/5 transition-colors text-[#C9A84C]"
                    aria-label="Menu"
                  >
                    <Menu className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[280px] p-0 flex flex-col bg-[#3D2463] border-l border-[#C9A84C]/15 text-white"
                >
                  <SheetTitle className="sr-only">Host Menu</SheetTitle>
                  <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col gap-6">
                    {/* Account Section */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-2.5 px-3">
                        Account
                      </p>
                      <div className="flex flex-col gap-1">
                        <SheetClose asChild>
                          <Link
                            href="/host/profile"
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                              pathname === "/host/profile"
                                ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                                : "text-white/80 hover:bg-white/5 hover:text-white",
                            )}
                          >
                            <User className="h-4.5 w-4.5 shrink-0" /> Profile
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/host/settings"
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                              pathname === "/host/settings"
                                ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                                : "text-white/80 hover:bg-white/5 hover:text-white",
                            )}
                          >
                            <Settings className="h-4.5 w-4.5 shrink-0" /> Settings
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] mb-2.5 px-3">
                        Host Dashboard
                      </p>
                      <div className="flex flex-col gap-1">
                        {menuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <SheetClose asChild key={item.href}>
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                                  isActive(item.href)
                                    ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                                    : "text-white/80 hover:bg-white/5 hover:text-white",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <Icon className="h-4.5 w-4.5 shrink-0" />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                  <span className="inline-flex items-center justify-center bg-rose-500 text-white text-[10px] font-black h-[18px] min-w-[18px] rounded-full px-1.5">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            </SheetClose>
                          );
                        })}
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    <SheetClose asChild>
                      <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all w-full text-left">
                        <LogOut className="h-4.5 w-4.5 shrink-0" /> Log Out
                      </button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </header>

      {/*  Bottom Navigation (.h-bnav)  */}
      {isHostRoute && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1C1030] border-t border-[#C9A84C]/20 lg:hidden">
          <div className="flex items-center justify-around py-2.5 pb-3.5 px-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-0.5 min-w-0"
                >
                  <div className="relative">
                    <Icon
                      className={cn(
                        "h-[19px] w-[19px]",
                        active ? "text-[#C9A84C]" : "text-[#5A5070]",
                      )}
                    />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-[#C9A84C] text-[#1C1030] text-[7px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[9px] font-medium",
                      active ? "text-[#C9A84C]" : "text-[#5A5070]",
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
