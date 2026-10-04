"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  Wallet,
  Scale,
  Megaphone,
  BarChart3,
  Settings,
  Activity,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  Wallet,
  Scale,
  Megaphone,
  BarChart3,
  Settings,
  Activity,
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/users", label: "Users", icon: "Users" },
  { href: "/admin/listings", label: "Listings", icon: "Building2" },
  { href: "/admin/bookings", label: "Bookings", icon: "CalendarCheck" },
  { href: "/admin/payouts", label: "Payouts", icon: "Wallet" },
  { href: "/admin/disputes", label: "Disputes", icon: "Scale" },
  { href: "/admin/promotions", label: "Promotions", icon: "Megaphone" },
  { href: "/admin/reports", label: "Reports", icon: "BarChart3" },
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
  { href: "/admin/activity", label: "Activity", icon: "Activity" },
];

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r border-neutral-200/80 bg-white transition-all duration-300 hidden md:flex flex-col ${
        isCollapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-100 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-sm tracking-tight text-neutral-900 truncate">
              Nearby Escapes
            </span>
            <span className="text-[10px] font-semibold text-purple bg-purple/10 border border-purple/15 px-1.5 py-0.5 rounded shrink-0">
              Admin
            </span>
          </div>
        ) : (
          <div className="mx-auto h-7 w-7 rounded-lg bg-purple/10 text-purple border border-purple/15 flex items-center justify-center font-bold text-xs">
            NE
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-2 space-y-0.5 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = iconMap[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-purple/10 text-purple font-semibold"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-medium"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {isCollapsed ? (
                <span className="mx-auto">
                  {Icon ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-semibold">{item.label.charAt(0)}</span>
                  )}
                </span>
              ) : (
                <>
                  {Icon && (
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-purple" : "text-neutral-500"
                      }`}
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="p-2 border-t border-neutral-100 space-y-1 shrink-0">
        <Link
          href="/host"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="Go to Host Portal"
        >
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          {!isCollapsed && <span className="font-medium truncate">Host Portal</span>}
        </Link>
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="Go to Marketplace"
        >
          <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
          {!isCollapsed && <span className="font-medium truncate">Public Marketplace</span>}
        </Link>
      </div>
    </aside>
  );
}

/* MobileAdminNav */

export function MobileAdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] p-4 bg-white flex flex-col">
        <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neutral-100">
          <span className="font-bold text-base text-neutral-900">Nearby Escapes</span>
          <span className="text-[10px] font-semibold text-purple bg-purple/10 border border-purple/15 px-1.5 py-0.5 rounded">
            Admin
          </span>
        </div>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = iconMap[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-purple/10 text-purple font-semibold"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-medium"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-purple" : "text-neutral-500"
                    }`}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 border-t border-neutral-100 space-y-1">
          <Link
            href="/host"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            Host Portal
          </Link>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
            Public Marketplace
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
