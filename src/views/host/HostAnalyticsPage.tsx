"use client";

import Link from "next/link";
import {
  TrendingUp, TrendingDown, Eye, Users, DollarSign,
  Star, CalendarDays, ArrowLeft, BarChart3,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HostSidebar, HostMobileNav } from "@/views/host/HostDashboardPage";
import { cn } from "@/lib/utils";

const kpis = [
  { label: "Total views", value: "3,481", change: "+14%", up: true, icon: Eye },
  { label: "Bookings", value: "47", change: "+8%", up: true, icon: CalendarDays },
  { label: "Revenue (MTD)", value: "ZMW 48,200", change: "+22%", up: true, icon: DollarSign },
  { label: "Avg. rating", value: "4.9", change: "-0.1", up: false, icon: Star },
  { label: "Unique visitors", value: "1,240", change: "+5%", up: true, icon: Users },
  { label: "Conversion rate", value: "3.8%", change: "+0.4%", up: true, icon: TrendingUp },
];

const listingPerf = [
  { name: "Mosi-oa-Tunya Lodge", views: 1840, bookings: 21, revenue: "ZMW 22,400", rating: 4.92, occupancy: "78%" },
  { name: "Skyline Boutique Suite", views: 980, bookings: 14, revenue: "ZMW 16,800", rating: 4.78, occupancy: "65%" },
  { name: "Luangwa Tented Camp", views: 661, bookings: 12, revenue: "ZMW 9,000", rating: 4.95, occupancy: "55%" },
];

const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const revenueData = [28000, 35000, 31000, 42000, 38000, 48200];
const maxRevenue = Math.max(...revenueData);

const trafficSources = [
  { source: "Direct search", pct: 42 },
  { source: "Homepage featured", pct: 28 },
  { source: "Category browse", pct: 18 },
  { source: "Referral / share", pct: 12 },
];

const sourceColors = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
];

export function HostAnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header band */}
      <div className="border-b border-border/50 bg-primary-soft/30">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-8 md:py-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <HostMobileNav />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Host</p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-primary" /> Analytics
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Full performance breakdown across all your listings.</p>
              </div>
            </div>
            <Link href="/host" className="shrink-0">
              <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 md:px-6 py-10">
        <div className="flex gap-10">
          <HostSidebar />

          <div className="flex-1 min-w-0 space-y-10">

            {/* KPI grid */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Key metrics — last 30 days</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {kpis.map(({ label, value, change, up, icon: Icon }) => (
                  <Card key={label} className="border-border/60">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={cn(
                          "flex items-center gap-1 text-xs font-semibold",
                          up ? "text-emerald-600" : "text-red-500"
                        )}>
                          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold tracking-tight">{value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Revenue bar chart */}
            <section>
              <Card className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold">Monthly revenue (ZMW)</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-end gap-3 h-40 mt-4">
                    {revenueData.map((val, i) => (
                      <div key={months[i]} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {(val / 1000).toFixed(0)}k
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-primary transition-all duration-500"
                          style={{ height: `${(val / maxRevenue) * 100}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground">{months[i]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Per-listing performance */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Listing performance</p>
              <Card className="border-border/60">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 text-xs text-muted-foreground uppercase tracking-wider">
                          <th className="text-left px-6 py-3 font-semibold">Listing</th>
                          <th className="text-right px-4 py-3 font-semibold">Views</th>
                          <th className="text-right px-4 py-3 font-semibold">Bookings</th>
                          <th className="text-right px-4 py-3 font-semibold">Revenue</th>
                          <th className="text-right px-4 py-3 font-semibold">Rating</th>
                          <th className="text-right px-6 py-3 font-semibold">Occupancy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {listingPerf.map((l) => (
                          <tr key={l.name} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-medium">{l.name}</td>
                            <td className="px-4 py-4 text-right text-muted-foreground">{l.views.toLocaleString()}</td>
                            <td className="px-4 py-4 text-right text-muted-foreground">{l.bookings}</td>
                            <td className="px-4 py-4 text-right font-semibold">{l.revenue}</td>
                            <td className="px-4 py-4 text-right">
                              <span className="flex items-center justify-end gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{l.rating}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="inline-flex items-center rounded-full bg-primary-soft text-primary text-xs font-semibold px-2.5 py-1">
                                {l.occupancy}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Traffic sources */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Traffic sources</p>
              <Card className="border-border/60">
                <CardContent className="p-6 space-y-4">
                  {trafficSources.map(({ source, pct }, i) => (
                    <div key={source}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{source}</span>
                        <span className="text-sm font-bold">{pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-700", sourceColors[i])}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
