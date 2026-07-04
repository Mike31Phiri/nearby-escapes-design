"use client";

import { useState, useMemo, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { mockHostBookings } from "@/lib/mock-host-bookings";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import type { HostBooking } from "@/lib/mock-host-bookings";
import { toast } from "sonner";

function BookingRow({
  booking,
  onAccept,
  onDecline,
  processing,
}: {
  booking: HostBooking;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  processing: string | null;
}) {
  const dates = booking.checkIn
    ? `${new Date(booking.checkIn).toLocaleDateString("en-ZM", { weekday: "short", month: "short", day: "numeric" })} – ${new Date(booking.checkOut!).toLocaleDateString("en-ZM", { weekday: "short", month: "short", day: "numeric" })}`
    : booking.date
      ? new Date(booking.date).toLocaleDateString("en-ZM", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      : "";

  return (
    <div className="border-b border-[#E0DBD0] last:border-b-0">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0"
          style={{ background: "#2A3A4A", color: "#7AAAD4" }}
        >
          {booking.guestName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-medium text-[#1C1030]">
            {booking.guestName} · {booking.guests} guests
          </div>
          <div className="text-[10px] text-[#64748B]">
            {dates} · K{booking.amount.toLocaleString()}
          </div>
        </div>
        <div
          className="text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{
            background:
              booking.status === "pending"
                ? "#FFF4DC"
                : booking.status === "confirmed"
                  ? "#E6F4EE"
                  : booking.status === "completed"
                    ? "#EDE8F5"
                    : "#FCEBEB",
            color:
              booking.status === "pending"
                ? "#8A5C0A"
                : booking.status === "confirmed"
                  ? "#2A5C3F"
                  : booking.status === "completed"
                    ? "#3D2463"
                    : "#A32D2D",
          }}
        >
          {booking.status === "pending"
            ? "Pending"
            : booking.status === "confirmed"
              ? "Confirmed"
              : booking.status === "completed"
                ? "Done"
                : "Cancelled"}
        </div>
      </div>
      {booking.status === "pending" && (
        <div className="grid grid-cols-2 gap-2 px-3 pb-3">
          <button
            onClick={() => onDecline(booking.id)}
            disabled={processing === booking.id}
            className="py-2 rounded-lg border border-[#A32D2D] bg-[#FCEBEB] text-center text-[12px] font-medium text-[#A32D2D] hover:bg-[#F8D5D5] transition-colors disabled:opacity-50"
          >
            {processing === booking.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" />
            ) : (
              "Decline"
            )}
          </button>
          <button
            onClick={() => onAccept(booking.id)}
            disabled={processing === booking.id}
            className="py-2 rounded-lg border border-[#2A5C3F] bg-[#E6F4EE] text-center text-[12px] font-medium text-[#2A5C3F] hover:bg-[#D4EDD8] transition-colors disabled:opacity-50"
          >
            {processing === booking.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" />
            ) : (
              "Accept"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export function HostBookingsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [processing, setProcessing] = useState<string | null>(null);
  const [bookings, setBookings] = useState<HostBooking[]>(mockHostBookings);

  const filters = [
    { key: "all", label: `All (${bookings.length})` },
    {
      key: "upcoming",
      label: `Upcoming (${bookings.filter((b) => b.status === "confirmed").length})`,
    },
    { key: "pending", label: `Pending (${bookings.filter((b) => b.status === "pending").length})` },
    {
      key: "completed",
      label: `Completed (${bookings.filter((b) => b.status === "completed").length})`,
    },
  ];

  const filtered = useMemo(() => {
    if (activeFilter === "all") return bookings;
    if (activeFilter === "upcoming") return bookings.filter((b) => b.status === "confirmed");
    if (activeFilter === "pending") return bookings.filter((b) => b.status === "pending");
    return bookings.filter((b) => b.status === "completed");
  }, [bookings, activeFilter]);

  const handleAccept = useCallback(
    (id: string) => {
      const guest = bookings.find((b) => b.id === id);
      setProcessing(id);
      setTimeout(() => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b)),
        );
        setProcessing(null);
        toast.success(`Booking confirmed for ${guest?.guestName ?? "Guest"}!`);
      }, 800);
    },
    [bookings],
  );

  const handleDecline = useCallback(
    (id: string) => {
      const guest = bookings.find((b) => b.id === id);
      setProcessing(id);
      setTimeout(() => {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b)),
        );
        setProcessing(null);
        toast.success(`Booking from ${guest?.guestName ?? "Guest"} declined.`);
      }, 800);
    },
    [bookings],
  );

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <HostPageHeader
        eyebrow="Reservations"
        title="My Bookings"
        description="View and manage all your upcoming and past guest stays."
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        {/* Filter pills */}
        <div className="flex gap-1.5 pb-3 overflow-x-auto scrollbar-none mt-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-colors ${
                activeFilter === f.key
                  ? "bg-[#3D2463] text-[#FAF7F2]"
                  : "bg-white border border-[#E0DBD0] text-[#3D2463] hover:border-[#2a1b47]/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Pending approval section */}
        {filtered.filter((b) => b.status === "pending").length > 0 && (
          <div className="mx-4 mb-4 md:mx-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[26px] h-[26px] rounded-lg bg-[#FFF4DC] flex items-center justify-center">
                <svg
                  className="h-3.5 w-3.5 text-[#2a1b47]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[12px] font-medium text-[#1C1030]">Pending approval</span>
            </div>
            <div className="bg-white border border-[#E0DBD0] rounded-xl overflow-hidden">
              {filtered
                .filter((b) => b.status === "pending")
                .map((b) => (
                  <BookingRow
                    key={b.id}
                    booking={b}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    processing={processing}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Confirmed upcoming section */}
        {filtered.filter((b) => b.status === "confirmed").length > 0 && (
          <div className="mx-4 mb-4 md:mx-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[26px] h-[26px] rounded-lg bg-[#EDE8F5] flex items-center justify-center">
                <svg
                  className="h-3.5 w-3.5 text-[#3D2463]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[12px] font-medium text-[#1C1030]">Confirmed upcoming</span>
            </div>
            <div className="bg-white border border-[#E0DBD0] rounded-xl overflow-hidden">
              {filtered
                .filter((b) => b.status === "confirmed")
                .map((b) => (
                  <BookingRow
                    key={b.id}
                    booking={b}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    processing={processing}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Completed section */}
        {filtered.filter((b) => b.status === "completed").length > 0 && (
          <div className="mx-4 pb-4 md:mx-0 md:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-[26px] h-[26px] rounded-lg bg-[#E6F4EE] flex items-center justify-center">
                  <svg
                    className="h-3.5 w-3.5 text-[#2A5C3F]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[12px] font-medium text-[#1C1030]">Completed</span>
              </div>
              <span className="text-[11px] text-[#2a1b47] font-medium cursor-pointer">
                View all
              </span>
            </div>
            <div className="bg-white border border-[#E0DBD0] rounded-xl overflow-hidden">
              {filtered
                .filter((b) => b.status === "completed")
                .map((b) => (
                  <div
                    key={b.id}
                    className="border-b border-[#E0DBD0] last:border-b-0 px-3 py-2.5 flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#3A2A10] text-[#2a1b47] flex items-center justify-center text-[11px] font-medium shrink-0">
                      {b.guestName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-[#1C1030]">
                        {b.guestName} · {b.guests} guests
                      </div>
                      <div className="text-[10px] text-[#64748B]">
                        K{b.amount.toLocaleString()} paid out
                      </div>
                    </div>
                    <div className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E6F4EE] text-[#2A5C3F]">
                      Done
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="px-4 py-10 text-center text-[12px] text-[#64748B]">No bookings found</div>
        )}
      </div>
    </div>
  );
}
