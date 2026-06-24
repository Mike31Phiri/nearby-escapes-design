"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Heart,
  MapPin,
  CalendarDays,
  Star,
  Settings,
  Clock,
  Trash2,
  User,
  Mail,
  ShieldCheck,
  Compass,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Diamond,
  Tent,
  Waves,
  School,
  DollarSign,
  Users,
  Bus,
  Bell,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useWishlistStore } from "@/store/wishlistStore";
import { mockTrips, mockReviews } from "@/lib/mock-profile-data";
import type { TripBooking } from "@/lib/mock-profile-data";
import { useReviewStore } from "@/store/reviewStore";
import { toast } from "sonner";

type GuestTab = "saves" | "trips" | "reviews";

function ScrollRow({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (ref.current)
      ref.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 transition-all"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4 text-gray-700" />
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-6">
        {children}
      </div>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 transition-all"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4 text-gray-700" />
      </button>
    </div>
  );
}

const explorerBadges = [
  { label: "Hidden gem finder", icon: Diamond, className: "bg-[#FAEEDA] text-[#633806]" },
  { label: "Camp enthusiast", icon: Tent, className: "bg-[#E1F5EE] text-[#085041]" },
  { label: "Early bird", icon: Clock, className: "bg-[#EEEDFE] text-[#3C3489]" },
  { label: "Riverside lover", icon: Waves, className: "bg-[#E6F1FB] text-[#0C447C]" },
];

