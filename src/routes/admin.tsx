import { createFileRoute, Link, Outlet, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  Percent,
  Settings as SettingsIcon,
  ShieldCheck,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const sid = localStorage.getItem("ne.session");
    if (!sid) {
      throw redirect({ to: "/login", search: { redirect: location.href } as never });
    }
    try {
      const users = JSON.parse(localStorage.getItem("ne.users") || "[]");
      const me = users.find((u: { id: string; role?: string }) => u.id === sid);
      if (!me || me.role !== "admin") {
        throw redirect({ to: "/" });
      }
    } catch (e) {
      // re-throw redirects, swallow JSON errors
      if (e && typeof e === "object" && "to" in e) throw e;
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin — Nearby Escapes" },
      { name: "description", content: "Manage users, bookings, payments and commissions for Nearby Escapes." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

const navItems = [
  { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users" as const, label: "Users", icon: Users },
  { to: "/admin/bookings" as const, label: "Bookings", icon: CalendarCheck },
  { to: "/admin/payments" as const, label: "Payments", icon: CreditCard },
  { to: "/admin/commissions" as const, label: "Commissions", icon: Percent },
  { to: "/admin/settings" as const, label: "Settings", icon: SettingsIcon },
];

function AdminLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-background">
        <div className="px-5 py-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-bold shadow-[var(--shadow-elegant)]">
              N
            </div>
            <div className="leading-tight">
              <p className="font-bold text-sm">Nearby Escapes</p>
              <p className="text-[10px] uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Admin
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back to site
          </Link>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-border bg-background/90 backdrop-blur px-4 py-3">
          <Link to="/admin" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Admin</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Site
          </Button>
        </header>

        {/* Mobile horizontal nav */}
        <div className="md:hidden border-b border-border bg-background overflow-x-auto">
          <nav className="flex gap-1 px-3 py-2 min-w-max">
            {navItems.map(({ to, label, icon: Icon, exact }) => {
              const active = isActive(to, exact);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                    active ? "bg-primary-soft text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
          <div className="hidden md:flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="text-sm font-semibold">{user?.fullName} · {user?.email}</p>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
