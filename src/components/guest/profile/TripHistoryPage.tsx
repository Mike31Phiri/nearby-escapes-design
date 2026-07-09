"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Building2, Compass, Bus } from "lucide-react";

import { ProfileSubpageHeader } from "./ProfileSubpageHeader";

export function TripHistoryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ProfileSubpageHeader title="Trip history" />

      <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-4">
        {/* Trip 1: Stay */}
        <div className="bg-white border border-white-soft rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-sm hover:border-purple/30 transition">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Stay
              </span>
            </div>
            <p className="font-semibold text-black mt-1">Chisanga's Lakeside Lodge</p>
            <p className="text-xs text-black-muted mt-0.5">Livingstone, Zambia · Aug 12 - Aug 15, 2025</p>
          </div>
          <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full w-fit">Completed</span>
        </div>

        {/* Trip 2: Experience */}
        <div className="bg-white border border-white-soft rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-sm hover:border-purple/30 transition">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-purple-muted text-purple px-2 py-0.5 rounded-full flex items-center gap-1">
                <Compass className="w-3 h-3" /> Experience
              </span>
            </div>
            <p className="font-semibold text-black mt-1">Mosi-oa-Tunya Safari & River Cruise</p>
            <p className="text-xs text-black-muted mt-0.5">Livingstone, Zambia · Jan 18, 2026</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full w-fit">Upcoming</span>
        </div>

        {/* Trip 3: Transport */}
        <div className="bg-white border border-white-soft rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-sm hover:border-purple/30 transition">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Bus className="w-3 h-3" /> Transport
              </span>
            </div>
            <p className="font-semibold text-black mt-1">Lusaka to Livingstone Express</p>
            <p className="text-xs text-black-muted mt-0.5">Lusaka, Zambia · Dec 28, 2025</p>
          </div>
          <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full w-fit">Completed</span>
        </div>
      </div>
    </div>
  );
}
