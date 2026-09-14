"use client";

import { useState, useMemo } from "react";
import {
  Sparkles,
  Search,
  Tag,
  Plus,
  CheckCircle2,
  CalendarDays,
  Bed,
  Ticket,
  Bus,
  Star,
  Home,
  ArrowUpRight,
  Copy,
  Trash2,
  Gem,
  Download,
  Percent,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
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
import { mockPromoCodes, mockFeaturedListings } from "@/lib/mock-admin-data";
import type { PromoCode, FeaturedListing } from "@/lib/mock-admin-data";
import { useLoading, withLoading } from "@/lib/loading-context";
import { showSuccess, showWarning } from "@/lib/admin-toast";
import { toast } from "sonner";

// Helpers

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: Bus,
  gem: Gem,
};

const placementConfig: Record<string, { label: string; icon: React.ElementType; colorClass: string }> = {
  homepage_banner: {
    label: "Homepage Banner",
    icon: Home,
    colorClass: "bg-purple/10 text-purple border-purple/20",
  },
  category_featured: {
    label: "Category Featured",
    icon: Star,
    colorClass: "bg-amber-50 text-amber-700 border-amber-200/80",
  },
  search_boost: {
    label: "Search Boost",
    icon: ArrowUpRight,
    colorClass: "bg-blue-50 text-blue-700 border-blue-200/80",
  },
};

// Promo Code Card

