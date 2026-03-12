"use client";

import BrandBox from "@/app/components/brand-box";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import { cn } from "@/lib/utils";
import type { CommunityServiceFilter, CommunityServiceValue } from "../_types";

type BrandTabsProps =
  | {
      value: CommunityServiceFilter;
      onChange: (value: CommunityServiceFilter) => void;
      includeAll?: true;
    }
  | {
      value: CommunityServiceValue;
      onChange: (value: CommunityServiceValue) => void;
      includeAll: false;
    };

export default function BrandTabs(props: BrandTabsProps) {
  const { value, onChange, includeAll = true } = props;
  const brandTabs = [
    ...(includeAll ? [{ key: "all", label: "전체" }] : []),
    ...Object.entries(subscriptableBrand).map(([key, brand]) => ({
      key,
      label: brand.label,
    })),
  ];

  return (
    <div
      className="tab-wrap flex gap-2 overflow-x-auto mt-5 ml-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      onWheel={(event) => {
        event.currentTarget.scrollLeft += event.deltaY;
      }}
    >
      {brandTabs.map((tab) => {
        const isActive = value === tab.key;

        if (tab.key === "all") {
          return (
            <button
              key={tab.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange("all")}
              className={cn(
                "flex min-w-fit flex-col items-center gap-2 transition-opacity"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl border",
                  isActive
                    ? "border-brand-primary bg-brand-primary text-white"
                    : "border-gray-100 bg-white text-gray-400"
                )}
              >
                전체
              </div>
              <span
                className={cn(
                  "text-sm leading-[110%]",
                  isActive ? "font-semibold text-black" : "text-black"
                )}
              >
                전체
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.key as CommunityServiceValue)}
            className={cn(
              "flex min-w-fit max-w-12 flex-col items-center gap-2 transition-opacity"
            )}
          >
            <BrandBox
              brandType={tab.key as keyof typeof subscriptableBrand}
              size="sm"
              isActive={isActive}
            />
            <span
              className={cn(
                "max-w-12 text-center text-sm leading-[110%] whitespace-normal break-keep",
                isActive ? "font-semibold text-black" : "text-black"
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
