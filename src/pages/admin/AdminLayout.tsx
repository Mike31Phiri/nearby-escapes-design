import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  LayoutDashboard,
  Users,
  Home,
  CalendarCheck,
  Settings,
  LogOut,
  X,
  TrendingUp,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const navItems = [
  { to: "/admin/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/listings", label: "Listings", icon: Home },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      
      {/* Mobile menu button */}
      <div className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-muted-foreground">Admin Panel</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold">Admin Panel</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start text-destructive" asChild>
              <Link href="/" onClick={() => setSidebarOpen(false)}>
                <LogOut className="h-5 w-5 mr-2" />
                Exit Admin
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed inset-y-0 left-0 pt-[var(--header-height)]">
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-destructive" asChild>
            <Link href="/">
              <LogOut className="h-5 w-5 mr-2" />
              Exit Admin
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
