"use client";

import { useState, useMemo } from "react";
import {
  Scale,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  DollarSign,
  Bed,
  Ticket,
  Bus,
  ChevronDown,
  ChevronUp,
  Gem,
  Download,
  FileSpreadsheet,
  RotateCcw,
  User,
  Building2,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { mockDisputes } from "@/lib/mock-admin-data";
import type { DisputeCase } from "@/lib/mock-admin-data";
import { useLoading, withLoading } from "@/lib/loading-context";
import { showSuccess, showWarning, showInfo } from "@/lib/admin-toast";
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

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-neutral-50 text-neutral-600 border-neutral-200" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-700 border-amber-200/80" },
  high: { label: "High", className: "bg-rose-50 text-rose-700 border-rose-200/80" },
  critical: { label: "Critical", className: "bg-red-50 text-red-700 border-red-200 font-semibold" },
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> =
  {
    open: {
      label: "Open",
      icon: AlertTriangle,
      className: "bg-rose-50 text-rose-700 border-rose-200/80",
    },
    investigating: {
      label: "Investigating",
      icon: Clock,
      className: "bg-amber-50 text-amber-700 border-amber-200/80",
    },
    resolved_host: {
      label: "Resolved (Host)",
      icon: CheckCircle2,
      className: "bg-blue-50 text-blue-700 border-blue-200/80",
    },
    resolved_guest: {
      label: "Resolved (Guest)",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
    refunded: {
      label: "Refunded",
      icon: DollarSign,
      className: "bg-purple/10 text-purple border-purple/20",
    },
    closed: {
      label: "Closed",
      icon: ShieldAlert,
      className: "bg-neutral-100 text-neutral-600 border-neutral-200",
    },
  };

// Dispute Card

function DisputeCard({
  dispute,
  onResolve,
  onRefund,
  onClose,
}: {
  dispute: DisputeCase;
  onResolve: (id: string, inFavor: "host" | "guest") => void;
  onRefund: (id: string) => void;
  onClose: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [resolveDialog, setResolveDialog] = useState<"host" | "guest" | null>(null);
  const { setLoading, setLoadingMessage } = useLoading();
  const TypeIcon = typeIcons[dispute.listingType] || Scale;
  const priCfg = priorityConfig[dispute.priority] || priorityConfig.medium;
  const statCfg = statusConfig[dispute.status] || statusConfig.open;
  const StatusIcon = statCfg.icon;

  const daysOpen = Math.floor(
    (Date.now() - new Date(dispute.raisedAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  const handleResolve = (inFavor: "host" | "guest") => {
    setResolveDialog(null);
    onResolve(dispute.id, inFavor);
    showSuccess(
      `Case ${inFavor === "host" ? "resolved in host's favor" : "resolved in guest's favor"}`,
      `Dispute for "${dispute.listingName}" has been resolved.`,
    );
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white shadow-2xs transition-all duration-200",
        dispute.status === "open" || dispute.status === "investigating"
          ? "border-neutral-200/80 hover:border-neutral-300"
          : "border-neutral-200/60 opacity-95",
      )}
    >
      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div
              className={cn(
                "h-11 w-11 shrink-0 rounded-xl flex items-center justify-center border",
                dispute.priority === "critical"
                  ? "bg-red-50 text-red-600 border-red-200/80"
                  : dispute.priority === "high"
                    ? "bg-rose-50 text-rose-600 border-rose-200/80"
                    : "bg-purple/10 text-purple border-purple/15",
              )}
            >
              <Scale className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-neutral-900 text-base truncate">
                  {dispute.listingName}
                </h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full text-[11px] font-semibold tracking-wide px-2.5 py-0.5",
                    priCfg.className,
                  )}
                >
                  {priCfg.label} Priority
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full text-[11px] font-semibold tracking-wide px-2.5 py-0.5",
                    statCfg.className,
                  )}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statCfg.label}
                </Badge>
              </div>
              <p className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                <span className="font-medium text-neutral-800">{dispute.reason}</span>
                <span className="text-neutral-300">·</span>
                <span className="font-mono">Ref: {dispute.bookingRef}</span>
                <span className="text-neutral-300">·</span>
                <span>{daysOpen}d open</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 h-8 w-8 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Quick Info */}
        <div className="mt-3.5 pt-3.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <TypeIcon className="h-3.5 w-3.5 text-neutral-400" />
              {typeLabels[dispute.listingType]}
            </span>
            <span className="text-neutral-300">·</span>
            <span>
              <strong className="font-semibold text-neutral-900">{dispute.guestName}</strong> (guest) vs{" "}
              <strong className="font-semibold text-neutral-900">{dispute.hostName}</strong> (host)
            </span>
            <span className="text-neutral-300">·</span>
            <span className="font-semibold text-neutral-900">
              K{dispute.amount.toLocaleString()} disputed
            </span>
            <span className="text-neutral-300">·</span>
            <span className="capitalize text-neutral-500">Raised by {dispute.raisedBy}</span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-purple hover:underline"
          >
            {expanded ? "Hide Details" : "View Case Details →"}
          </button>
        </div>

        {/* Expanded Detail */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-neutral-100 space-y-4">
            <div className="rounded-xl bg-neutral-50/80 border border-neutral-200/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Description
              </p>
              <p className="text-sm text-neutral-800 leading-relaxed">{dispute.description}</p>
            </div>

            {dispute.resolution && (
              <div className="rounded-xl bg-blue-50/50 border border-blue-200/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1.5">
                  Resolution
                </p>
                <p className="text-sm text-blue-900">{dispute.resolution}</p>
              </div>
            )}

            {/* Actions */}
            {(dispute.status === "open" || dispute.status === "investigating") && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button
                  size="sm"
                  className="h-8.5 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => setResolveDialog("guest")}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Resolve in Guest&apos;s Favor
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8.5 px-3 rounded-xl text-xs font-semibold border-neutral-200/80 text-blue-700 hover:bg-blue-50/50"
                  onClick={() => setResolveDialog("host")}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Resolve in Host&apos;s Favor
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8.5 px-3 rounded-xl text-xs font-semibold border-neutral-200/80 text-neutral-700 hover:bg-neutral-50"
                  onClick={() => {
                    withLoading(
                      setLoading,
                      setLoadingMessage,
                      async () => {
                        await new Promise((r) => setTimeout(r, 600));
                        showInfo(
                          "Marked as investigating",
                          "Case has been flagged for further review.",
                        );
                      },
                      "Updating case...",
                    );
                  }}
                >
                  <Clock className="h-3.5 w-3.5 mr-1 text-neutral-400" />
                  Mark Investigating
                </Button>
              </div>
            )}

            {dispute.status === "resolved_host" || dispute.status === "resolved_guest" ? (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="h-8.5 px-3 rounded-xl text-xs font-semibold bg-purple hover:bg-purple/95 text-white"
                  onClick={() => {
                    withLoading(
                      setLoading,
                      setLoadingMessage,
                      async () => {
                        await new Promise((r) => setTimeout(r, 800));
                        onRefund(dispute.id);
                        showSuccess(
                          "Refund processed",
                          `K${(dispute.amount * 0.5).toLocaleString()} has been refunded to the guest.`,
                        );
                      },
                      "Processing refund...",
                    );
                  }}
                >
                  <DollarSign className="h-3.5 w-3.5 mr-1" />
                  Process Partial Refund (50%)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8.5 px-3 rounded-xl text-xs font-semibold border-neutral-200/80 text-neutral-700 hover:bg-neutral-50"
                  onClick={() => {
                    withLoading(
                      setLoading,
                      setLoadingMessage,
                      async () => {
                        await new Promise((r) => setTimeout(r, 600));
                        onClose(dispute.id);
                        showInfo("Case closed", "This dispute has been closed without refund.");
                      },
                      "Closing case...",
                    );
                  }}
                >
                  <ShieldAlert className="h-3.5 w-3.5 mr-1 text-neutral-400" />
                  Close Case
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Resolve Confirmation */}
      <AlertDialog open={resolveDialog !== null} onOpenChange={() => setResolveDialog(null)}>
        <AlertDialogContent className="rounded-2xl max-w-md bg-white border border-neutral-200/80 p-6 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-neutral-900">
              Resolve in {resolveDialog === "guest" ? "Guest's" : "Host's"} Favor?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-neutral-500 mt-2">
              {resolveDialog === "guest"
                ? `This will mark the dispute in favor of ${dispute.guestName}. You'll be able to process a refund after resolution.`
                : `This will mark the dispute in favor of ${dispute.hostName}. No refund will be issued.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-5">
            <AlertDialogCancel className="rounded-xl font-semibold text-xs border-neutral-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resolveDialog && handleResolve(resolveDialog)}
              className="rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-semibold"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Confirm Resolution
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Main Component

export function AdminDisputes() {
  const [disputes, setDisputes] = useState<DisputeCase[]>(mockDisputes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const stats = useMemo(
    () => ({
      total: disputes.length,
      open: disputes.filter((d) => d.status === "open").length,
      investigating: disputes.filter((d) => d.status === "investigating").length,
      resolved: disputes.filter(
        (d) => d.status === "resolved_host" || d.status === "resolved_guest",
      ).length,
      closed: disputes.filter((d) => d.status === "closed" || d.status === "refunded").length,
      critical: disputes.filter((d) => d.priority === "critical").length,
      high: disputes.filter((d) => d.priority === "high").length,
      disputedAmount: disputes.reduce((s, d) => s + d.amount, 0),
    }),
    [disputes],
  );

  const filteredDisputes = useMemo(() => {
    return disputes.filter((d) => {
      const matchesSearch =
        !search ||
        d.listingName.toLowerCase().includes(search.toLowerCase()) ||
        d.guestName.toLowerCase().includes(search.toLowerCase()) ||
        d.hostName.toLowerCase().includes(search.toLowerCase()) ||
        d.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
        d.reason.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || d.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [disputes, search, statusFilter, priorityFilter]);

  const handleResolve = (id: string, inFavor: "host" | "guest") => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: inFavor === "host" ? ("resolved_host" as const) : ("resolved_guest" as const),
              resolvedAt: new Date().toISOString(),
            }
          : d,
      ),
    );
  };

  const handleRefund = (id: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "refunded" as const } : d)),
    );
  };

  const handleClose = (id: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "closed" as const,
              resolvedAt: new Date().toISOString(),
              resolution: "Case closed after review — no further action required.",
            }
          : d,
      ),
    );
  };

  const handleExportCSV = () => {
    const headers = [
      "Dispute ID",
      "Booking Ref",
      "Listing Name",
      "Listing Type",
      "Guest Name",
      "Host Name",
      "Disputed Amount (ZMW)",
      "Priority",
      "Status",
      "Reason",
      "Raised By",
      "Raised Date",
    ];

    const rows = filteredDisputes.map((d) => [
      d.id,
      d.bookingRef,
      `"${d.listingName}"`,
      d.listingType,
      `"${d.guestName}"`,
      `"${d.hostName}"`,
      d.amount,
      d.priority,
      d.status,
      `"${d.reason}"`,
      d.raisedBy,
      d.raisedAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nearbyescapes-disputes-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Disputes CSV export downloaded successfully");
  };

  return (
    <div className="flex-1 min-h-screen bg-neutral-50/50 pb-16">
      <AdminPageHeader
        eyebrow="Resolution Center & Support"
        title="Disputes & Resolution"
        description={`${stats.total} cases — K${stats.disputedAmount.toLocaleString()} total disputed`}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-9 px-3.5 rounded-xl text-xs font-semibold border-neutral-200/80 bg-white hover:bg-neutral-50 shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-neutral-500" />
              Export CSV
            </Button>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search by listing, guest, host, or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-sm focus:bg-white transition-all"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px] h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-xs font-medium">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-xs font-medium">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved_host">Resolved (Host)</SelectItem>
              <SelectItem value="resolved_guest">Resolved (Guest)</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cases List */}
        <div className="space-y-3">
          {filteredDisputes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-2xs">
              <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
                <Scale className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900">No disputes found</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5 rounded-xl text-xs font-semibold"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredDisputes.map((dispute) => (
              <DisputeCard
                key={dispute.id}
                dispute={dispute}
                onResolve={handleResolve}
                onRefund={handleRefund}
                onClose={handleClose}
              />
            ))
          )}
        </div>

        {/* Stats Row */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
            Resolution Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
              <p className="text-2xl font-semibold text-neutral-900">{stats.total}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Total Cases</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
              <p className="text-2xl font-semibold text-amber-600">{stats.open}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Open</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
              <p className="text-2xl font-semibold text-emerald-600">{stats.resolved}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Resolved</p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
              <p className="text-2xl font-semibold text-blue-600">
                K{(stats.disputedAmount / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">Disputed Amount</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
