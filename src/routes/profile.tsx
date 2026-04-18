import { createFileRoute, Link, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { Home, Briefcase, Settings as SettingsIcon } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/profile")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const sid = localStorage.getItem("ne.session");
    if (!sid) {
      throw redirect({ to: "/login", search: { redirect: location.href } as never });
    }
  },
  head: () => ({
    meta: [
      { title: "Your profile — Nearby Escapes" },
      { name: "description", content: "Manage your Nearby Escapes profile, bookings and host listings." },
    ],
  }),
  component: ProfileLayout,
});

function ProfileLayout() {
  const { pathname } = useLocation();
  const isHost = pathname.startsWith("/profile/host");
  const isSettings = pathname.startsWith("/profile/settings");
  const isOverview = !isHost && !isSettings;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-8">
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="space-y-1">
            <SideLink to="/profile" icon={Home} label="Overview" active={isOverview} />
            <SideLink to="/profile/host" icon={Briefcase} label="Host dashboard" active={isHost} />
            <SideLink to="/profile/settings" icon={SettingsIcon} label="Settings" active={isSettings} />
          </aside>
          <section className="min-w-0">
            <Outlet />
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SideLink({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
