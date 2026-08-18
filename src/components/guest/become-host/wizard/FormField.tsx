"use client";

import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-black-soft">{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-black-muted mt-1">{hint}</p>}
      {error && (
        <p className="text-[11px] font-medium text-destructive flex items-center gap-1 mt-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
