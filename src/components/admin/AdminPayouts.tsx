"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  Search,
  Banknote,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  CalendarDays,
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
import { cn } from "@/lib/utils";
import { mockPayouts } from "@/lib/mock-admin-data";
import type { PayoutRecord } from "@/lib/mock-admin-data";
import { useLoading, withLoading } from "@/lib/loading-context";
import { showSuccess, showWarning } from "@/lib/admin-toast";

//Status Config ──────────────────────────────────────────────────────

const payoutStatusConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  failed: { label: "Failed", icon: XCircle, className: "bg-rose-50 text-rose-700 border-rose-200" },
};

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  mobile_money: "Mobile Money",
  paypal: "PayPal",
};

//Payout Card ────────────────────────────────────────────────────────

function PayoutCard({
  payout,
  onProcess,
}: {
  payout: PayoutRecord;
  onProcess: (id: string) => void;
}) {
  const { setLoading, setLoadingMessage } = useLoading();
  const cfg = payoutStatusConfig[payout.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {payout.hostName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-foreground truncate">{payout.hostName}</h4>
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full text-[8px] font-bold uppercase tracking-wider px-2 py-0.5",
                  cfg.className,
                )}
              >
                <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                {cfg.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <CalendarDays className="h-3 w-3 shrink-0" />
              {payout.period}
              <span className="text-muted-foreground/40">·</span>
              {methodLabels[payout.method]}
              <span className="text-muted-foreground/40">·</span>
              {payout.bookingRefs.length} booking{payout.bookingRefs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-foreground">K{payout.netAmount.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">
            <span className="text-emerald-600 font-semibold">
              K{payout.amount.toLocaleString()}
            </span>{" "}
            gross
          </p>
        </div>
      </div>

      {/* Commission Detail */}
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium">
          Commission:{" "}
          <span className="text-foreground font-semibold">
            K{payout.commission.toLocaleString()}
          </span>
        </span>
        <span className="text-muted-foreground/30">·</span>
        <span>
          Net:{" "}
          <span className="text-foreground font-semibold">
            K{payout.netAmount.toLocaleString()}
          </span>
        </span>
        {payout.processedAt && (
          <>
            <span className="text-muted-foreground/30">·</span>
            <span>
              Processed{" "}
              {new Date(payout.processedAt).toLocaleDateString("en-ZM", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      {payout.status === "pending" && (
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold"
            onClick={() =>
              withLoading(
                setLoading,
                setLoadingMessage,
                async () => {
                  await new Promise((r) => setTimeout(r, 1000));
                  onProcess(payout.id);
                  showSuccess(
                    "Payout processed",
                    `K${payout.netAmount.toLocaleString()} has been sent to ${payout.hostName}.`,
                  );
                },
                "Processing payout...",
              )
            }
          >
            <Banknote className="h-3.5 w-3.5 mr-1" /> Process Payout
          </Button>
        </div>
      )}

      {payout.status === "failed" && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <Button
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold"
            onClick={() =>
              withLoading(
                setLoading,
                setLoadingMessage,
                async () => {
                  await new Promise((r) => setTimeout(r, 1000));
                  onProcess(payout.id);
                  showSuccess(
                    "Payout retried",
                    `K${payout.netAmount.toLocaleString()} payout to ${payout.hostName} has been retried.`,
                  );
                },
                "Retrying payout...",
              )
            }
          >
            <Banknote className="h-3.5 w-3.5 mr-1" /> Retry Payout
          </Button>
        </div>
      )}
    </div>
  );
}

//Main Component ─────────────────────────────────────────────────────

export function AdminPayouts() {
  const [payouts, setPayouts] = useState<PayoutRecord[]>(mockPayouts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const stats = useMemo(
    () => ({
      total: payouts.length,
      totalGross: payouts.reduce((s, p) => s + p.amount, 0),
      totalCommission: payouts.reduce((s, p) => s + p.commission, 0),
      totalNet: payouts.reduce((s, p) => s + p.netAmount, 0),
      pending: payouts.filter((p) => p.status === "pending").length,
      processing: payouts.filter((p) => p.status === "processing").length,
      paid: payouts.filter((p) => p.status === "paid").length,
      failed: payouts.filter((p) => p.status === "failed").length,
      pendingAmount: payouts
        .filter((p) => p.status === "pending" || p.status === "processing")
        .reduce((s, p) => s + p.netAmount, 0),
    }),
    [payouts],
  );

  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      const matchesSearch =
        !search ||
        p.hostName.toLowerCase().includes(search.toLowerCase()) ||
        p.period.toLowerCase().includes(search.toLowerCase()) ||
        p.method.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payouts, search, statusFilter]);

  const handleProcess = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "paid" as const, processedAt: new Date().toISOString() } : p,
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
                  Payout Management
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  K{stats.totalGross.toLocaleString()} total payouts processed
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-amber-600 font-semibold">
                  K{(stats.pendingAmount / 1000).toFixed(0)}k
                </span>{" "}
                pending payout
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
                placeholder="Search by host name or period..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl border-border/60 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-10 rounded-xl border-border/60">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
              <p className="text-2xl font-bold text-foreground">
                K{(stats.totalGross / 1000).toFixed(0)}k
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Gross Payouts
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
              <p className="text-2xl font-bold text-emerald-600">
                K{(stats.totalCommission / 1000).toFixed(0)}k
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Commission Earned
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.paid}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Processed
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm card-shadow text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Pending
              </p>
            </div>
          </div>
        </div>

        {/* Payouts List */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6 pb-16 space-y-3">
          {filteredPayouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <DollarSign className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No payouts found</h3>
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
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredPayouts.map((payout) => (
              <PayoutCard key={payout.id} payout={payout} onProcess={handleProcess} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
