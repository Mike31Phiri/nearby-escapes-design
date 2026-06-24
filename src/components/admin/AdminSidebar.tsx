"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
      className={`fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 hidden md:block ${
        isCollapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!isCollapsed && <span className="text-sm font-bold text-foreground">Admin</span>}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
      <nav className="p-2 space-y-1">
        {" "}
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = iconMap[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {isCollapsed ? (
                <span className="mx-auto">
                  {Icon ? (
                    <Icon className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{item.label.charAt(0)}</span>
                  )}
                </span>
              ) : (
                <>
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

/* ─── MobileAdminNav ─── */

export function MobileAdminNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] p-4">
        <div className="mb-6">
          <span className="text-sm font-bold text-foreground">Admin</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = iconMap[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
