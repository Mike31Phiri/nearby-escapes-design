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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

//Type Helpers ───────────────────────────────────────────────────────

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
  low: { label: "Low", className: "bg-zinc-50 text-zinc-600 border-zinc-200" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-700 border-amber-200" },
  high: { label: "High", className: "bg-rose-50 text-rose-700 border-rose-200" },
  critical: { label: "Critical", className: "bg-red-50 text-red-800 border-red-300" },
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> =
  {
    open: {
      label: "Open",
      icon: AlertTriangle,
      className: "bg-rose-50 text-rose-700 border-rose-200",
    },
    investigating: {
      label: "Investigating",
      icon: Clock,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    resolved_host: {
      label: "Resolved (Host)",
      icon: CheckCircle2,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    resolved_guest: {
      label: "Resolved (Guest)",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    refunded: {
      label: "Refunded",
      icon: DollarSign,
      className: "bg-violet-50 text-violet-700 border-violet-200",
    },
    closed: {
      label: "Closed",
      icon: ShieldAlert,
      className: "bg-zinc-50 text-zinc-600 border-zinc-200",
    },
  };

//Dispute Card ───────────────────────────────────────────────────────

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
  const TypeIcon = typeIcons[dispute.listingType];
  const priCfg = priorityConfig[dispute.priority];
  const statCfg = statusConfig[dispute.status];
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
        "rounded-xl border shadow-sm transition-all duration-200",
        dispute.status === "open" || dispute.status === "investigating"
          ? "border-border/50 bg-card hover:shadow-md"
          : "border-border/30 bg-card/50",
      )}
    >
      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={cn(
                "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center",
                dispute.priority === "critical"
                  ? "bg-red-50 text-red-600"
                  : dispute.priority === "high"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-muted text-muted-foreground",
              )}
            >
              <Scale className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-foreground truncate">{dispute.listingName}</h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full text-[8px] font-bold uppercase tracking-wider px-2 py-0.5",
                    priCfg.className,
                  )}
                >
                  {priCfg.label} Priority
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full text-[8px] font-bold uppercase tracking-wider px-2 py-0.5",
                    statCfg.className,
                  )}
                >
                  <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                  {statCfg.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-foreground">{dispute.reason}</span>
                <span className="text-muted-foreground/40">·</span>
                <span>Ref: {dispute.bookingRef}</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{daysOpen}d open</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Quick Info */}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <TypeIcon className="h-3 w-3" />
            {typeLabels[dispute.listingType]}
          </span>
          <span>
            <strong>{dispute.guestName}</strong> (guest) vs <strong>{dispute.hostName}</strong>{" "}
            (host)
          </span>
          <span className="font-semibold text-foreground">
            K{dispute.amount.toLocaleString()} disputed
          </span>
          <span className="capitalize">Raised by {dispute.raisedBy}</span>
        </div>

        {/* Expanded Detail */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border/30 space-y-4">
            <div className="rounded-lg bg-muted/40 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Description
              </p>
              <p className="text-sm text-foreground leading-relaxed">{dispute.description}</p>
            </div>

            {dispute.resolution && (
              <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1.5">
                  Resolution
                </p>
                <p className="text-sm text-blue-800">{dispute.resolution}</p>
              </div>
            )}

            {/* Actions */}
            {(dispute.status === "open" || dispute.status === "investigating") && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button
                  size="sm"
                  className="h-8 rounded-lg text-xs font-semibold"
                  onClick={() => setResolveDialog("guest")}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Resolve in Guest&apos;s Favor
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg text-xs font-semibold border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => setResolveDialog("host")}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Resolve in Host&apos;s Favor
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg text-xs font-semibold"
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
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Mark Investigating
                </Button>
              </div>
            )}

            {dispute.status === "resolved_host" || dispute.status === "resolved_guest" ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-8 rounded-lg text-xs font-semibold"
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
                  className="h-8 rounded-lg text-xs font-semibold"
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
                  <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                  Close Case
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Resolve Confirmation */}
      <AlertDialog open={resolveDialog !== null} onOpenChange={() => setResolveDialog(null)}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              Resolve in {resolveDialog === "guest" ? "Guest's" : "Host's"} Favor?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {resolveDialog === "guest"
                ? `This will mark the dispute in favor of ${dispute.guestName}. You'll be able to process a refund after resolution.`
                : `This will mark the dispute in favor of ${dispute.hostName}. No refund will be issued.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-semibold border-border/60">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => resolveDialog && handleResolve(resolveDialog)}
              className="rounded-xl bg-primary text-white hover:bg-primary/90 font-bold"
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

//Main Component ─────────────────────────────────────────────────────

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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="flex-1">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-8">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-6 md:pt-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Disputes &amp; Resolution
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.total} cases — K{stats.disputedAmount.toLocaleString()} total disputed
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {stats.critical > 0 && (
                  <Badge
                    variant="outline"
                    className="rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border-red-200"
                  >
                    {stats.critical} critical
                  </Badge>
                )}
                <span className="text-muted-foreground">
                  <span className="font-semibold text-amber-600">{stats.open}</span> open
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-emerald-600 font-semibold">{stats.resolved} resolved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-card p-3 shadow-sm card-shadow">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by listing, guest, host, or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl border-border/60 text-sm"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] h-10 rounded-xl border-border/60">
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
              <SelectTrigger className="w-[160px] h-10 rounded-xl border-border/60">
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
        </div>

        {/* Stats Row */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Cases
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.open}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Open
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
              <p className="text-2xl font-bold text-emerald-600">{stats.resolved}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Resolved
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
              <p className="text-2xl font-bold text-blue-600">
                K{(stats.disputedAmount / 1000).toFixed(0)}k
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Disputed Amount
              </p>
            </div>
          </div>
        </div>

        {/* Cases List */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6 pb-16 space-y-3">
          {filteredDisputes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Scale className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No disputes found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 rounded-full text-xs font-semibold"
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
      </div>
    </div>
  );
}
