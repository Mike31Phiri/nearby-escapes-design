"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Lock, Unlock, Tag, AlertCircle, 
  ArrowLeft, Settings, Save
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ListingCalendarPage() {
  const params = useParams();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1)); // May 2024

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  const bookedDates = [15, 16, 17, 18, 19, 20];
  const blockedDates = [5, 6, 25];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <Link 
              href="/host/listings" 
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to listings
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">Calendar & Availability</h1>
            <p className="text-muted-foreground">Victoria Falls Waterfront Lodge • Listing ID: 84291</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-xl h-11 border-2 font-bold flex items-center gap-2"><Settings className="h-4 w-4" /> Pricing Settings</Button>
             <Button className="rounded-xl h-11 bg-primary font-bold shadow-lg flex items-center gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-500">
             <Card className="border-border/60 shadow-xl rounded-[40px] overflow-hidden">
                <CardHeader className="p-8 border-b border-border/40 flex flex-row items-center justify-between">
                   <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold tracking-tight">May 2024</h2>
                      <div className="flex bg-muted/50 p-1 rounded-xl">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg"><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg"><ChevronRight className="h-4 w-4" /></Button>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                      <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-emerald-500" /> Booked</div>
                      <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-red-500" /> Blocked</div>
                      <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full border border-border" /> Available</div>
                   </div>
                </CardHeader>
                <CardContent className="p-8">
                   <div className="grid grid-cols-7 gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                        <div key={d} className="text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest py-4">
                           {d}
                        </div>
                      ))}
                      {padding.map((_, i) => <div key={`p-${i}`} />)}
                      {days.map(d => {
                        const isBooked = bookedDates.includes(d);
                        const isBlocked = blockedDates.includes(d);
                        return (
                          <div 
                            key={d} 
                            className={cn(
                              "aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer group relative",
                              isBooked && "bg-emerald-50 border-emerald-500 text-emerald-700",
                              isBlocked && "bg-red-50 border-red-500 text-red-700",
                              !isBooked && !isBlocked && "bg-card border-border/40 hover:border-primary/40"
                            )}
                          >
                             <span className="font-bold text-lg">{d}</span>
                             <span className="text-[8px] font-black opacity-40 uppercase">ZMW 850</span>
                             {isBooked && <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                             {isBlocked && <Lock className="absolute top-2 right-2 h-3 w-3" />}
                          </div>
                        );
                      })}
                   </div>
                </CardContent>
             </Card>
          </div>

          <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
             <Card className="border-border/60 shadow-lg rounded-[32px] p-8">
                <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
                <div className="space-y-4">
                   <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-bold justify-start gap-3">
                      <Lock className="h-4 w-4 text-red-500" /> Block Dates
                   </Button>
                   <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-bold justify-start gap-3">
                      <Unlock className="h-4 w-4 text-emerald-500" /> Unblock Dates
                   </Button>
                   <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-bold justify-start gap-3">
                      <Tag className="h-4 w-4 text-primary" /> Seasonal Pricing
                   </Button>
                </div>
             </Card>

             <Card className="border-border/60 shadow-lg rounded-[32px] p-8 bg-muted/30">
                <div className="flex items-start gap-3 mb-6">
                   <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                   <div>
                      <h4 className="font-bold">Next Booking</h4>
                      <p className="text-xs text-muted-foreground">Arriving in 2 days</p>
                   </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-border/40 shadow-sm">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                         <img src="https://i.pravatar.cc/100?img=12" alt="" />
                      </div>
                      <div>
                         <p className="font-bold text-sm">Mwila K.</p>
                         <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Guest • 2 People</p>
                      </div>
                   </div>
                   <p className="text-xs font-bold flex items-center gap-2"><CalendarIcon className="h-3 w-3" /> May 15 - 20</p>
                   <Link href="/host/messages">
                     <Button className="w-full mt-4 h-9 rounded-lg bg-primary text-xs font-bold">Message Mwila</Button>
                   </Link>
                </div>
             </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
