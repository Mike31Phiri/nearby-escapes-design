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
  Gem,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockHostProfile } from "@/lib/mock-profile-data";
import type { HostListing } from "@/lib/mock-profile-data";
import { mockHostBookings } from "@/lib/mock-host-bookings";
import { ROUTES } from "@/lib/constants/routes";
import { useShallow } from "zustand/react/shallow";
import { selectHostDrafts, useListingDraftStore } from "@/store/listingDraftStore";
import type { ListingDraft } from "@/types/listing";

// Type helpers

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: Bus,
  gem: Gem,
};

const typeLabels: Record<string, string> = {
  stay: "Stay",
  experience: "Experience",
  transport: "Transport",
  gem: "Hidden Gem",
};

const statusStyles: Record<string, string> = {
  active:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  pending: "bg-[#f3eafb] text-purple border-purple/30",
  draft:
    "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
};

type FilterType = "all" | "active" | "pending" | "draft";

const HOST_ID = "host-1"; // TODO: derive from the authenticated host session

// Draft Card (continue-where-you-left-off)

function DraftCard({ draft }: { draft: ListingDraft }) {
  const TypeIcon = typeIcons[draft.type] ?? Bed;
  const pct = draft.progressPercent;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-purple/30 bg-white shadow-sm p-4 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-lg bg-[#f3eafb] px-2.5 py-1 text-[10px] font-bold text-purple uppercase tracking-wider flex items-center gap-1">
          <TypeIcon className="h-3.5 w-3.5" />
          {typeLabels[draft.type] ?? "Listing"}
        </span>
        <span className="rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">
          Draft
        </span>
      </div>

      <div>
        <h3 className="text-sm font-bold text-neutral-900 truncate">
          {draft.title || "Untitled draft"}
        </h3>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Saved{" "}
          {new Date(draft.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
          <span className="text-neutral-500">{pct}% complete</span>
          <span className="text-neutral-400">Step {Math.min(draft.currentStep + 1, 99)}</span>
        </div>
        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple rounded-full transition-all"
            style={{ width: `${Math.max(4, pct)}%` }}
          />
        </div>
      </div>

      <Link
        href={ROUTES.listingDrafts.editor(draft.id, draft.currentStep + 1)}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple text-white text-xs font-bold h-9 hover:bg-purple-hover transition-colors"
      >
        <PlayCircle className="h-3.5 w-3.5" />
        Resume
        <ArrowRight className="h-3 w-3 ml-0.5" />
      </Link>
    </div>
  );
}

// Listing Card

function ListingCard({ listing }: { listing: HostListing }) {
  const TypeIcon = typeIcons[listing.type];
  const statusClass = statusStyles[listing.status];
  const [imgError, setImgError] = useState(false);

  // Count bookings for this listing from mock data
  const bookingCount = useMemo(
    () => mockHostBookings.filter((b) => b.listingId === listing.id).length,
    [listing.id],
  );

  return (
    <Link
      href={`/host/listings/${listing.id}`}
      className="group block rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-primary/30"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100 rounded-t-xl">
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-5xl font-bold">
            {listing.name.charAt(0)}
          </div>
        ) : (
          <img
            src={listing.image}
            alt={listing.name}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <TypeIcon className="h-3.5 w-3.5" />
            <span>{typeLabels[listing.type]}</span>
          </div>
          <div
            className={cn(
              "rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border",
              statusClass,
            )}
          >
            {listing.status}
          </div>
        </div>
        {/* View details overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
          <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold shadow-lg flex items-center gap-1.5 text-neutral-900">
            <Eye className="h-3.5 w-3.5" />
            View Details
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-base font-bold text-neutral-900 truncate group-hover:text-primary transition-colors">
            {listing.name}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            {listing.location}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            {listing.rating > 0 && (
              <div className="flex items-center gap-0.5 text-sm font-semibold text-neutral-900">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {listing.rating.toFixed(1)}
              </div>
            )}
            <span className="text-[10px] text-gray-400 font-medium">
              {bookingCount} booking{bookingCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-neutral-900">K{listing.price}</p>
            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">
              /{""}
              {listing.type === "stay" ? "night" : listing.type === "transport" ? "seat" : "person"}
            </p>
          </div>
        </div>

        {/* Performance micro-bar */}
        {listing.revenue > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />K{listing.revenue.toLocaleString()} earned
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

// Main Page

export function HostListingsPage() {
  const listings = mockHostProfile.listings;
  // useShallow keeps the snapshot referentially stable (the selector builds a
  // new array each call) — avoids React's "getSnapshot should be cached" loop.
  const drafts = useListingDraftStore(useShallow(selectHostDrafts(HOST_ID)));
  const sortedDrafts = useMemo(
    () => [...drafts].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    [drafts],
  );
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
    const draft = listings.filter((l) => l.status === "draft").length + sortedDrafts.length;
    const totalRevenue = listings.reduce((sum, l) => sum + l.revenue, 0);
    const totalBookings = listings.reduce((sum, l) => sum + l.bookings, 0);
    return {
      active,
      pending,
      draft,
      totalRevenue,
      totalBookings,
      total: listings.length + sortedDrafts.length,
    };
  }, [listings, sortedDrafts]);

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "active", label: "Active", count: stats.active },
    { id: "pending", label: "Pending", count: stats.pending },
    { id: "draft", label: "Draft", count: stats.draft },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <HostPageHeader
        title="My Listings"
        description="Manage and monitor all your properties and services"
        actions={
          <Button
            className="h-10 px-5 rounded-xl text-base font-bold bg-purple text-white hover:bg-purple-hover shadow-sm border-none"
            asChild
          >
            <Link href="/host/create">
              <Plus className="h-4 w-4 mr-1.5" />
              New Listing
            </Link>
          </Button>
        }
      />

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex border-b border-gray-200 gap-0 overflow-x-auto">
          {filters.map(({ id, label, count }) => {
            const isActive = activeFilter === id;
            return (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={cn(
                  "flex items-center gap-2 pb-3 px-4 text-sm font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-neutral-900 hover:border-gray-300",
                )}
              >
                {label}
                <span
                  className={cn(
                    "ml-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold",
                    isActive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative shrink-0 w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-9 rounded-xl border-gray-200 text-base"
          />
        </div>
      </div>

      {/* Drafts — continue where you left off */}
      {sortedDrafts.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Your drafts</h2>
              <p className="text-sm text-gray-500">
                Continue where you left off — nothing is lost.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDrafts.map((draft) => (
              <DraftCard key={draft.id} draft={draft} />
            ))}
          </div>
        </section>
      )}

      {/* Listing Grid */}
      {filteredListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
            <Building2 className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
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
          <p className="text-base text-gray-500 max-w-sm mb-8">
            {searchQuery
              ? "Try adjusting your search terms."
              : activeFilter !== "all"
                ? `There are no listings with the"${activeFilter}"status.`
                : "Create your first listing to start hosting."}
          </p>
          {searchQuery ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="rounded-lg text-sm font-semibold border-gray-200"
            >
              Clear Search
            </Button>
          ) : (
            <Button className="rounded-lg text-sm font-bold" asChild>
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
  );
}
