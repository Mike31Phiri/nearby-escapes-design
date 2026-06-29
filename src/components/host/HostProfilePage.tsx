"use client";

import { Star, MapPin, ChatTeardropText as MessageSquare } from "@phosphor-icons/react";
import { mockHostProfile } from "@/lib/mock-profile-data";

export function HostProfilePage() {
  const host = mockHostProfile;
  const avgRating = host.listings
    .filter((l) => l.rating > 0)
    .reduce((s, l, _, a) => s + l.rating / a.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/*  Full-width Host Header  */}
      <div className="bg-[#1A0B2E] w-full">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] rounded-full bg-[#1E1B4B] border-2 border-[#D4AF37] flex items-center justify-center text-[20px] font-bold text-[#D4AF37] shrink-0">
              {host.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <div className="font-display text-xl md:text-2xl font-bold tracking-tight text-white">
                {host.name}
              </div>
              <div className="text-sm text-[#64748B] mt-0.5">{host.location}</div>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-[#D4AF37]">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Verified host
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Content Container  */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        <div className="bg-white border border-[#E0DBD0] rounded-2xl overflow-hidden">
          {/* Body */}
          <div className="px-4 py-3.5 space-y-4">
            {/* Stats row */}
            <div className="flex items-center gap-4 text-sm text-[#64748B]">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span className="font-semibold text-[#1A0B2E]">{avgRating.toFixed(1)}</span>
              </div>
              <span>·</span>
              <div>
                <span className="font-semibold text-[#1A0B2E]">{host.reviewCount}</span> reviews
              </div>
              <span>·</span>
              <div>
                <span className="font-semibold text-[#1A0B2E]">{host.responseRate}%</span> response
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1.5">
                About
              </div>
              <p className="text-sm text-[#1A0B2E] leading-relaxed">{host.bio}</p>
            </div>

            {/* Verified badges */}
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1.5">
                Verifications
              </div>
              <div className="flex flex-wrap gap-1.5">
                {host.verifiedBadges.map((b) => (
                  <span
                    key={b}
                    className="text-xs text-[#1A0B2E] bg-muted px-2.5 py-1 rounded-full font-medium"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Listings */}
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1.5">
                Listings ({host.listings.length})
              </div>
              <div className="space-y-2">
                {host.listings.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center gap-2.5 bg-white border border-[#E0DBD0] rounded-xl p-2.5"
                  >
                    <img
                      src={l.image}
                      alt={l.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[#1A0B2E] truncate">{l.name}</div>
                      <div className="flex items-center gap-1 text-xs text-[#64748B] mt-0.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {l.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#1A0B2E]">K{l.price}</div>
                      <div className="text-[10px] text-[#64748B] uppercase tracking-wider">
                        / night
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-[#faf9f5] border border-[#E0DBD0] rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1A0B2E] flex items-center justify-center text-[#D4AF37] text-lg font-bold shrink-0">
                {host.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-base font-bold text-[#1A0B2E]">{host.name}</div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  Hosting since {host.joined} · Responds {host.responseTime}
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-bold text-[#1A0B2E] bg-white border border-[#E0DBD0] rounded-lg hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 shadow-sm">
                <MessageSquare className="h-4 w-4" /> Message
              </button>
            </div>

            {/* Reviews */}
            <div>
              <div className="text-[10px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1.5">
                Guest reviews
              </div>
              <div className="space-y-3">
                {[
                  {
                    initials: "TM",
                    name: "Thandeka M.",
                    text: "Honestly did not expect to see elephants just 45 minutes from Lusaka. The food was incredible and the staff felt like family.",
                  },
                  {
                    initials: "KC",
                    name: "Kelvin C.",
                    text: "Perfect weekend for our group of 6. This is exactly what a Zambian escape should feel like.",
                  },
                ].map((r, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-[30px] h-[30px] rounded-full bg-[#2A3A4A] text-[#7AAAD4] flex items-center justify-center text-[11px] font-medium shrink-0">
                      {r.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1A0B2E]">{r.name}</div>
                      <div className="flex gap-0.5 my-1">
                        {Array(5)
                          .fill(0)
                          .map((_, s) => (
                            <svg
                              key={s}
                              className="h-3.5 w-3.5 text-[#D4AF37]"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                      </div>
                      <div className="text-sm text-[#1A0B2E] italic leading-relaxed">
                        &ldquo;{r.text}&rdquo;
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
