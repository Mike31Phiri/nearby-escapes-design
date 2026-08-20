"use client";

interface FilterChip {
  label: string;
  onRemove: () => void;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onClearAll?: () => void;
}

export function FilterChips({ chips, onClearAll }: FilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 bg-[#f2ba0d] text-white text-sm font-semibold px-4.5 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 shadow-xs"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            aria-label={`Remove ${chip.label} filter`}
            className="hover:opacity-70 transition-opacity leading-none"
          >
            ×
          </button>
        </span>
      ))}
      {chips.length >= 2 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-sm text-[#1f1433] font-semibold whitespace-nowrap flex-shrink-0 underline underline-offset-2 hover:text-[#1f1433] transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
