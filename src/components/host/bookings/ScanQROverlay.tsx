"use client";

import { useEffect, useState } from "react";
import { Check, QrCode, ScanLine, X } from "lucide-react";
import { ManifestGuestRow } from "@/store/hostBookingsStore";

interface ScanQROverlayProps {
  open: boolean;
  onClose: () => void;
  /** Performs the check-in; returns the matched guest or null when none are left. */
  onScanned: () => ManifestGuestRow | null;
}

type Phase = "scanning" | "matched" | "none-left";

export function ScanQROverlay({ open, onClose, onScanned }: ScanQROverlayProps) {
  const [phase, setPhase] = useState<Phase>("scanning");
  const [matched, setMatched] = useState<ManifestGuestRow | null>(null);

  useEffect(() => {
    if (!open) return;
    setPhase("scanning");
    setMatched(null);

    // Simulate the camera finding the first unchecked guest's QR code.
    const scanTimer = setTimeout(() => {
      const guest = onScanned();
      if (guest) {
        setMatched(guest);
        setPhase("matched");
        // Briefly show the match, then dismiss the viewfinder.
        setTimeout(() => onClose(), 900);
      } else {
        setPhase("none-left");
        setTimeout(() => onClose(), 1400);
      }
    }, 1300);

    return () => clearTimeout(scanTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-14 shrink-0">
        <span className="text-white/70 text-[12px] font-semibold uppercase tracking-widest">
          Scan QR
        </span>
        <button
          onClick={onClose}
          aria-label="Close scanner"
          className="h-9 w-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {phase === "scanning" && (
          <>
            <div className="relative h-60 w-60 md:h-72 md:w-72">
              {/* Corner brackets */}
              {[
                "top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl",
                "top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl",
                "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl",
                "bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl",
              ].map((c) => (
                <span key={c} className={`absolute h-10 w-10 border-emerald-400 ${c}`} />
              ))}
              {/* Scan line */}
              <span className="absolute left-4 right-4 h-0.5 bg-emerald-400/90 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-scan-line" />
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode className="h-16 w-16 text-white/20" />
              </div>
            </div>
            <p className="mt-8 text-white text-[15px] font-bold">
              Align the ticket QR within the frame
            </p>{" "}
            <p className="mt-1 text-white/50 text-[12px]">
              Hold steady — we&apos;ll match it to a guest automatically
            </p>
            <div className="mt-6 flex items-center gap-2 text-emerald-400/80">
              <ScanLine className="h-4 w-4 animate-pulse" />
              <span className="text-[12px] font-semibold">Scanning…</span>
            </div>
          </>
        )}

        {phase === "matched" && matched && (
          <div className="text-center animate-checkin-pop">
            <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.6)]">
              <Check className="h-10 w-10 text-white" strokeWidth={3} />
            </div>
            <p className="mt-6 text-white text-lg font-black">Guest matched!</p>
            <p className="mt-1 text-emerald-300 text-[14px] font-semibold">{matched.name}</p>
            <p className="mt-0.5 text-white/50 text-[12px]">
              Party of {matched.partySize} · Checked in ✓
            </p>
          </div>
        )}

        {phase === "none-left" && (
          <div className="text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
              <Check className="h-9 w-9 text-white" strokeWidth={2.5} />
            </div>
            <p className="mt-6 text-white text-[15px] font-bold">
              All guests are already checked in
            </p>
            <p className="mt-1 text-white/50 text-[12px]">Nothing left to scan — nice work!</p>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="shrink-0 px-6 pb-10 pt-4 text-center">
        <p className="text-white/40 text-[11px]">
          No camera? Tap the checkbox on any guest row as a fallback.
        </p>
      </div>
    </div>
  );
}
