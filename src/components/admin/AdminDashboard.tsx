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
import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import { cn } from "@/lib/utils";
import {
  mockPlatformStats,
  mockMonthlyData,
  mockActivityLogs,
  mockPendingListings,
  mockAdminUsers,
} from "@/lib/mock-admin-data";
import type { ActivityLog } from "@/lib/mock-admin-data";

// Stat Card

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
    <div className="group flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-purple/30">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200"
        style={{
          backgroundColor: accent ? `${accent}14` : "rgba(107, 33, 168, 0.08)",
          color: accent ?? "#6b21a8",
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-semibold tracking-tight text-neutral-900">{value}</p>
        <p className="text-xs font-medium text-neutral-500 mt-0.5">
          {label}
        </p>
        {sub && <p className="text-[11px] text-neutral-400 mt-0.5">{sub}</p>}
        {trend && (
          <p
            className={cn(
              "text-[11px] font-semibold mt-1 flex items-center gap-0.5",
              trend.positive ? "text-emerald-700" : "text-rose-600",
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

// Activity Item

function ActivityItem({ log }: { log: ActivityLog }) {
  const typeColors: Record<string, string> = {
    booking: "bg-blue-50 text-blue-700 border-blue-150",
    listing: "bg-emerald-50 text-emerald-700 border-emerald-150",
    user: "bg-purple/10 text-purple border-purple/20",
    payment: "bg-amber-50 text-amber-700 border-amber-150",
    report: "bg-rose-50 text-rose-700 border-rose-150",
    system: "bg-neutral-100 text-neutral-700 border-neutral-200",
  };

  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <div
        className={cn(
          "h-7 w-7 shrink-0 rounded-lg border flex items-center justify-center text-xs font-semibold uppercase",
          typeColors[log.type] || "bg-neutral-100 text-neutral-700",
        )}
      >
        {log.type.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-neutral-900 leading-snug">
          <span className="font-semibold text-neutral-800">{log.user}</span>{" "}
          <span className="text-neutral-600">{log.action}</span>
          {log.target && (
            <>
              {" "}
              <span className="text-neutral-400">·</span>{" "}
              <span className="font-medium text-neutral-700">{log.target}</span>
            </>
          )}
        </p>
        <p className="text-[11px] text-neutral-400 mt-0.5">
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

// Main Component

export function AdminDashboard() {
  const stats = mockPlatformStats;
  const pendingListingsCount = mockPendingListings.filter((l) => l.status === "pending_review").length;
  const openDisputesCount = mockDisputes.filter((d) => d.status === "open" || d.status === "investigating").length;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background pb-16">
      <div className="flex-1">
        <AdminPageHeader
          eyebrow="Operations"
          title="Dashboard"
          description="Overview of all platform activity, moderation queues, and metrics."
          actions={
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-600 bg-neutral-50 border border-neutral-200/80">
                <CalendarDays className="h-3.5 w-3.5 text-neutral-500" />
                {new Date().toLocaleDateString("en-ZM", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <Link
                href="/admin/listings"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple text-white hover:bg-purple-hover transition-colors shadow-xs"
              >
                Review Submissions
              </Link>
            </div>
          }
        />

        {/* Triage Action Banner */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-6">
          <div className="rounded-2xl border border-purple/20 bg-purple/[0.03] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-purple/10 text-purple border border-purple/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Administrator Daily Triage</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {pendingListingsCount} listings awaiting review · {openDisputesCount} active disputes requiring moderation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin/listings"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-neutral-200/80 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                Listings ({pendingListingsCount})
              </Link>
              <Link
                href="/admin/disputes"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-neutral-200/80 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                Disputes ({openDisputesCount})
              </Link>
              <Link
                href="/admin/payouts"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-neutral-200/80 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                Payouts
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers.toLocaleString()}
              sub={`${stats.totalGuests} guests · ${stats.totalHosts} hosts`}
              trend={{ value: `${stats.growthRate}% this month`, positive: true }}
              accent="#2563eb"
              href="/admin/users"
            />
            <StatCard
              icon={Building2}
              label="Total Listings"
              value={stats.totalListings.toLocaleString()}
              sub={`${stats.activeListings} active · ${stats.pendingModeration} pending`}
              accent="#059669"
              href="/admin/listings"
            />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={`K${(stats.totalRevenue / 1000).toFixed(0)}k`}
              sub={`K${(stats.platformCommission / 1000).toFixed(0)}k commission`}
              accent="#d97706"
              href="/admin/reports"
            />
            <StatCard
              icon={CalendarDays}
              label="Total Bookings"
              value={stats.totalBookings.toLocaleString()}
              sub={`${stats.completedBookings} completed`}
              trend={{
                value: `${((stats.completedBookings / stats.totalBookings) * 100).toFixed(0)}% completion`,
                positive: true,
              }}
              accent="#7c3aed"
              href="/admin/bookings"
            />
          </div>
        </div>

        {/* Main Grid: Chart & Activity Feed */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Revenue Chart */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900">
                      Monthly Revenue & Commission
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Platform earnings over the last 12 months (ZMW)
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-purple" /> Gross Revenue
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> Platform Fee
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-2 h-52 pt-4">
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
                        <div className="w-full flex items-end justify-center gap-1">
                          <div
                            className="w-2.5 sm:w-3.5 rounded-t-sm bg-purple/70 transition-all duration-200 cursor-pointer group-hover:bg-purple"
                            style={{ height: `${Math.max(revHeight, 4)}%` }}
                          />
                          <div
                            className="w-2.5 sm:w-3.5 rounded-t-sm bg-amber-400/80 transition-all duration-200 cursor-pointer group-hover:bg-amber-400"
                            style={{ height: `${Math.max(commHeight, 4)}%` }}
                          />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10 shadow-sm">
                          K{(m.revenue / 1000).toFixed(0)}k gross
                        </div>
                        <span className="text-[10px] font-medium text-neutral-500 mt-2">
                          {m.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs">
                  <p className="text-xs font-medium text-neutral-500 mb-1">
                    Avg. Listing Rating
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-2xl font-semibold text-neutral-900">{stats.avgRating}</p>
                    <span className="text-xs text-neutral-400">/ 5.0</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Quality score across verified stays
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs">
                  <p className="text-xs font-medium text-neutral-500 mb-1">
                    Monthly Growth
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-2xl font-semibold text-emerald-700">+{stats.growthRate}%</p>
                  </div>
                  <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> User registration pace
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs">
                  <p className="text-xs font-medium text-neutral-500 mb-1">
                    Effective Commission
                  </p>
                  <p className="text-2xl font-semibold text-neutral-900">
                    {((stats.platformCommission / stats.totalRevenue) * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Average platform take rate
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple" />
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Live Audit Activity
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-purple bg-purple/10 border border-purple/15 px-2 py-0.5 rounded-md">
                  Real-time
                </span>
              </div>
              <div className="divide-y divide-neutral-100 flex-1">
                {mockActivityLogs.slice(0, 7).map((log) => (
                  <ActivityItem key={log.id} log={log} />
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 text-center">
                <Link
                  href="/admin/activity"
                  className="text-xs font-semibold text-purple hover:text-purple-hover transition-colors inline-flex items-center gap-1"
                >
                  View full audit log <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Access — Administrative Modules */}
          <div className="mt-8">
            <h3 className="text-base font-semibold text-neutral-900 mb-4">
              Administrative Modules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Users,
                  label: "User Directory",
                  desc: "Manage guests, hosts & permissions",
                  href: "/admin/users",
                  color: "#2563eb",
                },
                {
                  icon: Building2,
                  label: "Listing Moderation",
                  desc: "Approve, inspect & reject submissions",
                  href: "/admin/listings",
                  color: "#059669",
                },
                {
                  icon: CalendarDays,
                  label: "Booking Oversight",
                  desc: "Audit bookings & fee distributions",
                  href: "/admin/bookings",
                  color: "#7c3aed",
                },
                {
                  icon: Scale,
                  label: "Disputes & Resolution",
                  desc: "Handle guest claims & refunds",
                  href: "/admin/disputes",
                  color: "#e11d48",
                },
                {
                  icon: DollarSign,
                  label: "Payout Processing",
                  desc: "Disburse host mobile money & bank sums",
                  href: "/admin/payouts",
                  color: "#059669",
                },
                {
                  icon: Sparkles,
                  label: "Promotions & Codes",
                  desc: "Promo codes & featured listings",
                  href: "/admin/promotions",
                  color: "#d97706",
                },
                {
                  icon: Activity,
                  label: "Security & Audit Log",
                  desc: "Platform action history",
                  href: "/admin/activity",
                  color: "#475569",
                },
                {
                  icon: BarChart3,
                  label: "Financial Analytics",
                  desc: "Revenue & growth reporting",
                  href: "/admin/reports",
                  color: "#6b21a8",
                },
              ].map(({ icon: Icon, label, desc, href, color }) => (
                <Link
                  key={label}
                  href={href}
                  className="group rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-purple/30 hover:shadow-xs"
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200"
                    style={{ backgroundColor: `${color}14`, color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">{label}</p>
                  <p className="text-xs text-neutral-500 mt-1">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
