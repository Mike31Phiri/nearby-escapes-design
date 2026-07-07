"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FilterConfig {
  id: string;
  label: string;
  type: "checkbox-group" | "price-range" | "toggle" | "radio-group";
  options?: { value: string; label: string; count?: number }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

interface VerticalFilterSidebarProps {
  filters: FilterConfig[];
  activeFilters: Record<string, any>;
  onChange: (filterId: string, value: any) => void;
  onReset: () => void;
}

function FilterSection({
  filter,
  activeValue,
  onChange,
  defaultOpen,
}: {
  filter: FilterConfig;
  activeValue: any;
  onChange: (value: any) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-100 pt-4 mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left mb-3 group"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-[#1f1433]">{filter.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-2">
          {filter.type === "checkbox-group" &&
            filter.options?.map((opt) => {
              const current: string[] = Array.isArray(activeValue) ? activeValue : [];
              const checked = current.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="flex items-center gap-2.5 cursor-pointer group/cb"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? current.filter((v) => v !== opt.value)
                        : [...current, opt.value];
                      onChange(next);
                    }}
                    className="h-4 w-4 rounded border-gray-300 accent-[#1f1433] cursor-pointer"
                    aria-label={opt.label}
                  />
                  <span className="text-base text-gray-700 group-hover/cb:text-[#1f1433] transition-colors flex-1">
                    {opt.label}
                  </span>
                  {opt.count !== undefined && (
                    <span className="text-sm text-gray-400">{opt.count}</span>
                  )}
                </label>
              );
            })}

          {filter.type === "radio-group" &&
            filter.options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group/rb">
                <input
                  type="radio"
                  name={filter.id}
                  value={opt.value}
                  checked={(activeValue ?? filter.options?.[0]?.value) === opt.value}
                  onChange={() => onChange(opt.value)}
                  className="h-4 w-4 accent-[#1f1433] cursor-pointer"
                  aria-label={opt.label}
                />
                <span className="text-base text-gray-700 group-hover/rb:text-[#1f1433] transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}

          {filter.type === "price-range" && (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Min
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                    {filter.unit ?? ""}
                  </span>
                  <input
                    type="number"
                    min={filter.min ?? 0}
                    max={filter.max ?? 9999}
                    step={filter.step ?? 1}
                    value={activeValue?.min ?? filter.min ?? 0}
                    onChange={(e) => onChange({ ...activeValue, min: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg py-1.5 pl-6 pr-2 text-base focus:outline-none focus:ring-2 focus:ring-[#1f1433]/20 focus:border-[#1f1433] transition-colors"
                    aria-label="Minimum price"
                  />
                </div>
              </div>
              <span className="text-gray-300 mt-4">—</span>
              <div className="flex-1">
                <label className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Max
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                    {filter.unit ?? ""}
                  </span>
                  <input
                    type="number"
                    min={filter.min ?? 0}
                    max={filter.max ?? 9999}
                    step={filter.step ?? 1}
                    value={activeValue?.max ?? filter.max ?? 9999}
                    onChange={(e) => onChange({ ...activeValue, max: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg py-1.5 pl-6 pr-2 text-base focus:outline-none focus:ring-2 focus:ring-[#1f1433]/20 focus:border-[#1f1433] transition-colors"
                    aria-label="Maximum price"
                  />
                </div>
              </div>
            </div>
          )}

          {filter.type === "toggle" && (
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-base text-gray-700">Enabled</span>
              <button
                role="switch"
                aria-checked={!!activeValue}
                onClick={() => onChange(!activeValue)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                  activeValue ? "bg-[#f2ba0d]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    activeValue ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          )}
        </div>
      )}
    </div>
  );
}

export function VerticalFilterSidebar({
  filters,
  activeFilters,
  onChange,
  onReset,
}: VerticalFilterSidebarProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-[#1f1433]">Filters</h2>
        <button
          onClick={onReset}
          className="text-base font-semibold text-[#1f1433] hover:text-[#b8942e] transition-colors"
        >
          Reset all
        </button>
      </div>

      {filters.map((filter, idx) => (
        <FilterSection
          key={filter.id}
          filter={filter}
          activeValue={activeFilters[filter.id]}
          onChange={(val) => onChange(filter.id, val)}
          defaultOpen={idx < 3}
        />
      ))}
    </div>
  );
}
