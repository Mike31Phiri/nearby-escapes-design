"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Search, MoreHorizontal, Edit, Power, Trash2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function HostListingsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  const hostListings = [
    { ...listings[0], status: "Active", views: 1240, bookings: 45 },
    { ...listings[1], status: "Paused", views: 856, bookings: 12 },
    { ...listings[2], status: "Active", views: 2100, bookings: 68 },
    { ...listings[3], status: "Draft", views: 0, bookings: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Your Portfolio</h1>
            <p className="text-muted-foreground text-lg mt-2">Manage your active listings and drafts.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-muted/50 p-1 rounded-xl">
                <Button 
                  variant={view === "grid" ? "secondary" : "ghost"} 
                  size="icon" 
                  onClick={() => setView("grid")}
                  className="rounded-lg h-10 w-10 shadow-sm"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={view === "list" ? "secondary" : "ghost"} 
                  size="icon" 
                  onClick={() => setView("list")}
                  className="rounded-lg h-10 w-10 shadow-sm"
                >
                  <List className="h-4 w-4" />
                </Button>
             </div>
             <Link href="/host/create-listing">
              <Button className="rounded-2xl h-12 px-8 bg-primary font-bold shadow-lg flex items-center gap-2">
                <Plus className="h-5 w-5" /> New Listing
              </Button>
            </Link>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in duration-500">
            {hostListings.map((item) => (
              <div key={item.id} className="group relative">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                   <Badge className={cn(
                     "border-none shadow-md font-bold px-3 py-1",
                     item.status === "Active" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                   )}>
                    {item.status}
                   </Badge>
                </div>
                <ListingCard listing={item} />
                <div className="mt-4 flex items-center justify-between">
                   <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                      <span>{item.views} Views</span>
                      <span>{item.bookings} Bookings</span>
                   </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <MoreHorizontal className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            {hostListings.map((item) => (
              <Card key={item.id} className="border-border/60 shadow-sm rounded-3xl overflow-hidden hover:border-primary/20 transition-all">
                <CardContent className="p-4 flex items-center gap-6">
                   <div className="h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {item.location}</p>
                   </div>
                   <div className="hidden md:flex flex-col items-center px-8 border-x border-border/40">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Earnings</p>
                      <p className="font-bold">ZMW {(item.bookings * item.price * 0.95).toLocaleString()}</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <Badge className={cn(
                        "border-none shadow-sm font-bold",
                        item.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                      )}>
                        {item.status}
                      </Badge>
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2"><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2"><Power className="h-4 w-4" /></Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
