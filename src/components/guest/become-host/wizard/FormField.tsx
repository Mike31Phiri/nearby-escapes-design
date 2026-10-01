"use client";

import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-800">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {hint && !error && (
          <span className="text-[11px] text-neutral-400">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1 mt-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
