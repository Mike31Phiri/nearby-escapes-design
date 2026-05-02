import { useState } from "react";
import { Search, MoreHorizontal, Calendar, Users, DollarSign } from "lucide-react";
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

const bookings = [
  { id: "BK-2847", guest: "Mike Phiri", listing: "Mosi-oa-Tunya Lodge", dates: "Mar 15-18, 2026", amount: "ZMW 7,500", status: "confirmed" },
  { id: "BK-2846", guest: "Chanda Mulenga", listing: "Victoria Falls Boat Ride", dates: "Feb 22, 2026", amount: "ZMW 1,700", status: "pending" },
  { id: "BK-2845", guest: "Bwalya Katebe", listing: "Luangwa Tented Camp", dates: "Apr 5-10, 2026", amount: "ZMW 16,000", status: "confirmed" },
  { id: "BK-2844", guest: "Grace Banda", listing: "Skyline Boutique Suite", dates: "Jan 28-30, 2026", amount: "ZMW 3,600", status: "cancelled" },
  { id: "BK-2843", guest: "John Tembo", listing: "South Luangwa Safari", dates: "May 12-15, 2026", amount: "ZMW 18,000", status: "confirmed" },
];

export function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all");

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.guest.toLowerCase().includes(search.toLowerCase()) ||
      booking.listing.toLowerCase().includes(search.toLowerCase()) ||
      booking.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || booking.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout title="Booking Management" description="View and manage all platform bookings">
      {/* Filters */}
      <Card className="border-border/60 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, guest, or listing..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "confirmed", "pending", "cancelled"] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider">Booking ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider">Guest</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider">Listing</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider">Dates</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">{booking.id}</td>
                    <td className="px-6 py-4 font-medium">{booking.guest}</td>
                    <td className="px-6 py-4">{booking.listing}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {booking.dates}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{booking.amount}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="capitalize"
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Contact guest</DropdownMenuItem>
                          {booking.status === "pending" && (
                            <>
                              <DropdownMenuItem className="text-green-600">Confirm booking</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Cancel booking</DropdownMenuItem>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <DropdownMenuItem className="text-red-600">Cancel booking</DropdownMenuItem>
                          )}
                          {booking.status === "cancelled" && (
                            <DropdownMenuItem className="text-green-600">Restore booking</DropdownMenuItem>
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
            <div className="text-center py-12 text-muted-foreground">
              No bookings found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
