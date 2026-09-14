"use client";

import { Smartphone, CreditCard, Banknote, Plus, Check } from "lucide-react";
import { ProfileSubpageHeader } from "./ProfileSubpageHeader";

export function PaymentMethodsPage() {
  return (
    <div className="min-h-screen bg-[#fbfafc] font-sans pb-16">
      <ProfileSubpageHeader title="Payment methods" />

      <main className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-6 md:pt-8 space-y-6">
        {/* Mobile Money */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 px-1">
            Mobile Money
          </h2>
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#6b2bb8]/10 text-[#6b2bb8] p-2.5 rounded-xl">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Airtel Money</p>
                <p className="text-xs text-neutral-500 mt-0.5">+260 97 123 4567</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Default
              </span>
              <button className="text-[#6b2bb8] text-xs font-medium hover:underline px-2 py-1">
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Bank Cards */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 px-1">
            Bank Cards
          </h2>
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="bg-neutral-100 text-neutral-700 p-2.5 rounded-xl">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Visa ending in 4242</p>
                <p className="text-xs text-neutral-500 mt-0.5">Expires 08/2027</p>
              </div>
            </div>
            <button className="text-rose-600 text-xs font-medium hover:underline px-2 py-1">
              Remove
            </button>
          </div>
          <button className="mt-3 w-full border border-dashed border-neutral-300 rounded-2xl py-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add credit or debit card
          </button>
        </div>

        {/* Other Options */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 px-1">
            Other options
          </h2>
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="bg-amber-50 text-amber-700 p-2.5 rounded-xl">
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Pay on Arrival (Cash)</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Supported for eligible stays &amp; local transport
                </p>
              </div>
            </div>
            <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
