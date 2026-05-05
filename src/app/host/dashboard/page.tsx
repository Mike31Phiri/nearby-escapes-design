"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Users, Calendar, 
  MessageCircle, Star, Plus,
  ArrowUpRight, Clock, CheckCircle2,
  XCircle, Filter, Download
} from "lucide-react";
import Link from "next/link";
import { listings } from "@/lib/mock-data";

export default function HostDashboardPage() {
  const stats = [
    { title: "Monthly Earnings", value: "ZMW 12,450", trend: "+15%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Active Bookings", value: "8", trend: "0", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Average Rating", value: "4.9", trend: "+0.1", icon: Star, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Total Views", value: "2.4k", trend: "+12%", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const bookings = [
    { id: "B-1024", guest: "Mwila K.", listing: "Riverside Lodge", dates: "May 15 - 20", payout: "ZMW 4,200", status: "Confirmed" },
    { id: "B-1025", guest: "Chileshe M.", listing: "City Loft", dates: "May 22 - 24", payout: "ZMW 1,800", status: "Pending" },
    { id: "B-1026", guest: "Mutinta S.", listing: "Riverside Lodge", dates: "June 01 - 05", payout: "ZMW 3,500", status: "Confirmed" },
    { id: "B-1027", guest: "John D.", listing: "Bush Camp", dates: "June 10 - 15", payout: "ZMW 5,100", status: "Cancelled" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Host Dashboard</h1>
            <p className="text-muted-foreground text-lg mt-2">Welcome back, Bwalya! Here&apos;s how your escapes are performing.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/host/create-listing">
              <Button className="rounded-2xl h-12 px-8 bg-primary font-bold shadow-lg flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border/60 shadow-xl rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> {stat.trend}
                  </span>
                </div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Bookings Table */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-2xl font-bold tracking-tight">Recent Reservations</h2>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl h-10 px-4 font-bold border-2 gap-2"><Filter className="h-4 w-4" /> Filter</Button>
              <Button variant="outline" className="rounded-xl h-10 px-4 font-bold border-2 gap-2"><Download className="h-4 w-4" /> Export</Button>
            </div>
          </div>

          <Card className="border-border/60 shadow-xl rounded-[32px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground border-b border-border/40">Guest</th>
                    <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground border-b border-border/40">Listing</th>
                    <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground border-b border-border/40">Dates</th>
                    <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground border-b border-border/40">Payout</th>
                    <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground border-b border-border/40">Status</th>
                    <th className="p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground border-b border-border/40">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                            <img src={`https://i.pravatar.cc/100?u=${booking.guest}`} alt="" />
                          </div>
                          <span className="font-bold">{booking.guest}</span>
                        </div>
                      </td>
                      <td className="p-6 font-medium">{booking.listing}</td>
                      <td className="p-6 text-sm text-muted-foreground">{booking.dates}</td>
                      <td className="p-6 font-bold">{booking.payout}</td>
                      <td className="p-6">
                        <Badge className={cn(
                          "rounded-full px-3 py-1 font-bold text-[10px] border-none shadow-sm",
                          booking.status === "Confirmed" && "bg-emerald-100 text-emerald-700",
                          booking.status === "Pending" && "bg-orange-100 text-orange-700",
                          booking.status === "Cancelled" && "bg-red-100 text-red-700",
                        )}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl"><MessageCircle className="h-4 w-4" /></Button>
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="flex justify-center">
            <Button variant="ghost" className="font-bold text-primary hover:underline">View all reservations</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function MoreVertical({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
