"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, ShieldCheck, CreditCard, Smartphone, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

function DPOPayPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "DEMO-TOKEN-123";
  const ref = searchParams.get("ref") || "NE-2026-DEMO";
  const amount = searchParams.get("amount") || "750";
  const currency = searchParams.get("currency") || "ZMW";
  const callbackUrl = searchParams.get("callback") || `/checkout/confirmation?ref=${ref}&status=success&token=${token}`;

  const [method, setMethod] = useState<"card" | "momo">("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form mock fields
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [momoProvider, setMomoProvider] = useState("airtel");
  const [momoNumber, setMomoNumber] = useState("097 123 4567");

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);

      // Notify parent window (the checkout page holding this iframe)
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(
            {
              type: "DPO_PAYMENT_SUCCESS",
              token,
              ref,
              amount,
              currency,
            },
            "*",
          );
        }
      } catch (e) {
        console.error("postMessage error:", e);
      }

      // Redirect top-level window or iframe to callbackUrl after 800ms
      setTimeout(() => {
        if (window.top && window.top !== window) {
          window.top.location.href = callbackUrl;
        } else {
          window.location.href = callbackUrl;
        }
      }, 800);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f3f5f8] flex flex-col justify-between font-sans text-neutral-800 p-4 sm:p-6">
      <div className="max-w-md mx-auto w-full bg-white rounded-2xl border border-neutral-200 shadow-md overflow-hidden">
        {/* DPO Header */}
        <div className="bg-[#002f6c] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs tracking-wider">
              DPO
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Lock className="h-3 w-3" /> Secure Payment Gateway
              </div>
              <div className="text-sm font-semibold text-white/90">
                Nearby Escapes Zambia
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/70 uppercase font-mono">Total Due</div>
            <div className="text-base font-extrabold text-white">
              {currency} {Number(amount).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Transaction Reference strip */}
        <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <span>Booking Reference:</span>
          <span className="font-mono font-bold text-neutral-900">{ref}</span>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Payment Approved!</h3>
            <p className="text-xs text-neutral-600 max-w-xs mx-auto">
              Your transaction has been approved by DPO. Redirecting you to your confirmed booking...
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-purple font-medium pt-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Redirecting...</span>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Payment Method Switcher inside DPO */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-xl">
              <button
                type="button"
                onClick={() => setMethod("card")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  method === "card"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("momo")}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  method === "momo"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Mobile Money</span>
              </button>
            </div>

            {method === "card" ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 •••• •••• 8892"
                    className="w-full h-9 px-3 rounded-lg border border-neutral-300 text-xs font-mono font-medium focus:outline-none focus:border-[#002f6c]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="w-full h-9 px-3 rounded-lg border border-neutral-300 text-xs font-medium focus:outline-none focus:border-[#002f6c]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700">CVV / CVC</label>
                    <input
                      type="password"
                      maxLength={4}
                      defaultValue="321"
                      className="w-full h-9 px-3 rounded-lg border border-neutral-300 text-xs font-medium focus:outline-none focus:border-[#002f6c]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700">Select Provider</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "airtel", name: "Airtel" },
                      { id: "mtn", name: "MTN" },
                      { id: "zamtel", name: "Zamtel" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setMomoProvider(p.id)}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          momoProvider === p.id
                            ? "border-[#002f6c] bg-[#002f6c]/5 text-[#002f6c]"
                            : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700">Mobile Phone</label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-2.5 rounded-lg border border-neutral-300 bg-neutral-50 text-xs font-bold text-neutral-700">
                      🇿🇲 +260
                    </div>
                    <input
                      type="tel"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 text-xs font-medium focus:outline-none focus:border-[#002f6c]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DPO Pay Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={processing}
                onClick={handlePay}
                className="w-full h-11 rounded-xl bg-[#002f6c] hover:bg-[#00224f] active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-70 disabled:cursor-wait"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing with DPO...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span>Pay {currency} {Number(amount).toLocaleString()}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                  </>
                )}
              </button>
            </div>

            {/* Security footer */}
            <div className="pt-2 text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>PCI-DSS Level 1 Certified • 256-Bit SSL Encryption</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-[11px] text-neutral-400 mt-4">
        Direct Pay Online (DPO Group) is licensed and regulated as a Payment Service Provider.
      </div>
    </div>
  );
}

export default function DPOPayPageRoute() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading DPO Secure PayPage...</div>}>
      <DPOPayPageContent />
    </Suspense>
  );
}
