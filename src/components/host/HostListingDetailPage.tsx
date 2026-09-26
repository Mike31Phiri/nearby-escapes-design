"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  DollarSign,
  CalendarDays,
  TrendingUp,
  ArrowLeft,
  Bed,
  Ticket,
  Bus,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  Trash2,
  ChevronDown,
  MessageSquare,
  BarChart3,
  Ban,
  RefreshCw,
  Loader2,
  ChevronRight,
  AlertTriangle,
  Copy,
  Gem,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { mockHostProfile } from "@/lib/mock-profile-data";
import type { HostListing } from "@/lib/mock-profile-data";
import { mockHostBookings } from "@/lib/mock-host-bookings";
import type { HostBooking } from "@/lib/mock-host-bookings";
import { toast } from "sonner";

// Type helpers

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: Bus,
  gem: Gem,
};

const typeLabels: Record<string, string> = {
  stay: "Stay",
  experience: "Experience",
  transport: "Transport",
  gem: "Hidden Gem",
};

const typeRoutes: Record<string, string> = {
  stay: "stays",
  experience: "experiences",
  transport: "transport",
  gem: "experiences",
};

const statusStyles: Record<string, string> = {
  active:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  pending: "bg-[#f3eafb] text-purple border-purple/30",
  draft:
    "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
};

const bookingStatusConfig: Record<
  string,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    badgeClass: "bg-[#f3eafb] text-purple border-purple/30",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    badgeClass:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    badgeClass:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
  },
};

// Mock monthly performance per listing

interface MonthlyListingPerf {
  month: string;
  bookings: number;
  revenue: number;
}

const mockListingPerformance: Record<string, MonthlyListingPerf[]> = {
  h1: [
    { month: "Jan", bookings: 8, revenue: 3600 },
    { month: "Feb", bookings: 6, revenue: 2700 },
    { month: "Mar", bookings: 10, revenue: 4500 },
    { month: "Apr", bookings: 12, revenue: 5400 },
    { month: "May", bookings: 15, revenue: 6750 },
    { month: "Jun", bookings: 14, revenue: 6300 },
    { month: "Jul", bookings: 18, revenue: 8100 },
    { month: "Aug", bookings: 16, revenue: 7200 },
    { month: "Sep", bookings: 11, revenue: 4950 },
    { month: "Oct", bookings: 9, revenue: 4050 },
    { month: "Nov", bookings: 5, revenue: 2250 },
    { month: "Dec", bookings: 7, revenue: 3150 },
  ],
  h2: [
    { month: "Jan", bookings: 5, revenue: 1900 },
    { month: "Feb", bookings: 4, revenue: 1520 },
    { month: "Mar", bookings: 8, revenue: 3040 },
    { month: "Apr", bookings: 9, revenue: 3420 },
    { month: "May", bookings: 11, revenue: 4180 },
    { month: "Jun", bookings: 10, revenue: 3800 },
    { month: "Jul", bookings: 13, revenue: 4940 },
    { month: "Aug", bookings: 12, revenue: 4560 },
    { month: "Sep", bookings: 7, revenue: 2660 },
    { month: "Oct", bookings: 6, revenue: 2280 },
    { month: "Nov", bookings: 3, revenue: 1140 },
    { month: "Dec", bookings: 4, revenue: 1520 },
  ],
  h3: [
    { month: "Jan", bookings: 3, revenue: 1260 },
    { month: "Feb", bookings: 2, revenue: 840 },
    { month: "Mar", bookings: 5, revenue: 2100 },
    { month: "Apr", bookings: 7, revenue: 2940 },
    { month: "May", bookings: 8, revenue: 3360 },
    { month: "Jun", bookings: 8, revenue: 3360 },
    { month: "Jul", bookings: 10, revenue: 4200 },
    { month: "Aug", bookings: 9, revenue: 3780 },
    { month: "Sep", bookings: 6, revenue: 2520 },
    { month: "Oct", bookings: 4, revenue: 1680 },
    { month: "Nov", bookings: 2, revenue: 840 },
    { month: "Dec", bookings: 3, revenue: 1260 },
  ],
  h4: [
    { month: "Jan", bookings: 22, revenue: 3960 },
    { month: "Feb", bookings: 18, revenue: 3240 },
    { month: "Mar", bookings: 28, revenue: 5040 },
    { month: "Apr", bookings: 30, revenue: 5400 },
    { month: "May", bookings: 35, revenue: 6300 },
    { month: "Jun", bookings: 32, revenue: 5760 },
    { month: "Jul", bookings: 40, revenue: 7200 },
    { month: "Aug", bookings: 38, revenue: 6840 },
    { month: "Sep", bookings: 25, revenue: 4500 },
    { month: "Oct", bookings: 20, revenue: 3600 },
    { month: "Nov", bookings: 15, revenue: 2700 },
    { month: "Dec", bookings: 18, revenue: 3240 },
  ],
  h5: [
    { month: "Jan", bookings: 12, revenue: 1440 },
    { month: "Feb", bookings: 10, revenue: 1200 },
    { month: "Mar", bookings: 16, revenue: 1920 },
    { month: "Apr", bookings: 18, revenue: 2160 },
    { month: "May", bookings: 20, revenue: 2400 },
    { month: "Jun", bookings: 19, revenue: 2280 },
    { month: "Jul", bookings: 24, revenue: 2880 },
    { month: "Aug", bookings: 22, revenue: 2640 },
    { month: "Sep", bookings: 15, revenue: 1800 },
    { month: "Oct", bookings: 13, revenue: 1560 },
    { month: "Nov", bookings: 8, revenue: 960 },
    { month: "Dec", bookings: 11, revenue: 1320 },
  ],
  h6: [
    { month: "Jan", bookings: 0, revenue: 0 },
    { month: "Feb", bookings: 0, revenue: 0 },
    { month: "Mar", bookings: 0, revenue: 0 },
    { month: "Apr", bookings: 0, revenue: 0 },
    { month: "May", bookings: 0, revenue: 0 },
    { month: "Jun", bookings: 0, revenue: 0 },
    { month: "Jul", bookings: 0, revenue: 0 },
    { month: "Aug", bookings: 0, revenue: 0 },
    { month: "Sep", bookings: 0, revenue: 0 },
    { month: "Oct", bookings: 0, revenue: 0 },
    { month: "Nov", bookings: 0, revenue: 0 },
    { month: "Dec", bookings: 0, revenue: 0 },
  ],
};

