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
  Eye,
  Download,
  CheckCheck,
  ShieldCheck,
  User,
  Calendar,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";

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
  pending_review: "bg-amber-50 text-amber-700 border-amber-200/80",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  rejected: "bg-rose-50 text-rose-700 border-rose-200/80",
};

// Listing Card

function ListingCard({
  listing,
  onApprove,
  onReject,
  onInspect,
}: {
  listing: PendingListing;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  onInspect: (listing: PendingListing) => void;
}) {
  const TypeIcon = typeIcons[listing.type] || Bed;
  const statusClass = listingStatusStyles[listing.status];
  const [approving, setApproving] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

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
    }, 400);
  };

  const handleReject = () => {
    setRejecting(true);
    setTimeout(() => {
      setRejecting(false);
      setRejectDialogOpen(false);
      onReject(listing.id, rejectReason);
      showWarning(`"${listing.name}" rejected`, "The host will be notified of this decision.");
    }, 400);
  };

  return (
    <div className="group rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-purple/30 hover:shadow-xs">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="relative h-32 sm:h-28 w-full sm:w-28 shrink-0 rounded-xl overflow-hidden bg-neutral-100">
          <img src={listing.image} alt={listing.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold text-white uppercase tracking-wider">
            <TypeIcon className="h-3 w-3" />
            <span>{typeLabels[listing.type]}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-sm sm:text-base text-neutral-900 truncate">
                {listing.name}
              </h4>
              <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 shrink-0 text-neutral-400" />
                {listing.location}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "rounded-full text-[10px] font-semibold px-2.5 py-0.5 shrink-0",
                statusClass,
              )}
            >
              {statusLabel}
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-900">
              K{listing.price.toLocaleString()} / night
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-neutral-400" />
              {listing.hostName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-neutral-400" />
              {new Date(listing.submittedAt).toLocaleDateString("en-ZM", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Action Row */}
          <div className="mt-3.5 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl text-xs font-semibold border-neutral-200/80 text-neutral-700 hover:bg-neutral-50"
              onClick={() => onInspect(listing)}
            >
              <Eye className="h-3.5 w-3.5 mr-1 text-purple" /> Inspect Submission
            </Button>

            {listing.status === "pending_review" && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-8 rounded-xl text-xs font-semibold bg-purple hover:bg-purple-hover text-white shadow-xs"
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
                      className="h-8 rounded-xl text-xs font-semibold border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl max-w-md bg-white p-6 shadow-xl border border-neutral-200/80">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-base font-semibold text-neutral-900">
                        Reject &quot;{listing.name}&quot;?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xs text-neutral-500">
                        Please provide a reason for the rejection. The host will be notified with recommendations to re-submit.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="mt-2">
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g., Please provide clearer interior photos and verify property permits..."
                        rows={3}
                        className="w-full rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-purple"
                      />
                    </div>
                    <AlertDialogFooter className="gap-2 pt-2">
                      <AlertDialogCancel className="rounded-xl text-xs font-semibold border-neutral-200/80">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleReject}
                        disabled={rejecting}
                        className="rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold"
                      >
                        {rejecting ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 mr-1.5" /> Confirm Rejection
                          </>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {listing.status === "rejected" && listing.reason && (
            <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-rose-50/60 border border-rose-100 p-2.5 text-xs text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <p>{listing.reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Listing Inspection Dialog

function ListingInspectionDialog({
  listing,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: {
  listing: PendingListing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
}) {
  if (!listing) return null;
  const TypeIcon = typeIcons[listing.type] || Bed;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-xl">
        <DialogHeader className="space-y-1 pb-3 border-b border-neutral-100 text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-purple bg-purple/10 border border-purple/15 px-2 py-0.5 rounded-md flex items-center gap-1">
              <TypeIcon className="h-3 w-3" />
              {typeLabels[listing.type]}
            </span>
            <Badge
              variant="outline"
              className={cn("text-[10px] font-semibold px-2 py-0.5", listingStatusStyles[listing.status])}
            >
              {listing.status === "pending_review" ? "Pending Moderation" : listing.status}
            </Badge>
          </div>
          <DialogTitle className="text-lg font-semibold text-neutral-900 mt-1">
            {listing.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-neutral-400" />
            {listing.location}, Zambia
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Image Banner */}
          <div className="relative h-48 w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80">
            <img src={listing.image} alt={listing.name} className="h-full w-full object-cover" />
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
              K{listing.price.toLocaleString()} / night
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Host Name</span>
              <span className="text-xs font-semibold text-neutral-900 mt-0.5 block">{listing.hostName}</span>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Host KYC</span>
              <span className="text-xs font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> ID Verified
              </span>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200/80 bg-neutral-50/50">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Submitted</span>
              <span className="text-xs font-semibold text-neutral-900 mt-0.5 block">
                {new Date(listing.submittedAt).toLocaleDateString("en-ZM", { dateStyle: "medium" })}
              </span>
            </div>
          </div>

          {/* Moderation Checklist */}
          <div className="p-4 rounded-xl border border-neutral-200/80 bg-white space-y-2">
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Compliance Checklist</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>High-resolution imagery supplied</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Local Zambian pricing in ZMW</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Host contact and NRC verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Clear cancellation policy declared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-100">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          {listing.status === "pending_review" && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-semibold border-rose-200 text-rose-600 hover:bg-rose-50"
                onClick={() => {
                  onReject(listing.id, "Does not meet platform guidelines");
                  onOpenChange(false);
                }}
              >
                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
              <Button
                size="sm"
                className="rounded-xl text-xs font-semibold bg-purple hover:bg-purple-hover text-white shadow-xs"
                onClick={() => {
                  onApprove(listing.id);
                  onOpenChange(false);
                }}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve Listing
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
  const [inspectedListing, setInspectedListing] = useState<PendingListing | null>(null);

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

  const handleReject = (id: string, reason?: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "rejected" as const,
              reason: reason || "Did not meet platform verification standards",
            }
          : l,
      ),
    );
  };

  const handleApproveAllPending = () => {
    const count = listings.filter((l) => l.status === "pending_review").length;
    if (count === 0) {
      toast.info("No pending listings to approve");
      return;
    }
    setListings((prev) =>
      prev.map((l) => (l.status === "pending_review" ? { ...l, status: "approved" as const } : l)),
    );
    toast.success(`Batch approved ${count} pending listings!`);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Host", "Type", "Location", "Price_ZMW", "Status", "Submitted_At"];
    const rows = filteredListings.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.hostName.replace(/"/g, '""')}"`,
      l.type,
      `"${l.location.replace(/"/g, '""')}"`,
      l.price,
      l.status,
      l.submittedAt,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `nearby-escapes-listings-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Listings exported as CSV");
  };

  return (
    <div className="flex-1 min-h-screen bg-background pb-16">
      <AdminPageHeader
        eyebrow="Moderation"
        title="Listing Moderation"
        description={`${listingStats.total} submissions — ${listingStats.pendingReview} pending review`}
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs text-neutral-600">
              <span className="font-semibold text-neutral-900">{listingStats.approved}</span> approved
            </span>
            {listingStats.pendingReview > 0 && (
              <Badge
                variant="outline"
                className="rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border-amber-200"
              >
                {listingStats.pendingReview} pending
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-9 rounded-xl text-xs font-semibold border-neutral-200/80 text-neutral-700 hover:bg-neutral-50"
            >
              <Download className="h-3.5 w-3.5 mr-1 text-neutral-500" /> Export CSV
            </Button>
            {listingStats.pendingReview > 0 && (
              <Button
                size="sm"
                onClick={handleApproveAllPending}
                className="h-9 rounded-xl text-xs font-semibold bg-purple hover:bg-purple-hover text-white shadow-xs"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" /> Approve All Pending
              </Button>
            )}
          </div>
        }
      />

      {/* Quick Status Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All Submissions", count: listingStats.total },
            { id: "pending_review", label: "Pending Review", count: listingStats.pendingReview },
            { id: "approved", label: "Approved", count: listingStats.approved },
            { id: "rejected", label: "Rejected", count: listingStats.rejected },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5 border ${
                statusFilter === tab.id
                  ? "bg-purple text-white border-purple shadow-xs"
                  : "bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Type Filter Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-3">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-2xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search listings by name, host, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-neutral-200/80 text-xs sm:text-sm bg-neutral-50/50 focus:bg-white"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
            <SelectTrigger className="w-[140px] h-10 rounded-xl border-neutral-200/80 text-xs font-semibold">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="stay">Stays</SelectItem>
              <SelectItem value="experience">Experiences</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listings List */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-6 space-y-3">
        {filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-neutral-200/80 bg-white">
            <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
              <Building2 className="h-6 w-6 text-neutral-400" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900">No listings found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm">
              {search || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No listings have been submitted for moderation yet."}
            </p>
            {(search || statusFilter !== "all" || typeFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-xl text-xs font-semibold border-neutral-200/80"
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
              onInspect={setInspectedListing}
            />
          ))
        )}
      </div>

      {/* Detailed Inspection Modal */}
      <ListingInspectionDialog
        listing={inspectedListing}
        open={Boolean(inspectedListing)}
        onOpenChange={(open) => !open && setInspectedListing(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
