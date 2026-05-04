"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  Bell,
  Search,
  Star,
  MapPin,
  Calendar,
  ChevronRight,
  Home,
  Compass,
  LayoutDashboard,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const bookings = [
  { id: "BK-101", name: "Kafue Lodge", type: "Stay", status: "success", date: "Oct 12 - 15, 2025", price: "K2,400", image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { id: "BK-102", name: "Vic Falls Tour", type: "Attraction", status: "pending", date: "Nov 02, 2025", price: "K450", image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  { id: "BK-103", name: "Lusaka City Stay", type: "Stay", status: "cancelled", date: "Sep 20 - 22, 2025", price: "K1,200", image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
];

export function UserProfilePage() {
  const { user, logout, becomeHost } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const initials = user?.fullName
    ? user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  const filteredBookings = activeTab === "all" 
    ? bookings 
    : bookings.filter(b => b.type.toLowerCase().startsWith(activeTab.substring(0, 3)));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC]">
      <Navbar />

      <main className="flex-grow pb-24">
        {/* Header Section (Centered) */}
        <section className="pt-16 pb-12 px-4">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="relative inline-block">
               <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center text-primary text-4xl font-bold overflow-hidden mx-auto">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <button className="absolute top-2 -right-12 p-2 rounded-full bg-white shadow-md text-muted-foreground hover:text-primary transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
              </button>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-foreground font-display">
                {user?.fullName ?? "Michael Phiri"}
              </h1>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> Lusaka, Zambia
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
              <Link href="/accommodations" className="group">
                <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl bg-primary text-primary-foreground p-6 text-center h-full flex flex-col items-center justify-center gap-2">
                  <Search className="h-6 w-6" />
                  <span className="text-sm font-bold">Find your next escape</span>
                </Card>
              </Link>
              <button onClick={() => becomeHost()} className="group">
                <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl bg-white p-6 text-center h-full flex flex-col items-center justify-center gap-2 border border-border/40">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                  <span className="text-sm font-bold">Become a host</span>
                </Card>
              </button>
            </div>
          </div>
        </section>

        {/* Recents Section */}
        <section className="max-w-4xl mx-auto px-4 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight font-display">Recent</h2>
          </div>

          {/* Custom Tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            {["all", "stays", "attractions", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-foreground text-background shadow-lg" 
                    : "bg-white text-muted-foreground hover:bg-muted border border-border/40"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Booking Cards */}
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <Card key={booking.id} className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden bg-white group">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-40 sm:w-48 overflow-hidden shrink-0">
                      <img src={booking.image} alt={booking.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute top-3 left-3">
                         <Badge className="bg-white/90 text-black border-0 backdrop-blur-md font-bold text-[10px] uppercase tracking-tighter">
                            {booking.type}
                          </Badge>
                      </div>
                    </div>
                    <CardContent className="flex-1 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="text-center sm:text-left space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{booking.id}</p>
                        <h3 className="text-xl font-black tracking-tight">{booking.name}</h3>
                        <p className="text-sm font-medium text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> {booking.date}
                        </p>
                      </div>

                      <div className="flex flex-col items-center sm:items-end gap-2">
                        <div className="text-center sm:text-right">
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Booking</p>
                          <div className={cn(
                            "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                            booking.status === "success" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                            booking.status === "pending" && "bg-orange-50 text-orange-600 border-orange-100",
                            booking.status === "cancelled" && "bg-red-50 text-red-600 border-red-100",
                          )}>
                            {booking.status === "success" && <CheckCircle2 className="h-3 w-3" />}
                            {booking.status === "pending" && <AlertCircle className="h-3 w-3" />}
                            {booking.status === "cancelled" && <XCircle className="h-3 w-3" />}
                            {booking.status}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border/60">
                 <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                 <p className="text-muted-foreground font-medium">No recent bookings found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Logout / Footer Actions */}
        <section className="max-w-4xl mx-auto px-4 mt-16 pt-16 border-t border-border/40">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-16 rounded-3xl border-2 font-black tracking-tighter text-lg hover:bg-primary hover:text-white transition-all group"
                asChild
              >
                <Link href="/accommodations">
                  ESCAPE <Compass className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-16 rounded-3xl border-2 font-black tracking-tighter text-lg hover:bg-foreground hover:text-background transition-all group"
                onClick={() => becomeHost()}
              >
                HOST <LayoutDashboard className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
              </Button>
           </div>

           <div className="mt-12 text-center">
              <button 
                onClick={() => logout()}
                className="flex items-center justify-center gap-2 mx-auto text-sm font-bold text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout from your account
              </button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
