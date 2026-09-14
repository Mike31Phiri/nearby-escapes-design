"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FileDown, FileSpreadsheet, FileText, Loader2, X } from "lucide-react";

export type ExportFormat = "csv" | "pdf";

interface ExportStatementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** e.g. "July_2026_Payout" — used for the simulated download filename */
  fileNameBase: string;
  /** Build the CSV rows (header + data) when a real file is requested */
  csvContent: () => string;
  /** Short description shown in the modal header */
  description?: string;
}

type Phase = "pick" | "generating";

export function ExportStatementModal({
  open,
  onOpenChange,
  fileNameBase,
  csvContent,
  description = "Choose a format for your statement export.",
}: ExportStatementModalProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [phase, setPhase] = useState<Phase>("pick");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setPhase("pick");
      setFormat("csv");
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase !== "generating") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, onOpenChange]);

  if (!open) return null;

  const handleExport = () => {
    setPhase("generating");
    const extension = format;
    const filename = `${fileNameBase}.${extension}`;

    timerRef.current = setTimeout(() => {
      // Simulated file download — a real backend would stream the generated file.
      if (format === "csv") {
        const blob = new Blob(["\uFEFF" + csvContent()], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Mock PDF: emit a minimal placeholder payload so the download still fires.
        const blob = new Blob([`${fileNameBase}\n\n${csvContent().replace(/,/g, "\t")}`], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
      toast.success(`${filename} downloaded`);
      onOpenChange(false);
    }, 1200);
  };

  const options: { value: ExportFormat; label: string; hint: string; icon: typeof FileText }[] = [
    { value: "csv", label: "CSV", hint: "Spreadsheet-ready rows", icon: FileSpreadsheet },
    { value: "pdf", label: "PDF", hint: "Printable statement", icon: FileText },
  ];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Export statement"
    >
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-[2px]"
        onClick={() => (!phase || phase === "pick" ? onOpenChange(false) : undefined)}
      />
      <div className="relative w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple/10 text-purple flex items-center justify-center">
              <FileDown className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Download Statement</h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">{description}</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            disabled={phase === "generating"}
            className="h-8 w-8 rounded-lg hover:bg-neutral-100 text-neutral-500 flex items-center justify-center transition-colors disabled:opacity-40"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          {phase === "generating" ? (
            <div className="flex flex-col items-center py-10">
              <Loader2 className="h-7 w-7 text-purple animate-spin mb-4" />
              <p className="text-sm font-bold text-neutral-900">Generating file...</p>
              <p className="text-[11px] text-neutral-500 mt-1">
                Compiling {fileNameBase}.{format}
              </p>
            </div>
          ) : (
            <>
              {/* Format options */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {options.map((opt) => {
                  const Icon = opt.icon;
                  const selected = format === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFormat(opt.value)}
                      className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-all ${
                        selected
                          ? "border-purple bg-purple/5"
                          : "border-neutral-200/80 hover:border-purple/30"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${selected ? "text-purple" : "text-neutral-400"}`}
                      />
                      <span
                        className={`text-sm font-bold ${selected ? "text-purple" : "text-neutral-900"}`}
                      >
                        .{opt.label}
                      </span>
                      <span className="text-xs text-neutral-500">{opt.hint}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  className="flex-1 h-11 rounded-xl bg-purple hover:bg-purple-hover text-white text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <FileDown className="h-4 w-4" /> Generate {format.toUpperCase()}
                </button>
                <button
                  onClick={() => onOpenChange(false)}
                  className="h-11 px-5 rounded-xl border border-neutral-200/80 text-neutral-700 hover:bg-neutral-50 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
