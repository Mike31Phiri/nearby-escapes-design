"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Star,
  DollarSign,
  Bed,
  Ticket,
  Bus,
  Plus,
  Eye,
  Search,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockHostProfile } from "@/lib/mock-profile-data";
import type { HostListing } from "@/lib/mock-profile-data";
import { mockHostBookings } from "@/lib/mock-host-bookings";

// ─── Type helpers ────────────────────────────────────────────────────────

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: Bus,
};

const typeLabels: Record<string, string> = {
  stay: "Stay",
  experience: "Experience",
  transport: "Transport",
};

const statusStyles: Record<string, string> = {
  active:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  pending:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  draft:
    "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
};

type FilterType = "all" | "active" | "pending" | "draft";

// ─── Listing Card ────────────────────────────────────────────────────────

function ListingCard({ listing }: { listing: HostListing }) {
  const TypeIcon = typeIcons[listing.type];
  const statusClass = statusStyles[listing.status];

  // Count bookings for this listing from mock data
  const bookingCount = useMemo(
    () => mockHostBookings.filter((b) => b.listingId === listing.id).length,
    [listing.id],
  );

  return (
    <Link
      href={`/host/listings/${listing.id}`}
      className="group block rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={listing.image}
          alt={listing.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <TypeIcon className="h-3.5 w-3.5" />
            <span>{typeLabels[listing.type]}</span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "rounded-full text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border shadow-sm backdrop-blur-sm",
              statusClass,
            )}
          >
            {listing.status}
          </Badge>
        </div>
        {/* View details overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="rounded-full bg-white/90 backdrop-blur-sm text-foreground px-4 py-2 text-xs font-bold shadow-xl flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            View Details
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
            {listing.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            {listing.location}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            {listing.rating > 0 && (
              <div className="flex items-center gap-0.5 text-xs font-semibold text-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {listing.rating.toFixed(1)}
              </div>
            )}
            <span className="text-[10px] text-muted-foreground font-medium">
              {bookingCount} booking{bookingCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">K{listing.price}</p>
            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
              / {listing.type === "stay" ? "night" : listing.type === "experience" ? "person" : "seat"}
            </p>
          </div>
        </div>

        {/* Performance micro-bar */}
        {listing.revenue > 0 && (
          <div className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between text-[10px] text-muted-foreground font-medium">
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              K{listing.revenue.toLocaleString()} earned
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              {listing.bookings} total
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Stats Row ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: accent ? `${accent}1a` : "var(--primary)1a",
          color: accent ?? "var(--primary)",
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────

export function HostListingsPage() {
  const listings = mockHostProfile.listings;
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = useMemo(() => {
    let result =
      activeFilter === "all" ? listings : listings.filter((l) => l.status === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.type.toLowerCase().includes(q),
      );
    }
    return result;
  }, [listings, activeFilter, searchQuery]);

  const stats = useMemo(() => {
    const active = listings.filter((l) => l.status === "active").length;
    const pending = listings.filter((l) => l.status === "pending").length;
    const draft = listings.filter((l) => l.status === "draft").length;
    const totalRevenue = listings.reduce((sum, l) => sum + l.revenue, 0);
    const totalBookings = listings.reduce((sum, l) => sum + l.bookings, 0);
    return { active, pending, draft, totalRevenue, totalBookings, total: listings.length };
  }, [listings]);

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "active", label: "Active", count: stats.active },
    { id: "pending", label: "Pending", count: stats.pending },
    { id: "draft", label: "Draft", count: stats.draft },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <main className="flex-1">
        {/* ─── Header ────────────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-8">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    My Listings
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage and monitor all your properties and services
                  </p>
                </div>
              </div>
              <Button className="rounded-full text-xs font-bold h-9 shadow-sm shadow-primary/20" asChild>
                <Link href="/host/create">
                  <Plus className="h-4 w-4 mr-1" />
                  New Listing
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ─── Stats ─────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Building2} label="Total Listings" value={String(stats.total)} accent="#8b5cf6" />
            <StatCard
              icon={Eye}
              label="Active"
              value={String(stats.active)}
              accent="#10b981"
            />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={`K${stats.totalRevenue.toLocaleString()}`}
              accent="#3b82f6"
            />
            <StatCard
              icon={BarChart3}
              label="Bookings"
              value={String(stats.totalBookings)}
              accent="#f59e0b"
            />
          </div>
        </div>

        {/* ─── Filters ───────────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex border-b border-border/50 gap-0 overflow-x-auto scrollbar-none">
              {filters.map(({ id, label, count }) => {
                const isActive = activeFilter === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveFilter(id)}
                    className={cn(
                      "flex items-center gap-2 pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all duration-200 whitespace-nowrap",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
                    )}
                  >
                    {label}
                    <span
                      className={cn(
                        "ml-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold",
                        isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative shrink-0 w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-9 rounded-xl border-border/60 text-sm"
              />
            </div>
          </div>

          {/* ─── Listing Grid ────────────────────────────────────────── */}
          {filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Building2 className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {searchQuery
                  ? "No results found"
                  : activeFilter === "active"
                    ? "No active listings"
                    : activeFilter === "pending"
                      ? "No pending listings"
                      : activeFilter === "draft"
                        ? "No draft listings"
                        : "No listings yet"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-8">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : activeFilter !== "all"
                    ? `There are no listings with the "${activeFilter}" status.`
                    : "Create your first listing to start hosting."}
              </p>
              {searchQuery ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="rounded-full font-semibold text-xs border-border/60"
                >
                  Clear Search
                </Button>
              ) : (
                <Button className="rounded-full text-xs font-bold" asChild>
                  <Link href="/host/create">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Listing
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
