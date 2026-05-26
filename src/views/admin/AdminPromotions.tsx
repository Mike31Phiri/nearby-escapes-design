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
import { mockPromoCodes, mockFeaturedListings } from "@/lib/mock-admin-data";
import type { PromoCode, FeaturedListing } from "@/lib/mock-admin-data";
import { useLoading, withLoading } from "@/lib/loading-context";
import { showSuccess, showWarning } from "@/lib/admin-toast";

// ─── Helpers ────────────────────────────────────────────────────────────

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: Bus,
};

const placementConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  homepage_banner: { label: "Homepage Banner", icon: Home, color: "#8b5cf6" },
  category_featured: { label: "Category Featured", icon: Star, color: "#f59e0b" },
  search_boost: { label: "Search Boost", icon: ArrowUpRight, color: "#3b82f6" },
};

// ─── Promo Code Card ────────────────────────────────────────────────────

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
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm transition-all", promo.isActive ? "border-border/50 hover:shadow-md" : "border-border/30 bg-card/60")}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="group flex items-center gap-1.5 rounded-lg bg-primary/5 px-3 py-1 text-sm font-bold text-primary font-mono hover:bg-primary/10 transition-colors"
              title="Copy code"
            >
              {promo.code}
              {copied ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
            {promo.isActive ? (
              <Badge variant="outline" className="rounded-full text-[8px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="rounded-full text-[8px] font-bold uppercase tracking-wider bg-zinc-50 text-zinc-600 border-zinc-200">
                {isExpired ? "Expired" : "Disabled"}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">{promo.description}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-foreground">
            {promo.type === "percentage" ? `${promo.value}%` : `K${promo.value}`}
          </p>
          <p className="text-[10px] text-muted-foreground font-medium capitalize">{promo.type} off</p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Tag className="h-3 w-3" />
          {promo.appliesTo === "all" ? "All listings" : `${promo.appliesTo}s`}
        </span>
        {promo.minSpend && (
          <span>Min. K{promo.minSpend}</span>
        )}
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          Expires {expiresAt.toLocaleDateString("en-ZM", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>

      {/* Usage Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground font-medium">
            {promo.currentUses}/{promo.maxUses} used
          </span>
          <span className={cn(
            "font-semibold",
            usagePct >= 90 ? "text-rose-600" : usagePct >= 70 ? "text-amber-600" : "text-emerald-600",
          )}>
            {usagePct}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
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
      <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-2">
        <Button
          size="sm"
          variant={promo.isActive ? "outline" : "default"}
          className={cn("h-7 rounded-lg text-xs font-semibold", !promo.isActive && "")}
          onClick={() =>
            withLoading(useLoading().setLoading, useLoading().setLoadingMessage, async () => {
              await new Promise((r) => setTimeout(r, 400));
              onToggle(promo.id);
              showSuccess(promo.isActive ? "Promo code disabled" : "Promo code activated", promo.code);
            }, "Updating...")
          }
        >
          {promo.isActive ? "Deactivate" : "Activate"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive p-0"
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

// ─── Featured Listing Card ─────────────────────────────────────────────

function FeaturedCard({
  featured,
  onToggle,
}: {
  featured: FeaturedListing;
  onToggle: (id: string) => void;
}) {
  const pl = placementConfig[featured.placement];
  const PlacementIcon = pl.icon;

  return (
    <div className={cn("rounded-xl border bg-card p-5 shadow-sm transition-all", featured.isActive ? "border-border/50" : "border-border/30 bg-card/60")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${pl.color}1a`, color: pl.color }}
          >
            <PlacementIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-foreground truncate">{featured.listingName}</h4>
            <p className="text-xs text-muted-foreground">
              {featured.hostName} · {featured.listingType}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-foreground">K{featured.cost}</p>
          <p className="text-[10px] text-muted-foreground">/ month</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <PlacementIcon className="h-3 w-3 text-muted-foreground" />
        <span className="font-medium text-foreground">{pl.label}</span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays className="h-3 w-3" />
        {new Date(featured.startsAt).toLocaleDateString("en-ZM", { month: "short", day: "numeric" })} — {new Date(featured.endsAt).toLocaleDateString("en-ZM", { month: "short", day: "numeric", year: "numeric" })}
      </div>

      <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-2">
        <Button
          size="sm"
          variant={featured.isActive ? "outline" : "default"}
          className="h-7 rounded-lg text-xs font-semibold"
          onClick={() => {
            onToggle(featured.id);
            showSuccess(featured.isActive ? "Featured listing ended" : "Featured listing activated", featured.listingName);
          }}
        >
          {featured.isActive ? "End Promotion" : "Activate"}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────

export function AdminPromotions() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(mockPromoCodes);
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>(mockFeaturedListings);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"codes" | "featured">("codes");
  const { setLoading, setLoadingMessage } = useLoading();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredCodes = useMemo(() => {
    return promoCodes.filter((p) =>
      !search || p.code.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [promoCodes, search]);

  const filteredFeatured = useMemo(() => {
    return featuredListings.filter((f) =>
      !search || f.listingName.toLowerCase().includes(search.toLowerCase()) || f.hostName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [featuredListings, search]);

  const codeStats = useMemo(() => ({
    total: promoCodes.length,
    active: promoCodes.filter((p) => p.isActive).length,
    totalUsed: promoCodes.reduce((s, p) => s + p.currentUses, 0),
  }), [promoCodes]);

  const handleToggleCode = (id: string) => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
  };

  const handleDeleteCode = (id: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleFeatured = (id: string) => {
    setFeaturedListings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)),
    );
  };

  return (
    <div className="flex-1">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-8">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-6 md:pt-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Promotions &amp; Marketing</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {codeStats.active} active promo codes · {featuredListings.filter((f) => f.isActive).length} featured listings
                </p>
              </div>
              <Button
                size="sm"
                className="h-9 rounded-lg text-xs font-semibold"
                onClick={() => {
                  setShowCreateDialog(true);
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Create Promo Code
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="flex items-center gap-1 rounded-xl border border-border/40 bg-card p-1 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab("codes")}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeTab === "codes" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Tag className="h-3.5 w-3.5 inline mr-1.5" />
              Promo Codes
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeTab === "featured" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Star className="h-3.5 w-3.5 inline mr-1.5" />
              Featured Listings
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === "codes" ? "Search promo codes..." : "Search featured listings..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-border/60 text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-6 pb-16">
          {activeTab === "codes" ? (
            <div className="space-y-3">
              {filteredCodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Tag className="h-7 w-7 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">No promo codes found</h3>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your search.</p>
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
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Star className="h-7 w-7 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">No featured listings found</h3>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your search.</p>
                </div>
              ) : (
                filteredFeatured.map((feat) => (
                  <FeaturedCard
                    key={feat.id}
                    featured={feat}
                    onToggle={handleToggleFeatured}
                  />
                ))
              )}
            </div>
          )}
        </div>

      {/* Create Promo Dialog */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">Create Promo Code</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Add a new promotional code for users to apply at checkout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Code</label>
              <Input placeholder="e.g. SUMMER25" className="h-10 rounded-xl border-border/60 font-mono font-bold tracking-wider" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Type</label>
                <Select defaultValue="percentage">
                  <SelectTrigger className="h-10 rounded-xl border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-bold text-foreground mb-1 block">Value</label>
                <Input type="number" placeholder="20" className="h-10 rounded-xl border-border/60" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">Applies To</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 rounded-xl border-border/60">
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
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-semibold border-border/60">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowCreateDialog(false);
                showSuccess("Promo code created", "The new promo code is now active and available.");
              }}
              className="rounded-xl bg-primary text-white hover:bg-primary/90 font-bold"
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
