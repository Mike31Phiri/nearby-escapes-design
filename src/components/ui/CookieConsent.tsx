"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

const COOKIE_CONSENT_KEY = "ne_cookie_consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Small delay so it slides in gracefully without jarring page load
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage access errors
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
      aria-label="Cookie consent"
      role="region"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-4 sm:p-4.5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-purple/10 text-purple flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="h-4 w-4" />
          </div>
          <div className="flex-1 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            We use cookies to enhance your browsing experience, personalize content, and analyze our traffic.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800/60">
          <button
            type="button"
            onClick={() => handleChoice("denied")}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Deny
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-purple hover:bg-purple/90 rounded-lg shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            Accept
          </button>
        </div>
      </div>
    </aside>
  );
}
