"use client";

import { useState, useMemo } from"react";
import {
 BarChart3,
 DollarSign,
 TrendingUp,
 Users,
 CalendarDays,
 Download,
 ArrowUpRight,
 ArrowDownRight,
} from"lucide-react";
import { Button } from"@/components/ui/button";
import { AdminPageHeader } from"@/components/layout/AdminPageHeader";
import { Badge } from"@/components/ui/badge";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";
import { cn } from"@/lib/utils";
import { mockMonthlyData, mockPlatformStats } from"@/lib/mock-admin-data";
import { useLoading, withLoading } from"@/lib/loading-context";
import { toastReportExported } from"@/lib/admin-toast";

//Metric Card ────────────────────────────────────────────────────────

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
 <div className="group rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md">
 <div className="flex items-center gap-3 mb-3">
 <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 group-">
 <Icon className="h-4.5 w-4.5"/>
 </div>
 <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
 {label}
 </span>
 </div>
 <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
 {change && (
 <p
 className={cn(
"text-sm font-semibold mt-1 flex items-center gap-0.5",
 positive ?"text-emerald-600":"text-destructive",
 )}
 >
 {positive ? (
 <ArrowUpRight className="h-3.5 w-3.5"/>
 ) : (
 <ArrowDownRight className="h-3.5 w-3.5"/>
 )}
 {change} vs last year
 </p>
 )}
 </div>
 );
}

//Main Component ─────────────────────────────────────────────────────

