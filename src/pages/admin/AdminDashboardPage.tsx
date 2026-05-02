import { Link } from "@tanstack/react-router";
import { Users, Home, CalendarCheck, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Total Users", value: "2,847", icon: Users, change: "+12%", trend: "up" },
  { label: "Active Listings", value: "384", icon: Home, change: "+5%", trend: "up" },
  { label: "Bookings This Month", value: "1,203", icon: CalendarCheck, change: "+18%", trend: "up" },
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                {stat.trend === "up" && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <Link to="/admin/bookings" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      activity.type === "alert"
                        ? "bg-red-100 text-red-600"
                        : activity.type === "booking"
                        ? "bg-green-100 text-green-600"
                        : activity.type === "listing"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {activity.type === "alert" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : activity.type === "booking" ? (
                      <CalendarCheck className="h-4 w-4" />
                    ) : activity.type === "listing" ? (
                      <Home className="h-4 w-4" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid gap-3">
              <Link
                to="/admin/users"
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">Manage Users</span>
                </div>
              </Link>
              <Link
                to="/admin/listings"
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary" />
                  <span className="font-medium">Review Listings</span>
                </div>
              </Link>
              <Link
                to="/admin/bookings"
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  <span className="font-medium">View Bookings</span>
                </div>
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-primary" />
                  <span className="font-medium">Platform Settings</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
