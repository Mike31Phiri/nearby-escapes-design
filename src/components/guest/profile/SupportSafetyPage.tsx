"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle, PhoneCall } from "lucide-react";

import { ProfileSubpageHeader } from "./ProfileSubpageHeader";

export function SupportSafetyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ProfileSubpageHeader title="Support & safety" />

      <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Immediate Help */}
        <div>
          <h3 className="text-sm font-semibold text-black mb-3">Need immediate help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="bg-white border border-white-soft rounded-xl p-4 flex items-center gap-3 hover:bg-white-warm transition text-left shadow-sm">
              <div className="text-green-600 bg-green-100 p-2 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">WhatsApp Support</p>
                <p className="text-xs text-black-muted">We reply within 5 mins</p>
              </div>
            </button>
            <button className="bg-white border border-white-soft rounded-xl p-4 flex items-center gap-3 hover:bg-white-warm transition text-left shadow-sm">
              <div className="text-red-600 bg-red-100 p-2 rounded-full flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Emergency Hotline</p>
                <p className="text-xs text-black-muted">Local safety & security</p>
              </div>
            </button>
          </div>
        </div>

        {/* Common Questions */}
        <div>
          <h3 className="text-sm font-semibold text-black mb-3">Common questions</h3>
          <div className="space-y-3">
            <div className="bg-white border border-white-soft rounded-xl p-4 hover:bg-white-warm transition cursor-pointer shadow-sm">
              <p className="text-sm font-semibold text-black">
                How do I book a stay or experience?
              </p>
              <p className="text-xs text-black-muted mt-1">
                Search, choose a listing, and click "Reserve". Payments are secure.
              </p>
            </div>
            <div className="bg-white border border-white-soft rounded-xl p-4 hover:bg-white-warm transition cursor-pointer shadow-sm">
              <p className="text-sm font-semibold text-black">What is your cancellation policy?</p>
              <p className="text-xs text-black-muted mt-1">
                Stays allow free cancellation up to 48 hours before check-in.
              </p>
            </div>
            <div className="bg-white border border-white-soft rounded-xl p-4 hover:bg-white-warm transition cursor-pointer shadow-sm">
              <p className="text-sm font-semibold text-black">Is my community host verified?</p>
              <p className="text-xs text-black-muted mt-1">
                Yes! Every local host is vetted before they can list.
              </p>
            </div>
          </div>
        </div>

        {/* Report an Issue */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <h3 className="text-sm font-bold text-red-800 mb-1">Report an issue</h3>
          <p className="text-xs text-red-600 mb-3">
            If something went wrong with your booking, we're here to help.
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-red-700 transition">
            Submit a report
          </button>
        </div>
      </div>
    </div>
  );
}
