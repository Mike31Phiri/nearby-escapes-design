import { useState } from "react";
import { Search, MoreHorizontal, CheckCircle, XCircle, AlertTriangle, Home } from "lucide-react";
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

const listings = [
  {
    id: 1,
    name: "Mosi-oa-Tunya Lodge",
    host: "Chanda Mulenga",
    type: "accommodation",
    status: "approved",
    price: "ZMW 2,500",
  },
  {
    id: 2,
    name: "Luangwa Tented Camp",
    host: "Grace Banda",
    type: "accommodation",
    status: "pending",
    price: "ZMW 3,200",
  },
  {
    id: 3,
    name: "Victoria Falls Boat Ride",
    host: "Mike Phiri",
    type: "gem",
    status: "approved",
    price: "ZMW 850",
  },
  {
    id: 4,
    name: "Skyline Boutique Suite",
    host: "Bwalya Katebe",
    type: "accommodation",
    status: "rejected",
    price: "ZMW 1,800",
  },
  {
    id: 5,
    name: "South Luangwa Safari",
    host: "John Tembo",
    type: "gem",
    status: "approved",
    price: "ZMW 4,500",
  },
];

export function AdminListingsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

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
      description="Moderate and manage property and experience listings"
    >
      {/* Filters */}
      <Card className="border-border/60 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or host..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "approved", "pending", "rejected"] as const).map((status) => (
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

      {/* Listings Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="border-border/60 overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Home className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold">{listing.name}</h3>
                  <p className="text-sm text-muted-foreground">Hosted by {listing.host}</p>
                </div>
                <Badge
                  variant={
                    listing.status === "approved"
                      ? "default"
                      : listing.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                  className="capitalize"
                >
                  {listing.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-semibold">{listing.price}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit listing</DropdownMenuItem>
                    {listing.status === "pending" && (
                      <>
                        <DropdownMenuItem className="text-green-600">Approve</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Reject</DropdownMenuItem>
                      </>
                    )}
                    {listing.status === "approved" && (
                      <DropdownMenuItem className="text-red-600">Remove listing</DropdownMenuItem>
                    )}
                    {listing.status === "rejected" && (
                      <DropdownMenuItem className="text-green-600">Reinstate</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card className="border-border/60">
          <CardContent className="text-center py-12 text-muted-foreground">
            No listings found matching your criteria.
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
