"use client";

import { useState, useMemo, useEffect } from "react";
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
  ChevronRight,
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
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-purple/10 text-purple border-purple/20",
  draft: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

type FilterType = "all" | "active" | "pending" | "draft";

// Draft Card (continue-where-you-left-off)
function DraftCard({ draft }: { draft: ListingDraft }) {
  const TypeIcon = typeIcons[draft.type] ?? Bed;
  const pct = draft.progressPercent;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-purple/30 bg-white shadow-2xs p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-purple/10 border border-purple/20 px-2.5 py-0.5 text-[10px] font-bold text-purple uppercase tracking-wider flex items-center gap-1">
          <TypeIcon className="h-3.5 w-3.5" />
          {typeLabels[draft.type] ?? "Listing"}
        </span>
        <span className="rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
          Draft
        </span>
      </div>

      <div>
        <h3 className="text-sm font-bold text-neutral-900 truncate">
          {draft.title || "Untitled draft"}
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">
          Saved{" "}
          {new Date(draft.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
          <span className="text-neutral-500">{pct}% complete</span>
          <span className="text-neutral-400">Step {Math.min(draft.currentStep + 1, 99)}</span>
        </div>
        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple rounded-full transition-all duration-300"
            style={{ width: `${Math.max(4, pct)}%` }}
          />
        </div>
      </div>

      <Link
        href={ROUTES?.listingDrafts?.editor ? ROUTES.listingDrafts.editor(draft.id, draft.currentStep + 1) : `/listings/create/${draft.id}?step=${draft.currentStep + 1}`}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple text-white text-xs font-bold h-9 hover:bg-purple-hover transition-colors shadow-xs"
      >
        <PlayCircle className="h-3.5 w-3.5" />
        Resume
        <ArrowRight className="h-3 w-3 ml-0.5" />
      </Link>
    </div>
  );
}

function ListingCard({ listing }: { listing: HostListing }) {
  const TypeIcon = typeIcons[listing.type] ?? Bed;
  const statusClass = statusStyles[listing.status];
  const [imgError, setImgError] = useState(false);

  const bookingCount = useMemo(
    () => mockHostBookings.filter((b) => b.listingId === listing.id).length,
    [listing.id],
  );

  return (
    <Link
      href={`/host/listings/${listing.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-300 text-4xl font-bold">
            {listing.name.charAt(0)}
          </div>
        ) : (
          <img
            src={listing.image}
            alt={listing.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-neutral-800 uppercase tracking-wider flex items-center gap-1 shadow-2xs">
            <TypeIcon className="h-3 w-3 text-purple" />
            <span>{typeLabels[listing.type]}</span>
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border shadow-2xs",
              statusClass,
            )}
          >
            {listing.status}
          </span>
        </div>

        {/* View details overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-bold shadow-md flex items-center gap-1.5 text-neutral-900">
            <Eye className="h-3.5 w-3.5 text-purple" />
            Manage Listing
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-1 mb-1.5">
          {listing.rating > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-[#f2ba0d] text-[#f2ba0d]" />
              <span className="text-xs font-bold text-neutral-900">
                {listing.rating.toFixed(1)}
              </span>
              <span className="text-xs text-neutral-400">
                · {bookingCount} booking{bookingCount !== 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <span className="text-xs text-neutral-400 font-medium">New listing</span>
          )}
        </div>

        <h3 className="text-base font-bold text-neutral-900 truncate group-hover:text-purple transition-colors">
          {listing.name}
        </h3>

        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <span className="truncate">{listing.location}</span>
        </p>

        <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-base font-black text-neutral-900">K{listing.price}</span>
            <span className="text-xs text-neutral-500 font-normal">
              {" "}
              /
              {listing.type === "stay" ? "night" : listing.type === "transport" ? "seat" : "person"}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-purple group-hover:text-purple-hover transition-colors">
            View details <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Performance micro-bar */}
        {listing.revenue > 0 && (
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
            <span className="flex items-center gap-1 text-neutral-700">
              <DollarSign className="h-3 w-3 text-purple" />K{listing.revenue.toLocaleString()}{" "}
              earned
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3 text-neutral-400" />
              {listing.bookings} total
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function HostListingsPage() {
  const host = mockHostProfile;
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const draftsMap = useListingDraftStore((s) => s.drafts);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rawDrafts = useMemo(() => {
    if (!mounted) return [];
    return Object.values(draftsMap).filter((d) => d.hostId === "host-1");
  }, [draftsMap, mounted]);

  const sortedDrafts = useMemo(
    () =>
      [...rawDrafts]
        .filter((d) => d.status === "draft")
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [rawDrafts],
  );

  const publishedListings = useMemo<HostListing[]>(() => {
    return rawDrafts
      .filter((d) => d.status === "live")
      .map((d) => {
        const form = (d.form || {}) as Record<string, any>;
        const price =
          Number(form.baseRate) ||
          Number(form.priceAdult) ||
          Number(form.dailyRate) ||
          1200;
        const location = form.city || form.meetingPoint || form.address || "Zambia";
        return {
          id: d.id,
          name: d.title || "New Listing",
          type: d.type,
          location,
          status: "active" as const,
          image:
            Array.isArray(form.images) && form.images[0]
              ? form.images[0]
              : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
          price,
          bookings: 0,
          rating: 5.0,
          revenue: 0,
        };
      });
  }, [rawDrafts]);

  const allListings = useMemo(() => {
    return [...publishedListings, ...host.listings];
  }, [publishedListings, host.listings]);

  const stats = useMemo(() => {
    return {
      total: allListings.length,
      active: allListings.filter((l) => l.status === "active").length,
      pending: allListings.filter((l) => l.status === "pending").length,
      draft: sortedDrafts.length + allListings.filter((l) => l.status === "draft").length,
    };
  }, [allListings, sortedDrafts.length]);

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      if (activeFilter !== "all" && listing.status !== activeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          listing.name.toLowerCase().includes(q) ||
          listing.location.toLowerCase().includes(q) ||
          listing.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allListings, activeFilter, searchQuery]);

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "active", label: "Active", count: stats.active },
    { id: "pending", label: "Pending", count: stats.pending },
    { id: "draft", label: "Draft", count: stats.draft },
  ];

  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <HostPageHeader
        title="My Listings"
        description="Manage, update, and monitor performance across all your properties and services."
        actions={
          <Link
              href="/host/create"
              className="inline-flex items-center gap-1.5 border border-neutral-200 hover:border-purple/40 bg-white hover:bg-purple/5 text-neutral-600 hover:text-purple text-xs font-medium px-3.5 py-2 rounded-xl transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="font-normal">New listing</span>
            </Link>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 space-y-8">
        {/* Filters + Search bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {filters.map(({ id, label, count }) => {
              const isActive = activeFilter === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-purple text-white shadow-xs"
                      : "bg-white border border-neutral-200/80 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50",
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                      isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative shrink-0 w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9.5 rounded-xl border-neutral-200/80 bg-white text-sm focus:border-purple focus:ring-1 focus:ring-purple/20"
            />
          </div>
        </div>

        {/* Drafts Section */}
        {sortedDrafts.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="font-display text-lg md:text-xl font-bold text-neutral-900 tracking-tight">
                Your Drafts
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Continue where you left off — all progress is automatically saved.
              </p>
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
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center shadow-2xs">
            <div className="h-16 w-16 rounded-2xl bg-purple/10 text-purple flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">
              {searchQuery
                ? "No listings match your search"
                : activeFilter === "active"
                  ? "No active listings"
                  : activeFilter === "pending"
                    ? "No pending listings"
                    : activeFilter === "draft"
                      ? "No draft listings"
                      : "No listings yet"}
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              {searchQuery
                ? "Try searching for a different name, city, or property type."
                : activeFilter !== "all"
                  ? `You have no listings currently in the "${activeFilter}" state.`
                  : "List your stays, experiences, or transport to start earning."}
            </p>
            {searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="rounded-xl text-xs font-semibold border-neutral-200"
              >
                Clear search
              </Button>
            ) : (
              <Button className="bg-purple hover:bg-purple-hover text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all border-none" asChild>
                <Link href="/host/create">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Create your first listing
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
