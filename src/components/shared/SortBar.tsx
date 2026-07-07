"use client";

interface SortBarProps {
  total: number;
  sortValue: string;
  onSortChange: (value: string) => void;
  locationLabel?: string;
}

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

export function SortBar({ total, sortValue, onSortChange, locationLabel }: SortBarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-base text-gray-500 font-medium">
        <span className="text-[#1f1433] font-bold">{total}</span>{" "}
        {locationLabel ? `stays in ${locationLabel}` : "stays"}
      </p>
      <select
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        className="text-base border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1f1433]/20 focus:border-[#1f1433] transition-colors cursor-pointer"
        aria-label="Sort results"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
