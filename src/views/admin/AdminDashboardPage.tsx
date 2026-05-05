"use client";

import { useState } from "react";
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
  ArrowUpRight,
  CreditCard,
  UserPlus,
  ShieldCheck,
  Award,
  BarChart3,
  PieChart,
  History,
} from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth";

const stats = [
  { label: "Bookings", value: "1,203", icon: CalendarCheck, change: "+18.3%", trend: "up", color: "blue" },
  { label: "Revenue", value: "K487,200", icon: DollarSign, change: "+22.1%", trend: "up", color: "emerald" },
  { label: "Users", value: "2,847", icon: Users, change: "+12.5%", trend: "up", color: "indigo" },
  { label: "Performance", value: "94.2%", icon: Award, change: "+4.8%", trend: "up", color: "orange" },
];

const bookingRequests = [
  { id: "BR-101", user: "Michael Phiri", property: "Mosi-oa-Tunya Lodge", status: "pending", time: "2m ago" },
  { id: "BR-102", user: "Grace Banda", property: "Luangwa Camp", status: "pending", time: "15m ago" },
  { id: "BR-103", user: "John Doe", property: "Victoria Falls Hotel", status: "pending", time: "1h ago" },
];

const recentPayments = [
  { id: "PAY-501", user: "Sarah Zulu", amount: "K1,200", status: "completed", time: "10m ago" },
  { id: "PAY-502", user: "David Lungu", amount: "K4,500", status: "completed", time: "45m ago" },
  { id: "PAY-503", user: "James M.", amount: "K2,800", status: "failed", time: "2h ago" },
];

const recentUsers = [
  { id: "U-901", name: "Alice Mwamba", email: "alice@email.com", role: "guest", time: "5m ago" },
  { id: "U-902", name: "Robert Tembo", email: "robert@email.com", role: "host", time: "1h ago" },
];

const recentHosts = [
  { id: "H-201", name: "Chanda M.", property: "Livingstone Villa", status: "active", time: "1d ago" },
  { id: "H-202", name: "Bwalya K.", property: "Copperbelt Stay", status: "active", time: "2d ago" },
];

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("admin"); // 'admin' is the dashboard tab based on split("/") logic

  const renderContent = () => {
    switch (activeTab) {
      case "admin":
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Stats Grid */}
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[32px] group bg-white overflow-hidden hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 shadow-sm",
                        stat.color === "blue" && "bg-blue-50 text-blue-600",
                        stat.color === "indigo" && "bg-indigo-50 text-indigo-600",
                        stat.color === "emerald" && "bg-emerald-50 text-emerald-600",
                        stat.color === "orange" && "bg-orange-50 text-orange-600",
                      )}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-4xl font-black tracking-tight">{stat.value}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">{stat.label}</p>
                    <div className="mt-8 h-10 w-full flex items-end gap-1.5 opacity-20 group-hover:opacity-100 transition-opacity">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={cn("flex-1 rounded-t-md", 
                          stat.color === "blue" && "bg-blue-400",
                          stat.color === "indigo" && "bg-indigo-400",
                          stat.color === "emerald" && "bg-emerald-400",
                          stat.color === "orange" && "bg-orange-400"
                        )} style={{ height: `${20 + Math.random() * 80}%` }} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black tracking-tight font-display">Latest Activity</h2>
                <Button variant="ghost" size="sm" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">View All Activities</Button>
              </div>

              {/* Recents 2x2 Grid */}
              <div className="grid gap-8 md:grid-cols-2">
                <div onClick={() => setActiveTab("bookings")} className="cursor-pointer group/card">
                  <RecentsCard title="Booking Requests" icon={CalendarCheck} iconColor="text-blue-600" items={bookingRequests} />
                </div>
                <div onClick={() => setActiveTab("revenue")} className="cursor-pointer group/card">
                  <RecentsCard title="Recent Payments" icon={CreditCard} iconColor="text-emerald-600" items={recentPayments} priceLabel />
                </div>
                <div onClick={() => setActiveTab("users")} className="cursor-pointer group/card">
                  <UserListCard title="New Users" items={recentUsers} />
                </div>
                <div onClick={() => setActiveTab("performance")} className="cursor-pointer group/card">
                  <HostListCard title="New Hosts" items={recentHosts} />
                </div>
              </div>
            </div>
          </div>
        );
      case "analysis":
        return <PlaceholderView title="Analysis" icon={BarChart3} desc="Detailed analysis of platform growth and user behavior." />;
      case "revenue":
        return <RevenueListView />;
      case "bookings":
        return <BookingsListView />;
      case "users":
        return <UsersListView />;
      case "performance":
        return <PlaceholderView title="Performance" icon={Award} desc="Monitor property ratings, response rates, and host quality." />;
      case "settings":
        return <AdminSettingsView />;
      default:
        return <div>Select a tab</div>;
    }
  };

  const tabMeta: Record<string, { title: string; desc: string }> = {
    admin: { title: "Dashboard Overview", desc: "Monitor your platform's core metrics and latest activities." },
    analysis: { title: "Data Analysis", desc: "Gain insights into platform performance and trends." },
    revenue: { title: "Financial Reports", desc: "Monitor revenue streams and transaction history." },
    bookings: { title: "Booking Management", desc: "Review and manage all property reservations." },
    users: { title: "User Management", desc: "Oversee all registered guests and host accounts." },
    performance: { title: "Platform Performance", desc: "Evaluate quality metrics and user satisfaction." },
    settings: { title: "Account Settings", desc: "Manage your admin profile and system preferences." },
  };

  const currentMeta = tabMeta[activeTab] || tabMeta.admin;

  return (
    <AdminLayout 
      title={currentMeta.title} 
      description={currentMeta.desc} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </AdminLayout>
  );
}

