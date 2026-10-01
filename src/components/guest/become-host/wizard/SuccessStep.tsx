"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Mail, ShieldCheck, Clock, Loader2, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

interface SuccessStepProps {
  businessName: string;
  onFinish?: () => void;
}

export function SuccessStep({
  businessName,
  onFinish,
}: SuccessStepProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleDashboardClick = () => {
    setIsNavigating(true);
    if (onFinish) {
      onFinish();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 text-center py-4">
      <div className="inline-flex h-16 w-16 rounded-full bg-purple/10 items-center justify-center mb-4 text-purple">
        <CheckCircle2 className="h-8 w-8 text-purple" strokeWidth={2} />
      </div>

      <span className="text-[11px] font-semibold uppercase tracking-wider text-purple mb-1 block">
        Application Received
      </span>
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-2">
        You're almost there!
      </h1>
      <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed mb-6">
        Thanks, <span className="font-semibold text-neutral-900">{businessName}</span>. Your business verification documents (PACRA, proof of ownership & operation) have been submitted for review.
      </p>

      <div className="max-w-md mx-auto text-left mb-8 rounded-xl border border-neutral-200/80 bg-neutral-50/50 divide-y divide-neutral-200/60">
        {[
          { icon: ShieldCheck, text: "Our compliance team verifies your PACRA & ownership documents within 1–3 business days" },
          { icon: Mail, text: "You'll receive an email notification as soon as your host account is approved" },
          { icon: Clock, text: "Once approved, you can immediately begin creating listings across Stays, Experiences, and Transport" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-3 p-3.5">
            <Icon className="h-4 w-4 text-purple shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-600 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center">
        <Link
          href={ROUTES.host.dashboard}
          prefetch={true}
          onClick={handleDashboardClick}
          className="w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs bg-purple text-white hover:bg-purple-hover active:scale-98"
        >
          {isNavigating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Opening Dashboard...</span>
            </>
          ) : (
            <>
              <span>Go to Host Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
