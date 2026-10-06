"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, Check, ShieldCheck } from "lucide-react";

const COOKIE_CONSENT_KEY = "ne_cookie_consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage restrictions
    }
  }, []);

  const savePreferences = (options: { essential: true; analytics: boolean; marketing: boolean }) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(options));
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie Preferences"
      role="region"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-[360px] z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 select-none"
    >
      <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.16)] p-3.5 sm:p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
            <Cookie className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white leading-none flex items-center gap-1.5">
              Cookie Preferences
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">
              Choose which cookies you allow
            </p>
          </div>
        </div>

        {/* Granular Tick Options */}
        <div className="space-y-1.5 py-0.5">
          {/* 1. Essential (Always Active) */}
          <label className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 cursor-default">
            <div className="flex flex-col pr-2">
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 leading-tight">
                Essential
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                Logins, security &amp; bookings
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                Required
              </span>
              <div className="h-5 w-5 rounded-md bg-purple text-white flex items-center justify-center shrink-0 ml-1">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
            </div>
          </label>

          {/* 2. Analytics */}
          <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-purple/40 dark:hover:border-purple/50 transition-colors cursor-pointer">
            <div className="flex flex-col pr-2">
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 leading-tight">
                Analytics
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                Performance &amp; platform speed
              </span>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-neutral-300 text-purple focus:ring-purple cursor-pointer accent-purple shrink-0"
            />
          </label>

          {/* 3. Personalization */}
          <label className="flex items-center justify-between p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-purple/40 dark:hover:border-purple/50 transition-colors cursor-pointer">
            <div className="flex flex-col pr-2">
              <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 leading-tight">
                Personalization
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                Tailored stays &amp; trip offers
              </span>
            </div>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="h-4.5 w-4.5 rounded border-neutral-300 text-purple focus:ring-purple cursor-pointer accent-purple shrink-0"
            />
          </label>
        </div>

        {/* Privacy Note */}
        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-normal">
          Learn more in our{" "}
          <Link href="/privacy" className="underline hover:text-neutral-600 dark:hover:text-neutral-300">
            Privacy Policy
          </Link>
          .
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => savePreferences({ essential: true, analytics, marketing })}
            className="w-full py-1.5 px-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-xl transition-all active:scale-95 cursor-pointer text-center"
          >
            Save Choices
          </button>
          <button
            type="button"
            onClick={() => savePreferences({ essential: true, analytics: true, marketing: true })}
            className="w-full py-1.5 px-2 text-xs font-bold text-white bg-purple hover:bg-purple-hover rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer text-center"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
