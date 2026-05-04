"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Loader as Loader2,
  CircleCheck as CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function PaymentPage() {
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [method, setMethod] = useState<"card" | "mobile">("card");

  async function handlePay() {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPaying(false);
    setPaid(true);
    toast.success("Payment successful! Your booking is confirmed.");
  }

  if (paid) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-display">Booking confirmed</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your payment was processed securely via DPO. A confirmation email has been sent with
              your booking details.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                className="bg-[image:var(--gradient-hero)] hover:opacity-95"
                onClick={() => router.push("/booking/confirmation")}
              >
                View confirmation
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to review
        </Link>

        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Payment</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight font-display">Complete checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Secure payment powered by DPO Paygate.
          </p>
        </header>

        {/* Payment method selector */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMethod("card")}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-[var(--transition-smooth)] ${
              method === "card"
                ? "border-primary bg-primary-soft/30 ring-1 ring-primary/20"
                : "border-border/60 hover:border-primary/40"
            }`}
          >
            <CreditCard
              className={`h-5 w-5 ${method === "card" ? "text-primary" : "text-muted-foreground"}`}
            />
            <span className={`text-sm font-semibold ${method === "card" ? "text-primary" : ""}`}>
              Card
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMethod("mobile")}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-[var(--transition-smooth)] ${
              method === "mobile"
                ? "border-primary bg-primary-soft/30 ring-1 ring-primary/20"
                : "border-border/60 hover:border-primary/40"
            }`}
          >
            <Smartphone
              className={`h-5 w-5 ${method === "mobile" ? "text-primary" : "text-muted-foreground"}`}
            />
            <span className={`text-sm font-semibold ${method === "mobile" ? "text-primary" : ""}`}>
              Mobile Money
            </span>
          </button>
        </div>

        {/* Card form */}
        {method === "card" && (
          <Card className="mt-4 border-border/60">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="card-number">Card number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM / YY" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" className="h-11" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="card-name">Name on card</Label>
                <Input id="card-name" placeholder="Full name" className="h-11" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile money form */}
        {method === "mobile" && (
          <Card className="mt-4 border-border/60">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Provider</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["MTN Mobile Money", "Airtel Money"].map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      className="rounded-xl border border-border/60 p-3 text-xs font-semibold hover:border-primary/40 transition-[var(--transition-smooth)]"
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" placeholder="+260 XX XXX XXXX" className="h-11" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security notice */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          <span>Encrypted and processed by DPO Paygate. We never store your card details.</span>
        </div>

        <Separator className="my-6" />

        <Button
          onClick={handlePay}
          disabled={paying}
          className="w-full bg-[image:var(--gradient-hero)] hover:opacity-95 h-12 text-base"
        >
          {paying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" /> Pay now
            </>
          )}
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          By paying you agree to the cancellation policy and house rules.
        </p>
      </main>
      <Footer />
    </div>
  );
}
