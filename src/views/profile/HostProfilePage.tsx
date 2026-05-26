"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Star,
  Settings,
  LogOut,
  DollarSign,
  CalendarDays,
  Users,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Bed,
  Ticket,
  Bus,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  BarChart3,
  Edit3,
  ShieldCheck,
  Award,
  Mail,
  Phone,
  User,
  Bell,
  CreditCard,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  mockHostProfile,
  mockEarnings,
} from "@/lib/mock-profile-data";
import type { HostListing } from "@/lib/mock-profile-data";
import { toast } from "sonner";

type HostTab = "listings" | "bookings" | "reviews" | "availability" | "analytics" | "settings";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  draft: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
};

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: Bus,
};

const typeLabels: Record<string, string> = {
  stay: "Stay",
  experience: "Experience",
  transport: "Transport",
};

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {trend && (
          <p className={cn(
            "text-[10px] font-bold mt-0.5 flex items-center gap-0.5",
            trend.positive ? "text-emerald-600" : "text-destructive"
          )}>
            <TrendingUp className={cn("h-3 w-3", !trend.positive && "rotate-180")} />
            {trend.value} from last month
          </p>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: HostListing }) {
  const TypeIcon = typeIcons[listing.type];
  const statusClass = statusStyles[listing.status];

  return (
    <Link
      href={`/host/listings/${listing.id}`}
      className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={listing.image}
          alt={listing.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
          <TypeIcon className="h-3 w-3" />
          <span>{typeLabels[listing.type]}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-foreground truncate">{listing.name}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 shrink-0" />
              {listing.location}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn("rounded-full text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 shrink-0 border", statusClass)}
          >
            {listing.status}
          </Badge>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">${listing.price}</span>
          {listing.status === "active" && (
            <>
              <span>{listing.bookings} bookings</span>
              {listing.rating > 0 && (
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {listing.rating}
                </span>
              )}
              <span className="font-semibold text-emerald-600">${listing.revenue.toLocaleString()} earned</span>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 self-center">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}

function BookingItem({ booking }: { booking: typeof mockBookings[0] }) {
  const statusConfig = {
    confirmed: { label: "Confirmed", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    pending: { label: "Pending", icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200" },
    cancelled: { label: "Cancelled", icon: XCircle, className: "bg-rose-50 text-rose-700 border-rose-200" },
    completed: { label: "Completed", icon: CheckCircle2, className: "bg-blue-50 text-blue-700 border-blue-200" },
  };

  const cfg = statusConfig[booking.status];

  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-muted">
          <img src={booking.image} alt={booking.listingName} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{booking.listingName}</p>
          <p className="text-xs text-muted-foreground">
            {booking.guestName} · {new Date(booking.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-sm font-semibold text-foreground">${booking.price}</span>
        <Badge variant="outline" className={cn("rounded-full text-[9px] font-bold uppercase tracking-wider", cfg.className)}>
          {cfg.label}
        </Badge>
      </div>
    </div>
  );
}

function ReviewItem({ review }: { review: typeof mockHostReviews[0] }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {review.guestName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{review.guestName}</p>
            <p className="text-xs text-muted-foreground">{review.listingName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium">
        {new Date(review.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

// ----- MOCK HOST DATA -----
const mockBookings = [
  { id: "b1", listingName: "Luxury Safari Lodge", guestName: "Sarah Phiri", date: "2025-06-15", price: 450, status: "confirmed" as const, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&q=60" },
  { id: "b2", listingName: "Kafue River Lodge", guestName: "James Banda", date: "2025-06-12", price: 380, status: "pending" as const, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&q=60" },
  { id: "b3", listingName: "Victoria Falls Helicopter Tour", guestName: "Emily Zulu", date: "2025-06-10", price: 180, status: "completed" as const, image: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=200&q=60" },
  { id: "b4", listingName: "Luxury Safari Lodge", guestName: "Michael Tembo", date: "2025-06-08", price: 450, status: "completed" as const, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&q=60" },
  { id: "b5", listingName: "Bangweulu Wetlands Camp", guestName: "Grace Mwale", date: "2025-06-05", price: 420, status: "cancelled" as const, image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=200&q=60" },
  { id: "b6", listingName: "Kafue Game Drive", guestName: "David Mulenga", date: "2025-06-03", price: 120, status: "completed" as const, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=200&q=60" },
];

const mockHostReviews = [
  { id: "hr1", listingName: "Luxury Safari Lodge", guestName: "Sarah Phiri", rating: 5, date: "2025-06-10", text: "An absolutely stunning property! The attention to detail was incredible. Every need was anticipated, and the staff were exceptional. We'll definitely be back." },
  { id: "hr2", listingName: "Kafue River Lodge", guestName: "James Banda", rating: 4, date: "2025-06-08", text: "Beautiful location right on the river. The rooms were comfortable and the food was great. Only minor issue was the WiFi connectivity in the rooms." },
  { id: "hr3", listingName: "Victoria Falls Helicopter Tour", guestName: "Emily Zulu", rating: 5, date: "2025-06-05", text: "Worth every kwacha! The views of Victoria Falls from the helicopter were absolutely breathtaking. Our pilot was knowledgeable and made the experience unforgettable." },
  { id: "hr4", listingName: "Kafue Game Drive", guestName: "David Mulenga", rating: 5, date: "2025-06-02", text: "Moses was the best guide we've ever had! He spotted a leopard within minutes and knew exactly where to find the lion pride. An incredible day in the bush." },
];

export function HostProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<HostTab>("listings");

  const host = mockHostProfile;

  const activeListings = host.listings.filter((l) => l.status === "active");
  const pendingListings = host.listings.filter((l) => l.status === "pending");
  const draftListings = host.listings.filter((l) => l.status === "draft");

  const totalRevenue = host.listings.reduce((sum, l) => sum + l.revenue, 0);
  const totalBookings = host.listings.reduce((sum, l) => sum + l.bookings, 0);
  const avgRating = host.listings.filter((l) => l.rating > 0).reduce((sum, l, _i, arr) => sum + l.rating / arr.length, 0);

  const currentMonthEarnings = mockEarnings[mockEarnings.length - 1];
  const prevMonthEarnings = mockEarnings[mockEarnings.length - 2];
  const earningsTrend = prevMonthEarnings
    ? ((currentMonthEarnings.amount - prevMonthEarnings.amount) / prevMonthEarnings.amount * 100).toFixed(1)
    : "0";

  const tabs: { id: HostTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "listings", label: "Listings", icon: Building2, count: host.listings.length },
    { id: "bookings", label: "Bookings", icon: CalendarDays, count: mockBookings.length },
    { id: "reviews", label: "Reviews", icon: MessageSquare, count: mockHostReviews.length },
    { id: "availability", label: "Availability", icon: CalendarDays },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-12">
          <div className="mx-auto max-w-5xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-primary/5">
                  <img
                    src={host.avatar}
                    alt={host.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary border-2 border-white flex items-center justify-center">
                  <Award className="h-3.5 w-3.5 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {host.name}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Badge variant="secondary" className="rounded-full text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                      <Award className="h-3 w-3 mr-1" />
                      Superhost
                    </Badge>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-foreground">{host.rating}</span>
                      <span className="text-xs text-muted-foreground">({host.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {host.email}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1 flex items-center justify-center md:justify-start gap-1.5">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {host.location}
                </p>
                <p className="text-sm text-muted-foreground/80 mt-3 max-w-lg mx-auto md:mx-0 leading-relaxed">
                  {host.bio}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                  {host.verifiedBadges.map((badge) => (
                    <Badge
                      key={badge}
                      variant="outline"
                      className="rounded-full text-[9px] font-bold uppercase tracking-wider border-primary/20 text-primary bg-primary/[0.03]"
                    >
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                  <Badge
                    variant="outline"
                    className="rounded-full text-[9px] font-semibold border-border/50 text-muted-foreground"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Responds {host.responseTime}
                  </Badge>
                </div>
              </div>

              {/* Quick Actions (desktop) */}
              <div className="hidden md:flex flex-col gap-2 shrink-0">
                <Button className="rounded-full font-black uppercase tracking-widest text-xs" asChild>
                  <Link href="/host/create">
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Listing
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="rounded-full font-black uppercase tracking-widest text-[10px] border-border/60">
                  <Edit3 className="h-3.5 w-3.5 mr-1" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard icon={Building2} label="Total Listings" value={String(host.listings.length)} />
            <StatCard icon={Users} label="Total Bookings" value={String(totalBookings)} />
            <StatCard
              icon={DollarSign}
              label="Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              trend={{ value: `${earningsTrend}%`, positive: Number(earningsTrend) > 0 }}
            />
            <StatCard icon={Star} label="Avg Rating" value={avgRating.toFixed(1)} />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 mt-10">
          <div className="flex border-b border-border/50 gap-0 overflow-x-auto scrollbar-none">
            {tabs.map(({ id, label, icon: Icon, count }) => {
              const isActive = activeTab === id;
              const isAvailability = id === "availability";
              const btn = (
                <button
                  key={id}
                  onClick={() => {
                    if (isAvailability) {
                      router.push("/host/availability");
                    } else {
                      setActiveTab(id);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 pb-3.5 px-4 md:px-6 text-xs font-black uppercase tracking-wider border-b-2 transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {label}
                  {count !== undefined && (
                    <span
                      className={cn(
                        "ml-1 rounded-full px-2 py-0.5 text-[9px] font-bold",
                        isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
              return btn;
            })}
          </div>

          {/* Tabs Content */}
          <div className="mt-6 pb-16">
            {/* Listings Tab */}
            {activeTab === "listings" && (
              <div className="space-y-8">
                {/* Active Listings */}
                {activeListings.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Active</h3>
                        <span className="text-xs text-muted-foreground">({activeListings.length})</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {activeListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Drafts */}
                {draftListings.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Drafts</h3>
                      <span className="text-xs text-muted-foreground">({draftListings.length})</span>
                    </div>
                    <div className="space-y-3 opacity-70">
                      {draftListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  </div>
                )}

                {host.listings.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <Building2 className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No listings yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      Create your first listing and start sharing Zambia with travelers.
                    </p>
                    <Button className="mt-6 rounded-full font-black uppercase tracking-widest text-xs" asChild>
                      <Link href="/host/create">
                        <Plus className="h-4 w-4 mr-1.5" />
                        Create Listing
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                      Recent Bookings
                    </h3>
                    <span className="text-xs text-muted-foreground">({mockBookings.length})</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-primary/20 text-primary hover:bg-primary/5 font-black uppercase tracking-widest text-[9px]"
                    asChild
                  >
                    <Link href="/host/bookings">
                      Manage Requests
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>

                {/* Pending count notice */}
                {mockBookings.filter((b) => b.status === "pending").length > 0 && (
                  <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30 px-5 py-3 mb-4">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                      {mockBookings.filter((b) => b.status === "pending").length} booking request
                      {mockBookings.filter((b) => b.status === "pending").length > 1 ? "s" : ""} awaiting your response.
                    </p>
                    <Link
                      href="/host/bookings"
                      className="ml-auto text-xs font-bold text-amber-700 dark:text-amber-300 underline underline-offset-2 hover:text-amber-900 shrink-0"
                    >
                      View All
                    </Link>
                  </div>
                )}

                {mockBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <CalendarDays className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No bookings yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      Guest bookings for your listings will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockBookings.map((booking) => (
                      <BookingItem key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                {mockHostReviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <MessageSquare className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No reviews yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      Reviews from guests will appear here after their stays.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockHostReviews.map((review) => (
                      <ReviewItem key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                {/* Revenue Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">This Month</p>
                    <p className="text-3xl font-bold text-foreground">${currentMonthEarnings.amount.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" />
                      {earningsTrend}% vs last month
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Bookings</p>
                    <p className="text-3xl font-bold text-foreground">{currentMonthEarnings.bookings}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" />
                      {currentMonthEarnings.bookings - prevMonthEarnings.bookings > 0 ? "+" : ""}{currentMonthEarnings.bookings - prevMonthEarnings.bookings} vs last month
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Avg. Per Booking</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${currentMonthEarnings.bookings > 0 ? Math.round(currentMonthEarnings.amount / currentMonthEarnings.bookings) : 0}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">Average order value</p>
                  </div>
                </div>

                {/* Earnings Chart (simplified bar chart) */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-5">
                    Earnings Overview
                  </h3>
                  <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
                    <div className="flex items-end justify-between gap-1 h-40">
                      {mockEarnings.map((m) => {
                        const maxAmount = Math.max(...mockEarnings.map((e) => e.amount));
                        const height = (m.amount / maxAmount) * 100;
                        return (
                          <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                            <span className="text-[9px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              ${m.amount / 1000}k
                            </span>
                            <div
                              className="w-full rounded-md bg-gradient-to-t from-primary/60 to-primary/30 hover:from-primary hover:to-primary/60 transition-all duration-200 cursor-pointer relative"
                              style={{ height: `${height}%` }}
                            >
                              <div className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[9px] font-semibold text-muted-foreground">{m.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Top Performers */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-5">
                    Top Performing Listings
                  </h3>
                  <div className="space-y-3">
                    {host.listings
                      .filter((l) => l.status === "active")
                      .sort((a, b) => b.bookings - a.bookings)
                      .slice(0, 3)
                      .map((listing, idx) => (
                        <div
                          key={listing.id}
                          className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm"
                        >
                          <span className="text-lg font-black text-muted-foreground/30 w-6 text-center">
                            {idx + 1}
                          </span>
                          <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                            <img src={listing.image} alt={listing.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{listing.name}</p>
                            <p className="text-xs text-muted-foreground">{listing.location}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-foreground">{listing.bookings} bookings</p>
                            <p className="text-xs font-semibold text-emerald-600">${listing.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="max-w-2xl space-y-8">
                {/* Profile Settings */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-5">
                    Host Profile
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Display Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          defaultValue={host.name}
                          className="pl-9 h-11 rounded-xl border-border/60 focus-visible:ring-primary focus-visible:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          defaultValue={host.email}
                          type="email"
                          className="pl-9 h-11 rounded-xl border-border/60 focus-visible:ring-primary focus-visible:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Phone
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          defaultValue="+260 97 765 4321"
                          className="pl-9 h-11 rounded-xl border-border/60 focus-visible:ring-primary focus-visible:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Bio
                      </Label>
                      <textarea
                        defaultValue={host.bio}
                        rows={3}
                        className="flex w-full rounded-xl border border-border/60 bg-transparent px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button className="rounded-full font-black uppercase tracking-widest text-xs px-8">
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      Save Changes
                    </Button>
                    <Button variant="outline" className="rounded-full font-semibold text-xs border-border/60">
                      Cancel
                    </Button>
                  </div>
                </div>

                <hr className="border-border/50" />

                {/* Payout Settings */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-5">
                    Payout Method
                  </h3>
                  <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <CreditCard className="h-5.5 w-5.5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">Bank Transfer</p>
                      <p className="text-xs text-muted-foreground">Zambia National Bank · **** 4832</p>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-full text-xs font-semibold">
                      Update
                    </Button>
                  </div>
                </div>

                <hr className="border-border/50" />

                {/* Notifications */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-5">
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      { icon: Bell, label: "New Bookings", desc: "Get notified when guests book your listings" },
                      { icon: MessageSquare, label: "Messages", desc: "Receive guest inquiries and messages" },
                      { icon: Star, label: "New Reviews", desc: "Be notified when guests leave reviews" },
                    ].map(({ icon: Icon, label, desc }) => (
                      <label
                        key={label}
                        className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 cursor-pointer transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{label}</p>
                            <p className="text-xs text-muted-foreground">{desc}</p>
                          </div>
                        </div>
                        <div className="h-6 w-11 rounded-full bg-primary transition-colors relative cursor-pointer">
                          <div className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-border/50" />

                {/* Account */}
                <div className="rounded-xl border border-destructive/20 bg-destructive/[0.02] p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-destructive mb-2">
                    Account
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Manage your host account settings.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/5 font-black uppercase tracking-widest text-xs"
                      onClick={() => {
                        logout();
                        toast.success("Signed out successfully");
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-1.5" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
