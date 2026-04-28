import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, DollarSign, MessageSquare, ChartBar as BarChart3, Hop as Home, Star, Plus, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const hostNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/host" },
  { label: "Properties", icon: Home, to: "/host/properties" },
  { label: "Calendar", icon: CalendarDays, to: "/host/calendar" },
  { label: "Earnings", icon: DollarSign, to: "/host/earnings" },
  { label: "Inbox", icon: MessageSquare, to: "/host/inbox" },
  { label: "Feedback", icon: Star, to: "/host/feedback" },
  { label: "Performance", icon: BarChart3, to: "/host/performance" },
];

const stats = [
  { label: "Active listings", value: "3", icon: Home },
  { label: "Occupancy rate", value: "74%", icon: TrendingUp },
  { label: "Monthly revenue", value: "$4.8k", icon: DollarSign },
  { label: "Guests this month", value: "18", icon: Users },
];

const recentBookings = [
  { guest: "Sarah M.", property: "Mosi-oa-Tunya Lodge", dates: "Apr 28 - May 1", status: "Confirmed" },
  { guest: "James K.", property: "Kafue Eco Lodge", dates: "May 3 - May 7", status: "Pending" },
  { guest: "Anna L.", property: "Mosi-oa-Tunya Lodge", dates: "May 10 - May 14", status: "Confirmed" },
];

export function HostDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-display">Host dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track listings, reservations and earnings.
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: "/host/new-property/step-1" })}
            className="bg-[image:var(--gradient-hero)] hover:opacity-95 shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" /> New listing
          </Button>
        </div>

        {/* Host subnav */}
        <nav className="flex gap-1 overflow-x-auto scrollbar-none pb-4 border-b border-border/50 mb-6">
          {hostNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-primary-soft hover:text-primary transition-[var(--transition-smooth)] whitespace-nowrap"
                activeProps={{ className: "bg-primary-soft text-primary" }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-border/60">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold tracking-tight">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent bookings */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Recent bookings</h2>
            <Link to="/host/calendar" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <Card className="border-border/60">
            <CardContent className="p-0 divide-y divide-border/50">
              {recentBookings.map((booking, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      {booking.guest.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{booking.guest}</p>
                      <p className="text-xs text-muted-foreground">{booking.property} &middot; {booking.dates}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      booking.status === "Confirmed"
                        ? "bg-primary-soft text-primary"
                        : "bg-accent/20 text-accent-foreground"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm">Need to update a listing?</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Edit pricing, photos, availability or description for any property.
              </p>
              <Link to="/host/properties">
                <Button variant="outline" size="sm" className="mt-3">
                  Manage properties <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <h3 className="font-semibold text-sm">Check your earnings</h3>
              <p className="text-xs text-muted-foreground mt-1">
                View payout history, upcoming payments and monthly breakdowns.
              </p>
              <Link to="/host/earnings">
                <Button variant="outline" size="sm" className="mt-3">
                  View earnings <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