function PromoCodeCard({
  promo,
  onToggle,
  onDelete,
}: {
  promo: PromoCode;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const { setLoading, setLoadingMessage } = useLoading();
  const expiresAt = new Date(promo.expiresAt);
  const isExpired = expiresAt < new Date();
  const usagePct = Math.round((promo.currentUses / promo.maxUses) * 100);

  const handleCopy = () => {
    navigator.clipboard.writeText(promo.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-2xs transition-all duration-200",
        promo.isActive ? "border-neutral-200/80 hover:border-neutral-300" : "border-neutral-200/60 opacity-90",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopy}
              className="group flex items-center gap-1.5 rounded-xl bg-purple/10 border border-purple/15 px-3 py-1 text-sm font-semibold text-purple font-mono hover:bg-purple/15 transition-colors"
              title="Copy code"
            >
              {promo.code}
              {copied ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
            {promo.isActive ? (
              <Badge
                variant="outline"
                className="rounded-full text-[11px] font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-200/80"
              >
                Active
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="rounded-full text-[11px] font-semibold px-2.5 py-0.5 bg-neutral-100 text-neutral-600 border-neutral-200"
              >
                {isExpired ? "Expired" : "Disabled"}
              </Badge>
            )}
          </div>
          <p className="text-xs text-neutral-600 mt-2">{promo.description}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xl font-semibold text-neutral-900">
            {promo.type === "percentage" ? `${promo.value}%` : `K${promo.value}`}
          </p>
          <p className="text-[11px] text-neutral-400 font-medium capitalize">
            {promo.type} off
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <Tag className="h-3.5 w-3.5 text-neutral-400" />
          {promo.appliesTo === "all" ? "All listings" : `${promo.appliesTo}s`}
        </span>
        {promo.minSpend && (
          <>
            <span className="text-neutral-300">·</span>
            <span>Min. K{promo.minSpend}</span>
          </>
        )}
        <span className="text-neutral-300">·</span>
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
          Expires{" "}
          {expiresAt.toLocaleDateString("en-ZM", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Usage Bar */}
      <div className="mt-3.5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-neutral-500 font-medium">
            {promo.currentUses}/{promo.maxUses} used
          </span>
          <span
            className={cn(
              "font-semibold",
              usagePct >= 90
                ? "text-rose-600"
                : usagePct >= 70
                  ? "text-amber-600"
                  : "text-emerald-600",
            )}
          >
            {usagePct}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              usagePct >= 90 ? "bg-rose-500" : usagePct >= 70 ? "bg-amber-500" : "bg-emerald-500",
            )}
            style={{ width: `${Math.min(usagePct, 100)}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3.5 pt-3.5 border-t border-neutral-100 flex items-center justify-between">
        <Button
          size="sm"
          variant={promo.isActive ? "outline" : "default"}
          className={cn(
            "h-8 px-3 rounded-xl text-xs font-semibold",
            promo.isActive
              ? "border-neutral-200/80 text-neutral-700 hover:bg-neutral-50"
              : "bg-primary hover:bg-primary/95 text-white",
          )}
          onClick={() =>
            withLoading(
              setLoading,
              setLoadingMessage,
              async () => {
                await new Promise((r) => setTimeout(r, 400));
                onToggle(promo.id);
                showSuccess(
                  promo.isActive ? "Promo code disabled" : "Promo code activated",
                  promo.code,
                );
              },
              "Updating...",
            )
          }
        >
          {promo.isActive ? "Deactivate" : "Activate"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 p-0 transition-colors"
          onClick={() => {
            onDelete(promo.id);
            showWarning("Promo code deleted", `${promo.code} has been removed.`);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// Featured Listing Card

function FeaturedCard({
  featured,
  onToggle,
}: {
  featured: FeaturedListing;
  onToggle: (id: string) => void;
}) {
  const pl = placementConfig[featured.placement] || placementConfig.homepage_banner;
  const PlacementIcon = pl.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-2xs transition-all duration-200",
        featured.isActive ? "border-neutral-200/80 hover:border-neutral-300" : "border-neutral-200/60 opacity-90",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-purple/10 border border-purple/15 flex items-center justify-center text-purple">
            <PlacementIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-neutral-900 text-base truncate">{featured.listingName}</h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              {featured.hostName} · {featured.listingType}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-semibold text-neutral-900">K{featured.cost}</p>
          <p className="text-[11px] text-neutral-400">/ month</p>
        </div>
      </div>

      <div className="mt-3.5 pt-3.5 border-t border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("rounded-full text-[11px] font-semibold px-2.5 py-0.5", pl.colorClass)}>
            <PlacementIcon className="h-3 w-3 mr-1" />
            {pl.label}
          </Badge>
        </div>
        <div className="text-xs text-neutral-400 flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          {new Date(featured.startsAt).toLocaleDateString("en-ZM", {
            month: "short",
            day: "numeric",
          })}{" "}
          —{" "}
          {new Date(featured.endsAt).toLocaleDateString("en-ZM", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant={featured.isActive ? "outline" : "default"}
          className={cn(
            "h-8 px-3 rounded-xl text-xs font-semibold",
            featured.isActive
              ? "border-neutral-200/80 text-neutral-700 hover:bg-neutral-50"
              : "bg-primary hover:bg-primary/95 text-white",
          )}
          onClick={() => {
            onToggle(featured.id);
            showSuccess(
              featured.isActive ? "Featured listing ended" : "Featured listing activated",
              featured.listingName,
            );
          }}
        >
          {featured.isActive ? "End Promotion" : "Activate"}
        </Button>
      </div>
    </div>
  );
}

// Main Component

export function AdminPromotions() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(mockPromoCodes);
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>(mockFeaturedListings);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"codes" | "featured">("codes");
  const { setLoading, setLoadingMessage } = useLoading();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredCodes = useMemo(() => {
    return promoCodes.filter(
      (p) =>
        !search ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [promoCodes, search]);

  const filteredFeatured = useMemo(() => {
    return featuredListings.filter(
      (f) =>
        !search ||
        f.listingName.toLowerCase().includes(search.toLowerCase()) ||
        f.hostName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [featuredListings, search]);

  const codeStats = useMemo(
    () => ({
      total: promoCodes.length,
      active: promoCodes.filter((p) => p.isActive).length,
      totalUsed: promoCodes.reduce((s, p) => s + p.currentUses, 0),
    }),
    [promoCodes],
  );

  const handleToggleCode = (id: string) => {
    setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)));
  };

  const handleDeleteCode = (id: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleFeatured = (id: string) => {
    setFeaturedListings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)),
    );
  };

  const handleExportCSV = () => {
    if (activeTab === "codes") {
      const headers = ["Code", "Type", "Value", "Applies To", "Min Spend", "Uses", "Max Uses", "Status", "Expires At"];
      const rows = filteredCodes.map((p) => [
        p.code,
        p.type,
        p.value,
        p.appliesTo,
        p.minSpend || 0,
        p.currentUses,
        p.maxUses,
        p.isActive ? "active" : "inactive",
        p.expiresAt,
      ]);
      const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csv));
      link.setAttribute("download", `promo-codes-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Promo codes exported to CSV");
    } else {
      const headers = ["Listing Name", "Host Name", "Type", "Placement", "Monthly Cost (ZMW)", "Status", "Starts At", "Ends At"];
      const rows = filteredFeatured.map((f) => [
        `"${f.listingName}"`,
        `"${f.hostName}"`,
        f.listingType,
        f.placement,
        f.cost,
        f.isActive ? "active" : "inactive",
        f.startsAt,
        f.endsAt,
      ]);
      const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csv));
      link.setAttribute("download", `featured-campaigns-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Featured campaigns exported to CSV");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-neutral-50/50 pb-16">
      <AdminPageHeader
        eyebrow="Growth & Marketing"
        title="Promotions & Marketing"
        description={`${codeStats.active} active promo codes · ${featuredListings.filter((f) => f.isActive).length} featured listings`}
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
            <Button
              size="sm"
              className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white shadow-2xs"
              onClick={() => {
                setShowCreateDialog(true);
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create Promo Code
            </Button>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6 space-y-6">
        {/* Tab Controls and Search Bar */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setActiveTab("codes");
                  setSearch("");
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
                  activeTab === "codes"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100/80",
                )}
              >
                <Tag className="h-3.5 w-3.5" />
                Promo Codes
              </button>
              <button
                onClick={() => {
                  setActiveTab("featured");
                  setSearch("");
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
                  activeTab === "featured"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:bg-neutral-100/80",
                )}
              >
                <Star className="h-3.5 w-3.5" />
                Featured Listings
              </button>
            </div>

            <span className="text-xs text-neutral-400">
              {activeTab === "codes"
                ? `${codeStats.active} of ${codeStats.total} codes active`
                : `${featuredListings.filter((f) => f.isActive).length} listings featured`}
            </span>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder={
                activeTab === "codes" ? "Search promo codes..." : "Search featured listings..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-sm focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Content Stream */}
        <div>
          {activeTab === "codes" ? (
            <div className="space-y-3">
              {filteredCodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-2xs">
                  <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
                    <Tag className="h-6 w-6 text-neutral-400" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900">No promo codes found</h3>
                  <p className="text-xs text-neutral-500 mt-1">Try adjusting your search query.</p>
                </div>
              ) : (
                filteredCodes.map((promo) => (
                  <PromoCodeCard
                    key={promo.id}
                    promo={promo}
                    onToggle={handleToggleCode}
                    onDelete={handleDeleteCode}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFeatured.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-2xs">
                  <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
                    <Star className="h-6 w-6 text-neutral-400" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900">No featured listings found</h3>
                  <p className="text-xs text-neutral-500 mt-1">Try adjusting your search query.</p>
                </div>
              ) : (
                filteredFeatured.map((feat) => (
                  <FeaturedCard key={feat.id} featured={feat} onToggle={handleToggleFeatured} />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Promo Dialog */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent className="rounded-2xl max-w-md bg-white border border-neutral-200/80 p-6 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-neutral-900">
              Create Promo Code
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-neutral-500 mt-1.5">
              Add a new promotional code for users to apply at checkout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3.5 my-2">
            <div>
              <label className="text-xs font-semibold text-neutral-700 mb-1 block">Code</label>
              <Input
                placeholder="e.g. SUMMER25"
                className="h-10 rounded-xl border-neutral-200/80 font-mono font-bold tracking-wider"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1 block">Type</label>
                <Select defaultValue="percentage">
                  <SelectTrigger className="h-10 rounded-xl border-neutral-200/80 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 mb-1 block">Value</label>
                <Input
                  type="number"
                  placeholder="20"
                  className="h-10 rounded-xl border-neutral-200/80 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-700 mb-1 block">Applies To</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 rounded-xl border-neutral-200/80 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Listings</SelectItem>
                  <SelectItem value="stay">Stays Only</SelectItem>
                  <SelectItem value="experience">Experiences Only</SelectItem>
                  <SelectItem value="transport">Transport Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel className="rounded-xl font-semibold text-xs border-neutral-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowCreateDialog(false);
                showSuccess(
                  "Promo code created",
                  "The new promo code is now active and available.",
                );
              }}
              className="rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-semibold"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Create Code
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
