"use client";

import { useState, useMemo } from "react";
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  DollarSign,
  Bed,
  Ticket,
  Bus,
  AlertTriangle,
  Gem,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { mockPendingListings, statsFromListings } from "@/lib/mock-admin-data";
import type { PendingListing } from "@/lib/mock-admin-data";
import { showSuccess, showWarning } from "@/lib/admin-toast";

// Type Helpers

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

const listingStatusStyles: Record<string, string> = {
  pending_review: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

// Listing Card

function ListingCard({
  listing,
  onApprove,
  onReject,
}: {
  listing: PendingListing;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const TypeIcon = typeIcons[listing.type];
  const statusClass = listingStatusStyles[listing.status];
  const [approving, setApproving] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const statusLabel =
    listing.status === "pending_review"
      ? "Pending Review"
      : listing.status === "approved"
        ? "Approved"
        : "Rejected";

  const handleApprove = () => {
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      onApprove(listing.id);
      showSuccess(
        `"${listing.name}" approved`,
        "The listing has been published and is now visible to guests.",
      );
    }, 800);
  };

  const handleReject = () => {
    setRejecting(true);
    setTimeout(() => {
      setRejecting(false);
      setRejectDialogOpen(false);
      onReject(listing.id);
      showWarning(`"${listing.name}" rejected`, "The host will be notified of this decision.");
    }, 800);
  };

  return (
    <div className="group rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-muted">
          <img src={listing.image} alt={listing.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
            <TypeIcon className="h-3 w-3" />
            <span>{typeLabels[listing.type]}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-bold text-foreground truncate">{listing.name}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 shrink-0" />
                {listing.location}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5",
                statusClass,
              )}
            >
              {statusLabel}
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />K{listing.price}
            </span>
            <span>
              by <strong>{listing.hostName}</strong>
            </span>
            <span>
              Submitted{" "}
              {new Date(listing.submittedAt).toLocaleDateString("en-ZM", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Actions */}
          {listing.status === "pending_review" && (
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                className="h-8 rounded-lg text-sm font-semibold"
                onClick={handleApprove}
                disabled={approving}
              >
                {approving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                  </>
                )}
              </Button>
              <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg text-sm font-semibold border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">
                      Reject &quot;{listing.name}&quot;?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-muted-foreground">
                      The host will be notified and the listing will not be published. You can
                      provide a reason below.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3">
                    <textarea
                      placeholder="Reason for rejection (optional)..."
                      rows={3}
                      className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-base placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                  </div>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="rounded-xl font-semibold border-border/60">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReject}
                      disabled={rejecting}
                      className="rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-bold"
                    >
                      {rejecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1.5" /> Reject Listing
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {listing.status === "rejected" && listing.reason && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50/50 border border-rose-100 p-3 text-sm text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <p>{listing.reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Component

export function AdminListings() {
  const [listings, setListings] = useState<PendingListing[]>(mockPendingListings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending_review" | "approved" | "rejected"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "stay" | "experience" | "transport">("all");

  const listingStats = useMemo(() => statsFromListings(listings), [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch =
        !search ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.hostName.toLowerCase().includes(search.toLowerCase()) ||
        l.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      const matchesType = typeFilter === "all" || l.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [listings, search, statusFilter, typeFilter]);

  const handleApprove = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "approved" as const } : l)),
    );
  };

  const handleReject = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "rejected" as const } : l)),
    );
  };

  return (
    <div className="flex-1 min-h-screen bg-[#faf9f5]">
      <AdminPageHeader
        eyebrow="Moderation"
        title="Listing Moderation"
        description={`${listingStats.total} submissions — ${listingStats.pendingReview} pending review`}
        actions={
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/80">
              <span className="font-semibold text-white">{listingStats.approved}</span> approved
            </span>
            {listingStats.pendingReview > 0 && (
              <Badge
                variant="outline"
                className="rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f2ba0d] text-[#1f1433] border-none"
              >
                {listingStats.pendingReview} pending
              </Badge>
            )}
          </div>
        }
      />

      {/* Filters */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 relative z-10">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-card p-3 shadow-sm card-shadow">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search listings by name, host, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-border/60 text-base"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
            <SelectTrigger className="w-[140px] h-10 rounded-xl border-border/60">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="stay">Stays</SelectItem>
              <SelectItem value="experience">Experiences</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
          >
            <SelectTrigger className="w-[160px] h-10 rounded-xl border-border/60">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listings */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6 pb-8 space-y-3">
        {filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Building2 className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No listings found</h3>
            <p className="text-base text-muted-foreground mt-1 max-w-sm">
              {search || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No listings have been submitted for moderation yet."}
            </p>
            {(search || statusFilter !== "all" || typeFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-6 rounded-full text-sm font-semibold"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>

      {/* Stats Row */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6 pb-16">
        <h3 className="text-[10px] sm:text-sm font-bold text-[#1f1433] uppercase tracking-widest mb-3">
          Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {" "}
          <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
            <p className="text-2xl font-bold text-foreground">{listingStats.total}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Total
            </p>
          </div>
          <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
            <p className="text-2xl font-bold text-amber-600">{listingStats.pendingReview}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Pending Review
            </p>
          </div>
          <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
            <p className="text-2xl font-bold text-emerald-600">{listingStats.approved}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Approved
            </p>
          </div>
          <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
            <p className="text-2xl font-bold text-rose-600">{listingStats.rejected}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Rejected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
