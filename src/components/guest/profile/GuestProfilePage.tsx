"use client";

import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  Edit3,
  Camera,
  DollarSign,
  Bus,
  Bell,
  HelpCircle,
  ShieldCheck,
  School,
  CalendarDays,
  Building2,
} from "lucide-react";
import { Users } from "@phosphor-icons/react";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import { useAuth } from "@/lib/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { mockReviews, mockTrips } from "@/lib/mock-profile-data";
import { useReviewStore } from "@/store/reviewStore";
import { toast } from "sonner";
import { useState } from "react";

/* ── mock travel preferences (replace with API data later) ── */
const preferences = [
  { icon: DollarSign, label: "Budget per night", value: "Under K1,000" },
  { icon: Users, label: "Usually travels", value: "Solo or 2 people" },
  { icon: Bus, label: "Transport", value: "Coaster seats" },
  { icon: Bell, label: "Deal alerts", value: "On" },
];

/* ── Stat pill ─────────────────────────────────────────────── */
function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mt-0.5">{label}</p>
    </div>
  );
}

/* ── Trip card ─────────────────────────────────────────────── */
interface TripProps {
  location: string;
  date: string;
  image: string;
  status: "completed" | "upcoming" | "cancelled";
}

function TripCard({ location, date, image, status }: TripProps) {
  const badge =
    status === "completed"
      ? "bg-purple-muted text-purple border-purple-border"
      : status === "upcoming"
        ? "bg-gold/10 text-gold border-gold/20"
        : "bg-white-bone text-black-faint border-purple-border";

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-purple-border bg-white hover:shadow-sm transition-shadow duration-200">
      <img
        src={image}
        alt={location}
        className="h-14 w-14 rounded-xl object-cover bg-white-bone shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-black truncate">{location}</p>
        <p className="text-sm text-black-faint mt-0.5 flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" /> {date}
        </p>
      </div>
      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border capitalize shrink-0 ${badge}`}>
        {status}
      </span>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export function GuestProfilePage() {
  const goBack = useBackNavigation();
  const { user } = useAuth();
  const { items: savedItems } = useWishlistStore();
  const getReviewsByGuest = useReviewStore((s) => s.getReviewsByGuest);
  const [activeTab, setActiveTab] = useState<"trips" | "reviews">("trips");

  const storeReviews = getReviewsByGuest(user?.name ?? "");
  const allReviews = [...storeReviews, ...mockReviews];

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? "G";

  return (
    <div className="min-h-screen bg-white-warm font-sans">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-purple-deep text-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-10 pb-14">
          {/* Back button */}
          <button
            onClick={goBack}
            className="absolute left-4 top-4 sm:left-8 sm:top-8 flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-sm font-medium text-white transition-all duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex flex-col items-center text-center gap-4">

            {/* Avatar */}
            <div
              className="relative cursor-pointer group"
              onClick={() => toast.info("Change profile photo coming soon")}
            >
              <div className="h-24 w-24 rounded-full ring-4 ring-gold/60 overflow-hidden shadow-lg">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name ?? ""}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-purple to-purple-deep flex items-center justify-center text-2xl font-bold text-white">
                    {initials}
                  </div>
                )}
                {/* Camera overlay */}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              {/* Online dot */}
              <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-purple-deep bg-gold" />
            </div>

            {/* Name */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{user?.name ?? "Guest"}</h1>
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-white/60">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Lusaka, Zambia</span>
                <span className="text-white/30">·</span>
                <span className="flex items-center gap-1"><School className="h-3.5 w-3.5" /> UNZA student</span>
                <span className="text-white/30">·</span>
                <span>Member since Mar 2025</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 sm:gap-16 mt-2 py-4 border-t border-b border-white/10 w-full max-w-xs mx-auto">
              <Stat value={allReviews.length} label="Reviews" />
              <Stat value={mockTrips.length} label="Trips" />
              <Stat value={savedItems.length || 8} label="Saves" />
            </div>

            {/* Edit button */}
            <button
              onClick={() => toast.info("Profile editing coming soon")}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2 text-sm font-semibold text-white transition-all duration-200"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">

          {/* ── Left column ─────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Pill tabs */}
            <div className="flex gap-2 p-1 bg-white rounded-full border border-purple-border w-fit shadow-sm">
              {(["trips", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 capitalize ${activeTab === tab
                      ? "bg-purple text-white shadow-sm"
                      : "text-black-muted hover:text-black"
                    }`}
                >
                  {tab === "trips" ? "Recent Trips" : "Reviews"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "trips" ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-black">Recent Trips</h2>
                  <p className="text-sm text-black-muted mt-0.5">Places you have visited.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {mockTrips.length === 0 ? (
                    <p className="text-sm text-black-muted col-span-2 py-8 text-center">You have no recent trips yet.</p>
                  ) : (
                    mockTrips.slice(0, 4).map((trip, i) => (
                      <TripCard key={i} {...trip} />
                    ))
                  )}
                </div>
                {mockTrips.length > 4 && (
                  <button className="mt-4 w-full rounded-full border border-purple-border bg-white py-2.5 text-sm font-semibold text-purple hover:bg-purple-muted transition-colors">
                    See all {mockTrips.length} trips
                  </button>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-black">Your Reviews</h2>
                  <p className="text-sm text-black-muted mt-0.5">Reviews you&apos;ve left for places you&apos;ve visited.</p>
                </div>

                {allReviews.length === 0 ? (
                  <div className="py-16 rounded-2xl border border-dashed border-purple-border text-center">
                    <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 border border-gold/20">
                      <Star className="h-6 w-6 text-gold" strokeWidth={1.5} />
                    </div>
                    <p className="font-bold text-black">No reviews yet</p>
                    <p className="text-sm text-black-muted mt-1 max-w-xs mx-auto">
                      After your trips, share your experience to help fellow guests.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-purple-border bg-white divide-y divide-purple-border overflow-hidden">
                    {allReviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-black">{review.listingName}</p>
                            <p className="text-[10px] text-black-faint font-bold uppercase tracking-wider mt-0.5">
                              {review.listingType}
                            </p>
                          </div>
                          <div className="flex gap-0.5 shrink-0 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={"h-3.5 w-3.5 " + (i < review.rating ? "fill-gold text-gold" : "text-black-faint")}
                                strokeWidth={i < review.rating ? 0 : 1.5}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="pl-3 border-l-2 border-purple-border">
                          <p className="text-sm text-black-muted leading-relaxed italic">
                            &ldquo;{review.text}&rdquo;
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-3 ml-3">
                          <span className="text-[11px] text-black-faint">
                            {new Date(review.date).toLocaleDateString("en-US", {
                              month: "long", day: "numeric", year: "numeric",
                            })}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-purple bg-purple-muted px-2 py-0.5 rounded-full border border-purple-border">
                            Verified
                          </span>
                        </div>
                      </div>
                    ))}
                    {allReviews.length > 3 && (
                      <button className="w-full py-3.5 text-sm font-bold text-purple hover:bg-purple-muted transition-colors">
                        Show all {allReviews.length} reviews
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────── */}
          <aside className="flex flex-col gap-5">

            {/* Travel Preferences */}
            <div className="rounded-2xl border border-purple-border bg-white p-5">
              <h3 className="text-sm font-bold text-black mb-4">Travel Preferences</h3>
              <ul className="space-y-3">
                {preferences.map((p) => {
                  const Icon = p.icon;
                  return (
                    <li key={p.label} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-black-muted flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-black-faint shrink-0" />
                        {p.label}
                      </span>
                      <span className="text-sm font-semibold text-black text-right">{p.value}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Become a Host CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-purple-deep p-5 text-white">
              <Building2
                className="pointer-events-none absolute -right-3 -bottom-3 h-24 w-24 text-white opacity-5"
                strokeWidth={1}
              />
              <h3 className="text-base font-bold">Become a Host</h3>
              <p className="mt-1.5 text-sm text-white/70 leading-relaxed">
                List your property, experience or vehicle and start earning with Nearby Escapes.
              </p>
              <Link
                href="/become-host"
                className="mt-4 block w-full rounded-full bg-gold hover:bg-gold-hover text-black py-2.5 text-center text-sm font-bold transition-colors"
              >
                Switch to Hosting
              </Link>
            </div>

            {/* Need Help */}
            <div className="rounded-2xl bg-purple-muted border border-purple-border p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-black">
                <HelpCircle className="h-4 w-4 text-purple" />
                Need Help?
              </h3>
              <p className="mt-2 text-sm text-black-muted leading-relaxed">
                Our support team is here to help with any questions or issues.
              </p>
              <Link
                href="/help"
                className="mt-4 block w-full rounded-full border border-purple-border bg-white py-2.5 text-center text-sm font-semibold text-purple hover:bg-white-soft transition-colors"
              >
                Contact Support
              </Link>
            </div>

            {/* Privacy note */}
            <div className="flex items-center gap-2 px-1">
              <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
              <p className="text-xs leading-relaxed text-black-faint">
                Your data is protected with industry-standard encryption.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
