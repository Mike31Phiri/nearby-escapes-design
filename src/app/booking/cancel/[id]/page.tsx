"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function CancellationPage() {
  const params = useParams();
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState("");

  const handleCancel = () => {
    setStep(2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 md:px-6 py-12 md:py-20">
        <Link 
          href="/account/bookings" 
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to bookings
        </Link>

        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Cancel your booking</h1>
            <p className="text-muted-foreground text-lg mb-10">We&apos;re sorry you have to cancel. Please let us know why.</p>

            <div className="space-y-12">
              <section className="bg-red-50 p-8 rounded-3xl border border-red-100 flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900">Refund Policy</h3>
                  <p className="text-sm text-red-800/80 leading-relaxed mt-1">
                    Free cancellation until May 10. After that, you&apos;ll get a 50% refund, minus the service fee.
                  </p>
                  <p className="text-sm font-bold text-red-900 mt-4">Estimated refund: ZMW 2,125.00</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-bold tracking-tight">Reason for cancellation</h2>
                <RadioGroup onValueChange={setReason} className="space-y-4">
                  {[
                    "Plans changed / Trip cancelled",
                    "Found a better price elsewhere",
                    "Unforeseen circumstances (medical, family, etc.)",
                    "Safety concerns",
                    "Host asked to cancel",
                    "Other"
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-3 p-4 rounded-2xl border border-border/60 hover:bg-muted/30 transition-all cursor-pointer">
                      <RadioGroupItem value={item} id={item} />
                      <Label htmlFor={item} className="flex-1 font-bold cursor-pointer">{item}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </section>

              <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center gap-4">
                <Button 
                  onClick={handleCancel}
                  disabled={!reason}
                  className="w-full sm:w-auto h-14 rounded-2xl px-12 bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg shadow-lg"
                >
                  Confirm Cancellation
                </Button>
                <Link href="/account/bookings" className="w-full sm:w-auto">
                  <Button variant="ghost" className="w-full h-14 rounded-2xl px-12 font-bold">
                    Keep Booking
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 animate-in zoom-in fade-in duration-700">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Booking Cancelled</h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto">
              Your booking has been successfully cancelled. A refund of ZMW 2,125.00 has been initiated to your original payment method.
            </p>
            <Link href="/">
              <Button className="h-14 rounded-2xl px-12 bg-primary font-extrabold text-lg shadow-xl">
                Browse more escapes
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
