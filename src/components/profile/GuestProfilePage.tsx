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
  ShieldCheck,
  Compass,
  Edit3,
  CheckCircle2,
  XCircle,
  Diamond,
  Tent,
  Waves,
  School,
  DollarSign,
  Users,
  Bus,
  Bell,
  Award,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
      ref.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg hover:bg-gray-50 transition-all hover:scale-105"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-6 py-1">
        {children}
      </div>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 h-9 w-9 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-lg hover:bg-gray-50 transition-all hover:scale-105"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
}

const explorerBadges = [
  { label: "Hidden Gem Finder", icon: Diamond, className: "bg-amber-50 text-amber-800 border-amber-200", desc: "Found 3 off-grid escapes" },
  { label: "Camp Enthusiast", icon: Tent, className: "bg-emerald-50 text-emerald-800 border-emerald-200", desc: "2 bush camp stays" },
  { label: "Early Bird", icon: Clock, className: "bg-indigo-50 text-indigo-800 border-indigo-200", desc: "Books 30+ days ahead" },
  { label: "Riverside Lover", icon: Waves, className: "bg-sky-50 text-sky-800 border-sky-200", desc: "5 lakeside getaways" },
];

const preferences = [
  { icon: DollarSign, label: "Budget per night", value: "Under K1,000" },
  { icon: Users, label: "Usually travels", value: "Solo or 2 people" },
  { icon: Bus, label: "Transport", value: "Coaster seats" },
  { icon: Bell, label: "Deal alerts", value: "On" },
];

