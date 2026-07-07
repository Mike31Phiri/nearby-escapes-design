"use client";

import Link from "next/link";
import {
  CurrencyDollar as DollarSign,
  CalendarBlank as CalendarDays,
  Percent,
  Star,
  ArrowRight,
  Briefcase,
  Stack as Layers,
  Lightning as Zap,
  ChatTeardropText as MessageSquare,
  CaretRight as ChevronRight,
  Clock,
  Medal as Award,
  Calendar,
  WarningCircle as AlertCircle,
  ChatCircle as MessageCircle,
  TrendUp as TrendingUp,
} from "@phosphor-icons/react";
import { mockWeeklySnapshot, mockOperationalQueue } from "@/lib/mock-host-dashboard";
import { mockHostProfile } from "@/lib/mock-profile-data";
import { mockHostBookings } from "@/lib/mock-host-bookings";
import { mockHostReviews } from "@/lib/mock-host-inbox";

import { HostPageHeader } from "@/components/layout/HostPageHeader";

export function HostDashboardPage() {
  const host = mockHostProfile;
  const arriving = mockOperationalQueue.filter((q) => q.type === "arriving");

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <HostPageHeader
        eyebrow="Host Dashboard"
        title={`Welcome back, ${host.name.split(" ")[0]}`}
        actions={
          <Link
            href="/host/profile"
            className="hidden sm:inline-flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 hover:shadow-md transition-all shadow-sm"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1f1433] to-[#150d22] flex items-center justify-center text-base font-bold text-[#1f1433] border border-[#1f1433]/20">
              {host.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <span className="text-base font-bold text-white tracking-wide">View Profile</span>
          </Link>
        }
      />

      {/*  Content Container  */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8">
        {/* Alert Banner */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 flex items-center justify-between gap-4 mb-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold text-amber-900">New Booking Request</div>
              <p className="text-base text-amber-700 mt-0.5">
                Tendai K. requested a stay for <span className="font-semibold">18–20 Jul</span> at
                your Luxury Safari Lodge.
              </p>
            </div>
          </div>
          <Link
            href="/host/bookings"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-base font-medium bg-amber-600 text-white hover:bg-amber-700 transition-colors shrink-0"
          >
            Review Request <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Section Title */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-[10px] sm:text-sm font-bold text-[#1f1433] uppercase tracking-widest mb-1.5">
              Insights
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#1f1433] leading-[1.15]">
              Performance Metrics
            </h2>
            <p className="text-[#64748B] mt-1.5 text-base max-w-lg leading-relaxed">
              How your business is doing this month
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#e0dbd0]/60 text-base font-bold text-[#1f1433] shadow-sm">
            <Calendar className="h-4 w-4 text-[#1f1433]" />
            July 2025
          </span>
        </div>

        {/*  Metrics Grid  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Earnings Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-border flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-base font-medium text-muted-foreground">
                  Monthly Earnings
                </span>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  K{mockWeeklySnapshot.revenue.toLocaleString()}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-base font-medium text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              <span>+{mockWeeklySnapshot.revenueChange}% vs last month</span>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-border flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-base font-medium text-muted-foreground">Active Bookings</span>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {mockWeeklySnapshot.bookings}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-base font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>3 upcoming · 3 completed</span>
            </div>
          </div>

          {/* Occupancy Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-border flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-base font-medium text-muted-foreground">Occupancy Rate</span>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {mockWeeklySnapshot.occupancyRate}%
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Percent className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-base font-medium text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Above region average</span>
            </div>
          </div>

          {/* Rating Card */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-border flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-base font-medium text-muted-foreground">Average Rating</span>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {mockWeeklySnapshot.avgRating?.toFixed(2) ?? "5.00"}
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-base font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{mockWeeklySnapshot.reviewCount} reviews total</span>
            </div>
          </div>
        </div>

        {/*  Main Content Grid  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS - SCHEDULE & LOGS */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Check-ins */}
            <div className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] sm:text-sm font-bold text-[#1f1433] uppercase tracking-widest mb-1">
                    Schedule
                  </p>
                  <h3 className="font-display text-xl font-bold tracking-tight text-[#1f1433] leading-[1.15]">
                    Upcoming Check-ins
                  </h3>
                  <p className="text-[#64748B] mt-1 text-base">
                    Guests arriving in the next few days
                  </p>
                </div>
                <Link
                  href="/host/bookings"
                  className="hidden sm:inline-flex items-center gap-1.5 text-base font-semibold text-[#1f1433] hover:text-[#2A154A] transition-all duration-200 group"
                >
                  <span>Manage bookings</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
                {arriving.length === 0 ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-base text-muted-foreground">
                      No check-ins scheduled for today or tomorrow
                    </p>
                  </div>
                ) : (
                  arriving.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                          {item.guestName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>

                        <div>
                          <div className="text-base font-semibold text-foreground">
                            {item.guestName}
                          </div>
                          <div className="text-base text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-medium text-foreground">
                              {item.checkIn
                                ? new Date(item.checkIn).toLocaleDateString("en-ZM", {
                                    month: "short",
                                    day: "numeric",
                                    weekday: "short",
                                  })
                                : ""}
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <span>
                              {item.checkOut
                                ? new Date(item.checkOut).toLocaleDateString("en-ZM", {
                                    month: "short",
                                    day: "numeric",
                                    weekday: "short",
                                  })
                                : ""}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span>{item.guests} guests</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium border ${
                            item.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${item.status === "pending" ? "bg-amber-500" : "bg-emerald-500"}`}
                          />
                          {item.status}
                        </span>

                        <Link
                          href="/host/inbox"
                          className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] sm:text-sm font-bold text-[#1f1433] uppercase tracking-widest mb-1">
                    Activity
                  </p>
                  <h3 className="font-display text-xl font-bold tracking-tight text-[#1f1433] leading-[1.15]">
                    Recent Transactions
                  </h3>
                  <p className="text-[#64748B] mt-1 text-base">
                    Latest bookings and reservation updates
                  </p>
                </div>
                <Link
                  href="/host/bookings"
                  className="hidden sm:inline-flex items-center gap-1.5 text-base font-semibold text-[#1f1433] hover:text-[#2A154A] transition-all duration-200 group"
                >
                  <span>All bookings</span>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
                {mockHostBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                        {booking.guestName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-semibold text-foreground">
                            {booking.guestName}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-base text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                            {booking.listingName}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Ref: {booking.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-border shrink-0">
                      <div className="text-right">
                        <div className="text-base font-bold text-foreground">K{booking.amount}</div>
                        <p className="text-sm text-muted-foreground">Payout pending</p>
                      </div>

                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium border ${
                          booking.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : booking.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - ACTIONS & REVIEWS */}
          <div className="space-y-8">
            {/* Quick Actions Grid */}
            <div className="space-y-5">
              <div>
                <p className="text-[10px] sm:text-sm font-bold text-[#1f1433] uppercase tracking-widest mb-1">
                  Shortcuts
                </p>
                <h3 className="font-display text-xl font-bold tracking-tight text-[#1f1433] leading-[1.15]">
                  Quick Management
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/host/availability"
                  className="bg-white border border-border rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground">Block Dates</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Manage availability</p>
                  </div>
                </Link>

                <Link
                  href="/host/finances"
                  className="bg-white border border-border rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground">Set Pricing</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Adjust rates</p>
                  </div>
                </Link>

                <Link
                  href="/host/listings"
                  className="bg-white border border-border rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground">My Listings</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">Edit photo & info</p>
                  </div>
                </Link>

                <Link
                  href="/host/finances"
                  className="bg-white border border-border rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-primary/40 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground">Payouts</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      K{mockWeeklySnapshot.revenue.toLocaleString()} available
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
