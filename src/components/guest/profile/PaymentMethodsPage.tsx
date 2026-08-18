"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Smartphone, CreditCard, Banknote, Plus } from "lucide-react";

import { ProfileSubpageHeader } from "./ProfileSubpageHeader";

export function PaymentMethodsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ProfileSubpageHeader title="Payment methods" />

      <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Mobile Money */}
        <div>
          <h3 className="text-sm font-semibold text-black mb-3">Mobile Money</h3>
          <div className="bg-white border border-white-soft rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-purple-muted text-purple p-2 rounded-full">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Airtel Money</p>
                <p className="text-xs text-black-muted">+260 97 123 4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-700 font-medium bg-green-100 px-2 py-1 rounded-full">
                Default
              </span>
              <button className="text-purple text-xs font-semibold hover:underline">Edit</button>
            </div>
          </div>
        </div>

        {/* Bank Cards */}
        <div>
          <h3 className="text-sm font-semibold text-black mb-3">Bank Cards</h3>
          <div className="bg-white border border-white-soft rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-purple p-2">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Visa ending in 4242</p>
                <p className="text-xs text-black-muted">Expires 08/2027</p>
              </div>
            </div>
            <button className="text-red-600 text-xs font-semibold hover:underline">Remove</button>
          </div>
          <button className="mt-3 w-full border-2 border-dashed border-white-soft rounded-xl py-3 text-sm text-black-muted hover:bg-white-warm transition flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add credit or debit card
          </button>
        </div>

        {/* Other Options */}
        <div>
          <h3 className="text-sm font-semibold text-black mb-3">Other options</h3>
          <div className="bg-white border border-white-soft rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="text-black-soft p-2">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Pay on Arrival (Cash)</p>
                <p className="text-xs text-black-muted">Available for stays & local transport</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Preferences Button */}
        <div className="pt-4 border-t border-white-soft">
          <button className="w-full bg-purple text-white rounded-xl py-3.5 font-semibold hover:bg-purple-hover transition shadow-md shadow-purple/20">
            Save payment preferences
          </button>
        </div>
      </div>
    </div>
  );
}
