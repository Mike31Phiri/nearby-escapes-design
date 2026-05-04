"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  TrendingUp,
  DollarSign,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analysis", label: "Analysis", icon: TrendingUp },
  { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/performance", label: "Performance", icon: Award },
  { href: "/admin/settings", label: "Profile Settings", icon: Settings },
] as const;

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function AdminLayout({ children, title, description, activeTab, onTabChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-[#FAFBFC]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always open on desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-border/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 flex flex-col shadow-sm",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col px-6 py-6 border-b border-border/40 gap-5">
            <div className="flex items-center justify-between">
              <Link href="/" className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm transition-transform hover:scale-105">
                N
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-black shrink-0 border border-primary/20 ring-4 ring-primary/5">
                {user?.fullName?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black truncate text-foreground leading-tight">{user?.fullName || "Admin User"}</p>
                <p className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-tighter mt-0.5">{user?.email || "admin@nearby.com"}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Navigation
            </p>
            {navItems.map((item) => {
              const tabId = item.href.split("/").pop() || "dashboard";
              const isActive = onTabChange 
                ? activeTab === tabId
                : (item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href));
                
              const content = (
                <>
                  <item.icon className={cn("h-4.5 w-4.5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  {item.label}
                </>
              );

              if (onTabChange) {
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      onTabChange(tabId);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {content}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border/40 bg-muted/10">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5 h-10 px-3 rounded-xl font-semibold transition-colors" 
              onClick={() => {
                logout();
                router.push("/");
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
        <header className="h-20 bg-white border-b border-border/40 flex items-center justify-between px-6 lg:px-10 shadow-sm/5 z-40">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden -ml-2 text-muted-foreground hover:bg-muted rounded-full"
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            <div className="hidden md:flex items-center gap-3 text-muted-foreground bg-[#F0F2F5]/50 px-4 py-2.5 rounded-full border border-border/40 focus-within:border-primary/40 focus-within:bg-white transition-all w-64 lg:w-96 shadow-inner-sm">
              <Search className="h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search resources, bookings..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/60 text-foreground font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="relative p-2.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-white" />
             </button>
             <div className="h-8 w-px bg-border/50 mx-1" />
             <Link href="/" className="text-xs font-bold text-primary hover:underline px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors">
                View Site
             </Link>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8 lg:py-12">
            <div className="mb-10">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
              {description && <p className="text-base text-muted-foreground mt-2 font-medium max-w-2xl">{description}</p>}
            </div>
            {children}
          </div>

          {/* Admin Footer */}
          <footer className="mt-auto pt-8 border-t border-border/40 text-center space-y-2 pb-10 px-6 lg:px-10">
            <p className="text-sm font-bold text-foreground/80">Nearby Escapes Admin Panel</p>
            <p className="text-xs text-muted-foreground">© 2026 Nearby Escapes. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 pt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Link href="/admin/help" className="hover:text-primary transition-colors">Help Center</Link>
              <span className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
              <Link href="/admin/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <span className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
              <Link href="/admin/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
