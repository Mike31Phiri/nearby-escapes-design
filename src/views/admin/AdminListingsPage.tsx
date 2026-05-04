"use client";

import { useState } from "react";
import { Search, MoreHorizontal, CheckCircle, XCircle, AlertTriangle, Home, MapPin, DollarSign, Star, Image as ImageIcon, LayoutGrid, List as ListIcon, ExternalLink } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const listings = [
  {
    id: 1,
    name: "Mosi-oa-Tunya Lodge",
    host: "Chanda Mulenga",
    type: "accommodation",
    status: "approved",
    price: "K2,500",
    location: "Livingstone",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    name: "Luangwa Tented Camp",
    host: "Grace Banda",
    type: "accommodation",
    status: "pending",
    price: "K3,200",
    location: "South Luangwa",
    rating: 0,
    reviews: 0,
    image: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    name: "Victoria Falls Boat Ride",
    host: "Mike Phiri",
    type: "gem",
    status: "approved",
    price: "K850",
    location: "Livingstone",
    rating: 4.8,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    name: "Skyline Boutique Suite",
    host: "Bwalya Katebe",
    type: "accommodation",
    status: "rejected",
    price: "K1,800",
    location: "Lusaka",
    rating: 3.5,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    name: "South Luangwa Safari",
    host: "John Tembo",
    type: "gem",
    status: "approved",
    price: "K4,500",
    location: "South Luangwa",
    rating: 5.0,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1516422317778-9d5a7ae59139?auto=format&fit=crop&q=80&w=800",
  },
];

type Listing = (typeof listings)[0];

