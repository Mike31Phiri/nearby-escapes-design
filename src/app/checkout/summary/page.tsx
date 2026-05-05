"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Info, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";

export default function CheckoutSummaryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground mb-8">
          <span className="text-primary flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Trip Details</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Summary</span>
          <ChevronRight className="h-4 w-4" />
          <span>Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Review your summary</h1>
            
            <section className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">Guest details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input id="full-name" placeholder="John Mwine" className="rounded-xl h-12" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" placeholder="+260 97 123 4567" className="rounded-xl h-12" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="special-requests">Special requests (optional)</Label>
                <Textarea id="special-requests" placeholder="Any dietary requirements or accessibility needs?" className="rounded-xl min-h-[120px]" />
              </div>
            </section>

            <section className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-800">Your trip is protected</h3>
                <p className="text-sm text-emerald-700/80 leading-relaxed mt-1">
                  We verify all hosts and provide 24/7 support. Your payment is held securely and only released to the host 24 hours after check-in.
                </p>
              </div>
            </section>

            <div className="pt-8 flex flex-col md:flex-row items-center gap-6">
              <Link href="/checkout/payment" className="w-full md:w-auto">
                <Button className="w-full h-14 rounded-2xl px-12 bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-lg font-extrabold text-lg flex items-center justify-center gap-2">
                  Proceed to Payment <Lock className="h-5 w-5" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground max-w-xs text-center md:text-left">
                Secure 256-bit SSL encrypted payment gateway.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-border/60 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-6">Order Recap</h3>
                  <div className="flex gap-4">
                    <div className="h-20 w-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src="https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=200&h=200" alt="Listing" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold">Victoria Falls Waterfront Lodge</h4>
                      <p className="text-sm text-muted-foreground mt-1">Standard Chalet • 5 Nights</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-border/50">
                  <div className="flex justify-between font-medium">
                    <span>Base Fare</span>
                    <span>ZMW 4,250.00</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Service Fees</span>
                    <span>ZMW 245.00</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Taxes</span>
                    <span>ZMW 150.00</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-xl pt-4 border-t border-border/50 text-foreground">
                    <span>Total Price</span>
                    <span>ZMW 4,645.00</span>
                  </div>
                </div>

                <div className="bg-muted/30 p-6 rounded-2xl flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By proceeding, you agree that if the host accepts your request, your payment will be processed immediately.
                  </p>
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
