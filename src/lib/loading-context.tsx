"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

//Context ────────────────────────────────────────────────────────────

interface LoadingContextValue {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextValue>({
  isLoading: false,
  setLoading: () => {},
  loadingMessage: "",
  setLoadingMessage: () => {},
});

export function useLoading() {
  return useContext(LoadingContext);
}

//Provider ───────────────────────────────────────────────────────────

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingMessage, setLoadingMessage }}>
      {children}
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
    </LoadingContext.Provider>
  );
}

//Overlay ────────────────────────────────────────────────────────────

function LoadingOverlay({ isLoading, message }: { isLoading: boolean; message: string }) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center",
        "bg-background/80 backdrop-blur-sm",
        "animate-in fade-in duration-200",
      )}
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card border border-border/50 p-8 shadow-xl">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
          <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
          <Loader2 className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
        </div>
        {message && (
          <p className="text-sm font-semibold text-foreground text-center max-w-[200px]">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

//Action Helper ──────────────────────────────────────────────────────
// Wraps an async action with loading state and optional message/reset

export function withLoading<T>(
  setLoading: (v: boolean) => void,
  setMessage: (m: string) => void,
  fn: () => Promise<T> | T,
  message?: string,
): Promise<T> {
  setMessage(message ?? "");
  setLoading(true);
  return Promise.resolve(fn()).finally(() => {
    setLoading(false);
    setMessage("");
  });
}
