"use client";

import { useState } from "react";
import { Search, MoreHorizontal, CheckCircle, XCircle, AlertTriangle, Mail, Calendar, Shield, MapPin, User as UserIcon } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const users = [
  {
    id: 1,
    name: "Mike Phiri",
    email: "mike.p@email.com",
    role: "traveler",
    status: "active",
    joined: "Jan 12, 2025",
    location: "Lusaka, Zambia",
    totalBookings: 12,
    spent: "K14,500",
  },
  {
    id: 2,
    name: "Chanda Mulenga",
    email: "chanda.m@email.com",
    role: "host",
    status: "active",
    joined: "Feb 28, 2025",
    location: "Livingstone, Zambia",
    totalBookings: 0,
    spent: "K0",
  },
  {
    id: 3,
    name: "Bwalya Katebe",
    email: "bwalya.k@email.com",
    role: "traveler",
    status: "pending",
    joined: "Mar 05, 2025",
    location: "Ndola, Zambia",
    totalBookings: 1,
    spent: "K2,200",
  },
  {
    id: 4,
    name: "Grace Banda",
    email: "grace.b@email.com",
    role: "host",
    status: "suspended",
    joined: "Dec 15, 2024",
    location: "Kitwe, Zambia",
    totalBookings: 0,
    spent: "K0",
  },
  {
    id: 5,
    name: "John Tembo",
    email: "john.t@email.com",
    role: "traveler",
    status: "active",
    joined: "Mar 10, 2025",
    location: "Lusaka, Zambia",
    totalBookings: 3,
    spent: "K6,800",
  },
];

type User = (typeof users)[0];

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "suspended">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout title="User Management" description="Monitor and manage all accounts registered on Nearby Escapes">
      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-2xl border border-border/40">
          {(["all", "active", "pending", "suspended"] as const).map((status) => (
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
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl focus-visible:ring-primary/20 placeholder:text-muted-foreground/60 font-medium"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">User</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Details</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Status</th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Joined</th>
                  <th className="px-8 py-5 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="group hover:bg-primary/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <Avatar className="h-10 w-10 border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                               {user.name.charAt(0)}
                            </AvatarFallback>
                         </Avatar>
                         <div>
                            <p className="font-bold text-foreground text-[15px] group-hover:text-primary transition-colors">{user.name}</p>
                            <p className="text-xs font-semibold text-muted-foreground mt-0.5">{user.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge
                        variant={user.role === "host" ? "default" : "secondary"}
                        className={cn(
                          "capitalize px-3 py-1 rounded-lg text-[10px] font-black",
                          user.role === "host" ? "bg-indigo-500 hover:bg-indigo-600" : "bg-muted/80"
                        )}
                      >
                        {user.role}
                      </Badge>
                      <span className="text-xs font-bold text-muted-foreground/70 ml-3">{user.location}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {user.status === "active" && (
                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span className="capitalize text-[10px] font-black">Active</span>
                          </div>
                        )}
                        {user.status === "pending" && (
                          <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100/50">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span className="capitalize text-[10px] font-black">Pending</span>
                          </div>
                        )}
                        {user.status === "suspended" && (
                          <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100/50">
                            <XCircle className="h-3.5 w-3.5" />
                            <span className="capitalize text-[10px] font-black">Suspended</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-muted-foreground/60">{user.joined}</td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-border/40 shadow-xl p-1.5 min-w-[160px]">
                          <DropdownMenuItem onClick={() => setSelectedUser(user)} className="rounded-lg font-semibold text-sm py-2">View details</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg font-semibold text-sm py-2">Edit details</DropdownMenuItem>
                          <Separator className="my-1.5" />
                          {user.status !== "suspended" ? (
                            <DropdownMenuItem className="text-destructive font-semibold text-sm rounded-lg py-2">
                              Suspend account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-emerald-600 font-semibold text-sm rounded-lg py-2">
                              Reactivate account
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
          {filteredUsers.length === 0 && (
            <div className="text-center py-24">
              <div className="bg-muted/30 h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                 <Search className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-lg font-bold text-foreground">No users found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Drawer */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="sm:max-w-md border-l-0 shadow-2xl p-0 flex flex-col">
          {selectedUser && (
            <>
              <div className="h-32 bg-[image:var(--gradient-hero)] shrink-0" />
              <div className="px-8 -mt-10 relative flex-1 overflow-y-auto pb-10">
                 <Avatar className="h-20 w-20 border-4 border-white shadow-lg mb-6">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                       {selectedUser.name.charAt(0)}
                    </AvatarFallback>
                 </Avatar>
                 
                 <SheetHeader className="text-left space-y-1">
                    <SheetTitle className="text-2xl font-black">{selectedUser.name}</SheetTitle>
                    <SheetDescription className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                       {selectedUser.role} · {selectedUser.location}
                    </SheetDescription>
                 </SheetHeader>

                 <div className="mt-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Total Bookings</p>
                          <p className="text-xl font-black mt-1">{selectedUser.totalBookings}</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Total Spent</p>
                          <p className="text-xl font-black mt-1">{selectedUser.spent}</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Account Information</h4>
                       <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm font-semibold">
                             <Mail className="h-4 w-4 text-muted-foreground" />
                             {selectedUser.email}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-semibold">
                             <Calendar className="h-4 w-4 text-muted-foreground" />
                             Joined {selectedUser.joined}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-semibold">
                             <Shield className="h-4 w-4 text-muted-foreground" />
                             Permissions: Standard {selectedUser.role}
                          </div>
                       </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                       <Button className="w-full font-bold h-11 rounded-xl">Edit User Profile</Button>
                       <Button variant="outline" className="w-full font-bold h-11 rounded-xl">Send Message</Button>
                       {selectedUser.status === "active" ? (
                          <Button variant="destructive" className="w-full font-bold h-11 rounded-xl mt-4">Suspend User</Button>
                       ) : (
                          <Button className="w-full font-bold h-11 rounded-xl mt-4 bg-emerald-600 hover:bg-emerald-700">Activate User</Button>
                       )}
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
