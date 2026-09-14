"use client";

import { useState, useMemo } from "react";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  CalendarDays,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockMonthlyData, mockPlatformStats } from "@/lib/mock-admin-data";
import { useLoading, withLoading } from "@/lib/loading-context";
import { toastReportExported } from "@/lib/admin-toast";
import { toast } from "sonner";

// Metric Card

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-neutral-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-xl bg-purple/10 text-purple border border-purple/15 flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-neutral-900">{value}</p>
      {change && (
        <p
          className={cn(
            "text-xs font-semibold mt-1 flex items-center gap-0.5",
            positive ? "text-emerald-600" : "text-rose-600",
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {change} vs last year
        </p>
      )}
    </div>
  );
}

// Main Component

export function AdminReports() {
  const { setLoading, setLoadingMessage } = useLoading();
  const [period, setPeriod] = useState<"12m" | "6m" | "3m">("12m");

  const stats = mockPlatformStats;
  const monthlyData = useMemo(() => {
    const data = [...mockMonthlyData];
    if (period === "6m") return data.slice(-6);
    if (period === "3m") return data.slice(-3);
    return data;
  }, [period]);

  // Cumulative
  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const totalCommission = monthlyData.reduce((sum, m) => sum + m.commission, 0);
  const totalBookings = monthlyData.reduce((sum, m) => sum + m.newBookings, 0);
  const totalNewUsers = monthlyData.reduce((sum, m) => sum + m.newUsers, 0);

  // Growth
  const midPoint = Math.floor(monthlyData.length / 2);
  const firstHalf = monthlyData.slice(0, midPoint);
  const secondHalf = monthlyData.slice(midPoint);
  const revenueGrowth =
    firstHalf.length && secondHalf.length
      ? (
          ((secondHalf.reduce((s, m) => s + m.revenue, 0) -
            firstHalf.reduce((s, m) => s + m.revenue, 0)) /
            firstHalf.reduce((s, m) => s + m.revenue, 0)) *
          100
        ).toFixed(1)
      : "0";
  const bookingGrowth =
    firstHalf.length && secondHalf.length
      ? (
          ((secondHalf.reduce((s, m) => s + m.newBookings, 0) -
            firstHalf.reduce((s, m) => s + m.newBookings, 0)) /
            firstHalf.reduce((s, m) => s + m.newBookings, 0)) *
          100
        ).toFixed(1)
      : "0";

  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);
  const maxBookings = Math.max(...monthlyData.map((m) => m.newBookings), 1);

  const handleExportCSV = () => {
    withLoading(
      setLoading,
      setLoadingMessage,
      async () => {
        await new Promise((r) => setTimeout(r, 600));
        const headers = ["Month", "Gross Revenue (ZMW)", "Commission (ZMW)", "Bookings", "New Users"];
        const rows = monthlyData.map((m) => [
          m.month,
          m.revenue,
          m.commission,
          m.newBookings,
          m.newUsers,
        ]);

        const csvContent =
          "data:text/csv;charset=utf-8," +
          [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `nearbyescapes-report-${period}-${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toastReportExported();
      },
      "Generating financial report CSV...",
    );
  };

  return (
    <div className="flex-1 min-h-screen bg-neutral-50/50 pb-16">
      <AdminPageHeader
        eyebrow="Business Intelligence"
        title="Reports & Analytics"
        description="Comprehensive financial performance, margins, and growth trends"
        actions={
          <div className="flex items-center gap-2.5">
            <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
              <SelectTrigger className="w-[140px] h-9 rounded-xl border-neutral-200/80 bg-white text-xs font-semibold shadow-2xs">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="12m">Last 12 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl text-xs font-semibold border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 shadow-2xs"
              onClick={handleExportCSV}
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-neutral-500" /> Export CSV
            </Button>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <MetricCard
            icon={DollarSign}
            label="Gross Volume"
            value={`K${(totalRevenue / 1000).toFixed(0)}k`}
            change={`${revenueGrowth}%`}
            positive={Number(revenueGrowth) > 0}
          />
          <MetricCard
            icon={BarChart3}
            label="Commission Earned"
            value={`K${(totalCommission / 1000).toFixed(0)}k`}
            change={`${((stats.platformCommission / stats.totalRevenue) * 100).toFixed(0)}% rate`}
            positive
          />
          <MetricCard
            icon={CalendarDays}
            label="Total Bookings"
            value={totalBookings.toLocaleString()}
            change={`${bookingGrowth}%`}
            positive={Number(bookingGrowth) > 0}
          />
          <MetricCard
            icon={Users}
            label="New Signups"
            value={totalNewUsers.toLocaleString()}
            change={`+${stats.growthRate}% monthly avg`}
            positive
          />
        </div>

        {/* Revenue vs Bookings Chart */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">
                Revenue & Bookings Trend
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">Month-over-month performance analysis</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-purple" /> Platform Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> Bookings
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-52 pt-4">
            {monthlyData.map((m) => {
              const revHeight = (m.revenue / maxRevenue) * 100;
              const bkgHeight = (m.newBookings / maxBookings) * 100;
              return (
                <div
                  key={m.month}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div className="w-full flex items-end justify-center gap-1">
                    <div
                      className="w-3.5 rounded-t-md bg-purple/75 transition-all duration-200 cursor-pointer group-hover:bg-purple"
                      style={{ height: `${Math.max(revHeight, 4)}%` }}
                    />
                    <div
                      className="w-3.5 rounded-t-md bg-blue-400 transition-all duration-200 cursor-pointer group-hover:bg-blue-600"
                      style={{ height: `${Math.max(bkgHeight, 4)}%` }}
                    />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none z-10 shadow-md">
                    K{(m.revenue / 1000).toFixed(0)}k · {m.newBookings} bookings
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-500 mt-1">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Breakdown */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900">
                Monthly Breakdown Table
              </h3>
              <span className="text-xs text-neutral-400">{monthlyData.length} billing cycles</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="text-left px-5 py-3 font-semibold uppercase tracking-wider text-neutral-500">
                      Month
                    </th>
                    <th className="text-right px-5 py-3 font-semibold uppercase tracking-wider text-neutral-500">
                      Revenue
                    </th>
                    <th className="text-right px-5 py-3 font-semibold uppercase tracking-wider text-neutral-500">
                      Commission
                    </th>
                    <th className="text-right px-5 py-3 font-semibold uppercase tracking-wider text-neutral-500">
                      Bookings
                    </th>
                    <th className="text-right px-5 py-3 font-semibold uppercase tracking-wider text-neutral-500">
                      Users
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {monthlyData.map((m) => (
                    <tr
                      key={m.month}
                      className="hover:bg-neutral-50/60 transition-colors"
                    >
                      <td className="px-5 py-3 font-semibold text-neutral-900">{m.month}</td>
                      <td className="px-5 py-3 text-right font-medium text-neutral-900">
                        K{(m.revenue / 1000).toFixed(0)}k
                      </td>
                      <td className="px-5 py-3 text-right text-purple font-medium">
                        K{(m.commission / 1000).toFixed(0)}k
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-neutral-700">{m.newBookings}</td>
                      <td className="px-5 py-3 text-right text-neutral-500">{m.newUsers}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-neutral-200/80 bg-neutral-50/80">
                    <td className="px-5 py-3 font-semibold text-neutral-900">Total</td>
                    <td className="px-5 py-3 text-right font-semibold text-neutral-900">
                      K{(totalRevenue / 1000).toFixed(0)}k
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-purple">
                      K{(totalCommission / 1000).toFixed(0)}k
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-neutral-900">{totalBookings}</td>
                    <td className="px-5 py-3 text-right font-semibold text-neutral-600">{totalNewUsers}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Key Insights & Quick Stats */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                Key Strategic Insights
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
                  <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-900">Positive Growth Trajectory</p>
                    <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                      Revenue has expanded {revenueGrowth}% over the selected period. Peak monthly volume was in July with K
                      {monthlyData
                        .reduce((max, m) => (m.revenue > max.revenue ? m : max), monthlyData[0])
                        .revenue.toLocaleString()} transacted.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60">
                  <Users className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900">User Network Expansion</p>
                    <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                      Platform boasts {stats.totalGuests} registered guests and {stats.totalHosts} active hosts across Zambia, sustaining a {stats.growthRate}% monthly new user growth rate.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple/5 border border-purple/15">
                  <BarChart3 className="h-4 w-4 text-purple shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-purple">High Booking Conversion</p>
                    <p className="text-xs text-purple/80 mt-0.5 leading-relaxed">
                      {((stats.completedBookings / stats.totalBookings) * 100).toFixed(0)}% completion rate across {stats.totalBookings.toLocaleString()} total platform bookings processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs text-center">
                <p className="text-xs font-medium text-neutral-500 mb-1">
                  Avg Revenue / Mo
                </p>
                <p className="text-xl font-semibold text-neutral-900">
                  K{(totalRevenue / monthlyData.length / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs text-center">
                <p className="text-xs font-medium text-neutral-500 mb-1">
                  Avg Bookings / Mo
                </p>
                <p className="text-xl font-semibold text-neutral-900">
                  {Math.round(totalBookings / monthlyData.length)}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs text-center">
                <p className="text-xs font-medium text-neutral-500 mb-1">
                  Platform Margin
                </p>
                <p className="text-xl font-semibold text-purple">
                  {((stats.platformCommission / stats.totalRevenue) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs text-center">
                <p className="text-xs font-medium text-neutral-500 mb-1">
                  Guest Satisfaction
                </p>
                <p className="text-xl font-semibold text-emerald-600">{stats.avgRating} ★</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