function TripCard({ trip }: { trip: TripBooking }) {
  const isUpcoming = trip.status === "upcoming";
  const isCompleted = trip.status === "completed";
  const isCancelled = trip.status === "cancelled";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div
        className={cn(
          "w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm",
          isUpcoming
            ? "bg-[#FAEEDA] text-[#854F0B]"
            : isCompleted
              ? "bg-[#E1F5EE] text-[#0F6E56]"
              : "bg-gray-100 text-gray-400",
        )}
      >
        {isUpcoming ? (
          <CalendarDays className="h-4 w-4" />
        ) : isCompleted ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{trip.name}</p>
        <p className="text-xs text-gray-500">
          {new Date(trip.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {" · "}
          {trip.location}
        </p>
      </div>
      <span
        className={cn(
          "text-[10px] font-semibold px-2.5 py-1 rounded shrink-0",
          isUpcoming
            ? "bg-[#FAEEDA] text-[#854F0B]"
            : isCompleted
              ? "bg-[#E1F5EE] text-[#0F6E56]"
              : "bg-gray-100 text-gray-400",
        )}
      >
        {isUpcoming ? "Upcoming" : isCompleted ? "Completed" : "Cancelled"}
      </span>
    </div>
  );
}

export function GuestProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const { items: savedItems, removeItem } = useWishlistStore();
  const [activeTab, setActiveTab] = useState<GuestTab>("saves");
  const getReviewsByGuest = useReviewStore((s) => s.getReviewsByGuest);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col bg-background font-sans items-center justify-center p-6 pb-24">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 p-8 shadow-xl text-center space-y-6">
          <div className="h-16 w-16 mx-auto rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
            <User className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Profile</h1>
            <p className="text-sm text-gray-500">
              Sign in to view your escapes, manage your trips, and access your saved collections.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full rounded-2xl bg-[#2A1B3D] hover:bg-[#2E1A4E] text-white font-semibold py-6"
              asChild
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-2xl border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-6"
              asChild
            >
              <Link href="/auth/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
      count: storeReviews.length + mockReviews.length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans pb-12">
      {/* ── Full Width Primary Header ── */}
      <div className="bg-primary w-full pt-8 pb-20 relative px-4 md:px-8">
        <div className="max-w-3xl mx-auto relative">
          <Link
            href="/settings"
            className="absolute top-0 right-0 h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-primary-foreground" />
          </Link>
          <div className="text-[11px] font-bold text-primary-foreground/60 uppercase tracking-widest mt-2">
            Member since March 2025
          </div>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 md:px-8 -mt-12 relative z-10">
        {/* Avatar — overlapping the header and the wall */}
        <div className="relative mb-4">
          <div className="h-[90px] w-[90px] rounded-full bg-primary flex items-center justify-center text-[28px] font-bold text-primary-foreground border-4 border-background shadow-sm">
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("") || "G"}
          </div>
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-background flex items-center justify-center">
            <ShieldCheck className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Profile Info */}
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 tracking-tight">
            {user?.name ?? "Guest"}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 font-medium">
            <MapPin className="h-4 w-4" />
            <span>Lusaka, Zambia</span>
            <span className="text-gray-300">·</span>
            <School className="h-4 w-4" />
            <span>UNZA student</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { value: mockTrips.length, label: "Escapes taken" },
              { value: storeReviews.length, label: "Reviews left" },
              { value: savedItems.length, label: "Saves" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-gray-100 rounded-xl py-4 text-center shadow-sm"
              >
                <p className="font-display text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Explorer badges */}
          <div className="mt-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">
              Explorer badges
            </p>
            <div className="flex flex-wrap gap-2">
              {explorerBadges.map((b) => (
                <span
                  key={b.label}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium",
                    b.className,
                  )}
                >
                  <b.icon className="h-3.5 w-3.5" />
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Recent & upcoming trips */}
          <div className="mt-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">
              Recent &amp; upcoming trips
            </p>
            <div className="space-y-2">
              {[...upcomingTrips.slice(0, 1), ...completedTrips.slice(0, 2)].map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </div>

          {/* Travel preferences */}
          <div className="mt-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">
              Travel preferences
            </p>
            <div className="divide-y divide-gray-100">
              {[
                { icon: DollarSign, label: "Budget per night", value: "Under K1,000" },
                { icon: Users, label: "Usually travels", value: "Solo or 2 people" },
                { icon: Bus, label: "Transport", value: "Coaster seats" },
                { icon: Bell, label: "Deal alerts", value: "On" },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-gray-500 flex items-center gap-2">
                    <p.icon className="h-3.5 w-3.5 text-gray-400" />
                    {p.label}
                  </span>
                  <span className="text-xs font-medium text-gray-900">{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Edit profile button */}
          <button
            onClick={() => toast.info("Profile editing coming soon")}
            className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Edit3 className="h-4 w-4" />
            Edit profile
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 px-1">
            {tabs.map(({ id, label, icon: Icon, count }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-400 hover:text-gray-600",
                  )}
                >
                  <Icon
                    className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-gray-400")}
                  />
                  {label}
                  {count !== undefined && count > 0 && (
                    <span className="ml-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[8px] font-bold text-gray-500">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4">
            {/* Saved */}
            {activeTab === "saves" &&
              (savedItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900">No saved items yet</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Start exploring and save your favorites
                  </p>
                  <Button
                    size="sm"
                    className="mt-4 rounded-full text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground"
                    asChild
                  >
                    <Link href="/search">Browse destinations</Link>
                  </Button>
                </div>
              ) : (
                <ScrollRow>
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="shrink-0 w-56 rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md"
                    >
                      <Link href={`/listings/stays/${item.id}`} className="block">
                        <div className="relative aspect-[4/3] bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white font-semibold text-xs truncate drop-shadow">
                              {item.name}
                            </p>
                            <p className="text-white/80 text-[10px] flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5" />
                              {item.location}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between px-3 py-2.5">
                        <p className="text-xs font-semibold text-gray-900">
                          K{item.price}
                          <span className="text-[9px] font-normal text-gray-400 ml-1">night</span>
                        </p>
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            toast.success("Removed");
                          }}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </ScrollRow>
              ))}

            {/* Trips */}
            {activeTab === "trips" &&
              (mockTrips.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900">No trips yet</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Your booking history will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTrips.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                        <CalendarDays className="h-3 w-3" /> Upcoming ({upcomingTrips.length})
                      </p>
                      <div className="space-y-2">
                        {upcomingTrips.map((t) => (
                          <TripCard key={t.id} trip={t} />
                        ))}
                      </div>
                    </div>
                  )}
                  {completedTrips.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Completed (
                        {completedTrips.length})
                      </p>
                      <div className="space-y-2">
                        {completedTrips.map((t) => (
                          <TripCard key={t.id} trip={t} />
                        ))}
                      </div>
                    </div>
                  )}
                  {cancelledTrips.length > 0 && (
                    <div className="opacity-60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                        <XCircle className="h-3 w-3" /> Cancelled ({cancelledTrips.length})
                      </p>
                      <div className="space-y-2">
                        {cancelledTrips.map((t) => (
                          <TripCard key={t.id} trip={t} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

            {/* Reviews */}
            {activeTab === "reviews" &&
              (() => {
                const allReviews = [...storeReviews, ...mockReviews];
                if (allReviews.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="font-display text-xl font-bold text-gray-900">No reviews yet</p>
                      <p className="text-xs text-gray-500 mt-1">
                        After your trips, share your experience
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="space-y-6">
                    {allReviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100/60 pb-5 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-display text-base font-bold text-gray-900 tracking-tight">
                              {review.listingName}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              {review.listingType}
                            </p>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          {review.text}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-[11px] font-semibold text-gray-400">
                            {new Date(review.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            Verified
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
          </div>
        </div>
      </main>
    </div>
  );
}
