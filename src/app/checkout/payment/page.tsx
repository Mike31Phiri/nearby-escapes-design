"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldCheck, CreditCard, ChevronRight, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PaymentPage() {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      window.location.href = "/checkout/success";
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground mb-8">
          <span className="text-emerald-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Trip Details</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-emerald-600 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Summary</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Confirm and Pay</h1>
              <p className="text-muted-foreground">Secure checkout powered by DPO Group</p>
            </div>

            <Card className="border-border/60 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border/40 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl font-bold">Credit or Debit Card</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <div className="relative">
                    <Input id="card-number" placeholder="0000 0000 0000 0000" className="rounded-xl h-12 pl-12" required />
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground/50" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiration Date</Label>
                    <Input id="expiry" placeholder="MM / YY" className="rounded-xl h-12" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <div className="relative">
                      <Input id="cvv" placeholder="123" className="rounded-xl h-12" required />
                      <Info className="absolute right-4 top-3.5 h-5 w-5 text-muted-foreground/50 cursor-help" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input id="card-name" placeholder="John Mwine" className="rounded-xl h-12" required />
                </div>
                
                <div className="pt-4">
                   <Button 
                    onClick={handlePay}
                    disabled={processing}
                    className="w-full h-14 rounded-2xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-lg font-extrabold text-lg flex items-center justify-center gap-3 transition-all"
                  >
                    {processing ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ZMW 4,645.00 <Lock className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-8 py-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              <img src="https://www.dpogroup.com/wp-content/uploads/2021/04/DPO-Logo-1.png" alt="DPO" className="h-8" />
              <div className="h-8 w-[1px] bg-border" />
              <div className="flex items-center gap-2 font-bold text-xs">
                <ShieldCheck className="h-5 w-5" />
                SECURE 256-BIT SSL
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <Card className="sticky top-32 border-border/60 bg-muted/20 rounded-3xl overflow-hidden p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between pb-6 border-b border-border/40">
                  <h3 className="text-xl font-bold">Total to pay</h3>
                  <span className="text-2xl font-extrabold text-primary">ZMW 4,645.00</span>
                </div>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src="https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=200&h=200" alt="Listing" className="h-full w-full object-cover" />
                    </div>
                    <div className="text-sm">
                      <p className="font-bold">Victoria Falls Waterfront Lodge</p>
                      <p className="text-muted-foreground mt-1">May 15 – 20, 2024 • 2 Guests</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-border/40 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Original Price</span>
                      <span>ZMW 4,250.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nearby Escapes Fee</span>
                      <span>ZMW 245.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>ZMW 150.00</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/checkout/failed">
                    <p className="text-center text-xs text-muted-foreground underline hover:text-foreground cursor-pointer transition-colors">
                      Cancel and return to summary
                    </p>
                  </Link>
                </div>
             </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
