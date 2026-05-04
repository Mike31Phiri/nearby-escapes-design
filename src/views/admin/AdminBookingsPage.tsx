"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Calendar, Users, DollarSign, MapPin, Clock, CheckCircle, AlertTriangle, XCircle, ArrowUpRight } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const bookings = [
  {
    id: "BK-2847",
    guest: "Mike Phiri",
    listing: "Mosi-oa-Tunya Lodge",
    dates: "Mar 15-18, 2026",
    nights: 3,
    amount: "K7,500",
    status: "confirmed",
    location: "Livingstone",
    paymentStatus: "paid",
  },
  {
    id: "BK-2846",
    guest: "Chanda Mulenga",
    listing: "Victoria Falls Boat Ride",
    dates: "Feb 22, 2026",
    nights: 1,
    amount: "K1,700",
    status: "pending",
    location: "Livingstone",
    paymentStatus: "pending",
  },
  {
    id: "BK-2845",
    guest: "Bwalya Katebe",
    listing: "Luangwa Tented Camp",
    dates: "Apr 5-10, 2026",
    nights: 5,
    amount: "K16,000",
    status: "confirmed",
    location: "South Luangwa",
    paymentStatus: "partial",
  },
  {
    id: "BK-2844",
    guest: "Grace Banda",
    listing: "Skyline Boutique Suite",
    dates: "Jan 28-30, 2026",
    nights: 2,
    amount: "K3,600",
    status: "cancelled",
    location: "Lusaka",
    paymentStatus: "refunded",
  },
  {
    id: "BK-2843",
    guest: "John Tembo",
    listing: "South Luangwa Safari",
    dates: "May 12-15, 2026",
    nights: 3,
    amount: "K18,000",
    status: "confirmed",
    location: "South Luangwa",
    paymentStatus: "paid",
  },
];

type Booking = (typeof bookings)[0];

