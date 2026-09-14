"use client";

import { useState } from "react";
import { CalendarOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BACKDROP_CLASS } from "@/lib/utils";
import { useAvailabilityStore } from "@/store/availabilityStore";

interface BlockDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listings: Array<{ id: string; name: string }>;
  defaultListingId?: string;
}

export function BlockDateDialog({
  open,
  onOpenChange,
  listings,
  defaultListingId,
}: BlockDateDialogProps) {
  const { blockDateRange } = useAvailabilityStore();
  const [selectedId, setSelectedId] = useState<string>(
    defaultListingId || (listings[0]?.id ?? "h1"),
  );

  // Default to today and 2 days out
  const todayStr = new Date().toISOString().split("T")[0];
  const nextDay = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(nextDay);
  const [reason, setReason] = useState("Maintenance / Repairs");

  const handleBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please choose both start and end dates");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before or equal to end date");
      return;
    }

    blockDateRange(selectedId, startDate, endDate);
    const listingName = listings.find((l) => l.id === selectedId)?.name ?? "Listing";
    toast.success(`Dates blocked for ${listingName}`, {
      description: `${startDate} to ${endDate} is now closed for bookings.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName={BACKDROP_CLASS}
        className="w-[min(92vw,440px)] max-w-sm p-0 overflow-hidden rounded-2xl border border-neutral-200/80 shadow-xl font-sans"
      >
        <div className="bg-neutral-50/70 border-b border-neutral-200/80 px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
              <CalendarOff className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-neutral-900 leading-tight">
                Block a Date
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500 mt-0.5">
                Close off calendar availability for reservations
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleBlock} className="p-5 space-y-4">
          {/* Listing Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">Property / Tour</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/30 transition-all cursor-pointer"
            >
              {listings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date range selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/30 transition-all cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/30 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700">Reason (Optional)</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/30 transition-all cursor-pointer"
            >
              <option value="Maintenance / Repairs">Maintenance / Repairs</option>
              <option value="Personal Use / Family">Personal Use / Family</option>
              <option value="Private Event">Private Event</option>
              <option value="Seasonal Closure">Seasonal Closure</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="rounded-xl bg-purple/5 border border-purple/15 p-3 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-purple shrink-0 mt-0.5" />
            <p className="text-[11px] text-purple-950/80 leading-relaxed">
              Blocked dates prevent new guests from reserving these nights. Existing confirmed bookings will not be affected.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 rounded-xl bg-purple text-white text-xs font-semibold hover:bg-purple-hover active:scale-98 transition-all shadow-xs cursor-pointer"
            >
              Block Dates
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