// Stat Card

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  accent?: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-purple/30">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 ",
        )}
        style={{
          backgroundColor: accent ? `${accent}1a` : "rgba(107, 43, 184, 0.1)",
          color: accent ?? "var(--color-purple)",
        }}
      >
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">{value}</p>
        <p className="text-xs font-semibold text-black-muted uppercase tracking-wide mt-0.5">
          {label}
        </p>
        {trend && (
          <p
            className={cn(
              "text-xs font-semibold text-black mt-0.5 flex items-center gap-0.5",
              trend.positive ? "text-emerald-600" : "text-rose-600",
            )}
          >
            <TrendingUp className={cn("h-3 w-3", !trend.positive && "rotate-180")} />
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}

// Booking Card (compact)

function CompactBookingCard({ booking }: { booking: HostBooking }) {
  const cfg = bookingStatusConfig[booking.status];
  const StatusIcon = cfg.icon;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-ZM", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm card-shadow transition-all duration-200 hover:shadow-md">
      <div className="h-10 w-10 shrink-0 rounded-full bg-purple/10 flex items-center justify-center text-purple font-bold text-base">
        {booking.guestName.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-neutral-900 truncate">{booking.guestName}</p>
        <p className="text-sm text-neutral-500 flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3" />
          {booking.checkIn
            ? `${formatDate(booking.checkIn)} — ${formatDate(booking.checkOut)}`
            : formatDate(booking.date)}
          <span className="font-semibold ml-1">K{booking.amount.toLocaleString()}</span>
        </p>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "rounded-full text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 border",
          cfg.badgeClass,
        )}
      >
        <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
        {cfg.label}
      </Badge>
    </div>
  );
}

