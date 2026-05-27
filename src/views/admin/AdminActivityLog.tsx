"use client";

import { useState, useMemo } from "react";
import { Activity, Search, CalendarDays, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// ─── Config ─────────────────────────────────────────────────────────────

const typeColors: Record<string, string> = {
  booking: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  listing: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
  user: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
  payment: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
  report: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
  system: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
};

const typeLabels: Record<string, string> = {
  booking: "Booking",
  listing: "Listing",
  user: "User",
  payment: "Payment",
  report: "Report",
  system: "System",
};

// ─── Activity Item ──────────────────────────────────────────────────────

function ActivityItem({ log }: { log: ActivityLog }) {
  const badgeColor = typeColors[log.type] ?? typeColors.system;

  return (
    <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0 border-b border-border/10 last:border-0">
      <div
        className={cn(
          "h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold",
          badgeColor,
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
          <span className="text-sm font-bold text-foreground">{log.user}</span>
          <span
            className={cn(
              "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border",
              badgeColor,
            )}
          >
            {typeLabels[log.type]}
          </span>
          {log.userRole !== "admin" && (
            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full capitalize">
              {log.userRole}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          <span className="font-medium text-foreground/80">{log.action.toLowerCase()}</span>
          {log.target && (
            <>
              {" "}
              — <span className="font-medium text-foreground">{log.target}</span>
            </>
          )}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3" />
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

// ─── Main Component ─────────────────────────────────────────────────────

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
    [],
  );

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-8">
        <div className="mx-auto max-w-6xl px-4 md:px-6 pt-6 md:pt-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Audit Log
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.total} total events — showing {stats.filtered}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 relative z-10">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-card p-3 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search actions, users, or targets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-border/60 text-sm"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px] h-10 rounded-xl border-border/60">
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
            <SelectTrigger className="w-[160px] h-10 rounded-xl border-border/60">
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
            className="h-10 px-3 rounded-xl border border-border/60 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors flex items-center gap-1.5"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortOrder === "newest" ? "Newest" : "Oldest"}
          </button>
        </div>
      </div>

      {/* Type Summary Chips */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6">
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(typeLabels).map(([type, label]) => (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? "all" : type)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all",
                typeFilter === type
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30",
              )}
            >
              {label} ({stats.byType[type as keyof typeof stats.byType]})
            </button>
          ))}
          {typeFilter !== "all" && (
            <button
              onClick={() => setTypeFilter("all")}
              className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6 pb-16">
        <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Activity className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No events found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 rounded-full text-xs font-semibold"
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
