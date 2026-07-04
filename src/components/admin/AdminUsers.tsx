"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Mail,
  MapPin,
  CalendarDays,
  DollarSign,
  Ban,
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
import { AdminPageHeader } from "@/components/layout/AdminPageHeader";

import { cn } from "@/lib/utils";
import { mockAdminUsers, statsFromUsers } from "@/lib/mock-admin-data";
import type { AdminUser } from "@/lib/mock-admin-data";
import { useLoading, withLoading } from "@/lib/loading-context";
import { showSuccess, showWarning } from "@/lib/admin-toast";

//Role Badge ─────────────────────────────────────────────────────────

const roleConfig: Record<string, { label: string; className: string }> = {
  admin: {
    label: "Admin",
    className:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  },
  host: {
    label: "Host",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  guest: {
    label: "Guest",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> =
  {
    active: {
      label: "Active",
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    suspended: {
      label: "Suspended",
      icon: XCircle,
      className: "bg-rose-50 text-rose-700 border-rose-200",
    },
    "pending verification": {
      label: "Pending",
      icon: Clock,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };

//User Card ──────────────────────────────────────────────────────────

function UserCard({
  user,
  onSuspend,
  onVerify,
}: {
  user: AdminUser;
  onSuspend: (id: string) => void;
  onVerify: (id: string) => void;
}) {
  const { setLoading, setLoadingMessage } = useLoading();
  const roleCfg = roleConfig[user.role];
  const statusCfg = statusConfig[user.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="group rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Avatar */}
          <div className="h-12 w-12 shrink-0 rounded-full bg-muted overflow-hidden">
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-foreground truncate">{user.name}</h4>
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full text-[8px] font-bold uppercase tracking-wider px-2 py-0.5",
                  roleCfg.className,
                )}
              >
                {roleCfg.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3 w-3 shrink-0" />
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3 w-3 shrink-0" />
              {user.location}
            </p>
          </div>
        </div>

        {/* Actions (desktop) */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {user.status === "pending verification" && (
            <Button
              size="sm"
              className="h-8 rounded-lg text-xs font-semibold"
              onClick={() => onVerify(user.id)}
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              Verify
            </Button>
          )}
          {user.status === "active" && user.role !== "admin" && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs font-semibold border-rose-200 text-rose-600 hover:bg-rose-50"
              onClick={() => onSuspend(user.id)}
            >
              <Ban className="h-3.5 w-3.5 mr-1" />
              Suspend
            </Button>
          )}
          {user.status === "suspended" && (
            <Button
              size="sm"
              className="h-8 rounded-lg text-xs font-semibold"
              onClick={() =>
                withLoading(
                  setLoading,
                  setLoadingMessage,
                  async () => {
                    await new Promise((r) => setTimeout(r, 600));
                    showSuccess(
                      `${user.name} reactivated`,
                      "User has been restored to active status.",
                    );
                  },
                  "Reactivating user...",
                )
              }
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Reactivate
            </Button>
          )}
        </div>
      </div>

      {/* Details Row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3" />
          Joined{" "}
          {new Date(user.joined).toLocaleDateString("en-ZM", { month: "short", year: "numeric" })}
        </span>
        {user.role !== "admin" && (
          <>
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-3 w-3" />
              {user.totalBookings} booking{user.totalBookings !== 1 ? "s" : ""}
            </span>
            {user.role === "host" && user.listings && (
              <span className="flex items-center gap-1.5">
                {user.listings} listing{user.listings !== 1 ? "s" : ""}
              </span>
            )}
          </>
        )}
        <Badge
          variant="outline"
          className={cn(
            "rounded-full text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5",
            statusCfg.className,
          )}
        >
          <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
          {statusCfg.label}
        </Badge>
      </div>

      {/* Mobile Actions */}
      <div className="md:hidden mt-3 flex gap-2">
        {user.status === "pending verification" && (
          <Button
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold flex-1"
            onClick={() => onVerify(user.id)}
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verify
          </Button>
        )}
        {user.status === "active" && user.role !== "admin" && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold flex-1 border-rose-200 text-rose-600"
            onClick={() => onSuspend(user.id)}
          >
            <Ban className="h-3.5 w-3.5 mr-1" /> Suspend
          </Button>
        )}
        {user.status === "suspended" && (
          <Button
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold flex-1"
            onClick={() =>
              withLoading(
                setLoading,
                setLoadingMessage,
                async () => {
                  await new Promise((r) => setTimeout(r, 600));
                  showSuccess(
                    `${user.name} reactivated`,
                    "User has been restored to active status.",
                  );
                },
                "Reactivating user...",
              )
            }
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Reactivate
          </Button>
        )}
      </div>
    </div>
  );
}

//Main Component ─────────────────────────────────────────────────────

export function AdminUsers() {
  const { setLoading, setLoadingMessage } = useLoading();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "guest" | "host" | "admin">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "suspended" | "pending verification"
  >("all");
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);

  const userStats = useMemo(() => statsFromUsers(users), [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.location.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleSuspend = (id: string) => {
    withLoading(
      setLoading,
      setLoadingMessage,
      async () => {
        await new Promise((r) => setTimeout(r, 600));
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: "suspended" as const } : u)),
        );
        const user = users.find((u) => u.id === id);
        if (user)
          showWarning(`${user.name} suspended`, "This user can no longer access the platform.");
      },
      "Suspending user...",
    );
  };

  const handleVerify = (id: string) => {
    withLoading(
      setLoading,
      setLoadingMessage,
      async () => {
        await new Promise((r) => setTimeout(r, 600));
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: "active" as const } : u)),
        );
        const user = users.find((u) => u.id === id);
        if (user) showSuccess(`${user.name} verified`, "User account has been marked as verified.");
      },
      "Verifying user...",
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#faf9f5]">
      <div className="flex-1">
        <AdminPageHeader
          eyebrow="Users"
          title="User Management"
          description={`${userStats.total} users — ${userStats.guests} guests, ${userStats.hosts} hosts, ${userStats.admins} admins`}
          actions={
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/80">
                <span className="font-semibold text-white">{userStats.active}</span> active
              </span>
              {userStats.pendingVerification > 0 && (
                <Badge
                  variant="outline"
                  className="rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f2ba0d] text-[#1f1433] border-none"
                >
                  {userStats.pendingVerification} pending
                </Badge>
              )}
            </div>
          }
        />

        {/* Filters */}
        <div className="mx-auto max-w-7xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-card p-3 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-xl border-border/60 text-sm"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}>
              <SelectTrigger className="w-[130px] h-10 rounded-xl border-border/60">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="guest">Guests</SelectItem>
                <SelectItem value="host">Hosts</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="w-[160px] h-10 rounded-xl border-border/60">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending verification">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users List */}
        <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6 pb-8">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No users found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 rounded-full text-xs font-semibold"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onSuspend={handleSuspend}
                  onVerify={handleVerify}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6 pb-16">
          <h3 className="text-[10px] sm:text-xs font-bold text-[#1f1433] uppercase tracking-widest mb-3">
            Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-foreground">{userStats.total}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Users
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-blue-600">{userStats.hosts}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Hosts
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-emerald-600">{userStats.guests}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Guests
              </p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-amber-600">{userStats.pendingVerification}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Pending Verification
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

