"use client";

import Link from "next/link";
import { MessageCircle, PhoneCall, HelpCircle, ShieldCheck, AlertTriangle, Mail } from "lucide-react";
import { ProfileSubpageHeader } from "./ProfileSubpageHeader";

export function SupportSafetyPage() {
  return (
    <div className="min-h-screen bg-[#fbfafc] font-sans pb-16">
      <ProfileSubpageHeader title="Support & safety" />

      <main className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-6 md:pt-8 space-y-6">
        {/* Immediate Assistance */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 px-1">
            Need immediate assistance?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://wa.me/260971234567?text=Hello%20Nearby%20Escapes%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-neutral-200/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-emerald-300 hover:shadow-xs transition"
            >
              <div className="text-emerald-700 bg-emerald-50 p-2.5 rounded-xl shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">WhatsApp Support</p>
                <p className="text-xs text-neutral-500 mt-0.5">Available 24/7 for urgent help</p>
              </div>
            </a>

            <a
              href="tel:+260211123456"
              className="bg-white border border-neutral-200/80 rounded-2xl p-4 flex items-center gap-3.5 hover:border-rose-300 hover:shadow-xs transition"
            >
              <div className="text-rose-700 bg-rose-50 p-2.5 rounded-xl shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Emergency Line</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Direct safety &amp; security dispatch
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Safety Assurances */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-[#6b2bb8]" />
            <span>Community Safety Standards</span>
          </div>

          <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <p className="font-medium text-neutral-900 mb-0.5">Host &amp; Guide Verification</p>
              <p className="text-neutral-500">
                Every host on Nearby Escapes verifies their national identity (NRC or passport) and
                accommodation license before publishing listings.
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <p className="font-medium text-neutral-900 mb-0.5">
                Secure Escrow &amp; Local Currency
              </p>
              <p className="text-neutral-500">
                Payments in Zambian Kwacha (ZMW) are held securely until check-in is complete and
                verified.
              </p>
            </div>
          </div>
        </div>

        {/* Report an Issue */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1 text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-semibold">Report an issue or incident</h3>
          </div>
          <p className="text-xs text-rose-700/90 mb-4 leading-relaxed">
            If an experience or accommodation did not match what was advertised, or if you faced a safety concern, our guest relations team is ready to step in.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="mailto:support@nearbyescapes.com?subject=Incident%20Report%20-%20Nearby%20Escapes"
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Submit incident report</span>
            </a>
            <Link
              href="/help"
              className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Visit Help Center</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
