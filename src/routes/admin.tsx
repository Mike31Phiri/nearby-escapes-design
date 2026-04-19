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
  UserCircle,
  Menu,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  { to: "/admin/profile" as const, label: "Profile", icon: UserCircle },
  { to: "/admin/settings" as const, label: "Settings", icon: SettingsIcon },
];

function AdminLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const current = navItems.find((i) => isActive(i.to, i.exact)) ?? navItems[0];

  const NavMenu = ({ align = "start" as "start" | "end" }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Menu className="h-4 w-4" />
          <span className="font-medium">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel>Admin menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navItems.map(({ to, label, icon: Icon, exact }) => {
          const active = isActive(to, exact);
          return (
            <DropdownMenuItem key={to} asChild>
              <Link
                to={to}
                className={`flex items-center gap-2 cursor-pointer ${
                  active ? "text-primary font-semibold" : ""
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <ChevronLeft className="h-4 w-4" /> Back to site
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top bar (all sizes) */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-border bg-background/90 backdrop-blur px-4 md:px-6 py-3">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground font-bold shadow-[var(--shadow-elegant)]">
            N
          </div>
          <div className="leading-tight hidden sm:block">
            <p className="font-bold text-sm">Nearby Escapes</p>
            <p className="text-[10px] uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Admin
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden md:block text-right mr-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Signed in</p>
              <p className="text-xs font-semibold truncate max-w-[200px]">{user.email}</p>
            </div>
          )}
          <NavMenu align="end" />
        </div>
      </header>

      <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