// Main Page Component

interface Props {
  listing: HostListing;
}

export function HostListingDetailPage({ listing }: Props) {
  const router = useRouter();
  const TypeIcon = typeIcons[listing.type];
  const statusClass = statusStyles[listing.status];

  // Tab state
  type Tab = "overview" | "bookings" | "reviews";
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Status toggle
  const [currentStatus, setCurrentStatus] = useState(listing.status);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  // Bookings for this listing
  const listingBookings = useMemo(
    () => mockHostBookings.filter((b) => b.listingId === listing.id),
    [listing.id],
  );

  // Performance data
  const perfData = useMemo(() => mockListingPerformance[listing.id] ?? [], [listing.id]);

  // Stats
  const stats = useMemo(() => {
    const totalRevenue = perfData.reduce((sum, m) => sum + m.revenue, 0);
    const totalBookings = perfData.reduce((sum, m) => sum + m.bookings, 0);
    const currentMonth = perfData[perfData.length - 1] ?? { bookings: 0, revenue: 0 };
    const prevMonth = perfData[perfData.length - 2] ?? { bookings: 0, revenue: 0 };
    const bookingsTrend =
      prevMonth.bookings > 0
        ? (((currentMonth.bookings - prevMonth.bookings) / prevMonth.bookings) * 100).toFixed(1)
        : "0";
    const revenueTrend =
      prevMonth.revenue > 0
        ? (((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1)
        : "0";
    return {
      totalRevenue,
      totalBookings,
      currentMonthBookings: currentMonth.bookings,
      currentMonthRevenue: currentMonth.revenue,
      bookingsTrend,
      revenueTrend,
    };
  }, [perfData]);

  // Derived booking groups
  const pendingBookings = useMemo(
    () => listingBookings.filter((b) => b.status === "pending"),
    [listingBookings],
  );
  const upcomingBookings = useMemo(
    () => listingBookings.filter((b) => b.status === "confirmed"),
    [listingBookings],
  );
  const pastBookings = useMemo(
    () => listingBookings.filter((b) => b.status === "completed" || b.status === "cancelled"),
    [listingBookings],
  );

  // Management Actions

  const handleDelete = useCallback(() => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleteDialogOpen(false);
      toast.success(`"${listing.name}"has been deleted.`);
      router.push("/host");
    }, 1200);
  }, [listing.name, router]);

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/listings/${typeRoutes[listing.type]}/${listing.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Listing link copied to clipboard");
  }, [listing.id, listing.type]);

  // Chart config

  const maxRevenue = Math.max(...perfData.map((m) => m.revenue), 1);
  const maxBookings = Math.max(...perfData.map((m) => m.bookings), 1);

  // Recent reviews for this listing from mock data
  const listingReviews = useMemo(() => {
    const allReviews = [
      {
        id: "r1",
        guestName: "Sarah Phiri",
        rating: 5,
        date: "2025-03-20",
        text: "An absolutely breathtaking experience! Waking up to elephants at dawn was magical. The staff went above and beyond to make our stay unforgettable.",
      },
      {
        id: "r2",
        guestName: "James Banda",
        rating: 4,
        date: "2025-03-22",
        text: "Beautiful location and great service. The room was comfortable and the food was excellent. Would definitely recommend to anyone visiting the area.",
      },
      {
        id: "r3",
        guestName: "Emily Zulu",
        rating: 5,
        date: "2025-02-15",
        text: "Exceeded all expectations! The views were incredible and the guide was knowledgeable. A truly unforgettable experience.",
      },
      {
        id: "r4",
        guestName: "Michael Tembo",
        rating: 5,
        date: "2025-02-10",
        text: "One of the best experiences in Zambia. Everything was perfectly organized from start to finish.",
      },
      {
        id: "r5",
        guestName: "Grace Mwale",
        rating: 4,
        date: "2025-01-28",
        text: "Lovely property with amazing attention to detail. The hosts were incredibly welcoming and helpful throughout our stay.",
      },
    ];
    return allReviews.slice(0, Math.floor(Math.random() * 3) + 2);
  }, []); // Stable mock

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "bookings", label: "Bookings", icon: CalendarDays },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-purple/8 via-purple/[0.02] to-transparent pb-8">
          <div className="mx-auto max-w-5xl px-4 md:px-6 pt-8 md:pt-12">
            {/* Back + Actions Row */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/host/listings"
                className="text-xs font-semibold text-neutral-500 hover:text-purple transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Listings
              </Link>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl text-xs font-semibold border-neutral-200/80 bg-white hover:border-purple/40 hover:text-purple"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Copy Link</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl text-xs font-semibold border-neutral-200/80 bg-white hover:border-purple/40 hover:text-purple"
                  asChild
                >
                  <Link
                    href={`/listings/${typeRoutes[listing.type]}/${listing.id}`}
                    target="_blank"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    <span className="hidden sm:inline">View Public</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Listing Identity */}
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Image */}
              <div className="relative h-36 w-full md:h-44 md:w-72 shrink-0 rounded-2xl overflow-hidden bg-muted shadow-md">
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <div className="rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white uppercase tracking-wide flex items-center gap-1">
                    <TypeIcon className="h-3.5 w-3.5" />
                    <span>{typeLabels[listing.type]}</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full text-[11px] font-semibold uppercase tracking-wide px-2.5 py-0.5 border",
                          statusClass,
                        )}
                      >
                        {currentStatus}
                      </Badge>
                      {listing.rating > 0 && (
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-base font-bold text-neutral-900">
                            {listing.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
                      {listing.name}
                    </h1>
                    <p className="text-base text-neutral-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {listing.location}
                    </p>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-base">
                  <span className="flex items-center gap-1.5 font-semibold text-neutral-900">
                    <DollarSign className="h-4 w-4 text-purple/70" />K{listing.price}
                    <span className="text-neutral-500 font-normal">
                      /
                      {listing.type === "stay"
                        ? "night"
                        : listing.type === "transport"
                          ? "seat"
                          : "person"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-500">
                    <CalendarDays className="h-4 w-4 text-purple/70" />
                    {listing.bookings} total bookings
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-500">
                    <DollarSign className="h-4 w-4 text-purple/70" />K
                    {listing.revenue.toLocaleString()} earned
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={`K${stats.totalRevenue.toLocaleString()}`}
              trend={{
                value: `${stats.revenueTrend.startsWith("-") ? "" : "+"}${stats.revenueTrend}% vs last month`,
                positive: Number(stats.revenueTrend) >= 0,
              }}
              accent="var(--color-purple)"
            />
            <StatCard
              icon={CalendarDays}
              label="Total Bookings"
              value={String(stats.totalBookings)}
              trend={{
                value: `${stats.bookingsTrend.startsWith("-") ? "" : "+"}${stats.bookingsTrend}% vs last month`,
                positive: Number(stats.bookingsTrend) >= 0,
              }}
              accent="var(--color-purple)"
            />
            <StatCard
              icon={Star}
              label="Avg. Rating"
              value={listing.rating > 0 ? listing.rating.toFixed(1) : "—"}
              accent="var(--color-purple)"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg. per Booking"
              value={
                stats.totalBookings > 0
                  ? `K${Math.round(stats.totalRevenue / stats.totalBookings).toLocaleString()}`
                  : "K0"
              }
              accent="var(--color-purple)"
            />
          </div>
        </div>

        {/* Management Actions Bar */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 mt-6">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-2">
              Management
            </span>

            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl text-xs font-semibold border-neutral-200/80 bg-white hover:border-purple/40 hover:text-purple"
              asChild
            >
              <Link href={`/host/availability`}>
                <CalendarDays className="h-3.5 w-3.5 mr-1" />
                Calendar
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-xl text-xs font-semibold border-neutral-200/80 bg-white hover:border-purple/40 hover:text-purple"
              onClick={() => toast.success("Edit mode coming soon")}
            >
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              Edit Listing
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl text-xs font-semibold border-neutral-200/80 bg-white hover:border-purple/40 hover:text-purple"
                onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                {currentStatus === "active" ? "Set to Draft" : "Publish"}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
              {statusMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setStatusMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-1 z-20 w-56 rounded-xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
                    <button
                      onClick={() => {
                        setCurrentStatus(currentStatus === "active" ? "draft" : "active");
                        setStatusMenuOpen(false);
                        toast.success(
                          `Listing ${currentStatus === "active" ? "unpublished" : "published"} successfully`,
                        );
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div
                        className={cn(
                          "h-7 w-7 rounded-lg flex items-center justify-center",
                          currentStatus === "active"
                            ? "bg-[#e4d4f5] text-purple"
                            : "bg-emerald-100 text-emerald-600",
                        )}
                      >
                        {currentStatus === "active" ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-base">
                          {currentStatus === "active" ? "Unpublish" : "Publish"}
                        </p>
                        <p className="text-xs text-black-muted">
                          {currentStatus === "active"
                            ? "Hide from guest search results"
                            : "Make visible to guests"}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        handleCopyLink();
                        setStatusMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-base">View Public Page</p>
                        <p className="text-xs text-black-muted">
                          Open listing as guests see it
                        </p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex-1" />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-lg text-sm font-semibold text-destructive hover:text-destructive hover:bg-destructive/5"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">
                    Delete &quot;{listing.name}&quot;?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-base text-neutral-500">
                    This action cannot be undone. All associated booking data will be permanently
                    removed from your dashboard and the listing will be immediately hidden from
                    search results.
                  </AlertDialogDescription>
                </AlertDialogHeader>{" "}
                <div className="flex items-start gap-3 rounded-lg bg-[#f3eafb] border border-purple/30 p-3 text-base text-purple">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    This listing has <strong>{stats.totalBookings}</strong> historical bookings and
                    {""}
                    <strong>{pendingBookings.length}</strong> pending requests.
                  </p>
                </div>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="rounded-xl font-semibold border-border/60">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1.5" /> Delete Listing
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 mt-8">
          <div className="flex border-b border-neutral-200 gap-0 overflow-x-auto scrollbar-none">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-2 pb-3.5 px-4 md:px-6 text-sm font-bold uppercase tracking-wider border-b-2 transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "border-purple text-purple"
                      : "border-transparent text-neutral-500 hover:text-neutral-900 hover:border-muted-foreground/30",
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-purple" : "text-neutral-500")} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="mt-8 pb-16">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-10">
                {/* Performance Chart */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold uppercase tracking-widest text-neutral-900">
                      Monthly Performance
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-purple/60" />
                        Revenue
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-purple/20" />
                        Bookings
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm card-shadow">
                    <div className="flex items-end justify-between gap-2 h-44">
                      {perfData.map((m) => {
                        const revHeight = (m.revenue / maxRevenue) * 100;
                        const bkgHeight = (m.bookings / maxBookings) * 100;
                        return (
                          <div
                            key={m.month}
                            className="flex-1 flex flex-col items-center gap-0.5 group"
                          >
                            {/* Dual bar chart */}
                            <div className="w-full flex items-end justify-center gap-[2px]">
                              <div
                                className="w-2.5 rounded-t-md bg-purple/60 transition-all duration-200 cursor-pointer group-hover:bg-purple/100 relative"
                                style={{ height: `${Math.max(revHeight, 2)}%` }}
                                title={`Revenue: K${m.revenue.toLocaleString()}`}
                              />
                              <div
                                className="w-2.5 rounded-t-md bg-purple/20 transition-all duration-200 cursor-pointer group-hover:bg-purple/40 relative"
                                style={{ height: `${Math.max(bkgHeight, 2)}%` }}
                                title={`Bookings: ${m.bookings}`}
                              />
                            </div>
                            {/* Tooltip on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[11px] font-semibold px-2 py-1 tracking-wide rounded-md whitespace-nowrap pointer-events-none z-10">
                              K{m.revenue.toLocaleString()} · {m.bookings} bookings
                            </div>
                            <span className="text-[11px] font-semibold text-black-muted mt-1 tracking-wide">
                              {m.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick Overview Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm card-shadow">
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                      Current Month
                    </p>
                    <p className="text-3xl font-bold text-neutral-900">
                      {stats.currentMonthBookings}
                    </p>
                    <p className="text-sm text-neutral-500 font-medium mt-1">bookings this month</p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm card-shadow">
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                      Monthly Revenue
                    </p>
                    <p className="text-3xl font-bold text-neutral-900">
                      K{stats.currentMonthRevenue.toLocaleString()}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-semibold mt-1 flex items-center gap-0.5",
                        Number(stats.revenueTrend) >= 0 ? "text-emerald-600" : "text-destructive",
                      )}
                    >
                      <TrendingUp
                        className={cn("h-3 w-3", Number(stats.revenueTrend) < 0 && "rotate-180")}
                      />
                      {stats.revenueTrend}% vs last month
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm card-shadow">
                    <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                      Pending Requests
                    </p>
                    <p className="text-3xl font-bold text-neutral-900">{pendingBookings.length}</p>
                    <p className="text-sm text-neutral-500 font-medium mt-1">
                      {pendingBookings.length > 0 ? `Awaiting your response` : "All clear"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKINGS */}
            {activeTab === "bookings" && (
              <div className="space-y-8">
                {/* Upcoming / Confirmed */}
                {(upcomingBookings.length > 0 || pendingBookings.length > 0) && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarDays className="h-4 w-4 text-purple" />
                      <h3 className="text-base font-bold uppercase tracking-widest text-neutral-900">
                        Upcoming & Pending
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {/* Pending First */}
                      {pendingBookings.map((booking) => (
                        <CompactBookingCard key={booking.id} booking={booking} />
                      ))}
                      {upcomingBookings.map((booking) => (
                        <CompactBookingCard key={booking.id} booking={booking} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Past Bookings */}
                {pastBookings.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-neutral-500" />
                      <h3 className="text-base font-bold uppercase tracking-widest text-neutral-500">
                        Past Bookings
                      </h3>
                      <span className="text-sm text-neutral-500">({pastBookings.length})</span>
                    </div>
                    <div className="space-y-3">
                      {pastBookings.map((booking) => (
                        <CompactBookingCard key={booking.id} booking={booking} />
                      ))}
                    </div>
                  </div>
                )}

                {listingBookings.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <CalendarDays className="h-7 w-7 text-neutral-500/40" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900">No bookings yet</h3>
                    <p className="text-base text-neutral-500 mt-1 max-w-sm">
                      Guest bookings for this listing will appear here.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-6 rounded-full font-semibold text-sm border-border/60"
                      asChild
                    >
                      <Link href={`/host/bookings`}>
                        View All Booking Requests
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                )}

                {listingBookings.length > 0 && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full font-semibold text-sm border-border/60"
                      asChild
                    >
                      <Link href={`/host/bookings`}>
                        View All Booking Requests
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === "reviews" && (
              <div>
                {listingReviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <MessageSquare className="h-7 w-7 text-neutral-500/40" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900">No reviews yet</h3>
                    <p className="text-base text-neutral-500 mt-1 max-w-sm">
                      Reviews from guests will appear here after their stays.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listingReviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm card-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-purple/10 flex items-center justify-center text-purple font-bold text-base">
                              {review.guestName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-base font-bold text-neutral-900">
                                {review.guestName}
                              </p>
                              <p className="text-sm text-neutral-500">
                                {new Date(review.date).toLocaleDateString("en-ZM", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-neutral-500/20",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-base text-neutral-500 leading-relaxed">{review.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                {listingReviews.length > 0 && listing.rating > 0 && (
                  <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm card-shadow">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-neutral-900">
                          {listing.rating.toFixed(1)}
                        </p>
                        <p className="text-sm text-neutral-500 font-medium">out of 5</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = listingReviews.filter((r) => r.rating === star).length;
                          const pct =
                            listingReviews.length > 0 ? (count / listingReviews.length) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2 text-sm">
                              <span className="w-3 text-neutral-500 font-semibold">{star}</span>
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                {" "}
                                <div
                                  className="h-full rounded-full bg-purple transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="w-6 text-right text-neutral-500">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
