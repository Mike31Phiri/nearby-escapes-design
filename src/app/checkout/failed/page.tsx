"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, RefreshCcw, Headset, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 py-20">
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Card className="border-border/60 shadow-2xl rounded-[40px] overflow-hidden">
            <CardContent className="p-10 md:p-16 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Payment Failed</h1>
              <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
                Unfortunately, your payment could not be processed. This might be due to insufficient funds, an expired card, or a temporary issue with your bank.
              </p>

              <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8 mb-12 text-left space-y-4">
                <h3 className="font-bold text-red-900 flex items-center gap-2">
                  Possible reasons:
                </h3>
                <ul className="space-y-2 text-sm text-red-800/80 list-disc pl-5">
                  <li>Your card has insufficient funds</li>
                  <li>The payment was declined by your bank for security</li>
                  <li>The CVV code or expiry date was entered incorrectly</li>
                  <li>Temporary connection issue with DPO payment gateway</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/checkout/payment" className="w-full sm:w-auto">
                  <Button className="w-full h-14 rounded-2xl px-10 bg-primary font-extrabold text-lg flex items-center gap-2 shadow-lg">
                    <RefreshCcw className="h-5 w-5" /> Try again
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full h-14 rounded-2xl px-10 border-2 font-extrabold text-lg flex items-center gap-2">
                    <Headset className="h-5 w-5" /> Contact Support
                  </Button>
                </Link>
              </div>

              <div className="mt-12 pt-12 border-t border-border/40">
                <p className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-widest">Or reach us on WhatsApp</p>
                <Link href="https://wa.me/260971234567" target="_blank">
                  <Button variant="outline" className="rounded-full px-8 h-12 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/5 font-bold flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 fill-[#25D366]" /> Chat on WhatsApp
                  </Button>
                </Link>
              </div>
              
              <Link href="/checkout/summary" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Return to summary
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
