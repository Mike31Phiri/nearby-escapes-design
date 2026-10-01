"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomBulletListProps {
  items?: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
  onRemove: (item: string) => void;
  isDanger?: boolean;
}

export function CustomBulletList({
  items,
  selectedItems,
  onToggle,
  onRemove,
  isDanger = false,
}: CustomBulletListProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {items.map((custom) => {
        const isSelected = selectedItems.includes(custom);
        return (
          <span
            key={custom}
            onClick={() => onToggle(custom)}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border select-none",
              isSelected
                ? isDanger
                  ? "border-rose-500 bg-rose-50 text-rose-700 font-semibold shadow-xs"
                  : "border-purple bg-purple/10 text-purple font-semibold shadow-xs"
                : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full shrink-0",
                isSelected
                  ? isDanger
                    ? "bg-rose-600"
                    : "bg-purple"
                  : "bg-neutral-400",
              )}
            />
            <span>{custom}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(custom);
              }}
              className={cn(
                "ml-1 -mr-0.5 p-0.5 rounded-full text-neutral-400 transition-colors cursor-pointer",
                isDanger
                  ? "hover:text-rose-600 hover:bg-rose-100/60"
                  : "hover:text-neutral-700 hover:bg-neutral-200/60",
              )}
              title={`Remove ${custom}`}
              aria-label={`Remove ${custom}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        );
      })}
    </div>
  );
}
