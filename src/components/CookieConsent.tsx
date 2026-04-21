import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const KEY = "ne.cookieConsent";

type Choice = "accepted" | "rejected";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (!v) setVisible(true);
    } catch {
      // no-op (private mode etc.)
    }
  }, []);

  const persist = (choice: Choice) => {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      // no-op
    }
    setVisible(false);
    // Dispatch a window event so analytics integrations can react when added
    window.dispatchEvent(new CustomEvent("ne:cookie-consent", { detail: choice }));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 p-4 shadow-[var(--shadow-elegant)] backdrop-blur md:p-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Cookie className="h-4 w-4" />
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            We use essential cookies to make the site work and optional analytics cookies to improve it.{" "}
            <Link to="/legal/cookies" className="font-medium text-primary underline">
              Learn more
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => persist("rejected")}>
            Reject
          </Button>
          <Button
            size="sm"
            className="bg-[image:var(--gradient-hero)] hover:opacity-95"
            onClick={() => persist("accepted")}
          >
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