function RecentsCard({ title, icon: Icon, iconColor, items, priceLabel }: any) {
  return (
    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-border/40 flex flex-row items-center justify-between bg-muted/5">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Icon className={cn("h-4 w-4", iconColor)} /> {title}
        </CardTitle>
        <History className="h-4 w-4 text-muted-foreground/40" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/30">
          {items.map((item: any) => (
            <div key={item.id} className="p-4 hover:bg-muted/10 transition-colors flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{item.user}</p>
                <p className="text-[10px] text-muted-foreground">{item.property || item.id}</p>
              </div>
              <div className="text-right">
                {priceLabel ? (
                   <p className="text-sm font-black">{item.amount}</p>
                ) : (
                  <p className="text-[10px] font-bold text-primary">{item.time}</p>
                )}
                {item.status && (
                  <p className={cn("text-[10px] font-bold uppercase", item.status === "failed" ? "text-red-500" : "text-emerald-500")}>
                    {item.status}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UserListCard({ title, items }: any) {
  return (
    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-border/40 flex flex-row items-center justify-between bg-muted/5">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-600" /> {title}
        </CardTitle>
        <UserPlus className="h-4 w-4 text-muted-foreground/40" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/30">
          {items.map((u: any) => (
            <div key={u.id} className="p-4 hover:bg-muted/10 transition-colors flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-bold">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{u.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold capitalize">{u.role}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function HostListCard({ title, items }: any) {
  return (
    <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
      <CardHeader className="px-6 py-4 border-b border-border/40 flex flex-row items-center justify-between bg-muted/5">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-orange-600" /> {title}
        </CardTitle>
        <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/30">
          {items.map((h: any) => (
            <div key={h.id} className="p-4 hover:bg-muted/10 transition-colors flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{h.name}</p>
                <p className="text-[10px] text-muted-foreground">{h.property}</p>
              </div>
              <div className="text-right">
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0 text-[10px] font-bold">
                  {h.status}
                </Badge>
                <p className="text-[10px] text-muted-foreground mt-1">{h.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PlaceholderView({ title, icon: Icon, desc }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="h-24 w-24 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-6">
        <Icon className="h-12 w-12" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mx-auto">{desc}</p>
      <Button className="mt-8 rounded-xl px-8 shadow-md">
        Refresh {title}
      </Button>
    </div>
  );
}

function AdminSettingsView() {
  const { user } = useAuth();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-white p-1 h-12 rounded-2xl border border-border/40 shadow-sm inline-flex">
          <TabsTrigger value="profile" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">Profile</TabsTrigger>
          <TabsTrigger value="platform" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">Platform</TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">Security</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-black">Personal Information</CardTitle>
              <CardDescription>Update your public identity on the administrative panel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-border/40">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-black border-4 border-white shadow-md">
                  {user?.fullName?.charAt(0) || "A"}
                </div>
                <div className="space-y-2">
                  <Button size="sm" className="rounded-xl font-bold">Upload New Photo</Button>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Recommended size: 400x400px</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                  <Input id="name" defaultValue={user?.fullName || "Michael Phiri"} className="rounded-xl border-border/60 bg-muted/5 font-semibold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input id="email" defaultValue={user?.email || "michael@example.com"} className="rounded-xl border-border/60 bg-muted/5 font-semibold" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Administrative Bio</Label>
                <Textarea id="bio" placeholder="Briefly describe your role..." className="rounded-xl border-border/60 bg-muted/5 min-h-[100px] font-semibold" />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/5 border-t border-border/40 p-6">
              <Button className="rounded-xl px-10 shadow-lg font-black tracking-tight">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Platform Settings */}
        <TabsContent value="platform" className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" /> Critical Controls
              </CardTitle>
              <CardDescription>Manage the platform's public state and accessibility.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 border border-orange-100">
                <div className="space-y-0.5">
                  <Label className="text-sm font-black text-orange-900">Maintenance Mode</Label>
                  <p className="text-xs text-orange-700/80 font-medium">Temporarily disable all public guest and host access.</p>
                </div>
                <Switch />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                 <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Platform Service Fee (%)</Label>
                  <Input type="number" defaultValue="12" className="rounded-xl border-border/60 bg-muted/5 font-semibold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Default Currency</Label>
                  <Input defaultValue="ZMW (Zambian Kwacha)" className="rounded-xl border-border/60 bg-muted/5 font-semibold" disabled />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/5 border-t border-border/40 p-6">
              <Button className="rounded-xl px-10 shadow-lg font-black tracking-tight">Update Platform State</Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
             <CardHeader>
              <CardTitle className="text-xl font-black">Branding</CardTitle>
              <CardDescription>Customize the visual identity of Nearby Escapes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-32 bg-primary rounded-xl flex items-center justify-center text-white font-black">LOGO</div>
                <Button variant="outline" className="rounded-xl font-bold">Change Logo</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-black">Authentication</CardTitle>
              <CardDescription>Secure your administrative account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl border-border/60 bg-muted/5" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New Password</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-xl border-border/60 bg-muted/5" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-xl border-border/60 bg-muted/5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 border border-blue-100 mt-6">
                <div className="space-y-0.5">
                  <Label className="text-sm font-black text-blue-900">Two-Factor Authentication</Label>
                  <p className="text-xs text-blue-700/80 font-medium">Add an extra layer of security to your logins.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/5 border-t border-border/40 p-6">
              <Button className="rounded-xl px-10 shadow-lg font-black tracking-tight">Update Security</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingsListView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black">All Bookings</CardTitle>
            <CardDescription>Comprehensive list of all platform reservations.</CardDescription>
          </div>
          <Button size="sm" className="rounded-xl font-bold">Export CSV</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow className="border-border/40">
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">ID</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">Guest</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">Property</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">Date</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">Amount</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(6)].map((_, i) => (
                <TableRow key={i} className="border-border/20 hover:bg-muted/5 transition-colors">
                  <TableCell className="px-6 font-bold text-muted-foreground">BK-{100 + i}</TableCell>
                  <TableCell className="px-6 font-bold">User {i + 1}</TableCell>
                  <TableCell className="px-6 font-medium text-muted-foreground">Luxury Villa {i + 1}</TableCell>
                  <TableCell className="px-6 text-xs text-muted-foreground">Oct {10 + i}, 2026</TableCell>
                  <TableCell className="px-6 font-black">K{1200 + (i * 300)}</TableCell>
                  <TableCell className="px-6 text-right">
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      i % 3 === 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      i % 3 === 1 ? "bg-orange-50 text-orange-600 border-orange-100" : 
                      "bg-blue-50 text-blue-600 border-blue-100"
                    )}>
                      {i % 3 === 0 ? "Confirmed" : i % 3 === 1 ? "Pending" : "Arrived"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersListView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black">User Directory</CardTitle>
            <CardDescription>Manage all platform users and roles.</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="rounded-xl font-bold">Add User</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow className="border-border/40">
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">User</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">Email</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">Role</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">Joined</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(6)].map((_, i) => (
                <TableRow key={i} className="border-border/20 hover:bg-muted/5 transition-colors">
                  <TableCell className="px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">U</div>
                      <span className="font-bold">Member Name {i + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 text-sm text-muted-foreground font-medium">user{i + 1}@example.com</TableCell>
                  <TableCell className="px-6">
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase">{i % 2 === 0 ? "Guest" : "Host"}</Badge>
                  </TableCell>
                  <TableCell className="px-6 text-xs text-muted-foreground">2 days ago</TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function RevenueListView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
       <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
          <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Payouts</p>
            <p className="text-2xl font-black">K384,200</p>
          </Card>
          <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Pending Fees</p>
            <p className="text-2xl font-black text-orange-600">K12,450</p>
          </Card>
          <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Net Earnings</p>
            <p className="text-2xl font-black text-emerald-600">K46,800</p>
          </Card>
       </div>

      <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-black">Transaction History</CardTitle>
          <CardDescription>Detailed log of all financial movements on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow className="border-border/40">
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">TXN ID</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">Recipient</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">Amount</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6">Method</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest px-6 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(6)].map((_, i) => (
                <TableRow key={i} className="border-border/20 hover:bg-muted/5 transition-colors">
                  <TableCell className="px-6 font-bold text-muted-foreground">TX-90{i}</TableCell>
                  <TableCell className="px-6 font-bold">Vendor {i + 1}</TableCell>
                  <TableCell className="px-6 font-black text-emerald-600">K{2400 + (i * 100)}</TableCell>
                  <TableCell className="px-6 text-xs text-muted-foreground font-bold uppercase tracking-widest">Mobile Money</TableCell>
                  <TableCell className="px-6 text-right">
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-bold">COMPLETED</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
