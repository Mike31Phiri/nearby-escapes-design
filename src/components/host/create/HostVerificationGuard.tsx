"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Clock, ShieldCheck, Settings } from "lucide-react";
import { useAuth } from "@/lib/store/authStore";
import { ROUTES } from "@/lib/constants/routes";
import { BackButton } from "@/components/shared/BackButton";

interface HostVerificationGuardProps {
  children: React.ReactNode;
}

export function HostVerificationGuard({ children }: HostVerificationGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  // If auth is still resolving, show subtle loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-neutral-400">
          <div className="w-8 h-8 rounded-full border-2 border-purple border-t-transparent animate-spin" />
          <p className="text-xs font-medium">Verifying host credentials...</p>
        </div>
      </div>
    );
  }

  // Check if host is verified
  // A host is verified if isHostVerified is true OR verificationStatus is 'VERIFIED'
  const isVerified = Boolean(
    user?.isHostVerified === true || user?.verificationStatus === "VERIFIED",
  );

  if (!isVerified) {
    const statusText = user?.verificationStatus ?? "UNVERIFIED";

    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 pt-8 pb-20">
            {/* Header navigation bar */}
            <div className="flex items-center justify-between mb-6">
              <BackButton fallback={ROUTES.host.dashboard} ariaLabel="Back to host overview" />
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                  Verification Required
                </span>
              </div>
            </div>

            <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xs p-6 sm:p-10 text-center">
              <div className="max-w-md mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
                  <ShieldAlert className="w-8 h-8" />
                </div>

                {/* Title & Description */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 leading-snug">
                    Host Verification Required
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
                    Your host account status is currently{" "}
                    <strong className="text-neutral-900 font-semibold lowercase">
                      {statusText}
                    </strong>
                    . You cannot create properties or host anything until your verification status is
                    reviewed and approved by administrators.
                  </p>
                </div>

                {/* Status card */}
                <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 text-left flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-neutral-900">Current Status</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {statusText}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      All new host listings remain locked until your identity and host profile are
                      verified to ensure safety and quality across Nearby Escapes.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href={ROUTES.host.dashboard}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold inline-flex items-center justify-center transition-colors shadow-2xs"
                  >
                    Go to Host Dashboard
                  </Link>
                  <Link
                    href={ROUTES.host.account}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl bg-purple text-white hover:bg-purple-hover text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Review Account Status
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If verified, proceed to the creation flow
  return <>{children}</>;
}
