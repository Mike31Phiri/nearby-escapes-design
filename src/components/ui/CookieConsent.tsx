"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck } from "lucide-react";

const COOKIE_CONSENT_KEY = "ne_cookie_consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Subtle delay to avoid interfering with initial page render
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage restrictions
    }
  }, []);

  const handleChoice = (choice: "accepted" | "denied") => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      role="region"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-[420px] z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 select-none"
    >
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Title & Icon Header */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
            <Cookie className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white leading-tight flex items-center gap-1.5">
              <span>Cookie &amp; Privacy Preferences</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Nearby Escapes respects your privacy and transparency
            </p>
          </div>
        </div>

        {/* Informative Body Text with clear transparency on what is accepted */}
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
          We use essential cookies for secure login authentication and checkout reservations. With your permission, we also use analytical cookies to improve platform speed and personalized recommendations. Review our{" "}
          <Link
            href="/privacy"
            className="text-purple dark:text-purple-300 font-semibold underline underline-offset-2 hover:text-purple-hover"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/terms"
            className="text-purple dark:text-purple-300 font-semibold underline underline-offset-2 hover:text-purple-hover"
          >
            Terms of Service
          </Link>
          .
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => handleChoice("denied")}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            Deny Non-Essential
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="px-5 py-2 text-xs font-bold text-white bg-purple hover:bg-purple-hover rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
