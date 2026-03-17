"use client";

import { cn } from "@/app/utils/class";

export interface FilterChipOption {
  label: string;
  value: string;
}

interface Props {
  options: FilterChipOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterChips({
  options,
  value,
  onChange,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 scrollbar-hide",
        className ?? ""
      )}
      aria-label="필터 선택"
    >
      <button
        type="button"
        aria-pressed={value === "all"}
        onClick={() => onChange("all")}
        className={cn(
          "shrink-0 rounded-xl px-3 py-2 body-lg transition-colors",
          value === "all"
            ? "bg-brand-primary text-white font-bold"
            : "bg-white text-gray-300 border border-gray-100"
        )}
      >
        전체
      </button>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "shrink-0 rounded-xl px-3 py-2 body-lg transition-colors",
              isSelected
                ? "bg-brand-primary text-white font-bold"
                : "bg-white text-gray-300 border border-gray-100"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
