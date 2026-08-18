"use client";

import { CheckCircle2, Sparkles, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessStepProps {
  businessName: string;
  listingLabel: string;
  subTypeLabel: string;
  onFinish: () => void;
}

export function SuccessStep({
  businessName,
  listingLabel,
  subTypeLabel,
  onFinish,
}: SuccessStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-6">
      <div className="inline-flex h-20 w-20 rounded-full bg-gold/15 items-center justify-center mb-6 relative">
        <div
          className="absolute inset-0 rounded-full bg-gold/15 animate-ping"
          style={{ animationDuration: "2s" }}
        />
        <CheckCircle2 className="h-10 w-10 text-gold relative" />
      </div>

      <p className="font-bold tracking-wide text-2xl text-gold mb-2">Almost there</p>
      <h1 className="font-display text-2xl md:text-4xl font-black tracking-tight text-purple mb-3">
        Application received!
      </h1>
      <p className="text-sm text-black-muted max-w-md mx-auto leading-relaxed mb-8">
        Thanks, <span className="font-bold text-black">{businessName}</span>. Your request to host{" "}
        <span className="font-bold text-black">{listingLabel.toLowerCase()}</span>
        {subTypeLabel ? (
          <>
            {" "}
            · <span className="font-bold text-black">{subTypeLabel}</span>
          </>
        ) : null}{" "}
        has been submitted for review.
      </p>

      <div className="max-w-md mx-auto text-left mb-8 rounded-xl border border-border bg-white-soft divide-y divide-border/60">
        {[
          { icon: ShieldCheck, text: "Our team verifies your documents within 1–3 business days" },
          { icon: Sparkles, text: "You'll get an email the moment your host account is approved" },
          { icon: Clock, text: "Then you can start creating listings and earning" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-3 p-3.5">
            <Icon className="h-4 w-4 text-black-muted shrink-0 mt-0.5" />
            <p className="text-sm text-black-muted leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <Button
        onClick={onFinish}
        className="bg-gold hover:bg-gold-hover text-black font-black uppercase tracking-widest h-12 px-10 rounded-xl shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all"
      >
        Go to my dashboard
      </Button>
    </div>
  );
}
