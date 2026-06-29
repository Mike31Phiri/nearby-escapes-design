"use client";

import { WifiOff } from "lucide-react";
import { useUIStore } from "@/lib/store/uiStore";
import { useEffect } from "react";

export function OfflineNotice() {
  const { isOffline, setOffline } = useUIStore();

  useEffect(() => {
    function onOnline() {
      setOffline(false);
    }
    function onOffline() {
      setOffline(true);
    }

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    // Initial check
    if (!navigator.onLine) {
      setOffline(true);
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [setOffline]);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-lg">
      <WifiOff className="h-4 w-4" />
      <span>You are currently offline. Check your connection.</span>
    </div>
  );
}
