"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, CheckCircle2, Clock, Landmark, ReceiptText } from "lucide-react";
import { mockPayouts, sumLedger } from "@/lib/mock-payout-data";
import { ROUTES } from "@/lib/constants/routes";
import { ExportStatementModal } from "@/components/host/finances/ExportStatementModal";

interface LedgerBreakdownPageProps {
  payoutId: string;
}

const fmt = (n: number) => `K${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export function LedgerBreakdownPage({ payoutId }: LedgerBreakdownPageProps) {
  const router = useRouter();
  const [exportOpen, setExportOpen] = useState(false);

  const payout = useMemo(() => mockPayouts.find((p) => p.id === payoutId), [payoutId]);

  if (!payout) {
    return (
      <div className="min-h-screen bg-neutral-50 pb-12 font-sans flex items-center justify-center">
        <div className="text-center">
          <ReceiptText className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-neutral-900">Payout not found</p>
          <p className="text-[11px] text-neutral-500 mt-1">
            The ledger you requested does not exist.
          </p>
          <Link
            href={ROUTES.host.earnings}
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-purple hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Finance
          </Link>
        </div>
      </div>
    );
  }

  const totals = {
    gross: sumLedger(payout.entries, "grossRate"),
    commission: sumLedger(payout.entries, "commission"),
    tax: sumLedger(payout.entries, "tax"),
    net: sumLedger(payout.entries, "netEarnings"),
  };

  const fileNameBase = `${payout.label.replace(/\s+/g, "_")}_Payout`;

  const csvContent = () => {
    const headers = [
      "Booking ID",
      "Guest",
      "Date",
      "Gross Rate (ZMW)",
      "Platform Commission (ZMW)",
      "Tax (ZMW)",
      "Net Earnings (ZMW)",
    ];
    const rows = payout.entries.map((e) => [
      e.bookingId,
      `"${e.guest}"`,
      e.date,
      e.grossRate,
      e.commission,
      e.tax,
      e.netEarnings,
    ]);
    rows.push(["", "TOTAL", "", totals.gross, totals.commission, totals.tax, totals.net]);
    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-12 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-4">
          <button
            onClick={() => router.push(ROUTES.host.earnings)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-purple transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Finance
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-neutral-900">
                Ledger Breakdown — {payout.label}
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                {payout.status === "cleared" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Cleared · {payout.clearedOn}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2 py-0.5">
                    <Clock className="h-3 w-3" /> Upcoming payout
                  </span>
                )}
                <span className="text-[11px] text-neutral-500">
                  {payout.entries.length} bookings ·{" "}
                  <strong className="font-bold text-neutral-700">{fmt(totals.net)}</strong> net
                </span>
              </div>
            </div>
            <button
              onClick={() => setExportOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-purple hover:bg-purple-hover text-white text-sm font-bold h-10 px-5 rounded-xl shadow-sm transition-all"
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6 space-y-5">
        {/* Payout summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
              Gross Rate
            </p>
            <p className="text-lg font-bold text-neutral-900 mt-1">{fmt(totals.gross)}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
              Platform Commission (12%)
            </p>
            <p className="text-lg font-bold text-rose-600 mt-1">− {fmt(totals.commission)}</p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
              Withholding Tax (5%)
            </p>
            <p className="text-lg font-bold text-amber-600 mt-1">− {fmt(totals.tax)}</p>
          </div>
          <div className="bg-white border border-purple/20 bg-purple/[0.04] rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-purple">
              Net Earnings
            </p>
            <p className="text-lg font-bold text-purple mt-1">{fmt(totals.net)}</p>
          </div>
        </div>

        {/* Ledger table */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/70">
                  {[
                    "Booking ID",
                    "Guest",
                    "Date",
                    "Gross Rate",
                    "Platform Commission",
                    "Tax",
                    "Net Earnings",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-wider text-neutral-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payout.entries.map((entry) => (
                  <tr key={entry.bookingId} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-purple whitespace-nowrap">
                      {entry.bookingId}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-neutral-900 whitespace-nowrap">
                      {entry.guest}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-neutral-900 whitespace-nowrap">
                      {fmt(entry.grossRate)}
                    </td>
                    <td className="px-4 py-3 text-xs text-rose-600 whitespace-nowrap">
                      − {fmt(entry.commission)}
                    </td>
                    <td className="px-4 py-3 text-xs text-amber-600 whitespace-nowrap">
                      − {fmt(entry.tax)}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-emerald-700 whitespace-nowrap">
                      {fmt(entry.netEarnings)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-neutral-200 bg-neutral-50">
                  <td className="px-4 py-3.5 font-black text-neutral-900 uppercase tracking-wider text-[11px]">
                    Totals
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-neutral-500">
                    {payout.entries.length} bookings
                  </td>
                  <td />
                  <td className="px-4 py-3.5 text-sm font-black text-neutral-900">
                    {fmt(totals.gross)}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-black text-rose-600">
                    − {fmt(totals.commission)}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-black text-amber-600">
                    − {fmt(totals.tax)}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-black text-purple">{fmt(totals.net)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-[11px] text-neutral-400">
          <Landmark className="h-3.5 w-3.5" />
          Commission rate 12% · Withholding tax 5% · Net = Gross − Commission − Tax. Totals are
          rounded to 2 decimal places.
        </p>
      </div>

      <ExportStatementModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        fileNameBase={fileNameBase}
        csvContent={csvContent}
        description={`${payout.label} · ${payout.entries.length} bookings · net ${fmt(totals.net)}`}
      />
    </div>
  );
}
