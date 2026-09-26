"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Camera, Check, PartyPopper, Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDayLabel, formatTime12h } from "@/lib/utils/calendar";
import { TOUR_LISTINGS } from "@/store/tourAvailabilityStore";
import {
  getManifestSlot,
  getSlotKey,
  ManifestGuestRow,
  useHostBookingsStore,
} from "@/store/hostBookingsStore";
import { ScanQROverlay } from "@/components/host/bookings/ScanQROverlay";
import { ROUTES } from "@/lib/constants/routes";

function PaymentBadge({ status }: { status: "paid" | "pending" }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
      )}
    >
      {status === "paid" ? "Paid" : "Pending"}
    </span>
  );
}

export function DailyManifestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scannerOpen, setScannerOpen] = useState(false);

  const checkIns = useHostBookingsStore((s) => s.checkIns);
  const toggleGuestCheckIn = useHostBookingsStore((s) => s.toggleGuestCheckIn);
  const checkInFirstUnchecked = useHostBookingsStore((s) => s.checkInFirstUnchecked);

  const { listing, date, time, slotKey } = useMemo(() => {
    const raw = searchParams.get("slot") ?? "";
    const [listingId, dateStr, timeStr] = raw.split("|");
    const listing = TOUR_LISTINGS.find((l) => l.id === listingId);
    return {
      listing,
      date: dateStr ?? "",
      time: timeStr ?? "",
      slotKey: listingId && dateStr && timeStr ? getSlotKey(listingId, dateStr, timeStr) : "",
    };
  }, [searchParams]);

  const manifest = useMemo(
    () =>
      listing && slotKey
        ? getManifestSlot(listing.id, listing.name, listing.emoji, date, time, checkIns)
        : null,
    [listing, slotKey, date, time, checkIns],
  );

  const guests = useMemo(() => {
    if (!manifest) return [];
    const checked = manifest.guests.filter((g) => g.checkedIn);
    const waiting = manifest.guests.filter((g) => !g.checkedIn);
    return [...waiting, ...checked];
  }, [manifest]);

  if (!listing || !manifest || !slotKey) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[14px] font-semibold text-neutral-700">Manifest not found</p>
        <p className="text-[12px] text-neutral-400 mt-1">This time slot may no longer exist.</p>
        <button
          onClick={() => router.push(ROUTES?.host?.bookings ?? "/host/bookings")}
          className="mt-4 h-10 rounded-xl bg-purple text-white text-[13px] font-bold px-5 hover:bg-purple-hover transition-colors shadow-xs"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  const { totalPeople, checkedInPeople } = manifest;
  const progress = totalPeople > 0 ? Math.round((checkedInPeople / totalPeople) * 100) : 0;
  const allIn = totalPeople > 0 && checkedInPeople === totalPeople;
  const checkedCount = manifest.guests.filter((g) => g.checkedIn).length;

  const handleScan = () => {
    const guest = checkInFirstUnchecked(slotKey, date, time);
    if (guest) toast.success(`${guest.name} checked in ✓`, { position: "top-center" });
    return guest;
  };

  const toggleRow = (guest: ManifestGuestRow) => {
    toggleGuestCheckIn(slotKey, guest.id);
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-16">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center gap-2">
          <button
            onClick={() => router.push(ROUTES?.host?.bookings ?? "/host/bookings")}
            aria-label="Back to bookings"
            className="h-9 w-9 -ml-2 rounded-lg flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-neutral-900 truncate leading-tight">
              {manifest.listingName}
            </p>
            <p className="text-[11px] text-neutral-500">
              {formatDayLabel(manifest.date)} · {formatTime12h(manifest.time)}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4 space-y-4">
        {/* Celebration banner */}
        {allIn && (
          <div className="rounded-2xl bg-emerald-600 text-white px-4 py-3 flex items-center gap-3 animate-celebrate-pop shadow-sm">
            <PartyPopper className="h-5 w-5 shrink-0" />
            <p className="text-[13px] font-bold">All guests checked in! 🎉</p>
          </div>
        )}

        {/* Progress card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4">
          <div className="flex items-end justify-between mb-2">
            <p className="text-[22px] font-bold text-neutral-900 leading-none">
              {checkedInPeople}
              <span className="text-neutral-300 font-bold">/{totalPeople}</span>
            </p>
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
              Checked In
            </span>
          </div>
          <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                allIn ? "bg-emerald-500" : "bg-purple",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-neutral-400 font-medium">
            {checkedCount} of {manifest.guests.length} booking
            {manifest.guests.length === 1 ? "" : "s"} checked in
          </p>
        </div>

        {/* Scan QR */}
        <button
          onClick={() => setScannerOpen(true)}
          className="w-full h-13 min-h-[52px] rounded-2xl bg-emerald-600 text-white text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm"
        >
          <Camera className="h-5 w-5" />
          Scan QR
        </button>

        {/* Guest list */}
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          {/* Waiting guests */}
          {guests.filter((g) => !g.checkedIn).length > 0 && (
            <div className="px-4 pt-3 pb-1 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-black-muted">
                Waiting ({guests.filter((g) => !g.checkedIn).length})
              </span>
            </div>
          )}

          <div className="divide-y divide-neutral-100">
            {guests
              .filter((g) => !g.checkedIn)
              .map((guest) => (
                <button
                  key={guest.id}
                  onClick={() => toggleRow(guest)}
                  aria-pressed={false}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white hover:bg-neutral-50 transition-colors"
                >
                  <span className="h-6 w-6 shrink-0 rounded-md border-2 border-neutral-300 bg-white flex items-center justify-center" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate text-neutral-900">
                      {guest.name}
                    </p>
                    <p className="text-[11px] text-neutral-400">Party of {guest.partySize}</p>
                  </div>
                  <PaymentBadge status={guest.paymentStatus} />
                </button>
              ))}
          </div>

          {/* Checked-in section */}
          {checkedCount > 0 && (
            <>
              <div className="px-4 pt-3 pb-1 flex items-center gap-1.5 bg-[#F4FAF6]">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Checked In ({checkedCount})
                </span>
              </div>
              <div className="divide-y divide-emerald-100">
                {guests
                  .filter((g) => g.checkedIn)
                  .map((guest) => (
                    <button
                      key={`${guest.id}-in`}
                      onClick={() => toggleRow(guest)}
                      aria-pressed={true}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left bg-[#E7F6EE] animate-manifest-row-in transition-colors"
                    >
                      <span className="h-6 w-6 shrink-0 rounded-md border-2 border-emerald-500 bg-emerald-500 text-white flex items-center justify-center animate-checkin-pop">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold truncate text-emerald-900">
                          {guest.name}
                        </p>
                        <p className="text-[11px] text-emerald-700/60">
                          Party of {guest.partySize}
                        </p>
                      </div>
                      <PaymentBadge status={guest.paymentStatus} />
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>

        <p className="text-[11px] text-neutral-400 px-1">
          Tap a row to check a guest in manually, or use Scan QR to match the first unchecked guest.
        </p>
      </main>

      <ScanQROverlay
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanned={handleScan}
      />
    </div>
  );
}
