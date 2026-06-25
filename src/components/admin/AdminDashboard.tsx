"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  CalendarDays,
  AlertTriangle,
  ArrowRight,
  Activity,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Scale,
  Sparkles,
  Settings,
} from "lucide-react";
import { mockDisputes } from "@/lib/mock-admin-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  mockPlatformStats,
  mockMonthlyData,
  mockActivityLogs,
  mockPendingListings,
  mockAdminUsers,
} from "@/lib/mock-admin-data";
import type { ActivityLog } from "@/lib/mock-admin-data";

//Stat Card ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  accent,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  trend?: { value: string; positive: boolean };
  accent?: string;
  href?: string;
}) {
  const content = (
    <div className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-sm card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: accent ? `${accent}1a` : "var(--primary)1a",
          color: accent ?? "var(--primary)",
        }}
      >
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {sub && <p className="text-[11px] text-muted-foreground/70 mt-0.5">{sub}</p>}
        {trend && (
          <p
            className={cn(
              "text-[10px] font-bold mt-0.5 flex items-center gap-0.5",
              trend.positive ? "text-emerald-600" : "text-destructive",
            )}
          >
            <TrendingUp className={cn("h-3 w-3", !trend.positive && "rotate-180")} />
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

//Activity Item ──────────────────────────────────────────────────────

function ActivityItem({ log }: { log: ActivityLog }) {
  const typeColors: Record<string, string> = {
    booking: "bg-blue-100 text-blue-600",
    listing: "bg-emerald-100 text-emerald-600",
    user: "bg-violet-100 text-violet-600",
    payment: "bg-amber-100 text-amber-600",
    report: "bg-rose-100 text-rose-600",
    system: "bg-zinc-100 text-zinc-600",
  };

  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div
        className={cn(
          "h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold",
          typeColors[log.type],
        )}
      >
        {log.type === "booking"
          ? "B"
          : log.type === "listing"
            ? "L"
            : log.type === "user"
              ? "U"
              : log.type === "payment"
                ? "$"
                : log.type === "report"
                  ? "!"
                  : "S"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          <span className="font-semibold">{log.user}</span>{" "}
          <span className="text-muted-foreground">{log.action.toLowerCase()}</span>
          {log.target && (
            <>
              {" "}
              <span className="text-muted-foreground">—</span>{" "}
              <span className="font-medium">{log.target}</span>
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Date(log.timestamp).toLocaleDateString("en-ZM", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

//Main Component ─────────────────────────────────────────────────────

export function AdminDashboard() {
  const stats = mockPlatformStats;
  const pendingListings = mockPendingListings.filter((l) => l.status === "pending_review");
  const pendingUsers = mockAdminUsers.filter((u) => u.status === "pending verification");

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="flex-1">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-8">
          <div className="mx-auto max-w-7xl px-4 md:px-6 pt-6 md:pt-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Overview of all platform activity and metrics
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs font-semibold border-border/60"
                >
                  <CalendarDays className="h-3.5 w-3.5 mr-1" />
                  {new Date().toLocaleDateString("en-ZM", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mx-auto max-w-7xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers.toLocaleString()}
              sub={`${stats.totalGuests} guests · ${stats.totalHosts} hosts`}
              trend={{ value: `${stats.growthRate}% this month`, positive: true }}
              accent="#3b82f6"
              href="/admin/users"
            />
            <StatCard
              icon={Building2}
              label="Total Listings"
              value={stats.totalListings.toLocaleString()}
              sub={`${stats.activeListings} active · ${stats.pendingModeration} pending review`}
              accent="#10b981"
              href="/admin/listings"
            />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={`K${(stats.totalRevenue / 1000).toFixed(0)}k`}
              sub={`K${(stats.platformCommission / 1000).toFixed(0)}k commission`}
              accent="#f59e0b"
              href="/admin/reports"
            />
            <StatCard
              icon={CalendarDays}
              label="Total Bookings"
              value={stats.totalBookings.toLocaleString()}
              sub={`${stats.completedBookings} completed`}
              trend={{
                value: `${((stats.completedBookings / stats.totalBookings) * 100).toFixed(0)}% completion rate`,
                positive: true,
              }}
              accent="#8b5cf6"
              href="/admin/bookings"
            />
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingListings.length > 0 && (
              <Link
                href="/admin/listings"
                className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30 px-5 py-3 transition-all hover:shadow-md"
              >
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
                    {pendingListings.length} listing{pendingListings.length > 1 ? "s" : ""} pending
                    moderation
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    Review and approve new submissions
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-amber-500 shrink-0" />
              </Link>
            )}
            {pendingUsers.length > 0 && (
              <Link
                href="/admin/users"
                className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/50 dark:border-violet-800 dark:bg-violet-950/30 px-5 py-3 transition-all hover:shadow-md"
              >
                <Users className="h-5 w-5 text-violet-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-violet-800 dark:text-violet-200">
                    {pendingUsers.length} user{pendingUsers.length > 1 ? "s" : ""} pending
                    verification
                  </p>
                  <p className="text-xs text-violet-600 dark:text-violet-400">
                    New accounts awaiting identity confirmation
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-violet-500 shrink-0" />
              </Link>
            )}
            {stats.reportedListings > 0 && (
              <Link
                href="/admin/listings"
                className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/50 dark:border-rose-800 dark:bg-rose-950/30 px-5 py-3 transition-all hover:shadow-md"
              >
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-rose-800 dark:text-rose-200">
                    {stats.reportedListings} reported listing{stats.reportedListings > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-rose-600 dark:text-rose-400">
                    Flagged content requires review
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-rose-500 shrink-0" />
              </Link>
            )}
          </div>
        </div>

        {/* Main Grid: Chart + Activity */}
        <div className="mx-auto max-w-7xl px-4 md:px-6 mt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Revenue Chart */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm card-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                      Monthly Revenue
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Platform earnings over the last 12 months
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-primary/60" /> Revenue
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-amber-400/60" /> Commission
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2 h-52">
                  {mockMonthlyData.map((m) => {
                    const maxRev = Math.max(...mockMonthlyData.map((d) => d.revenue), 1);
                    const maxComm = Math.max(...mockMonthlyData.map((d) => d.commission), 1);
                    const revHeight = (m.revenue / maxRev) * 100;
                    const commHeight = (m.commission / maxComm) * 100;
                    return (
                      <div
                        key={m.month}
                        className="flex-1 flex flex-col items-center gap-0.5 group relative"
                      >
                        <div className="w-full flex items-end justify-center gap-[2px]">
                          <div
                            className="w-3 rounded-t-md bg-primary/60 transition-all duration-200 cursor-pointer group-hover:bg-primary/80"
                            style={{ height: `${Math.max(revHeight, 3)}%` }}
                          />
                          <div
                            className="w-3 rounded-t-md bg-amber-400/60 transition-all duration-200 cursor-pointer group-hover:bg-amber-400/80"
                            style={{ height: `${Math.max(commHeight, 3)}%` }}
                          />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10">
                          K{(m.revenue / 1000).toFixed(0)}k revenue
                        </div>
                        <span className="text-[9px] font-semibold text-muted-foreground mt-1">
                          {m.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm card-shadow">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Avg. Rating
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-3xl font-bold text-foreground">{stats.avgRating}</p>
                    <span className="text-sm text-muted-foreground">/ 5</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    Across all listings
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm card-shadow">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Monthly Growth
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-3xl font-bold text-emerald-600">+{stats.growthRate}%</p>
                  </div>
                  <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> New user registrations
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm card-shadow">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Commission Rate
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {((stats.platformCommission / stats.totalRevenue) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">
                    Effective platform fee
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm card-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                    Recent Activity
                  </h3>
                </div>
              </div>
              <div className="divide-y divide-border/30">
                {mockActivityLogs.slice(0, 8).map((log) => (
                  <ActivityItem key={log.id} log={log} />
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border/30">
                <Link
                  href="/admin"
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                >
                  View all activity <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Access — All Admin Tools */}
          <div className="mt-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-5">
              All Admin Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Users,
                  label: "User Management",
                  desc: "Manage guests, hosts & admins",
                  href: "/admin/users",
                  color: "#3b82f6",
                },
                {
                  icon: Building2,
                  label: "Listing Moderation",
                  desc: "Approve & review listings",
                  href: "/admin/listings",
                  color: "#10b981",
                },
                {
                  icon: CalendarDays,
                  label: "Booking Oversight",
                  desc: "Platform-wide bookings",
                  href: "/admin/bookings",
                  color: "#8b5cf6",
                },
                {
                  icon: Scale,
                  label: "Disputes & Resolution",
                  desc: "Handle guest-host conflicts",
                  href: "/admin/disputes",
                  color: "#ef4444",
                },
                {
                  icon: DollarSign,
                  label: "Payout Management",
                  desc: "Process host payments",
                  href: "/admin/payouts",
                  color: "#10b981",
                },
                {
                  icon: Sparkles,
                  label: "Promotions",
                  desc: "Promo codes & featured listings",
                  href: "/admin/promotions",
                  color: "#f59e0b",
                },
                {
                  icon: Activity,
                  label: "Activity Log",
                  desc: "Full audit trail",
                  href: "/admin/activity",
                  color: "#6b7280",
                },
                {
                  icon: BarChart3,
                  label: "Reports & Analytics",
                  desc: "Financial & growth metrics",
                  href: "/admin/reports",
                  color: "#f59e0b",
                },
              ].map(({ icon: Icon, label, desc, href, color }) => (
                <Link
                  key={label}
                  href={href}
                  className="group rounded-xl border border-border/50 bg-card p-5 shadow-sm card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20"
                >
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${color}1a`, color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
