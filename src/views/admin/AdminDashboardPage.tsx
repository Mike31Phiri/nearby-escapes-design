import Link from "next/link";
import {
  Users,
  Home,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Settings,
  ArrowRight,
  ArrowUpRight
} from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Users", value: "2,847", icon: Users, change: "+12.5%", trend: "up", color: "blue" },
  { label: "Active Listings", value: "384", icon: Home, change: "+5.2%", trend: "up", color: "indigo" },
  {
    label: "Monthly Bookings",
    value: "1,203",
    icon: CalendarCheck,
    change: "+18.3%",
    trend: "up",
    color: "emerald"
  },
  { label: "Revenue (MTD)", value: "K487,200", icon: DollarSign, change: "+22.1%", trend: "up", color: "orange" },
];

const recentActivity = [
  { id: 1, type: "booking", message: "New booking for Mosi-oa-Tunya Lodge", time: "2 min ago", user: "Michael P." },
  { id: 2, type: "user", message: "New host registered: chanda.m@email.com", time: "15 min ago", user: "Chanda M." },
  { id: 3, type: "listing", message: "New listing submitted: Luangwa Camp", time: "1 hour ago", user: "Grace B." },
  { id: 4, type: "alert", message: "Payment failed for booking #BK-2847", time: "2 hours ago", user: "System" },
];

export function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard" description="Overview of your platform's growth and operations">
      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-2xl group overflow-hidden bg-white">
            <CardContent className="p-7">
              <div className="flex items-center justify-between mb-6">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110 duration-500",
                  stat.color === "blue" && "bg-blue-50 text-blue-600",
                  stat.color === "indigo" && "bg-indigo-50 text-indigo-600",
                  stat.color === "emerald" && "bg-emerald-50 text-emerald-600",
                  stat.color === "orange" && "bg-orange-50 text-orange-600",
                )}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100/50">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-black tracking-tight text-foreground">{stat.value}</p>
              <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl bg-white overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 border-b border-border/40">
            <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
            <Link href="/admin/bookings" className="text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
              View All Activity <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-5 px-8 py-6 hover:bg-muted/10 transition-colors group">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all group-hover:scale-105",
                      activity.type === "alert"
                        ? "bg-red-50 text-red-600 border-red-100/50"
                        : activity.type === "booking"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                          : activity.type === "listing"
                            ? "bg-blue-50 text-blue-600 border-blue-100/50"
                            : "bg-purple-50 text-purple-600 border-purple-100/50"
                    )}
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
                    <p className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">{activity.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-xs font-semibold text-muted-foreground/70">{activity.time}</span>
                       <span className="h-1 w-1 rounded-full bg-border" />
                       <span className="text-xs font-bold text-foreground/60">By {activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-muted/20 text-center border-t border-border/30">
               <Button variant="ghost" size="sm" className="font-bold text-xs text-muted-foreground hover:text-foreground">
                  Load More Activity
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl bg-white p-7">
            <h2 className="text-xl font-bold tracking-tight mb-6">Quick Actions</h2>
            <div className="grid gap-3">
              {[
                { href: "/admin/users", icon: Users, label: "Manage Platform Users", color: "purple" },
                { href: "/admin/listings", icon: Home, label: "Moderate New Listings", color: "blue" },
                { href: "/admin/bookings", icon: CalendarCheck, label: "Review Guest Bookings", color: "emerald" },
                { href: "/admin/settings", icon: Settings, label: "Update Global Settings", color: "gray" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all group bg-white shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                      action.color === "purple" && "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
                      action.color === "blue" && "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
                      action.color === "emerald" && "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
                      action.color === "gray" && "bg-gray-50 text-gray-600 group-hover:bg-gray-100",
                    )}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm text-foreground/80 group-hover:text-foreground transition-colors">{action.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-300" />
                </Link>
              ))}
            </div>
          </Card>

          <Card className="border-none bg-primary p-7 rounded-2xl shadow-lg shadow-primary/20 text-primary-foreground relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-lg font-bold">New Version Available</h3>
                <p className="text-sm text-primary-foreground/80 mt-2 font-medium">Update Nearby Admin to v2.4 to get the latest security patches.</p>
                <Button variant="secondary" size="sm" className="mt-5 font-bold w-full rounded-xl shadow-md">
                   Update Now
                </Button>
             </div>
             <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
