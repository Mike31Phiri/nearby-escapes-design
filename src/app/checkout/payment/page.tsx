"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock, ShieldCheck, CreditCard,
  ChevronRight, CheckCircle2, Info,
  Smartphone, ChevronDown, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── DPO Group Integration Config ────────────────────────────────────────────
// Replace with real values from your DPO Group merchant account.
// See: https://developers.dpogroup.com/
const DPO_CONFIG = {
  companyToken: process.env.NEXT_PUBLIC_DPO_COMPANY_TOKEN ?? "YOUR_COMPANY_TOKEN",
  serviceType: process.env.NEXT_PUBLIC_DPO_SERVICE_TYPE ?? "YOUR_SERVICE_TYPE",
  paymentUrl: "https://secure.3gdirectpay.com/API/v6/",
  redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/checkout/success`,
  backUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/checkout/payment`,
  currency: "ZMW",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentMethod = "card" | "mobile";
type MobileNetwork = "airtel" | "mtn" | "zamtel";

interface CardForm {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

interface MobileForm {
  network: MobileNetwork | "";
  phone: string;
}

interface FormErrors {
  number?: string;
  name?: string;
  expiry?: string;
  cvv?: string;
  phone?: string;
  network?: string;
}

// ─── Validation helpers ───────────────────────────────────────────────────────
function validateCard(form: CardForm): FormErrors {
  const errors: FormErrors = {};
  const digits = form.number.replace(/\s/g, "");
  if (!digits || digits.length < 16) errors.number = "Enter a valid 16-digit card number";
  if (!form.name.trim()) errors.name = "Name on card is required";
  if (!form.expiry.match(/^\d{2}\/\d{2}$/)) errors.expiry = "Use MM/YY format";
  if (!form.cvv.match(/^\d{3,4}$/)) errors.cvv = "Enter a valid CVV";
  return errors;
}

function validateMobile(form: MobileForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.network) errors.network = "Select a mobile network";
  if (!form.phone.match(/^(\+?260|0)\d{9}$/)) errors.phone = "Enter a valid Zambian phone number";
  return errors;
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 2) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

// ─── Page component ───────────────────────────────────────────────────────────
export default function DPOPaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardForm, setCardForm] = useState<CardForm>({ number: "", name: "", expiry: "", cvv: "" });
  const [mobileForm, setMobileForm] = useState<MobileForm>({ network: "", phone: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [processing, setProcessing] = useState(false);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);

  const networks: { id: MobileNetwork; label: string; color: string }[] = [
    { id: "airtel", label: "Airtel Money", color: "bg-red-500" },
    { id: "mtn", label: "MTN Money", color: "bg-yellow-500" },
    { id: "zamtel", label: "Zamtel Kwacha", color: "bg-green-600" },
  ];

  /**
   * Initiates a DPO Group transaction.
   * Production flow:
   * 1. POST to your backend /api/payments/dpo/create-token with booking details
   * 2. Backend calls DPO createToken API → returns transToken
   * 3. Redirect to DPO payment page: https://secure.3gdirectpay.com/payv2.php?ID={transToken}
   * 4. DPO redirects back to redirectUrl on success/failure
   */
  const initiateDPOPayment = async () => {
    // TODO: Replace with real API call to your backend
    // const res = await fetch("/api/payments/dpo/create-token", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     amount: 4645.00,
    //     currency: DPO_CONFIG.currency,
    //     serviceType: DPO_CONFIG.serviceType,
    //     redirectUrl: DPO_CONFIG.redirectUrl,
    //     backUrl: DPO_CONFIG.backUrl,
    //     customerName: cardForm.name || mobileForm.phone,
    //     paymentMethod,
    //     phone: mobileForm.phone,
    //     network: mobileForm.network,
    //   }),
    // });
    // const { transToken } = await res.json();
    // window.location.href = `https://secure.3gdirectpay.com/payv2.php?ID=${transToken}`;

    // ── Demo: Simulate payment for MVP ─────────────────────────────────────
    await new Promise((r) => setTimeout(r, 2500));
    window.location.href = "/checkout/success";
  };

  const handlePay = async () => {
    const errs = paymentMethod === "card"
      ? validateCard(cardForm)
      : validateMobile(mobileForm);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setProcessing(true);
    try {
      await initiateDPOPayment();
    } catch {
      setProcessing(false);
      setErrors({ number: "Payment failed. Please try again or contact support." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground mb-10 flex-wrap">
          <span className="text-emerald-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Trip Details</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-emerald-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Summary</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-black">Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* ── Left: Payment form ── */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Confirm and Pay</h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Secure checkout powered by DPO Group
              </p>
            </div>

            {/* Method Toggle */}
            <div className="flex bg-muted/50 p-1.5 rounded-2xl gap-1">
              <button
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-black transition-all duration-300",
                  paymentMethod === "card"
                    ? "bg-background shadow-md text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CreditCard className="h-5 w-5" /> Card Payment
              </button>
              <button
                onClick={() => setPaymentMethod("mobile")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-black transition-all duration-300",
                  paymentMethod === "mobile"
                    ? "bg-background shadow-md text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Smartphone className="h-5 w-5" /> Mobile Money
              </button>
            </div>

            {/* ── Card Form ── */}
            {paymentMethod === "card" && (
              <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden animate-in fade-in duration-300">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/40 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <span className="font-black text-lg">Credit or Debit Card</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain" />
                  </div>
                </div>
                <CardContent className="p-6 md:p-8 space-y-5">
                  {/* Card Number */}
                  <div className="space-y-2">
                    <Label htmlFor="card-number" className="font-bold">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="card-number"
                        value={cardForm.number}
                        onChange={(e) => setCardForm((p) => ({ ...p, number: formatCardNumber(e.target.value) }))}
                        placeholder="0000 0000 0000 0000"
                        className={cn("rounded-xl h-12 pl-12 font-mono tracking-wider", errors.number && "border-destructive")}
                        maxLength={19}
                        inputMode="numeric"
                      />
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground/50" />
                    </div>
                    {errors.number && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{errors.number}</p>}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="font-bold">Expiration Date</Label>
                      <Input
                        id="expiry"
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                        placeholder="MM / YY"
                        className={cn("rounded-xl h-12", errors.expiry && "border-destructive")}
                        maxLength={5}
                        inputMode="numeric"
                      />
                      {errors.expiry && <p className="text-xs text-destructive">{errors.expiry}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="font-bold">CVV</Label>
                      <div className="relative">
                        <Input
                          id="cvv"
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                          placeholder="123"
                          className={cn("rounded-xl h-12 pr-12", errors.cvv && "border-destructive")}
                          maxLength={4}
                          inputMode="numeric"
                          type="password"
                        />
                        <Info className="absolute right-4 top-3.5 h-5 w-5 text-muted-foreground/50 cursor-help" />
                      </div>
                      {errors.cvv && <p className="text-xs text-destructive">{errors.cvv}</p>}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="card-name" className="font-bold">Name on Card</Label>
                    <Input
                      id="card-name"
                      value={cardForm.name}
                      onChange={(e) => setCardForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="John Mwine"
                      className={cn("rounded-xl h-12", errors.name && "border-destructive")}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── Mobile Money Form ── */}
            {paymentMethod === "mobile" && (
              <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden animate-in fade-in duration-300">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-b border-border/40 p-6 flex items-center gap-3">
                  <Smartphone className="h-6 w-6 text-emerald-600" />
                  <span className="font-black text-lg">Mobile Money</span>
                </div>
                <CardContent className="p-6 md:p-8 space-y-5">
                  {/* Network selector */}
                  <div className="space-y-2">
                    <Label className="font-bold">Mobile Network</Label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowNetworkMenu(!showNetworkMenu)}
                        className={cn(
                          "w-full h-12 px-4 rounded-xl border text-left flex items-center justify-between font-medium transition-colors",
                          errors.network ? "border-destructive" : "border-input",
                          "hover:border-primary focus:border-primary"
                        )}
                      >
                        {mobileForm.network ? (
                          <span className="flex items-center gap-3">
                            <span className={cn("h-3 w-3 rounded-full", networks.find(n => n.id === mobileForm.network)?.color)} />
                            {networks.find(n => n.id === mobileForm.network)?.label}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Select network</span>
                        )}
                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showNetworkMenu && "rotate-180")} />
                      </button>
                      {showNetworkMenu && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-20">
                          {networks.map((net) => (
                            <button
                              key={net.id}
                              type="button"
                              onClick={() => { setMobileForm(p => ({ ...p, network: net.id })); setShowNetworkMenu(false); }}
                              className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-muted/50 text-sm font-bold transition-colors text-left"
                            >
                              <span className={cn("h-3 w-3 rounded-full flex-shrink-0", net.color)} />
                              {net.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.network && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{errors.network}</p>}
                  </div>

                  {/* Phone number */}
                  <div className="space-y-2">
                    <Label htmlFor="mobile-phone" className="font-bold">Phone Number</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-sm font-bold text-muted-foreground">+260</span>
                      <Input
                        id="mobile-phone"
                        value={mobileForm.phone}
                        onChange={(e) => setMobileForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="97 123 4567"
                        className={cn("rounded-xl h-12 pl-16", errors.phone && "border-destructive")}
                        inputMode="tel"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{errors.phone}</p>}
                  </div>

                  <div className="bg-muted/30 rounded-2xl p-4 flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      You will receive a USSD prompt on your phone to confirm the payment. Ensure you have sufficient balance on your mobile money account before proceeding.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pay Button */}
            <Button
              onClick={handlePay}
              disabled={processing}
              className="w-full h-16 rounded-2xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-xl font-black text-xl flex items-center justify-center gap-3 transition-all"
            >
              {processing ? (
                <>
                  <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {paymentMethod === "mobile" ? "Sending prompt..." : "Processing..."}
                </>
              ) : (
                <>
                  Pay ZMW 4,645.00 <Lock className="h-5 w-5" />
                </>
              )}
            </Button>

            {/* Trust logos */}
            <div className="flex items-center justify-center gap-8 py-2 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-widest">256-bit SSL</span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">PCI DSS Compliant</span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Powered by DPO Group</span>
            </div>
          </div>

          {/* ── Right: Sticky order summary ── */}
          <div className="lg:col-span-2">
            <Card className="sticky top-28 border-border/60 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-muted/30 border-b border-border/40 p-6">
                <h3 className="font-black text-lg">Order Summary</h3>
              </div>
              <CardContent className="p-6 space-y-6">
                {/* Listing preview */}
                <div className="flex gap-4">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                    <img
                      src="https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=200&h=200"
                      alt="Listing"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-black leading-tight">Victoria Falls Waterfront Lodge</p>
                    <p className="text-sm text-muted-foreground mt-1">Standard Chalet</p>
                    <p className="text-sm text-muted-foreground">May 15 – 20 · 2 Guests</p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 pt-4 border-t border-border/50 text-sm">
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Base fare (5 nights)</span>
                    <span>ZMW 4,250.00</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>ZMW 245.00</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>ZMW 150.00</span>
                  </div>
                  <div className="flex justify-between font-black text-lg pt-4 border-t border-border/50">
                    <span>Total (ZMW)</span>
                    <span className="text-primary">ZMW 4,645.00</span>
                  </div>
                </div>

                {/* Security note */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Your payment is held securely. Funds are only released to the host 24 hours after check-in.
                  </p>
                </div>

                {/* Cancel link */}
                <div className="text-center">
                  <Link href="/checkout/summary">
                    <button className="text-xs text-muted-foreground underline hover:text-foreground transition-colors">
                      Cancel and return to summary
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
