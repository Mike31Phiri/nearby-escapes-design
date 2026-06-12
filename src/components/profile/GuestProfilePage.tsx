"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MapPin,
  CalendarDays,
  Star,
  Settings,
  LogOut,
  Clock,
  Trash2,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  Compass,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Tag,
  Bus,
  Hotel,
  Ticket,
  Save,
  BookOpen,
  MessageSquare,
  Bell,
  ChevronRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useWishlistStore } from "@/store/wishlistStore";
import { mockTrips, mockReviews } from "@/lib/mock-profile-data";
import type { TripBooking, UserReview } from "@/lib/mock-profile-data";
import { useReviewStore } from "@/store/reviewStore";
import { useProfileStore } from "@/store/profileStore";
import { toast } from "sonner";

type GuestTab = "saves" | "trips" | "reviews" | "settings";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5.5 w-5.5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {sub && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function TripCard({ trip }: { trip: TripBooking }) {
  const statusConfig = {
    upcoming: {
      label: "Upcoming",
      icon: Clock,
      className:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    },
    completed: {
      label: "Completed",
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      className:
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
    },
  };

  const typeIcons = {
    stay: Hotel,
    experience: Ticket,
    transport: Bus,
  };
  const TypeIcon = typeIcons[trip.type];

  const cfg = statusConfig[trip.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={trip.image}
          alt={trip.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
          <TypeIcon className="h-3 w-3" />
          <span>{trip.type}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-foreground truncate">{trip.name}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 shrink-0" />
              {trip.location}
            </p>
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0",
              cfg.className,
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {cfg.label}
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {new Date(trip.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="font-semibold text-foreground">${trip.price}</span>
          <span className="text-[10px] font-mono text-muted-foreground/60">{trip.bookingRef}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        asChild
      >
        <Link
          href={`/listings/${trip.type === "stay" ? "stays" : trip.type === "experience" ? "experiences" : "transport"}/${trip.id.split("-").pop()}`}
        >
          {" "}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function ReviewCard({ review }: { review: UserReview }) {
  const typeIcons = {
    stay: Hotel,
    experience: Ticket,
    transport: Bus,
  };
  const TypeIcon = typeIcons[review.listingType];

  return (
    <div className="group rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TypeIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{review.listingName}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {review.listingType}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20",
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium">
        {new Date(review.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

export function GuestProfilePage() {
  const { user, logout } = useAuth();
  const { items: savedItems, removeItem } = useWishlistStore();
  const [activeTab, setActiveTab] = useState<GuestTab>("saves");

  // Travel preferences from profile store
  const {
    phone: savedPhone,
    homeCity: savedHomeCity,
    travelPreferences,
    setPhone: savePhone,
    setHomeCity: saveHomeCity,
    setTravelPreferences: saveTravelPreferences,
  } = useProfileStore();

  // Settings form state
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(savedPhone || "+260 97 123 4567");
  const [bio, setBio] = useState("Travel enthusiast exploring Zambia one destination at a time.");
  const [showNotifications, setShowNotifications] = useState(true);
  const [showPromotions, setShowPromotions] = useState(false);

  const getReviewsByGuest = useReviewStore((s) => s.getReviewsByGuest);
  const storeReviews = getReviewsByGuest(user?.name ?? "");

  const completedTrips = mockTrips.filter((t) => t.status === "completed");
  const upcomingTrips = mockTrips.filter((t) => t.status === "upcoming");
  const cancelledTrips = mockTrips.filter((t) => t.status === "cancelled");

  const tabs: { id: GuestTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "saves", label: "Saved", icon: Heart, count: savedItems.length },
    { id: "trips", label: "Trips", icon: BookOpen, count: mockTrips.length },
    {
      id: "reviews",
      label: "Reviews",
      icon: MessageSquare,
      count: mockReviews.length + storeReviews.length,
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <main className="flex-1">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-12">
          <div className="mx-auto max-w-5xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-primary/5">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name ?? "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                      <User className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {user?.name ?? "Guest"}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="w-fit mx-auto md:mx-0 rounded-full text-[10px] font-bold uppercase tracking-wider px-3 py-1"
                  >
                    <Award className="h-3 w-3 mr-1" />
                    Explorer
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {user?.email ?? "guest@example.com"}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1 flex items-center justify-center md:justify-start gap-1.5">
                  <CalendarDays className="h-3 w-3 shrink-0" />
                  Member since March 2025
                </p>
                <p className="text-sm text-muted-foreground/80 mt-3 max-w-lg mx-auto md:mx-0 leading-relaxed">
                  Travel enthusiast exploring Zambia one destination at a time. Passionate about
                  wildlife, culture, and hidden gems.
                </p>
              </div>

              {/* Edit Button (desktop) */}
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex shrink-0 rounded-full border-border/60 font-black uppercase tracking-widest text-[10px]"
                onClick={() => setActiveTab("settings")}
              >
                <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 -mt-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              icon={Save}
              label="Saved Items"
              value={savedItems.length}
              sub="Across all categories"
            />
            <StatCard
              icon={Compass}
              label="Trips Taken"
              value={completedTrips.length}
              sub={`${upcomingTrips.length} upcoming`}
            />
            <StatCard
              icon={Star}
              label="Reviews Left"
              value={mockReviews.length + storeReviews.length}
              sub="4.8 avg rating"
            />
            <StatCard icon={MapPin} label="Destinations" value="4" sub="Zambia wide" />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 mt-10">
          <div className="flex border-b border-border/50 gap-0">
            {tabs.map(({ id, label, icon: Icon, count }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-2 pb-3.5 px-4 md:px-6 text-xs font-black uppercase tracking-wider border-b-2 transition-all duration-200",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
                  )}
                >
                  <Icon
                    className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")}
                  />
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
            })}
          </div>

          {/* Tabs Content */}
          <div className="mt-6 pb-16">
            {/* Saved Items Tab */}
            {activeTab === "saves" && (
              <div>
                {savedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <Heart className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No saved items yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      Start exploring and save your favorite stays, experiences, and transport
                      routes.
                    </p>
                    <Button
                      className="mt-6 rounded-full font-black uppercase tracking-widest text-xs"
                      asChild
                    >
                      <Link href="/search">
                        Browse destinations <Compass className="h-4 w-4 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <Link href={`/listings/stays/${item.id}`} className="block">
                          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                              <p className="text-white font-bold text-sm truncate drop-shadow-md">
                                {item.name}
                              </p>
                              <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3" />
                                {item.location}
                              </p>
                            </div>
                          </div>
                        </Link>
                        <div className="p-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">
                            ${item.price}
                            <span className="text-xs font-normal text-muted-foreground ml-1">
                              night
                            </span>
                          </p>
                          <button
                            onClick={() => {
                              removeItem(item.id);
                              toast.success(`Removed ${item.name} from saved`);
                            }}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                            aria-label="Remove from saved"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Trips Tab */}
            {activeTab === "trips" && (
              <div className="space-y-8">
                {/* Upcoming */}
                {upcomingTrips.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                        Upcoming
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        ({upcomingTrips.length})
                      </span>
                    </div>
                    <div className="space-y-3">
                      {upcomingTrips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Past */}
                {completedTrips.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                        Completed
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        ({completedTrips.length})
                      </span>
                    </div>
                    <div className="space-y-3">
                      {completedTrips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancelled */}
                {cancelledTrips.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                        Cancelled
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        ({cancelledTrips.length})
                      </span>
                    </div>
                    <div className="space-y-3 opacity-60">
                      {cancelledTrips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                      ))}
                    </div>
                  </div>
                )}

                {mockTrips.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <BookOpen className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No trips yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      Your booking history and upcoming adventures will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div>
                {/* User-submitted reviews */}
                {storeReviews.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Star className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                        Your Reviews
                      </h3>
                      <span className="text-xs text-muted-foreground">({storeReviews.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {storeReviews.map((review) => (
                        <div
                          key={review.id}
                          className="rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Ticket className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground">
                                  {review.listingName}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                  {review.listingType}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    i < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted-foreground/20",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {review.text}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium">
                            {new Date(review.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                            <span className="ml-2 text-[9px] uppercase tracking-wider font-bold text-primary">
                              Verified
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mockReviews.length === 0 && storeReviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <MessageSquare className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">No reviews yet</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      After your trips, come back and share your experience with the community.
                    </p>
                  </div>
                ) : (
                  mockReviews.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                          All Reviews
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          ({mockReviews.length + storeReviews.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...storeReviews, ...mockReviews].map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="max-w-2xl space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-5">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="settings-name"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="settings-name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-9 h-11 rounded-xl border-border/60 focus-visible:ring-primary focus-visible:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="settings-email"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="settings-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 h-11 rounded-xl border-border/60 focus-visible:ring-primary focus-visible:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="settings-phone"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="settings-phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-9 h-11 rounded-xl border-border/60 focus-visible:ring-primary focus-visible:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="settings-bio"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Bio
                      </Label>
                      <textarea
                        id="settings-bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
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
                    <Button
                      variant="outline"
                      className="rounded-full font-semibold text-xs border-border/60"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>

                <hr className="border-border/50" />

                {/* Travel Preferences */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-5">
                    Travel Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Home City
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={savedHomeCity}
                          onChange={(e) => saveHomeCity(e.target.value)}
                          placeholder="e.g. Lusaka, Ndola"
                          className="pl-9 h-11 rounded-xl border-border/60"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Travel Interests
                      </Label>
                      {travelPreferences.travelInterests.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {travelPreferences.travelInterests.map((interest) => (
                            <Badge
                              key={interest}
                              variant="secondary"
                              className="rounded-full text-[10px] font-semibold capitalize"
                            >
                              {interest.replace(/-/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No interests set yet</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Budget Range
                        </Label>
                        <p className="text-sm font-semibold text-foreground capitalize">
                          {travelPreferences.budgetRange}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Travel Group
                        </Label>
                        <p className="text-sm font-semibold text-foreground capitalize">
                          {travelPreferences.travelGroup}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs font-semibold border-border/60"
                      onClick={() => {
                        useProfileStore.getState().triggerTravelPreferences();
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      Update Preferences
                    </Button>
                  </div>
                </div>

                <hr className="border-border/50" />

                {/* Preferences */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-5">
                    Preferences
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 cursor-pointer transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Email Notifications
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Receive booking updates and confirmations
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={cn(
                          "h-6 w-11 rounded-full transition-colors relative cursor-pointer",
                          showNotifications ? "bg-primary" : "bg-muted-foreground/30",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                            showNotifications ? "translate-x-5.5" : "translate-x-0.5",
                          )}
                        />
                      </div>
                    </label>

                    <label className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 cursor-pointer transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Promotional Emails
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Get deals, discounts, and travel inspiration
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() => setShowPromotions(!showPromotions)}
                        className={cn(
                          "h-6 w-11 rounded-full transition-colors relative cursor-pointer",
                          showPromotions ? "bg-primary" : "bg-muted-foreground/30",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                            showPromotions ? "translate-x-5.5" : "translate-x-0.5",
                          )}
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Become a Host — only shown to guest users */}
                {(!user?.role || user.role === "guest") && (
                  <>
                    <hr className="border-border/50" />
                    <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.03] to-primary/[0.08] p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-foreground">Become a Host</h3>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            Share your property, tours, or transport with travelers. Start earning
                            and grow your hospitality business on Nearby Escapes.
                          </p>
                          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                              Set your own prices
                            </span>
                            <span className="flex items-center gap-1.5">
                              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                              Earn extra income
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                              Reach thousands of travelers
                            </span>
                          </div>
                        </div>
                        <Button
                          className="rounded-full font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 shrink-0 w-full md:w-auto"
                          asChild
                        >
                          <Link href="/become-host">
                            <Sparkles className="h-4 w-4 mr-1.5" />
                            Get Started
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                <hr className="border-border/50" />

                {/* Danger Zone */}
                <div className="rounded-xl border border-destructive/20 bg-destructive/[0.02] p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-destructive mb-2">
                    Account
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Sign out of your account or manage your profile settings.
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-xs text-muted-foreground"
                      onClick={() => toast.info("Account deletion is not available in demo mode.")}
                    >
                      <XCircle className="h-4 w-4 mr-1.5" />
                      Delete Account
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
