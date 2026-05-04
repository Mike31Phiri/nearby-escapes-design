"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, DollarSign, MessageSquare,
  ChartBar as BarChart3, Hop as Home, Star, Plus, TrendingUp,
  Users, ArrowRight, Compass, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const hostNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/host" },
  { label: "Properties", icon: Home, href: "/host/properties" },
  { label: "Calendar", icon: CalendarDays, href: "/host/calendar" },
  { label: "Earnings", icon: DollarSign, href: "/host/earnings" },
  { label: "Inbox", icon: MessageSquare, href: "/host/inbox" },
  { label: "Feedback", icon: Star, href: "/host/feedback" },
  { label: "Performance", icon: BarChart3, href: "/host/performance" },
];

const stats = [
  { label: "Active listings", value: "3", icon: Home, color: "text-primary bg-primary-soft" },
  { label: "Occupancy rate", value: "74%", icon: TrendingUp, color: "text-primary bg-primary-soft" },
  { label: "Monthly revenue", value: "$4.8k", icon: DollarSign, color: "text-primary bg-primary-soft" },
  { label: "Guests this month", value: "18", icon: Users, color: "text-primary bg-primary-soft" },
];

const recentBookings = [
  { guest: "Sarah M.", property: "Mosi-oa-Tunya Lodge", dates: "Apr 28 – May 1", status: "Confirmed" },
  { guest: "James K.", property: "Kafue Eco Lodge", dates: "May 3 – May 7", status: "Pending" },
  { guest: "Anna L.", property: "Mosi-oa-Tunya Lodge", dates: "May 10 – May 14", status: "Confirmed" },
];

export function HostSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0">
      <nav className="sticky top-24 space-y-1">
        {hostNav.map(({ label, icon: Icon, href }) => {
          const active = href === "/host" ? pathname === "/host" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function HostMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
      {hostNav.map(({ label, icon: Icon, href }) => {
        const active = href === "/host" ? pathname === "/host" : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all shrink-0",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-primary-soft hover:text-primary"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function HostDashboardPage() {
  const router = useRouter();
  const { user, becomeHost } = useAuth();

  if (user && user.role === "guest") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 md:px-6 md:py-24">
          <div className="text-center mb-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-6">
              <Home className="h-7 w-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Become a host</h1>
            <p className="mt-3 text-base text-muted-foreground max-w-md mx-auto">
              List your lodge, guesthouse, transport route or local experience and earn from travelers exploring Zambia.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            {[
              { icon: Sparkles, title: "Easy listing", body: "A guided wizard gets your first property live in minutes." },
              { icon: DollarSign, title: "Payouts in ZMW or USD", body: "Bank or mobile money — choose what works for you." },
              { icon: Star, title: "Built-in trust", body: "Verified guests, secure payments and 24/7 support." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border/60 bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="bg-[image:var(--gradient-hero)] hover:opacity-95 w-full sm:w-auto"
              onClick={() => { becomeHost(); toast.success("You're now a host! Welcome aboard 🎉"); }}>
              Activate host account
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/help">Learn how it works</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Page header band */}
      <div className="border-b border-border/50 bg-primary-soft/30">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-8 md:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Host</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Track listings, reservations and earnings.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                <Link href="/"><Compass className="h-4 w-4 mr-2" /> Traveler mode</Link>
              </Button>
              <Button onClick={() => router.push("/host/new-listing")} className="bg-[image:var(--gradient-hero)] hover:opacity-95">
                <Plus className="h-4 w-4 mr-2" /> New listing
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <HostMobileNav />
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 md:px-6 py-10">
        <div className="flex gap-10">
          <HostSidebar />

          <div className="flex-1 min-w-0 space-y-10">
            {/* Stats */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Overview</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                  <Card key={label} className="border-border/60">
                    <CardContent className="p-6">
                      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl mb-4", color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-3xl font-bold tracking-tight">{value}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent bookings */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent bookings</p>
                <Link href="/host/calendar" className="text-xs font-medium text-primary hover:underline">View all</Link>
              </div>
              <Card className="border-border/60">
                <CardContent className="p-0 divide-y divide-border/50">
                  {recentBookings.map((b, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary text-sm font-bold shrink-0">
                          {b.guest.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{b.guest}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{b.property} · {b.dates}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs font-semibold px-3 py-1 rounded-full",
                        b.status === "Confirmed" ? "bg-primary-soft text-primary" : "bg-accent/20 text-accent-foreground"
                      )}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Quick actions */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Quick actions</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Manage properties", desc: "Edit pricing, photos, availability or description.", href: "/host/properties" },
                  { title: "View earnings", desc: "Payout history, upcoming payments and monthly breakdowns.", href: "/host/earnings" },
                ].map(({ title, desc, href }) => (
                  <Card key={href} className="border-border/60">
                    <CardContent className="p-6">
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
                      <Link href={href}>
                        <Button variant="outline" size="sm" className="mt-4">
                          Go <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Perk({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/40 p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
