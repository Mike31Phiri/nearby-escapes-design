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
  Download,
  Send,
  Eye,
  CreditCard,
  Building2,
  Smartphone,
  ShieldCheck,
  Receipt,
  FileSpreadsheet,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { mockPayouts } from "@/lib/mock-admin-data";
import type { PayoutRecord } from "@/lib/mock-admin-data";
import { useLoading, withLoading } from "@/lib/loading-context";
import { showSuccess, showWarning } from "@/lib/admin-toast";
import { toast } from "sonner";

// Status Config

const payoutStatusConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200/80",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    className: "bg-blue-50 text-blue-700 border-blue-200/80",
  },
  paid: {
    label: "Processed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-rose-50 text-rose-700 border-rose-200/80",
  },
};

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank Wire (ZANACO)",
  mobile_money: "Mobile Money (Airtel/MTN)",
  paypal: "PayPal International",
};

const methodIcons: Record<string, React.ElementType> = {
  bank_transfer: Building2,
  mobile_money: Smartphone,
  paypal: CreditCard,
};

// Batch Payout Modal
function BatchPayoutModal({
  open,
  onOpenChange,
  pendingPayouts,
  onConfirmAll,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingPayouts: PayoutRecord[];
  onConfirmAll: () => void;
}) {
  const { setLoading, setLoadingMessage } = useLoading();
  const totalNet = pendingPayouts.reduce((sum, p) => sum + p.netAmount, 0);

  const handleExecuteBatch = () => {
    withLoading(
      setLoading,
      setLoadingMessage,
      async () => {
        await new Promise((r) => setTimeout(r, 1200));
        onConfirmAll();
        onOpenChange(false);
        showSuccess(
          "Batch Disbursed",
          `Successfully processed ${pendingPayouts.length} payouts totaling K${totalNet.toLocaleString()}.`,
        );
      },
      "Initiating Mobile Money & Bank gateway batch...",
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white border border-neutral-200/80 rounded-2xl shadow-xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-neutral-100 bg-neutral-50/50">
          <DialogTitle className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
            <Banknote className="h-5 w-5 text-purple" />
            Batch Disburse Pending Payouts
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            Review and trigger immediate automated bank wires and mobile money disbursements.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-purple/5 border border-purple/15 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple">
                Total Disbursement Batch
              </p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                K{totalNet.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-purple text-white border-none text-xs">
                {pendingPayouts.length} Host Accounts
              </Badge>
              <p className="text-[11px] text-neutral-500 mt-1">Ready for settlement</p>
            </div>
          </div>

          <div className="border border-neutral-200/80 rounded-xl divide-y divide-neutral-100 max-h-60 overflow-y-auto">
            {pendingPayouts.map((p) => (
              <div key={p.id} className="p-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-neutral-900">{p.hostName}</p>
                  <p className="text-neutral-500">{methodLabels[p.method] || p.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">K{p.netAmount.toLocaleString()}</p>
                  <p className="text-[10px] text-neutral-400">Net after 15% fee</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            className="rounded-xl text-xs font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white"
            onClick={handleExecuteBatch}
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Disburse K{totalNet.toLocaleString()} Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Single Payout Detail Modal
function PayoutAuditDialog({
  payout,
  open,
  onOpenChange,
  onProcess,
}: {
  payout: PayoutRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcess: (id: string) => void;
}) {
  const { setLoading, setLoadingMessage } = useLoading();
  if (!payout) return null;

  const cfg = payoutStatusConfig[payout.status] || payoutStatusConfig.pending;
  const StatusIcon = cfg.icon;
  const MethodIcon = methodIcons[payout.method] || Building2;

  const handleProcessNow = () => {
    withLoading(
      setLoading,
      setLoadingMessage,
      async () => {
        await new Promise((r) => setTimeout(r, 900));
        onProcess(payout.id);
        onOpenChange(false);
        showSuccess(
          "Payout Processed",
          `K${payout.netAmount.toLocaleString()} has been sent to ${payout.hostName}.`,
        );
      },
      "Processing payout...",
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white border border-neutral-200/80 rounded-2xl shadow-xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn("rounded-full text-[11px] font-semibold px-2.5 py-0.5", cfg.className)}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {cfg.label}
            </Badge>
            <span className="text-xs text-neutral-400 font-mono">ID: {payout.id}</span>
          </div>
          <DialogTitle className="text-xl font-semibold text-neutral-900 mt-2">
            {payout.hostName}
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Payout Settlement Period: {payout.period}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-neutral-200/80 divide-y divide-neutral-100 bg-neutral-50/50">
            <div className="p-3.5 flex justify-between items-center text-sm">
              <span className="text-neutral-600">Gross Booking Volume</span>
              <span className="font-semibold text-neutral-900">
                K{payout.amount.toLocaleString()} gross
              </span>
            </div>
            <div className="p-3.5 flex justify-between items-center text-sm bg-purple/5">
              <span className="text-purple font-medium">Commission Deducted (15%)</span>
              <span className="font-semibold text-purple">
                K{payout.commission.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 flex justify-between items-center text-sm">
              <span className="text-neutral-600">Net Host Remittance</span>
              <span className="font-semibold text-emerald-600">
                K{payout.netAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200/80 bg-white">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2.5 flex items-center gap-1.5">
              <MethodIcon className="h-3.5 w-3.5 text-neutral-400" />
              Disbursement Method
            </h4>
            <p className="text-sm font-semibold text-neutral-900">
              {methodLabels[payout.method] || payout.method}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Associated with {payout.bookingRefs.length} guest stay
              {payout.bookingRefs.length !== 1 ? "s" : ""}: {payout.bookingRefs.join(", ")}
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            className="rounded-xl text-xs font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {payout.status === "pending" && (
            <Button
              className="rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleProcessNow}
            >
              <Banknote className="h-3.5 w-3.5 mr-1" />
              Process Payout
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Payout Card

function PayoutCard({
  payout,
  onProcess,
  onInspect,
}: {
  payout: PayoutRecord;
  onProcess: (id: string) => void;
  onInspect: (payout: PayoutRecord) => void;
}) {
  const { setLoading, setLoadingMessage } = useLoading();
  const cfg = payoutStatusConfig[payout.status] || payoutStatusConfig.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-neutral-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-purple/10 border border-purple/15 flex items-center justify-center text-purple font-semibold text-base">
            {payout.hostName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="font-semibold text-neutral-900 text-base truncate">{payout.hostName}</h4>
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full text-[11px] font-semibold tracking-wide px-2.5 py-0.5",
                  cfg.className,
                )}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {cfg.label}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
              {payout.period}
              <span className="text-neutral-300">·</span>
              {methodLabels[payout.method] || payout.method}
              <span className="text-neutral-300">·</span>
              {payout.bookingRefs.length} booking{payout.bookingRefs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-semibold text-neutral-900">
            K{payout.netAmount.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-500">
            <span className="text-emerald-600 font-semibold">
              K{payout.amount.toLocaleString()}
            </span>{" "}
            gross
          </p>
        </div>
      </div>

      {/* Commission Detail */}
      <div className="mt-3.5 pt-3.5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
        <div className="flex items-center gap-3">
          <span>
            Commission:{" "}
            <span className="text-neutral-900 font-semibold">
              K{payout.commission.toLocaleString()}
            </span>
          </span>
          <span className="text-neutral-300">·</span>
          <span>
            Net:{" "}
            <span className="text-neutral-900 font-semibold">
              K{payout.netAmount.toLocaleString()}
            </span>
          </span>
          {payout.processedAt && (
            <>
              <span className="text-neutral-300">·</span>
              <span className="text-neutral-400">
                Processed{" "}
                {new Date(payout.processedAt).toLocaleDateString("en-ZM", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {payout.status === "pending" && (
            <Button
              size="sm"
              className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
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
          )}

          {payout.status === "failed" && (
            <Button
              size="sm"
              className="h-8 px-3 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
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
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 rounded-lg text-xs font-semibold border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            onClick={() => onInspect(payout)}
          >
            <Eye className="h-3.5 w-3.5 mr-1 text-neutral-400" /> Details
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Component

export function AdminPayouts() {
  const [payouts, setPayouts] = useState<PayoutRecord[]>(mockPayouts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayout, setSelectedPayout] = useState<PayoutRecord | null>(null);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

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

  const handleConfirmAll = () => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.status === "pending"
          ? { ...p, status: "paid" as const, processedAt: new Date().toISOString() }
          : p,
      ),
    );
  };

  const handleExportCSV = () => {
    const headers = [
      "Payout ID",
      "Host Name",
      "Period",
      "Payment Method",
      "Gross Amount (ZMW)",
      "Commission (ZMW)",
      "Net Payout (ZMW)",
      "Status",
      "Processed At",
    ];

    const rows = filteredPayouts.map((p) => [
      p.id,
      `"${p.hostName}"`,
      `"${p.period}"`,
      p.method,
      p.amount,
      p.commission,
      p.netAmount,
      p.status,
      p.processedAt || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nearbyescapes-payouts-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Payouts CSV export downloaded");
  };

  return (
    <div className="flex-1 min-h-screen bg-neutral-50/50 pb-16">
      <AdminPageHeader
        eyebrow="Finances & Settlements"
        title="Payout Management"
        description={`K${stats.totalGross.toLocaleString()} total payouts processed`}
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
            {stats.pending > 0 && (
              <Button
                size="sm"
                onClick={() => setIsBatchOpen(true)}
                className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white shadow-2xs"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Disburse Pending ({stats.pending})
              </Button>
            )}
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search by host name or period..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-sm focus:bg-white transition-all"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-xs font-medium">
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

        {/* Payouts Stream */}
        <div className="space-y-3">
          {filteredPayouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-2xs">
              <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
                <DollarSign className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900">No payouts found</h3>
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
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredPayouts.map((payout) => (
              <PayoutCard
                key={payout.id}
                payout={payout}
                onProcess={handleProcess}
                onInspect={(p) => setSelectedPayout(p)}
              />
            ))
          )}
        </div>

        {/* Stats Row */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
            Financial Settlement Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
              <p className="text-2xl font-semibold text-neutral-900">
                K{(stats.totalGross / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Gross Payouts
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
              <p className="text-2xl font-semibold text-emerald-600">
                K{(stats.totalCommission / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Commission Earned
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
              <p className="text-2xl font-semibold text-blue-600">{stats.paid}</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Processed
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
              <p className="text-2xl font-semibold text-amber-600">{stats.pending}</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pending
              </p>
            </div>
          </div>
        </div>
      </div>

      <BatchPayoutModal
        open={isBatchOpen}
        onOpenChange={setIsBatchOpen}
        pendingPayouts={payouts.filter((p) => p.status === "pending")}
        onConfirmAll={handleConfirmAll}
      />

      <PayoutAuditDialog
        payout={selectedPayout}
        open={!!selectedPayout}
        onOpenChange={(open) => {
          if (!open) setSelectedPayout(null);
        }}
        onProcess={handleProcess}
      />
    </div>
  );
}