export function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guest.toLowerCase().includes(search.toLowerCase()) ||
      booking.listing.toLowerCase().includes(search.toLowerCase()) ||
      booking.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || booking.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout title="Booking Management" description="View and manage all platform bookings across all categories">
      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-2xl border border-border/40">
          {(["all", "confirmed", "pending", "cancelled"] as const).map((status) => (
            <Button
              key={status}
              variant="ghost"
              size="sm"
              onClick={() => setFilter(status)}
              className={cn(
                "capitalize px-6 rounded-xl font-bold transition-all",
                filter === status 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50"
              )}
            >
              {status}
            </Button>
          ))}
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by ID, guest, or listing..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl focus-visible:ring-primary/20 placeholder:text-muted-foreground/60 font-medium"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">ID & Guest</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Listing</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Schedule</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Amount</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Status</th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    className="group hover:bg-primary/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <td className="px-8 py-6">
                       <div>
                          <p className="font-mono text-xs font-bold text-primary group-hover:underline transition-all mb-1">{booking.id}</p>
                          <p className="font-bold text-[15px]">{booking.guest}</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div>
                          <p className="font-bold text-[14px] text-foreground/90">{booking.listing}</p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 font-semibold">
                             <MapPin className="h-3 w-3" />
                             {booking.location}
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-sm">
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 font-bold text-foreground/80">
                             <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                             {booking.dates}
                          </div>
                          <p className="text-xs text-muted-foreground/70 font-semibold pl-5">{booking.nights} nights</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="font-black text-[16px]">{booking.amount}</p>
                       <p className={cn(
                          "text-[10px] font-black uppercase tracking-widest mt-1",
                          booking.paymentStatus === "paid" ? "text-emerald-600" : 
                          booking.paymentStatus === "pending" ? "text-orange-500" : "text-muted-foreground"
                       )}>{booking.paymentStatus}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {booking.status === "confirmed" && (
                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span className="capitalize text-[10px] font-black">Confirmed</span>
                          </div>
                        )}
                        {booking.status === "pending" && (
                          <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100/50">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="capitalize text-[10px] font-black">Pending</span>
                          </div>
                        )}
                        {booking.status === "cancelled" && (
                          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100/50">
                            <XCircle className="h-3.5 w-3.5" />
                            <span className="capitalize text-[10px] font-black">Cancelled</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-border/40 shadow-xl p-1.5 min-w-[160px]">
                          <DropdownMenuItem onClick={() => setSelectedBooking(booking)} className="rounded-lg font-semibold text-sm py-2">View details</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg font-semibold text-sm py-2">Contact guest</DropdownMenuItem>
                          <Separator className="my-1.5" />
                          {booking.status === "pending" && (
                            <DropdownMenuItem className="text-emerald-600 font-semibold text-sm rounded-lg py-2">
                              Confirm booking
                            </DropdownMenuItem>
                          )}
                          {booking.status !== "cancelled" && (
                            <DropdownMenuItem className="text-destructive font-semibold text-sm rounded-lg py-2">
                              Cancel booking
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBookings.length === 0 && (
            <div className="text-center py-24">
              <div className="bg-muted/30 h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                 <Search className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-lg font-bold text-foreground">No bookings found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Drawer */}
      <Sheet open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <SheetContent className="sm:max-w-md border-l-0 shadow-2xl p-0 flex flex-col">
          {selectedBooking && (
            <>
              <div className="h-32 bg-[image:var(--gradient-hero)] shrink-0" />
              <div className="px-8 -mt-10 relative flex-1 overflow-y-auto pb-10">
                 <div className="h-20 w-20 bg-white rounded-2xl shadow-lg mb-6 flex items-center justify-center border-4 border-white">
                    <Calendar className="h-8 w-8 text-primary" />
                 </div>
                 
                 <SheetHeader className="text-left space-y-1">
                    <SheetTitle className="text-2xl font-black">{selectedBooking.id}</SheetTitle>
                    <SheetDescription className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                       {selectedBooking.listing} · {selectedBooking.location}
                    </SheetDescription>
                 </SheetHeader>

                 <div className="mt-8 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Amount Paid</p>
                          <p className="text-xl font-black mt-1">{selectedBooking.amount}</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Nights</p>
                          <p className="text-xl font-black mt-1">{selectedBooking.nights}</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Guest Information</h4>
                          <div className="flex items-center gap-3">
                             <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                   {selectedBooking.guest.charAt(0)}
                                </AvatarFallback>
                             </Avatar>
                             <div>
                                <p className="text-sm font-bold">{selectedBooking.guest}</p>
                                <p className="text-xs text-muted-foreground font-semibold">Verified Traveler</p>
                             </div>
                             <Button variant="ghost" size="sm" className="ml-auto text-xs font-bold text-primary">View Profile</Button>
                          </div>
                       </div>

                       <Separator />

                       <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Booking Timeline</h4>
                          <div className="space-y-4">
                             <div className="flex gap-4">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <div>
                                   <p className="text-sm font-bold text-foreground/90">Check-in</p>
                                   <p className="text-xs text-muted-foreground font-semibold mt-0.5">{selectedBooking.dates.split("-")[0]}</p>
                                </div>
                             </div>
                             <div className="flex gap-4">
                                <div className="h-2 w-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                                <div>
                                   <p className="text-sm font-bold text-foreground/90">Checkout</p>
                                   <p className="text-xs text-muted-foreground font-semibold mt-0.5">{selectedBooking.dates.split("-")[1]}</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="pt-4 space-y-3">
                       <Button className="w-full font-bold h-11 rounded-xl">Generate Invoice</Button>
                       <Button variant="outline" className="w-full font-bold h-11 rounded-xl">Message Host</Button>
                       {selectedBooking.status === "pending" ? (
                          <Button className="w-full font-bold h-11 rounded-xl mt-4 bg-emerald-600 hover:bg-emerald-700">Confirm Booking</Button>
                       ) : selectedBooking.status !== "cancelled" ? (
                          <Button variant="destructive" className="w-full font-bold h-11 rounded-xl mt-4">Cancel Booking</Button>
                       ) : null}
                    </div>
                 </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