export function AdminListingsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.name.toLowerCase().includes(search.toLowerCase()) ||
      listing.host.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || listing.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout
      title="Listing Management"
      description="Moderate, review, and manage all property and experience listings on the platform"
    >
      {/* Filters & Controls */}
      <div className="flex flex-col xl:flex-row gap-6 mb-10 items-start xl:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
           <div className="flex p-1 bg-muted/50 rounded-2xl border border-border/40 shrink-0">
              {(["all", "approved", "pending", "rejected"] as const).map((status) => (
                <Button
                  key={status}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter(status)}
                  className={cn(
                    "capitalize px-5 rounded-xl font-bold transition-all",
                    filter === status 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                  )}
                >
                  {status}
                </Button>
              ))}
           </div>
           <div className="flex p-1 bg-muted/50 rounded-2xl border border-border/40 shrink-0">
               <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setView("grid")}
                  className={cn("rounded-xl transition-all", view === "grid" ? "bg-white text-primary shadow-sm" : "text-muted-foreground")}
               >
                  <LayoutGrid className="h-4 w-4" />
               </Button>
               <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setView("list")}
                  className={cn("rounded-xl transition-all", view === "list" ? "bg-white text-primary shadow-sm" : "text-muted-foreground")}
               >
                  <ListIcon className="h-4 w-4" />
               </Button>
           </div>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by listing name or host..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl focus-visible:ring-primary/20 placeholder:text-muted-foreground/60 font-bold"
          />
        </div>
      </div>

      {/* Listings Grid */}
      {view === "grid" ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <Card 
               key={listing.id} 
               className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white group cursor-pointer"
               onClick={() => setSelectedListing(listing)}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={listing.image} alt={listing.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                   <Badge
                     variant={
                       listing.status === "approved"
                         ? "default"
                         : listing.status === "pending"
                           ? "secondary"
                           : "destructive"
                     }
                     className={cn(
                        "capitalize px-3 py-1 rounded-xl text-[10px] font-black border-none shadow-lg",
                        listing.status === "approved" && "bg-emerald-500",
                        listing.status === "pending" && "bg-orange-500 text-white",
                        listing.status === "rejected" && "bg-red-500"
                     )}
                   >
                     {listing.status}
                   </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <p className="text-white text-xs font-bold flex items-center gap-2">Click to moderate <ArrowUpRight className="h-3 w-3" /></p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-lg text-foreground group-hover:text-primary transition-colors">{listing.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-1">
                       <MapPin className="h-3 w-3" />
                       {listing.location}
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="font-black text-primary">{listing.price}</p>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">per night</p>
                  </div>
                </div>
                
                <Separator className="my-5 opacity-50" />
                
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                         <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                            {listing.host.charAt(0)}
                         </AvatarFallback>
                      </Avatar>
                      <div>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Host</p>
                         <p className="text-xs font-bold text-foreground">{listing.host}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-1 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                      {listing.rating > 0 ? listing.rating.toFixed(1) : "New"}
                   </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white">
           <CardContent className="p-0">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-border/40 bg-muted/20">
                       <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Listing</th>
                       <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Host</th>
                       <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Price</th>
                       <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Status</th>
                       <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/30">
                    {filteredListings.map((listing) => (
                       <tr key={listing.id} className="group hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedListing(listing)}>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                                   <img src={listing.image} alt="" className="h-full w-full object-cover" />
                                </div>
                                <p className="font-bold text-[15px]">{listing.name}</p>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-muted-foreground">{listing.host}</td>
                          <td className="px-8 py-5 font-black">{listing.price}</td>
                          <td className="px-8 py-5">
                             <Badge variant="secondary" className={cn("capitalize rounded-lg px-2.5 py-0.5 text-[10px] font-black", 
                                listing.status === "approved" ? "text-emerald-600 bg-emerald-50" : 
                                listing.status === "pending" ? "text-orange-500 bg-orange-50" : "text-red-500 bg-red-50")}>
                                {listing.status}
                             </Badge>
                          </td>
                          <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                             <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                             </Button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </CardContent>
        </Card>
      )}

      {filteredListings.length === 0 && (
        <div className="text-center py-24">
          <div className="bg-muted/30 h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
             <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <p className="text-lg font-bold text-foreground">No listings found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search term.</p>
        </div>
      )}

      {/* Listing Details Drawer */}
      <Sheet open={!!selectedListing} onOpenChange={(open) => !open && setSelectedListing(null)}>
         <SheetContent className="sm:max-w-xl border-l-0 shadow-2xl p-0 flex flex-col">
            {selectedListing && (
               <>
                  <div className="h-56 relative shrink-0">
                     <img src={selectedListing.image} className="w-full h-full object-cover" alt="" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                     <div className="absolute bottom-6 left-8">
                        <Badge className="mb-3 bg-white text-black hover:bg-white/90 font-black px-3 py-1 rounded-xl shadow-lg border-none">
                           {selectedListing.type}
                        </Badge>
                        <h2 className="text-2xl font-black text-white tracking-tight">{selectedListing.name}</h2>
                     </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                              <AvatarFallback className="bg-primary/10 text-primary font-black">
                                 {selectedListing.host.charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                           <div>
                              <p className="text-sm font-black">{selectedListing.host}</p>
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Platform Host</p>
                           </div>
                        </div>
                        <Button variant="outline" size="sm" className="font-bold rounded-xl h-9">Contact Host</Button>
                     </div>

                     <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-center">
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-1">Price</p>
                           <p className="text-lg font-black">{selectedListing.price}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-center">
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-1">Rating</p>
                           <p className="text-lg font-black">{selectedListing.rating > 0 ? selectedListing.rating : "N/A"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-center">
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-1">Reviews</p>
                           <p className="text-lg font-black">{selectedListing.reviews}</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Listing Overview</h4>
                        <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                           This property is located in {selectedListing.location}, Zambia. It offers a premium experience with high-quality amenities and professional service from the host.
                        </p>
                     </div>

                     <Separator />

                     <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Moderation Actions</h4>
                            <Badge variant="outline" className="font-bold text-[10px] uppercase">{selectedListing.status}</Badge>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            {selectedListing.status !== "approved" && (
                               <Button className="font-black bg-emerald-600 hover:bg-emerald-700 h-11 rounded-xl">Approve Listing</Button>
                            )}
                            {selectedListing.status !== "rejected" && (
                               <Button variant="destructive" className="font-black h-11 rounded-xl">Reject Listing</Button>
                            )}
                            <Button variant="outline" className="col-span-2 font-black h-11 rounded-xl flex items-center gap-2">
                               <ExternalLink className="h-4 w-4" /> View Public Page
                            </Button>
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
