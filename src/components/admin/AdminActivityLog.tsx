"use client";

import { useState, useMemo } from "react";
import {
  Activity,
  Search,
  CalendarDays,
  ArrowUpDown,
  Download,
  Filter,
  User,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building2,
  Shield,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockActivityLogs } from "@/lib/mock-admin-data";
import type { ActivityLog } from "@/lib/mock-admin-data";
import { toast } from "sonner";

// Config

const typeColors: Record<string, { badge: string; iconBg: string }> = {
  booking: {
    badge: "bg-blue-50 text-blue-700 border-blue-200/80",
    iconBg: "bg-blue-50 text-blue-600 border border-blue-200/80",
  },
  listing: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/80",
  },
  user: {
    badge: "bg-purple/10 text-purple border-purple/20",
    iconBg: "bg-purple/10 text-purple border border-purple/20",
  },
  payment: {
    badge: "bg-amber-50 text-amber-700 border-amber-200/80",
    iconBg: "bg-amber-50 text-amber-600 border border-amber-200/80",
  },
  report: {
    badge: "bg-rose-50 text-rose-700 border-rose-200/80",
    iconBg: "bg-rose-50 text-rose-600 border border-rose-200/80",
  },
  system: {
    badge: "bg-neutral-100 text-neutral-600 border-neutral-200",
    iconBg: "bg-neutral-100 text-neutral-600 border border-neutral-200",
  },
};

const typeLabels: Record<string, string> = {
  booking: "Booking",
  listing: "Listing",
  user: "User",
  payment: "Payment",
  report: "Report",
  system: "System",
};

// Activity Item

function ActivityItem({ log }: { log: ActivityLog }) {
  const colorCfg = typeColors[log.type] ?? typeColors.system;

  return (
    <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 border-b border-neutral-100 last:border-0">
      <div
        className={cn(
          "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-xs font-semibold",
          colorCfg.iconBg,
        )}
      >
        {log.type === "booking"
          ? "B"
          : log.type === "listing"
            ? "L"
            : log.type === "user"
              ? "U"
              : log.type === "payment"
                ? "$"
                : log.type === "report"
                  ? "!"
                  : "S"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-neutral-900">{log.user}</span>
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
              colorCfg.badge,
            )}
          >
            {typeLabels[log.type]}
          </span>
          {log.userRole !== "admin" && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 capitalize">
              {log.userRole}
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-600 mt-1">
          <span className="font-medium text-neutral-800">{log.action.toLowerCase()}</span>
          {log.target && (
            <>
              {" "}
              — <span className="font-semibold text-neutral-900">{log.target}</span>
            </>
          )}
        </p>
        <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3 text-neutral-400" />
          {new Date(log.timestamp).toLocaleDateString("en-ZM", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

// Main Component

export function AdminActivityLog() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const allUsers = useMemo(() => {
    const users = new Set(mockActivityLogs.map((l) => l.user));
    return Array.from(users).sort();
  }, []);

  const filteredLogs = useMemo(() => {
    let logs = [...mockActivityLogs];

    // Search
    if (search) {
      const q = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.user.toLowerCase().includes(q) ||
          l.target.toLowerCase().includes(q),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      logs = logs.filter((l) => l.type === typeFilter);
    }

    // User filter
    if (userFilter !== "all") {
      logs = logs.filter((l) => l.user === userFilter);
    }

    // Sort
    logs.sort((a, b) => {
      const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });

    return logs;
  }, [search, typeFilter, userFilter, sortOrder]);

  const stats = useMemo(
    () => ({
      total: mockActivityLogs.length,
      filtered: filteredLogs.length,
      byType: {
        booking: mockActivityLogs.filter((l) => l.type === "booking").length,
        listing: mockActivityLogs.filter((l) => l.type === "listing").length,
        user: mockActivityLogs.filter((l) => l.type === "user").length,
        payment: mockActivityLogs.filter((l) => l.type === "payment").length,
        report: mockActivityLogs.filter((l) => l.type === "report").length,
        system: mockActivityLogs.filter((l) => l.type === "system").length,
      },
    }),
    [filteredLogs.length],
  );

  const handleExportCSV = () => {
    const headers = ["Timestamp", "User", "Role", "Type", "Action", "Target"];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      `"${l.user}"`,
      l.userRole,
      l.type,
      `"${l.action}"`,
      `"${l.target || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nearbyescapes-audit-log-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit log CSV exported successfully");
  };

  return (
    <div className="flex-1 min-h-screen bg-neutral-50/50 pb-16">
      <AdminPageHeader
        eyebrow="Security & Governance"
        title="Audit Log"
        description={`${stats.total} total events — showing ${stats.filtered}`}
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
        {/* Filters Box */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search actions, users, or targets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-sm focus:bg-white transition-all"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-xs font-medium">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="booking">Booking ({stats.byType.booking})</SelectItem>
                <SelectItem value="listing">Listing ({stats.byType.listing})</SelectItem>
                <SelectItem value="user">User ({stats.byType.user})</SelectItem>
                <SelectItem value="payment">Payment ({stats.byType.payment})</SelectItem>
                <SelectItem value="report">Report ({stats.byType.report})</SelectItem>
                <SelectItem value="system">System ({stats.byType.system})</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-[160px] h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-xs font-medium">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Users</SelectItem>
                {allUsers.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              className="h-10 px-3.5 rounded-xl border border-neutral-200/80 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
              {sortOrder === "newest" ? "Newest" : "Oldest"}
            </button>
          </div>

          {/* Type Summary Chips */}
          <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-2">
            {Object.entries(typeLabels).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setTypeFilter(typeFilter === type ? "all" : type)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5",
                  typeFilter === type
                    ? "bg-neutral-900 text-white border-neutral-900 font-semibold shadow-xs"
                    : "border-neutral-200/80 bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                )}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    typeFilter === type
                      ? "bg-neutral-700 text-white"
                      : "bg-neutral-200/60 text-neutral-500",
                  )}
                >
                  ({stats.byType[type as keyof typeof stats.byType]})
                </span>
              </button>
            ))}
            {typeFilter !== "all" && (
              <button
                onClick={() => setTypeFilter("all")}
                className="text-xs font-semibold text-purple hover:underline ml-1"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Activity List Stream */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
                <Activity className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900">No events found</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Try adjusting your search or filter selection.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5 rounded-xl text-xs font-semibold"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                  setUserFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            filteredLogs.map((log) => <ActivityItem key={log.id} log={log} />)
          )}
        </div>
      </div>
    </div>
  );
}