export function AdminReports() {
 const { setLoading, setLoadingMessage } = useLoading();
 const [period, setPeriod] = useState<"12m"|"6m"|"3m">("12m");

 const stats = mockPlatformStats;
 const monthlyData = useMemo(() => {
 const data = [...mockMonthlyData];
 if (period ==="6m") return data.slice(-6);
 if (period ==="3m") return data.slice(-3);
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
 :"0";
 const bookingGrowth =
 firstHalf.length && secondHalf.length
 ? (
 ((secondHalf.reduce((s, m) => s + m.newBookings, 0) -
 firstHalf.reduce((s, m) => s + m.newBookings, 0)) /
 firstHalf.reduce((s, m) => s + m.newBookings, 0)) *
 100
 ).toFixed(1)
 :"0";

 const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);
 const maxBookings = Math.max(...monthlyData.map((m) => m.newBookings), 1);

 return (
 <div className="flex-1 min-h-screen bg-[#faf9f5]">
 <AdminPageHeader
 eyebrow="Insights"
 title="Reports &amp; Analytics"
 description="Financial performance and growth metrics"
 actions={
 <div className="flex items-center gap-2">
 <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
 <SelectTrigger className="w-[130px] h-9 rounded-lg border-white/20 bg-white/10 text-white text-sm">
 <SelectValue placeholder="Period"/>
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
 className="h-9 rounded-lg text-sm font-semibold bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
 onClick={() =>
 withLoading(
 setLoading,
 setLoadingMessage,
 async () => {
 await new Promise((r) => setTimeout(r, 1000));
 toastReportExported();
 },
"Exporting report...",
 )
 }
 >
 <Download className="h-3.5 w-3.5 mr-1"/> Export
 </Button>
 </div>
 }
 />

 {/* Metric Cards */}
 <div className="mx-auto max-w-7xl px-4 md:px-6 -mt-6 relative z-10">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
 <MetricCard
 icon={DollarSign}
 label="Revenue"
 value={`K${(totalRevenue / 1000).toFixed(0)}k`}
 change={`${revenueGrowth}%`}
 positive={Number(revenueGrowth) > 0}
 />
 <MetricCard
 icon={BarChart3}
 label="Commission"
 value={`K${(totalCommission / 1000).toFixed(0)}k`}
 change={`${((stats.platformCommission / stats.totalRevenue) * 100).toFixed(0)}% rate`}
 positive
 />
 <MetricCard
 icon={CalendarDays}
 label="Bookings"
 value={totalBookings.toLocaleString()}
 change={`${bookingGrowth}%`}
 positive={Number(bookingGrowth) > 0}
 />
 <MetricCard
 icon={Users}
 label="New Users"
 value={totalNewUsers.toLocaleString()}
 change={`+${stats.growthRate}% monthly avg`}
 positive
 />
 </div>
 </div>

 {/* Revenue vs Bookings Chart */}
 <div className="mx-auto max-w-7xl px-4 md:px-6 mt-8">
 <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h3 className="text-base font-black uppercase tracking-widest text-foreground">
 Revenue & Bookings Trend
 </h3>
 <p className="text-sm text-muted-foreground mt-0.5">Month-over-month performance</p>
 </div>
 <div className="flex items-center gap-4 text-sm">
 <span className="flex items-center gap-1.5">
 <span className="h-2.5 w-2.5 rounded-sm bg-primary/60"/> Revenue
 </span>
 <span className="flex items-center gap-1.5">
 <span className="h-2.5 w-2.5 rounded-sm bg-blue-400/60"/> Bookings
 </span>
 </div>
 </div>
 <div className="flex items-end justify-between gap-2 h-48">
 {monthlyData.map((m) => {
 const revHeight = (m.revenue / maxRevenue) * 100;
 const bkgHeight = (m.newBookings / maxBookings) * 100;
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
 className="w-3 rounded-t-md bg-blue-400/60 transition-all duration-200 cursor-pointer group-hover:bg-blue-400/80"
 style={{ height: `${Math.max(bkgHeight, 3)}%` }}
 />
 </div>
 <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10">
 K{(m.revenue / 1000).toFixed(0)}k · {m.newBookings} bookings
 </div>
 <span className="text-[9px] font-semibold text-muted-foreground mt-1">
 {m.month}
 </span>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Detailed Tables */}
 <div className="mx-auto max-w-7xl px-4 md:px-6 mt-8 pb-16">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Monthly Breakdown */}
 <div className="rounded-xl border border-border/50 bg-card shadow-sm">
 <div className="p-5 border-b border-border/30">
 <h3 className="text-base font-black uppercase tracking-widest text-foreground">
 Monthly Breakdown
 </h3>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-base">
 <thead>
 <tr className="border-b border-border/20">
 <th className="text-left px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
 Month
 </th>
 <th className="text-right px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
 Revenue
 </th>
 <th className="text-right px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
 Commission
 </th>
 <th className="text-right px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
 Bookings
 </th>
 <th className="text-right px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
 New Users
 </th>
 </tr>
 </thead>
 <tbody>
 {monthlyData.map((m) => (
 <tr
 key={m.month}
 className="border-b border-border/10 last:border-0 hover:bg-muted/30 transition-colors"
 >
 <td className="px-5 py-3 font-semibold text-foreground">{m.month}</td>
 <td className="px-5 py-3 text-right font-medium">
 K{(m.revenue / 1000).toFixed(0)}k
 </td>
 <td className="px-5 py-3 text-right text-muted-foreground">
 K{(m.commission / 1000).toFixed(0)}k
 </td>
 <td className="px-5 py-3 text-right font-medium">{m.newBookings}</td>
 <td className="px-5 py-3 text-right text-muted-foreground">{m.newUsers}</td>
 </tr>
 ))}
 </tbody>
 <tfoot>
 <tr className="border-t border-border/30 bg-muted/20">
 <td className="px-5 py-3 text-sm font-bold text-foreground">Total</td>
 <td className="px-5 py-3 text-right font-bold">
 K{(totalRevenue / 1000).toFixed(0)}k
 </td>
 <td className="px-5 py-3 text-right font-bold text-muted-foreground">
 K{(totalCommission / 1000).toFixed(0)}k
 </td>
 <td className="px-5 py-3 text-right font-bold">{totalBookings}</td>
 <td className="px-5 py-3 text-right font-bold">{totalNewUsers}</td>
 </tr>
 </tfoot>
 </table>
 </div>
 </div>

 {/* Key Insights */}
 <div className="space-y-4">
 <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
 <h3 className="text-base font-black uppercase tracking-widest text-foreground mb-4">
 Key Insights
 </h3>
 <div className="space-y-4">
 <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
 <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5"/>
 <div>
 <p className="text-base font-bold text-emerald-800">Revenue Growing</p>
 <p className="text-sm text-emerald-600 mt-0.5">
 Revenue has grown {revenueGrowth}% in the last{""}
 {period ==="12m"?"12": period ==="6m"?"6":"3"} months. Peak revenue
 was in July with K
 {monthlyData
 .reduce((max, m) => (m.revenue > max.revenue ? m : max), monthlyData[0])
 .revenue.toLocaleString()}
 .
 </p>
 </div>
 </div>
 <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
 <Users className="h-4 w-4 text-blue-600 shrink-0 mt-0.5"/>
 <div>
 <p className="text-base font-bold text-blue-800">User Base Expanding</p>
 <p className="text-sm text-blue-600 mt-0.5">
 {stats.totalGuests} guests and {stats.totalHosts} hosts on the platform.
 Monthly growth rate of {stats.growthRate}%.
 </p>
 </div>
 </div>
 <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100">
 <BarChart3 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5"/>
 <div>
 <p className="text-base font-bold text-amber-800">Booking Conversion</p>
 <p className="text-sm text-amber-600 mt-0.5">
 {((stats.completedBookings / stats.totalBookings) * 100).toFixed(0)}%
 completion rate with {stats.totalBookings.toLocaleString()} total bookings
 processed.
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Quick Stats */}
 <div className="grid grid-cols-2 gap-4">
 <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm text-center">
 <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
 Avg Revenue/Month
 </p>
 <p className="text-xl font-bold text-foreground">
 K{(totalRevenue / monthlyData.length / 1000).toFixed(0)}k
 </p>
 </div>
 <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm text-center">
 <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
 Avg Bookings/Month
 </p>
 <p className="text-xl font-bold text-foreground">
 {Math.round(totalBookings / monthlyData.length)}
 </p>
 </div>
 <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm text-center">
 <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
 Avg Commission
 </p>
 <p className="text-xl font-bold text-foreground">
 {((stats.platformCommission / stats.totalRevenue) * 100).toFixed(0)}%
 </p>
 </div>
 <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm text-center">
 <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
 Avg Rating
 </p>
 <p className="text-xl font-bold text-foreground">{stats.avgRating}</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
