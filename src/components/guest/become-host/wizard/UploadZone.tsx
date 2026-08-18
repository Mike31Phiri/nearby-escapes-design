"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadedDoc } from "./onboarding";

interface UploadZoneProps {
  title: string;
  description: string;
  accept?: string;
  docs: UploadedDoc[];
  onDocsChange: (docs: UploadedDoc[]) => void;
  error?: string;
}

const ACCEPT_DEFAULT = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadZone({
  title,
  description,
  accept,
  docs,
  onDocsChange,
  error,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (files: FileList | File[]) => {
    if (!files.length) return;
    const next = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      size: file.size,
    }));
    // Append to the existing list — dedupe by name+size so re-selecting the
    // same file doesn't create duplicates.
    const merged = [...docs, ...next].filter(
      (doc, idx, arr) => arr.findIndex((d) => d.name === doc.name && d.size === doc.size) === idx,
    );
    onDocsChange(merged);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeDoc = (id: string) => {
    onDocsChange(docs.filter((doc) => doc.id !== id));
  };

  return (
    <div className="space-y-2.5">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          dragging
            ? "border-purple bg-purple/5"
            : "border-border bg-white-soft hover:border-purple/40 hover:bg-purple/[0.03]",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept ?? ACCEPT_DEFAULT}
          multiple
          className="hidden"
          onChange={handleInput}
        />
        <UploadCloud className="h-8 w-8 mx-auto text-black-subtle mb-2" />
        <p className="text-sm font-bold text-black">{dragging ? "Drop files to upload" : title}</p>
        <p className="text-xs text-black-muted mt-1">
          {dragging ? description : `${description} — click or drag & drop`}
        </p>
      </div>

      {docs.length > 0 && (
        <ul className="space-y-2">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-white px-3 py-2.5 card-shadow"
            >
              <div className="h-8 w-8 rounded-lg bg-black/5 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-black truncate">{doc.name}</p>
                <p className="text-[11px] text-black-subtle">{formatSize(doc.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeDoc(doc.id)}
                aria-label={`Remove ${doc.name}`}
                className="h-7 w-7 rounded-full flex items-center justify-center text-black-subtle hover:bg-destructive/5 hover:text-destructive transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-[11px] font-medium text-destructive">{error}</p>}
    </div>
  );
}
