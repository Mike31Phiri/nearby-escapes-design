"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Star, MessageCircle, ChevronRight, Clock, History, Ban } from "lucide-react";
import Link from "next/link";
import { listings } from "@/lib/mock-data";

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 md:px-6 py-10 md:py-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-10">My Bookings</h1>

        <Tabs defaultValue="upcoming" className="space-y-10">
          <TabsList className="bg-muted/50 p-1.5 rounded-2xl h-auto">
            <TabsTrigger value="upcoming" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm md:text-base flex items-center gap-2">
              <Clock className="h-4 w-4" /> Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm md:text-base flex items-center gap-2">
              <History className="h-4 w-4" /> Past
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold text-sm md:text-base flex items-center gap-2">
              <Ban className="h-4 w-4" /> Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {[1].map((i) => (
              <Card key={i} className="border-border/60 shadow-lg rounded-3xl overflow-hidden group hover:border-primary/30 transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-72 h-48 md:h-auto relative overflow-hidden">
                    <img src="https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=300" alt="Listing" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-emerald-500 text-white border-none font-bold">Confirmed</Badge>
                    </div>
                  </div>
                  <CardContent className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest mb-1">Stay • Livingstone</p>
                          <h3 className="text-xl md:text-2xl font-bold tracking-tight">Victoria Falls Waterfront Lodge</h3>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-sm font-bold text-foreground">ZMW 4,645.00</p>
                          <p className="text-xs text-muted-foreground">Total Paid</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 py-4 border-y border-border/40">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Check-in</p>
                          <p className="text-sm font-bold">May 15, 2024</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Check-out</p>
                          <p className="text-sm font-bold">May 20, 2024</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                      <Link href="/booking/detail/1" className="w-full sm:w-auto">
                        <Button className="w-full h-12 rounded-xl bg-primary font-bold shadow-md">View details</Button>
                      </Link>
                      <Button variant="outline" className="w-full sm:w-auto h-12 rounded-xl border-2 font-bold flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" /> Message Host
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-border/60 shadow-lg rounded-3xl overflow-hidden opacity-80">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-72 h-48 md:h-auto relative overflow-hidden grayscale">
                  <img src="https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=300" alt="Listing" className="h-full w-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-muted text-muted-foreground border-none font-bold">Completed</Badge>
                  </div>
                </div>
                <CardContent className="flex-1 p-6 md:p-8">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-widest mb-1">Experience • Chipata</p>
                        <h3 className="text-xl font-bold tracking-tight">South Luangwa Safari Drive</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">August 12, 2023 • 2 Guests</p>
                    <Link href="/booking/review/1">
                      <Button className="rounded-xl font-bold bg-[image:var(--gradient-hero)] text-white h-12 px-8 mt-4 shadow-lg">Leave a Review</Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="py-20 text-center bg-muted/20 rounded-[40px] border border-dashed border-border">
              <Ban className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-xl font-bold">No cancelled bookings</h3>
              <p className="text-muted-foreground">Everything is looking good!</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
