"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  Bell,
  Search,
  MapPin,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldCheck,
} from "lucide-react";
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
    : "MP";

  const filteredBookings = activeTab === "all" 
    ? bookings 
    : bookings.filter(b => b.type.toLowerCase().startsWith(activeTab.substring(0, 3)));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFC] font-sans">
      {/* HEADER: Strictly per Wireframe */}
      <nav className="h-20 bg-white border-b border-purple-100 px-6 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
            N
          </div>
          <span className="hidden sm:inline text-xl font-black tracking-tighter text-primary font-display">Nearby Escapes</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Admin
          </Link>
          <button onClick={() => becomeHost()} className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> Become Host
          </button>
          <div className="h-8 w-px bg-purple-100" />
          <button className="p-2 rounded-full text-primary hover:bg-primary/5 transition-all relative">
            <Bell className="h-6 w-6" strokeWidth={2.5} />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-white" />
          </button>
        </div>
      </nav>

      <main className="flex-grow pb-32">
        {/* HERO: Centered per Wireframe */}
        <section className="pt-20 pb-16 px-4">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="relative inline-block">
               <div className="h-44 w-44 rounded-full border-[8px] border-white bg-purple-50 shadow-2xl flex items-center justify-center text-primary text-5xl font-black overflow-hidden mx-auto ring-1 ring-purple-100">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-primary font-display">
                {user?.fullName ?? "Michael Phiri"}
              </h1>
              <p className="text-sm font-black text-primary/40 uppercase tracking-[0.3em]">
                {user?.email ?? "michael@nearbyescapes.com"}
              </p>
              
              <div className="flex items-center justify-center gap-10 pt-6">
                 <div className="text-center">
                    <p className="text-3xl font-black text-primary font-display">12</p>
                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Trips Taken</p>
                 </div>
                 <div className="w-px h-10 bg-purple-100" />
                 <div className="text-center">
                    <p className="text-3xl font-black text-primary font-display">4</p>
                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Reviews</p>
                 </div>
              </div>
            </div>

            {/* ACTION CARDS: Big and Monochromatic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-10">
              <Link href="/accommodations">
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[1.25rem] bg-primary text-white p-10 text-center flex flex-col items-center justify-center gap-4 group">
                  <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Search className="h-8 w-8" strokeWidth={3} />
                  </div>
                  <span className="text-xl font-black tracking-tight uppercase">Find your next escape</span>
                </Card>
              </Link>
              <button onClick={() => becomeHost()}>
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[1.25rem] bg-white text-primary p-10 text-center flex flex-col items-center justify-center gap-4 border-2 border-primary/10 group">
                  <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="h-8 w-8" strokeWidth={3} />
                  </div>
                  <span className="text-xl font-black tracking-tight uppercase">Become a host</span>
                </Card>
              </button>
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITY: Tabbed per Wireframe */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <h2 className="text-3xl font-black tracking-tighter font-display text-primary mb-10 text-center sm:text-left">Recent Activity</h2>

          <div className="flex items-center gap-2 mb-12 bg-purple-50/50 p-2 rounded-2xl border border-purple-100 w-fit mx-auto sm:mx-0">
            {["all", "stays", "attractions", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.05]" 
                    : "text-primary/40 hover:bg-primary/5 hover:text-primary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[1.25rem] overflow-hidden bg-white border border-purple-100 group">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-44 sm:w-60 overflow-hidden shrink-0">
                    <img src={booking.image} alt={booking.name} className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  </div>
                  <CardContent className="flex-1 p-8 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="text-center sm:text-left space-y-1">
                      <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] mb-2">{booking.id} · {booking.date}</p>
                      <h3 className="text-3xl font-black tracking-tighter font-display text-primary">{booking.name}</h3>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 text-primary/60 font-bold text-sm">
                        <MapPin className="h-4 w-4" /> Kafue National Park
                      </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-3 min-w-[160px]">
                      <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Status</p>
                      <div className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2",
                        booking.status === "success" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                        booking.status === "pending" && "bg-orange-50 text-orange-600 border-orange-100",
                        booking.status === "cancelled" && "bg-red-50 text-red-600 border-red-100",
                      )}>
                        {booking.status === "success" && <CheckCircle2 className="h-4 w-4" />}
                        {booking.status === "pending" && <AlertCircle className="h-4 w-4" />}
                        {booking.status === "cancelled" && <XCircle className="h-4 w-4" />}
                        {booking.status}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* BOTTOM ACTIONS: Bold per Wireframe */}
        <section className="max-w-4xl mx-auto px-4 mt-24">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-12 border-t border-purple-100">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-24 rounded-[1.25rem] border-4 border-primary/20 font-black tracking-widest text-2xl hover:bg-primary hover:text-white hover:border-primary transition-all group shadow-xl shadow-primary/5 uppercase font-display"
                onClick={() => logout()}
              >
                ESCAPE <LogOut className="ml-4 h-8 w-8 transition-transform group-hover:translate-x-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-24 rounded-[1.25rem] border-4 border-primary/10 font-black tracking-widest text-2xl hover:bg-primary hover:text-white hover:border-primary transition-all group shadow-xl shadow-primary/5 uppercase font-display"
                onClick={() => becomeHost()}
              >
                HOST <LayoutDashboard className="ml-4 h-8 w-8 transition-transform group-hover:scale-110" />
              </Button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
