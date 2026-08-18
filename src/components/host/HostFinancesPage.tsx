"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mockFinances } from "@/lib/mock-host-finances";
import type { Transaction } from "@/lib/mock-host-finances";
import { mockPayouts, payoutSummary, sumLedger } from "@/lib/mock-payout-data";
import { ROUTES } from "@/lib/constants/routes";
import { toast } from "sonner";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import {
  TrendingUp,
  TrendingDown,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Smartphone,
  Building2,
  Clock,
  RefreshCw,
  Download,
  CalendarRange,
  ArrowUpDown,
  ChevronRight,
  Wallet,
  PiggyBank,
  ReceiptText,
} from "lucide-react";

export function HostFinancesPage() {
  const router = useRouter();
  const [finances, setFinances] = useState(mockFinances);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"payouts" | "transactions">("payouts");
  const [txTab, setTxTab] = useState<"all" | "booking" | "payout" | "refund">("all");
  const [isEditingMethod, setIsEditingMethod] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState({
    type: "Airtel Money",
    account: "+260 97X XXX XXX",
    schedule: "Weekly (Every Tuesday)",
  });
  const [tempMethod, setTempMethod] = useState(payoutMethod.type);
  const [tempAccount, setTempAccount] = useState(payoutMethod.account);

  // Date range + sorting for the transaction log
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "amount-high" | "amount-low">(
    "newest",
  );

  const applyDatePreset = (days?: number) => {
    if (!days) {
      setDateFrom("");
      setDateTo("");
      return;
    }
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));
    setDateFrom(from.toISOString().split("T")[0]);
    setDateTo(to.toISOString().split("T")[0]);
  };

  const { expectedPayouts, monthlyData, recentTransactions } = finances;

  // Trend indicators derived from the monthly series
  const trends = useMemo(() => {
    const last = monthlyData[monthlyData.length - 1]?.earnings ?? 0;
    const prev = monthlyData[monthlyData.length - 2]?.earnings ?? last;
    const pct = prev > 0 ? Math.round(((last - prev) / prev) * 1000) / 10 : 0;
    return { pct, up: pct >= 0 };
  }, [monthlyData]);

  // Simulate the automatic weekly bulk payout process
  const simulateAutoPayout = () => {
    if (expectedPayouts <= 0) {
      toast.error("No pending payouts available to process");
      return;
    }

    const payoutAmount = expectedPayouts;
    const newTx: Transaction = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      type: "payout",
      description: `Automatic bulk payout to ${payoutMethod.type}`,
      amount: -payoutAmount,
      status: "paid",
    };

    setFinances((prev) => ({
      ...prev,
      totalEarnedYTD: prev.totalEarnedYTD + payoutAmount,
      expectedPayouts: 0,
      recentTransactions: [newTx, ...prev.recentTransactions],
    }));

    toast.success(
      `Simulation: Automatic bulk payment of K${payoutAmount.toLocaleString()} disbursed to your ${payoutMethod.type}!`,
    );
  };

  // Handle payout method save
  const handleSavePayoutMethod = () => {
    if (!tempAccount.trim()) {
      toast.error("Please enter a valid account or phone number");
      return;
    }

    setPayoutMethod({
      type: tempMethod,
      account: tempAccount,
      schedule:
        tempMethod === "Bank Transfer" ? "Bi-Weekly (1st & 15th)" : "Weekly (Every Tuesday)",
    });
    setIsEditingMethod(false);
    toast.success("Payout method updated successfully");
  };

  // Filtered, searched, date-ranged and sorted transactions
  const filteredTransactions = useMemo(() => {
    let list = recentTransactions.filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.guestName && tx.guestName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = txTab === "all" || tx.type === txTab;
      const matchesRange = (!dateFrom || tx.date >= dateFrom) && (!dateTo || tx.date <= dateTo);

      return matchesSearch && matchesTab && matchesRange;
    });

    switch (sortBy) {
      case "oldest":
        list = [...list].sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "amount-high":
        list = [...list].sort((a, b) => b.amount - a.amount);
        break;
      case "amount-low":
        list = [...list].sort((a, b) => a.amount - b.amount);
        break;
      default:
        list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    }
    return list;
  }, [recentTransactions, searchQuery, txTab, dateFrom, dateTo, sortBy]);

  // Summary of the filtered window
  const filteredSummary = useMemo(() => {
    const settled = filteredTransactions
      .filter((t) => t.status === "paid" && t.amount > 0)
      .reduce((s, t) => s + t.amount, 0);
    const pending = filteredTransactions
      .filter((t) => t.status === "pending" && t.amount > 0)
      .reduce((s, t) => s + t.amount, 0);
    const net = filteredTransactions.reduce((s, t) => s + t.amount, 0);
    return { settled, pending, net, count: filteredTransactions.length };
  }, [filteredTransactions]);

  // Export the currently filtered transactions as a CSV report
  const exportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("Nothing to export — adjust your filters first");
      return;
    }
    const headers = ["ID", "Date", "Type", "Description", "Guest", "Amount (ZMW)", "Status"];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.date,
      tx.type,
      `"${tx.description.replace(/"/g, '""')}"`,
      tx.guestName ?? "",
      String(tx.amount),
      tx.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nearby-escapes-finances-${dateFrom || "start"}-${dateTo || "today"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredTransactions.length} transactions as CSV`);
  };

  // YTD gross sales = sum of gross across all payouts
  const ytdGross = payoutSummary.ytdGross;

  const metricCards = [
    {
      label: "Upcoming Payouts",
      value: `K${payoutSummary.upcoming.toLocaleString()}`,
      sub: `${mockPayouts.filter((p) => p.status === "upcoming").length} cycle scheduled`,
      icon: Wallet,
      iconBg: "bg-amber-50 text-amber-600",
      trend: null as null | { pct: number; up: boolean },
    },
    {
      label: "Cleared Payouts",
      value: `K${payoutSummary.cleared.toLocaleString()}`,
      sub: "Sent to your accounts",
      icon: PiggyBank,
      iconBg: "bg-emerald-50 text-emerald-600",
      trend: { pct: trends.pct, up: trends.up },
    },
    {
      label: "YTD Gross Sales",
      value: `K${ytdGross.toLocaleString()}`,
      sub: "Gross before fees & tax",
      icon: ReceiptText,
      iconBg: "bg-purple/10 text-purple",
      trend: { pct: trends.pct + 3.2, up: true },
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-12 font-sans">
      <HostPageHeader
        title="Finance"
        description="Monthly payouts, ledger breakdowns and transaction logs"
        actions={
          expectedPayouts > 0 ? (
            <button
              onClick={simulateAutoPayout}
              className="inline-flex items-center justify-center gap-2 bg-purple hover:bg-purple-hover text-white text-sm font-bold uppercase tracking-wider h-10 px-4 rounded-xl shadow-sm transition-all duration-200 border-none"
              title="Test the background bulk payment worker"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Simulate Auto-Payout
            </button>
          ) : null
        }
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-8">
        {/* Headline metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                    {card.label}
                  </span>
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${card.iconBg}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-neutral-900">{card.value}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  {card.trend ? (
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-black uppercase tracking-wider ${
                        card.trend.up ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {card.trend.up ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {card.trend.up ? "+" : ""}
                      {card.trend.pct}%
                    </span>
                  ) : (
                    <Clock className="h-3 w-3 text-amber-500" />
                  )}
                  <span className="text-xs text-neutral-500">{card.sub}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Auto-Payout Banner */}
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100/60 rounded-2xl p-4 mb-8">
          <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-emerald-800">
              Automatic Weekly Bulk Payouts Active
            </div>
            <div className="text-[11px] text-emerald-700/95 mt-1 leading-relaxed">
              To minimize transfer fees, all payouts are consolidated and sent automatically.
              {expectedPayouts > 0 ? (
                <>
                  {" "}
                  Your current pending balance of{" "}
                  <strong className="font-bold">K{expectedPayouts.toLocaleString()}</strong> will be
                  automatically transferred to your{" "}
                  <strong className="font-bold">{payoutMethod.type}</strong> on the next settlement
                  date (Tuesday, Jun 30).
                </>
              ) : (
                <>
                  {" "}
                  All earnings have been settled. Future booking payouts will accumulate and release
                  on your next schedule.
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT/MAIN: Payouts & Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-neutral-200 gap-6 bg-white rounded-t-2xl px-5 pt-4">
              {(["payouts", "transactions"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all outline-none ${
                    activeTab === tab
                      ? "border-purple text-purple"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {tab === "payouts" ? "Payouts" : "Transactions"}
                </button>
              ))}
            </div>

            {activeTab === "payouts" ? (
              /* Monthly payout table */
              <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50/70">
                        {["Month", "Bookings", "Gross", "Net Payout", "Status"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-500 whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {[...mockPayouts]
                        .sort((a, b) => b.label.localeCompare(a.label))
                        .map((payout) => (
                          <tr
                            key={payout.id}
                            onClick={() => router.push(ROUTES.host.financeLedger(payout.id))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                router.push(ROUTES.host.financeLedger(payout.id));
                              }
                            }}
                            tabIndex={0}
                            role="link"
                            aria-label={`Open ${payout.label} ledger breakdown`}
                            className="group hover:bg-purple/[0.03] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple/30 focus:ring-inset"
                          >
                            <td className="px-5 py-4">
                              <div className="text-sm font-bold text-neutral-900">
                                {payout.label}
                              </div>
                              <div className="text-[10px] text-neutral-500 mt-0.5">
                                {payout.clearedOn ?? "Scheduled this month"}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-xs text-neutral-600">
                              {payout.entries.length} bookings
                            </td>
                            <td className="px-5 py-4 text-xs font-semibold text-neutral-900">
                              K{sumLedger(payout.entries, "grossRate").toLocaleString()}
                            </td>
                            <td className="px-5 py-4 text-sm font-black text-neutral-900">
                              K{payout.amount.toLocaleString()}
                            </td>
                            <td className="px-5 py-4">
                              {payout.status === "cleared" ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                                  <CheckCircle2 className="h-3 w-3" /> Cleared
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
                                  <Clock className="h-3 w-3" /> Upcoming
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-purple group-hover:translate-x-0.5 transition-all" />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/50 text-[11px] text-neutral-500">
                  Click any month to open its ledger breakdown with booking-level fees.
                </div>
              </div>
            ) : (
              /* Transaction Log */
              <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm">
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <h2 className="text-base font-bold text-neutral-900">Transactions</h2>
                    <div className="flex items-center gap-2">
                      <div className="relative w-full sm:w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500/60" />
                        <input
                          type="text"
                          placeholder="Search transactions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-1.5 h-8 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-purple"
                        />
                      </div>
                      <button
                        onClick={exportCSV}
                        className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-xl bg-purple text-white text-[11px] font-black uppercase tracking-wider hover:bg-purple-hover transition-all"
                        title="Export the filtered report as CSV"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Export
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200">
                      <CalendarRange className="h-3.5 w-3.5 text-purple" />
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="text-[11px] font-medium text-neutral-900 bg-transparent border-none p-0 focus:outline-none w-[110px]"
                        aria-label="From date"
                      />
                      <span className="text-neutral-400">→</span>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="text-[11px] font-medium text-neutral-900 bg-transparent border-none p-0 focus:outline-none w-[110px]"
                        aria-label="To date"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      {[
                        { label: "7D", days: 7 },
                        { label: "30D", days: 30 },
                        { label: "This month", days: new Date().getDate() },
                        { label: "All", days: 0 },
                      ].map((p) => (
                        <button
                          key={p.label}
                          onClick={() => applyDatePreset(p.days || undefined)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            (p.days === 0 && !dateFrom && !dateTo) ||
                            (p.days > 0 &&
                              dateFrom ===
                                new Date(Date.now() - (p.days - 1) * 86400000)
                                  .toISOString()
                                  .split("T")[0])
                              ? "bg-purple text-white"
                              : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200">
                      <ArrowUpDown className="h-3.5 w-3.5 text-purple" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="text-[11px] font-medium text-neutral-900 bg-transparent border-none p-0 focus:outline-none appearance-none"
                      >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="amount-high">Highest amount</option>
                        <option value="amount-low">Lowest amount</option>
                      </select>
                    </div>
                  </div>

                  {/* Filtered summary chips */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Settled
                      </p>
                      <p className="text-sm font-black text-emerald-700">
                        K{filteredSummary.settled.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#f3eafb] border border-purple/30 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-purple">
                        Pending
                      </p>
                      <p className="text-sm font-black text-purple">
                        K{filteredSummary.pending.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#f3eafb] border border-purple/20 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-purple">
                        Net · {filteredSummary.count} txns
                      </p>
                      <p className="text-sm font-black text-purple">
                        K{filteredSummary.net.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-neutral-200 gap-4 mb-4 overflow-x-auto scrollbar-hide">
                    {(["all", "booking", "payout", "refund"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setTxTab(tab)}
                        className={`pb-2.5 text-sm font-bold uppercase tracking-wider border-b-2 transition-all outline-none whitespace-nowrap ${
                          txTab === tab
                            ? "border-purple text-purple"
                            : "border-transparent text-neutral-500 hover:text-neutral-900"
                        }`}
                      >
                        {tab}s
                      </button>
                    ))}
                  </div>

                  {/* Transactions List */}
                  <div className="divide-y divide-neutral-200">
                    {filteredTransactions.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-sm text-neutral-500">No matching transactions found</p>
                      </div>
                    ) : (
                      filteredTransactions.map((tx) => {
                        const isPositive = tx.amount > 0;
                        return (
                          <div
                            key={tx.id}
                            className="py-3.5 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                                  tx.type === "payout"
                                    ? "bg-[#f3eafb] text-purple"
                                    : tx.type === "refund"
                                      ? "bg-rose-50 text-rose-600"
                                      : "bg-[#f3eafb] text-purple"
                                }`}
                              >
                                {tx.type === "payout" ? (
                                  <ArrowDownLeft className="h-4 w-4" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-neutral-900 truncate">
                                  {tx.description}
                                </div>
                                <div className="text-[10px] text-neutral-500 mt-0.5">
                                  {tx.date} {tx.guestName && ` · Guest: ${tx.guestName}`}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-sm font-bold ${
                                  isPositive ? "text-emerald-600" : "text-rose-600"
                                }`}
                              >
                                {isPositive ? "+" : ""}K{tx.amount.toLocaleString()}
                              </div>
                              <div
                                className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${
                                  tx.status === "paid"
                                    ? "text-emerald-600"
                                    : tx.status === "pending"
                                      ? "text-purple"
                                      : "text-neutral-500"
                                }`}
                              >
                                {tx.status}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Payout Setup & History */}
          <div className="space-y-6">
            {/* Payout method panel */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-neutral-900">Payout Destination</h2>
                {!isEditingMethod && (
                  <Link
                    href={ROUTES.host.settings}
                    className="text-sm font-bold text-purple hover:text-purple transition-colors"
                  >
                    Edit
                  </Link>
                )}
              </div>

              {isEditingMethod ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Payment Channel
                    </label>
                    <select
                      value={tempMethod}
                      onChange={(e) => setTempMethod(e.target.value)}
                      className="w-full h-9 rounded-lg border border-neutral-200 px-3 text-sm bg-white text-neutral-900 focus:outline-none focus:border-purple"
                    >
                      <option value="Airtel Money">Airtel Mobile Money</option>
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Bank Transfer">Bank Account Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      {tempMethod === "Bank Transfer" ? "Bank Routing & Account #" : "Phone Number"}
                    </label>
                    <input
                      type="text"
                      value={tempAccount}
                      onChange={(e) => setTempAccount(e.target.value)}
                      className="w-full h-9 rounded-lg border border-neutral-200 px-3 text-sm text-neutral-900 bg-white focus:outline-none focus:border-purple"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleSavePayoutMethod}
                      className="flex-1 h-8 rounded-lg bg-purple text-white hover:bg-purple-hover text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Save Method
                    </button>
                    <button
                      onClick={() => setIsEditingMethod(false)}
                      className="flex-1 h-8 rounded-lg border border-neutral-200 text-neutral-900 hover:bg-neutral-100 text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-sm text-neutral-500 flex items-center gap-1.5">
                      {payoutMethod.type === "Bank Transfer" ? (
                        <Building2 className="h-4 w-4 text-indigo-500" />
                      ) : (
                        <Smartphone className="h-4 w-4 text-emerald-500" />
                      )}
                      Type
                    </span>
                    <span className="text-sm font-bold text-neutral-900">{payoutMethod.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-sm text-neutral-500">Destination</span>
                    <span className="text-sm font-bold text-neutral-900">
                      {payoutMethod.account}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-sm text-neutral-500">Payout Schedule</span>
                    <span className="text-sm font-bold text-purple pl-2 max-w-[140px]">
                      {payoutMethod.schedule}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Payout History Snapshot */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-neutral-900 mb-4">Payout History</h2>
              <div className="space-y-3.5">
                {[...mockPayouts]
                  .filter((p) => p.status === "cleared")
                  .map((p) => (
                    <Link
                      key={p.id}
                      href={ROUTES.host.financeLedger(p.id)}
                      className="flex justify-between items-center group"
                    >
                      <div>
                        <div className="text-sm font-bold text-neutral-900 group-hover:text-purple transition-colors">
                          {p.label} payout
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          {p.entries.length} bookings · {p.clearedOn}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        K{p.amount.toLocaleString()}
                        <ChevronRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-purple group-hover:translate-x-0.5 transition-all" />
                      </span>
                    </Link>
                  ))}
              </div>
              <button
                onClick={exportCSV}
                className="w-full border border-neutral-200 rounded-xl py-2 mt-4 text-[11px] font-black uppercase tracking-wider text-secondary hover:text-purple hover:bg-neutral-50 transition-all flex items-center justify-center gap-1"
              >
                Export Statement <Download className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
