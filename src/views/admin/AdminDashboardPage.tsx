import Link from "next/link";
import {
  Users,
  Home,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Settings,
  ArrowRight
} from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Total Users", value: "2,847", icon: Users, change: "+12%", trend: "up" },
  { label: "Active Listings", value: "384", icon: Home, change: "+5%", trend: "up" },
  {
    label: "Bookings This Month",
    value: "1,203",
    icon: CalendarCheck,
    change: "+18%",
    trend: "up",
  },
  { label: "Revenue (MTD)", value: "ZMW 487K", icon: DollarSign, change: "+22%", trend: "up" },
];

const recentActivity = [
  { id: 1, type: "booking", message: "New booking for Mosi-oa-Tunya Lodge", time: "2 min ago" },
  { id: 2, type: "user", message: "New user registered: chanda.m@email.com", time: "15 min ago" },
  { id: 3, type: "listing", message: "New listing submitted: Luangwa Camp", time: "1 hour ago" },
  { id: 4, type: "alert", message: "Payment failed for booking #BK-2847", time: "2 hours ago" },
];

export function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard" description="Overview of platform performance and activity">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/40 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.trend === "up" && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                )}
              </div>
              <div className="mt-5">
                <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border/40 shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-6 border-b border-border/40 bg-white rounded-t-xl">
              <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
              <Link href="/admin/bookings" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-border/40 bg-white rounded-b-xl">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-6 hover:bg-muted/30 transition-colors">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                      activity.type === "alert"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : activity.type === "booking"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : activity.type === "listing"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-purple-50 text-purple-600 border-purple-100"
                    }`}
                  >
                    {activity.type === "alert" ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : activity.type === "booking" ? (
                      <CalendarCheck className="h-5 w-5" />
                    ) : activity.type === "listing" ? (
                      <Home className="h-5 w-5" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/40 shadow-sm h-fit">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold tracking-tight mb-5">Quick Actions</h2>
            <div className="grid gap-3">
              {[
                { href: "/admin/users", icon: Users, label: "Manage Users" },
                { href: "/admin/listings", icon: Home, label: "Review Listings" },
                { href: "/admin/bookings", icon: CalendarCheck, label: "View Bookings" },
                { href: "/admin/settings", icon: Settings, label: "Platform Settings" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm transition-all group bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                      <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="font-medium text-sm text-foreground">{action.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
