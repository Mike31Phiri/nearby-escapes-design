"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Printer, ArrowLeft, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function ReceiptPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <Link href="/checkout/success">
            <Button variant="ghost" className="gap-2 font-bold -ml-4 hover:bg-muted/50 rounded-2xl">
              <ArrowLeft className="h-4 w-4" /> Back to Booking
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 rounded-2xl border-2 font-bold h-10">
              <Download className="h-4 w-4" /> PDF
            </Button>
            <Button variant="outline" className="gap-2 rounded-2xl border-2 font-bold h-10" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div>
        </div>

        {/* The Receipt Document */}
        <Card id="receipt-document" className="border-border/60 shadow-xl rounded-[32px] overflow-hidden bg-white text-black">
          <div className="bg-emerald-600 px-8 py-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-1">Payment Receipt</h1>
              <p className="text-emerald-100 font-medium">Thank you for booking with Nearby Escapes</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs uppercase tracking-widest text-emerald-200 font-bold mb-1">Receipt Number</p>
              <p className="text-xl font-black">RCPT-NE84291</p>
              <p className="text-sm text-emerald-100 mt-1">May 05, 2026</p>
            </div>
          </div>

          <CardContent className="p-8 md:p-12">
            <div className="grid sm:grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Billed To</p>
                <p className="font-black text-lg">Mike Phiri</p>
                <p className="text-gray-600 mt-1">mike.phiri@example.com</p>
                <p className="text-gray-600 mt-1">+260 97 123 4567</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Method</p>
                <p className="font-black flex items-center sm:justify-end gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Airtel Money
                </p>
                <p className="text-gray-600 mt-1">Paid on May 05, 2026</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-3xl overflow-hidden mb-12">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between">
                <p className="font-black text-xs uppercase tracking-widest text-gray-500">Description</p>
                <p className="font-black text-xs uppercase tracking-widest text-gray-500">Amount</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-black text-lg mb-1">Victoria Falls Waterfront Lodge</p>
                    <p className="text-gray-600 text-sm">5 Nights (May 15 - May 20, 2026) · 2 Guests</p>
                  </div>
                  <p className="font-black whitespace-nowrap">ZMW 4,250.00</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-black mb-1">Cleaning Fee</p>
                  </div>
                  <p className="font-black whitespace-nowrap">ZMW 150.00</p>
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-black mb-1">Service Fee</p>
                  </div>
                  <p className="font-black whitespace-nowrap">ZMW 245.00</p>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-6 border-t border-gray-200 flex justify-between items-center">
                <p className="font-black text-gray-500 uppercase tracking-widest text-sm">Total Paid</p>
                <p className="font-black text-3xl text-emerald-600">ZMW 4,645.00</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-10 w-10 text-gray-300" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Secure Payment</p>
                  <p className="text-sm font-bold text-gray-600 mt-0.5">Processed by DPO Group</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-500 cursor-pointer hover:text-primary transition-colors">
                <HelpCircle className="h-4 w-4" /> Need help with this transaction?
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
