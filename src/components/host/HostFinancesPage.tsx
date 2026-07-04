"use client";

import { useState, useMemo } from "react";
import { mockFinances } from "@/lib/mock-host-finances";
import type { Transaction } from "@/lib/mock-host-finances";
import { toast } from "sonner";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Smartphone,
  Building2,
  Plus,
  ArrowRight,
  Percent,
  Clock,
  RefreshCw,
} from "lucide-react";

export function HostFinancesPage() {
  const [finances, setFinances] = useState(mockFinances);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "booking" | "payout" | "refund">("all");
  const [isEditingMethod, setIsEditingMethod] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState({
    type: "Airtel Money",
    account: "+260 97X XXX XXX",
    schedule: "Weekly (Every Tuesday)",
  });
  const [tempMethod, setTempMethod] = useState(payoutMethod.type);
  const [tempAccount, setTempAccount] = useState(payoutMethod.account);

  const { totalEarnedYTD, expectedPayouts, monthlyData, recentTransactions } = finances;

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

  // Filtered and searched transactions
  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.guestName && tx.guestName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = activeTab === "all" || tx.type === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [recentTransactions, searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-background pb-12 font-sans">
      <HostPageHeader
        eyebrow="Revenue"
        title="Earnings & Finances"
        description="Automated payout settings and financial logs"
        actions={
          expectedPayouts > 0 ? (
            <button
              onClick={simulateAutoPayout}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1f1433] to-[#150d22] hover:from-[#150d22] hover:to-[#967825] text-[#1f1433] text-xs font-black uppercase tracking-wider h-10 px-4 rounded-xl shadow-sm transition-all duration-200 border-none"
              title="Test the background bulk payment worker"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Simulate Auto-Payout
            </button>
          ) : null
        }
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-8">
        {/* Auto-Payout Banner */}
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100/60 rounded-2xl p-4 mb-8">
          <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-emerald-800">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Card 1: Total YTD */}
          <div className="bg-white border border-[#E0DBD0]/70 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Settled
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              K{totalEarnedYTD.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Paid out to your accounts YTD</p>
          </div>

          {/* Card 2: Expected/Pending */}
          <div className="bg-white border border-[#E0DBD0]/70 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pending Balance
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              K{expectedPayouts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {expectedPayouts > 0 ? "Settles automatically on Jun 30" : "Settled"}
            </p>
          </div>

          {/* Card 3: Platform Fees */}
          <div className="bg-white border border-[#E0DBD0]/70 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Platform Fees (YTD)
              </span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              K{mockFinances.platformFeesYTD.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Flat 5% system commission applied</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT/MAIN: Monthly Breakdown & Transactions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly breakdown */}
            <div className="bg-white border border-[#E0DBD0]/70 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground mb-4">
                Monthly Performance — June 2025
              </h2>
              <div className="divide-y divide-[#E0DBD0]/40">
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs text-muted-foreground">Gross Booking Revenue</span>
                  <span className="text-sm font-bold text-foreground">
                    K{monthlyData[monthlyData.length - 1]?.earnings.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs text-muted-foreground">Platform Commission (5%)</span>
                  <span className="text-sm font-bold text-rose-600">
                    − K
                    {Math.round(
                      (monthlyData[monthlyData.length - 1]?.earnings || 0) * 0.05,
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs text-muted-foreground">Experience Add-ons</span>
                  <span className="text-sm font-bold text-emerald-600">+ K900</span>
                </div>
                <div className="flex justify-between items-center pt-3 font-semibold">
                  <span className="text-xs text-foreground font-bold">Net Monthly Earnings</span>
                  <span className="text-base font-bold text-[#3D2463]">
                    K
                    {(
                      Math.round((monthlyData[monthlyData.length - 1]?.earnings || 0) * 0.95) + 900
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Log */}
            <div className="bg-white border border-[#E0DBD0]/70 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-sm font-bold text-foreground">Recent Transactions</h2>
                {/* Search Bar */}
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 h-8 bg-background border border-[#E0DBD0]/60 rounded-xl text-xs focus:outline-none focus:border-[#2a1b47]"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#E0DBD0]/40 gap-4 mb-4 overflow-x-auto scrollbar-hide">
                {(["all", "booking", "payout", "refund"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all outline-none whitespace-nowrap ${
                      activeTab === tab
                        ? "border-[#3D2463] text-[#3D2463]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}s
                  </button>
                ))}
              </div>

              {/* Transactions List */}
              <div className="divide-y divide-[#E0DBD0]/40">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-xs text-muted-foreground">No matching transactions found</p>
                  </div>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isPositive = tx.amount > 0;
                    return (
                      <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                              tx.type === "payout"
                                ? "bg-amber-50 text-amber-600"
                                : tx.type === "refund"
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {tx.type === "payout" ? (
                              <ArrowDownLeft className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-foreground truncate">
                              {tx.description}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {tx.date} {tx.guestName && ` · Guest: ${tx.guestName}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-xs font-bold ${
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
                                  ? "text-amber-600"
                                  : "text-muted-foreground"
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

          {/* RIGHT COLUMN: Payout Setup & History */}
          <div className="space-y-6">
            {/* Payout method panel */}
            <div className="bg-white border border-[#E0DBD0]/70 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-foreground">Payout Destination</h2>
                {!isEditingMethod && (
                  <button
                    onClick={() => {
                      setTempMethod(payoutMethod.type);
                      setTempAccount(payoutMethod.account);
                      setIsEditingMethod(true);
                    }}
                    className="text-xs font-bold text-[#2a1b47] hover:text-[#B08D3A] transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingMethod ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Payment Channel
                    </label>
                    <select
                      value={tempMethod}
                      onChange={(e) => setTempMethod(e.target.value)}
                      className="w-full h-9 rounded-lg border border-[#E0DBD0] px-3 text-xs bg-white text-foreground focus:outline-none focus:border-[#2a1b47]"
                    >
                      <option value="Airtel Money">Airtel Mobile Money</option>
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Bank Transfer">Bank Account Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      {tempMethod === "Bank Transfer" ? "Bank Routing & Account #" : "Phone Number"}
                    </label>
                    <input
                      type="text"
                      value={tempAccount}
                      onChange={(e) => setTempAccount(e.target.value)}
                      className="w-full h-9 rounded-lg border border-[#E0DBD0] px-3 text-xs text-foreground bg-white focus:outline-none focus:border-[#2a1b47]"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleSavePayoutMethod}
                      className="flex-1 h-8 rounded-lg bg-[#3D2463] text-white hover:bg-[#f2ba0d] text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Save Method
                    </button>
                    <button
                      onClick={() => setIsEditingMethod(false)}
                      className="flex-1 h-8 rounded-lg border border-[#E0DBD0] text-foreground hover:bg-muted text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#E0DBD0]/40">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      {payoutMethod.type === "Bank Transfer" ? (
                        <Building2 className="h-4 w-4 text-indigo-500" />
                      ) : (
                        <Smartphone className="h-4 w-4 text-emerald-500" />
                      )}
                      Type
                    </span>
                    <span className="text-xs font-bold text-foreground">{payoutMethod.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs text-muted-foreground">Destination</span>
                    <span className="text-xs font-bold text-foreground">
                      {payoutMethod.account}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs text-muted-foreground">Payout Schedule</span>
                    <span className="text-xs font-bold text-[#3D2463] pl-2 max-w-[140px]">
                      {payoutMethod.schedule}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Payout History Snapshot */}
            <div className="bg-white border border-[#E0DBD0]/70 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground mb-4">Payout History</h2>
              <div className="space-y-3.5">
                {monthlyData
                  .slice(-4)
                  .reverse()
                  .map((d) => (
                    <div key={d.month} className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-foreground">
                          {d.month} 2025 payout
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Sent to {payoutMethod.type} · 5th {d.month}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">
                        K{d.earnings.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => toast.success("Opening complete transaction statement...")}
                className="w-full border border-[#E0DBD0]/80 rounded-xl py-2 mt-4 text-[11px] font-black uppercase tracking-wider text-secondary hover:text-[#B08D3A] hover:bg-muted/50 transition-all flex items-center justify-center gap-1"
              >
                Export Statement <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

