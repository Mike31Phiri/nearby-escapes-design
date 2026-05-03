"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Users,
  Home,
  CalendarCheck,
  Settings,
  LogOut,
  X,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/listings", label: "Listings", icon: Home },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#F7F9FC]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-border/40">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">Nearby Admin</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              // Ensure perfect match for dashboard or prefix match for subpages
              const isActive = item.href === "/admin" 
                ? pathname === "/admin" 
                : pathname?.startsWith(item.href);
                
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border/40">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl border border-border/40 bg-muted/20">
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                {user?.fullName?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">{user?.fullName || "Admin User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@nearby.com"}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 px-4" 
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border/40 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden -ml-2 text-muted-foreground"
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border/50 focus-within:border-primary/50 focus-within:bg-white transition-colors">
              <Search className="h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-48 sm:w-64 placeholder:text-muted-foreground/70 text-foreground"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              {description && <p className="text-sm sm:text-base text-muted-foreground mt-1.5">{description}</p>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