function TripCard({ trip }: { trip: TripBooking }) {
  const isUpcoming = trip.status === "upcoming";
  const isCompleted = trip.status === "completed";
  const isCancelled = trip.status === "cancelled";

  return (
    <Link
      href={`/listings/${trip.type === "stay" ? "stays" : trip.type === "experience" ? "experiences" : "transport"}/${trip.id.replace("trip-", "")}`}
      className="group block min-w-[300px] sm:min-w-[340px] md:min-w-[380px] shrink-0"
    >
      <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={trip.image}
            alt={trip.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div
            className={cn(
              "absolute bottom-1 left-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white",
              isUpcoming ? "bg-blue-500/80" : isCompleted ? "bg-emerald-500/80" : "bg-gray-500/80",
            )}
          >
            {isUpcoming ? "Upcoming" : isCompleted ? "Completed" : "Cancelled"}
          </div>
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          <p className="text-sm font-bold text-gray-900 truncate leading-snug">{trip.name}</p>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {trip.location}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(trip.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="shrink-0 self-center text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-500">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

export function GuestProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const { items: savedItems, removeItem } = useWishlistStore();
  const [activeTab, setActiveTab] = useState<GuestTab>("saves");
  const getReviewsByGuest = useReviewStore((s) => s.getReviewsByGuest);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <div className="relative h-[200px] w-full overflow-hidden bg-gradient-to-br from-[#1A0B2E] via-[#2E154A] to-[#1A0B2E]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=60')] bg-cover bg-center opacity-10" />
        </div>
        <div className="flex-1 flex items-center justify-center px-4 pb-24 -mt-16">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-8 shadow-xl text-center space-y-6 relative">
            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center border border-[#D4AF37]/20">
              <User className="h-9 w-9 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Profile</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                Sign in to view your escapes, manage your trips, and access your saved collections.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button
                className="w-full rounded-xl bg-[#1A0B2E] hover:bg-[#2E154A] text-white font-bold py-6 shadow-lg shadow-[#1A0B2E]/20"
                asChild
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-6"
                asChild
              >
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </div>
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
    { id: "trips", label: "Trips", icon: Compass, count: mockTrips.length },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
      count: storeReviews.length + mockReviews.length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* PREMIUM PURPLE HERO */}
      <div className="relative w-full overflow-hidden bg-[#1A0B2E] pt-6 pb-12 px-4 md:px-8 shadow-xl">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0B2E] via-[#2E154A] to-[#3A1A5A] opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=60')] opacity-10 object-cover mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B2E] to-transparent opacity-80" />

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col">
          {/* Top Nav Row */}
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all text-white/90 hover:text-white font-medium text-[13px] group shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
              <span className="tracking-wide">Back</span>
            </Link>
            <Link
              href="/settings"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all text-white/90 hover:text-white hover:rotate-90 shadow-sm"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Avatar + Info Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative shrink-0 group cursor-pointer" onClick={() => toast.info("Change profile photo coming soon")}>
              <div className="h-[100px] w-[100px] md:h-[130px] md:w-[130px] rounded-full bg-gradient-to-br from-[#D4AF37] to-[#A38322] flex items-center justify-center text-[36px] md:text-[48px] font-bold text-[#1A0B2E] border-4 border-[#1A0B2E] shadow-2xl relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-300">
                  {user?.name?.split(" ").map((n) => n[0]).join("") || "G"}
                </span>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-8 h-8 rounded-full bg-emerald-500 border-[3px] border-[#1A0B2E] flex items-center justify-center shadow-lg z-30">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3 tracking-tight drop-shadow-md">
                {user?.name ?? "Guest"}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-[13px] md:text-[14px] text-white/80">
                <span className="inline-flex items-center gap-1.5 font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20 shadow-sm uppercase tracking-wider text-[11px]">
                  <Award className="h-3.5 w-3.5" /> Explorer Level 4
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#D4AF37]" /> Lusaka, Zambia
                </span>
                <span className="hidden sm:inline text-white/30">·</span>
                <span className="flex items-center gap-1.5">
                  <School className="h-4 w-4 text-[#D4AF37]" /> UNZA student
                </span>
                <span className="hidden sm:inline text-white/30">·</span>
                <span className="text-white/40">Member since Mar 2025</span>
              </div>
            </div>

            {/* Desktop Edit Button */}
            <button
              onClick={() => toast.info("Profile editing coming soon")}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-sm font-bold text-white hover:bg-white/20 transition-all shrink-0"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 md:px-8 py-8">

        {/* STATS GRID */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          {[
            {
              value: mockTrips.length,
              label: "Escapes Taken",
              icon: Tent,
              color: "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20",
            },
            {
              value: storeReviews.length + mockReviews.length,
              label: "Reviews Left",
              icon: Star,
              color: "text-[#1A0B2E] bg-[#1A0B2E]/5 border-[#1A0B2E]/10",
            },
            {
              value: savedItems.length || 8,
              label: "Saves",
              icon: Heart,
              color: "text-[#64748B] bg-[#64748B]/10 border-[#64748B]/20",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="relative bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border", s.color)}>
                  <s.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* CONTENT ROW: Badges + Preferences + Edit (mobile) */}
        <div className="grid md:grid-cols-5 gap-4 md:gap-6 mb-8">
          {/* Explorer Badges */}
          <div className="md:col-span-3 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-display font-bold text-[#1A0B2E]">
                Explorer Badges
              </h3>
              <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20 uppercase tracking-widest">
                4 earned
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {explorerBadges.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.label}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 transition-all duration-200 hover:shadow-sm",
                      b.className,
                    )}
                  >
                    <div className="h-9 w-9 rounded-lg bg-white/80 flex items-center justify-center shrink-0 shadow-sm border border-inherit">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold">{b.label}</p>
                      <p className="text-[10px] text-inherit opacity-70 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Travel Preferences */}
          <div className="md:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-display font-bold text-[#1A0B2E] mb-5">
              Travel Preferences
            </h3>
            <div className="space-y-3">
              {preferences.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-gray-400" />
                      {p.label}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{p.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RECENT & UPCOMING TRIPS */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-display font-bold text-[#1A0B2E] flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-[#D4AF37]" />
              Recent &amp; Upcoming Trips
            </h3>
            <Link
              href="/trips"
              className="text-[12px] font-bold uppercase tracking-wider text-[#D4AF37] hover:text-[#EAB308] transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {[...upcomingTrips.slice(0, 2), ...completedTrips.slice(0, 2)].map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>

        {/* EDIT PROFILE — MOBILE */}
        <button
          onClick={() => toast.info("Profile editing coming soon")}
          className="md:hidden w-full mb-8 py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
        >
          <Edit3 className="h-4 w-4" />
          Edit profile
        </button>

        {/* TABS: SAVES / TRIPS / REVIEWS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {tabs.map(({ id, label, icon: Icon, count }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all duration-200",
                    isActive
                      ? "border-[#1A0B2E] text-[#1A0B2E]"
                      : "border-transparent text-gray-400 hover:text-gray-600",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-[#1A0B2E]" : "text-gray-400",
                    )}
                    strokeWidth={1.5}
                  />
                  {label}
                  {count !== undefined && count > 0 && (
                    <span
                      className={cn(
                        "ml-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold",
                        isActive
                          ? "bg-[#1A0B2E] text-white"
                          : "bg-gray-100 text-gray-500",
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="p-5 md:p-6">
            {/* Saved */}
            {activeTab === "saves" &&
              (savedItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                    <Heart className="h-7 w-7 text-rose-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">No saved items yet</p>
                  <p className="text-sm text-gray-500 mt-1.5 max-w-xs mx-auto">
                    Start exploring and save your favorites to plan your next escape
                  </p>
                  <Button
                    className="mt-6 rounded-xl bg-[#1A0B2E] hover:bg-[#2E154A] text-white font-bold text-xs uppercase tracking-wider px-6 py-5 shadow-lg shadow-[#1A0B2E]/20"
                    asChild
                  >
                    <Link href="/search">
                      Browse destinations <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <ScrollRow>
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="shrink-0 w-[240px] rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <Link href={`/listings/stays/${item.id}`} className="block group">
                        <div className="relative aspect-[4/3] bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white font-bold text-xs truncate drop-shadow-sm">
                              {item.name}
                            </p>
                            <p className="text-white/80 text-[10px] flex items-center gap-1 mt-0.5">
                              <MapPin className="h-2.5 w-2.5" />
                              {item.location}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center justify-between px-3 py-2.5">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            K{item.price}
                          </p>
                          <p className="text-[9px] text-gray-400 font-medium">per night</p>
                        </div>
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            toast.success("Removed from saved");
                          }}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
                <div className="text-center py-16">
                  <div className="h-16 w-16 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-4 border border-sky-100">
                    <Compass className="h-7 w-7 text-sky-300" strokeWidth={1.5} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">No trips yet</p>
                  <p className="text-sm text-gray-500 mt-1.5 max-w-xs mx-auto">
                    Your booking history will appear here once you book your first escape
                  </p>
                  <Button
                    className="mt-6 rounded-xl bg-[#1A0B2E] hover:bg-[#2E154A] text-white font-bold text-xs uppercase tracking-wider px-6 py-5 shadow-lg shadow-[#1A0B2E]/20"
                    asChild
                  >
                    <Link href="/search">
                      Start exploring <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  {upcomingTrips.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-blue-400" />
                        Upcoming ({upcomingTrips.length})
                      </p>
                      <div className="space-y-2.5">
                        {upcomingTrips.map((t) => (
                          <TripCard key={t.id} trip={t} />
                        ))}
                      </div>
                    </div>
                  )}
                  {completedTrips.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Completed ({completedTrips.length})
                      </p>
                      <div className="space-y-2.5">
                        {completedTrips.map((t) => (
                          <TripCard key={t.id} trip={t} />
                        ))}
                      </div>
                    </div>
                  )}
                  {cancelledTrips.length > 0 && (
                    <div className="opacity-60">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5" />
                        Cancelled ({cancelledTrips.length})
                      </p>
                      <div className="space-y-2.5">
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
                    <div className="text-center py-16">
                      <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 border border-amber-100">
                        <Star className="h-7 w-7 text-amber-300" strokeWidth={1.5} />
                      </div>
                      <p className="text-lg font-bold text-gray-900">No reviews yet</p>
                      <p className="text-sm text-gray-500 mt-1.5 max-w-xs mx-auto">
                        After your trips, share your experience to help fellow travellers
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="space-y-0 divide-y divide-gray-100">
                    {allReviews.map((review) => (
                      <div
                        key={review.id}
                        className="py-5 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-base font-bold text-gray-900 tracking-tight">
                              {review.listingName}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                              {review.listingType}
                            </p>
                          </div>
                          <div className="flex gap-0.5 shrink-0">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200",
                                )}
                                strokeWidth={i < review.rating ? 0 : 1.5}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="relative pl-4 border-l-2 border-amber-200">
                          <p className="text-sm text-gray-600 leading-relaxed italic">
                            &ldquo;{review.text}&rdquo;
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-3 ml-4">
                          <span className="text-[11px] font-semibold text-gray-400">
                            {new Date(review.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
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
