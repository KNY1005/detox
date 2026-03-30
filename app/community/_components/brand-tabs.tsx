"use client";

import { useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import BrandBox from "@/app/components/brand-box";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import { cn } from "@/lib/utils";
import type { CommunityServiceFilter, CommunityServiceValue } from "../_types";

interface BrandTabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  labelClassName?: string;
}

type BrandTabsProps =
  | {
      value: CommunityServiceFilter;
      onChange?: (value: CommunityServiceFilter) => void;
      includeAll?: true;
    }
  | {
      value: CommunityServiceValue;
      onChange?: (value: CommunityServiceValue) => void;
      includeAll: false;
    };

function BrandTabButton({
  label,
  isActive,
  onClick,
  children,
  labelClassName,
}: BrandTabButtonProps) {
  return (
    <div className="shrink-0">
      <button
        type="button"
        aria-pressed={isActive}
        onClick={onClick}
        className={cn(
          "flex min-w-fit flex-col items-center gap-2 rounded-xl transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2"
        )}
      >
        {children}
        <span
          className={cn(
            "text-sm leading-[110%] text-black",
            isActive && "font-semibold",
            labelClassName
          )}
        >
          {label}
        </span>
      </button>
    </div>
  );
}

export default function BrandTabs(props: BrandTabsProps) {
  const { value, onChange, includeAll = true } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  const brandTabs = useMemo(
    () => [
      ...(includeAll ? [{ key: "all" as const, label: "전체" }] : []),
      ...Object.entries(subscriptableBrand).map(([key, brand]) => ({
        key: key as CommunityServiceValue,
        label: brand.label,
      })),
    ],
    [includeAll]
  );

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const activeIndex = brandTabs.findIndex((tab) => tab.key === value);

    if (activeIndex >= 0) {
      emblaApi.scrollTo(activeIndex);
    }
  }, [brandTabs, emblaApi, value]);

  return (
    <div className="mt-5" role="group" aria-label="커뮤니티 카테고리">
      <div
        ref={emblaRef}
        className="overflow-hidden [touch-action:pan-y_pinch-zoom]"
      >
        <div className="tab-wrap ml-6 mr-6 flex gap-2">
          {brandTabs.map((tab) => {
            const isActive = value === tab.key;

            if (tab.key === "all" && props.includeAll !== false) {
              return (
                <BrandTabButton
                  key={tab.key}
                  label={tab.label}
                  isActive={isActive}
                  onClick={() => props.onChange?.("all")}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl border cursor-pointer",
                      isActive
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-gray-100 bg-white text-gray-400"
                    )}
                  >
                    전체
                  </div>
                </BrandTabButton>
              );
            }

            return (
              <BrandTabButton
                key={tab.key}
                label={tab.label}
                isActive={isActive}
                onClick={() => onChange?.(tab.key as CommunityServiceValue)}
                labelClassName="max-w-12 text-center whitespace-normal break-keep"
              >
                <div className="max-w-12">
                  <BrandBox
                    brandType={tab.key as keyof typeof subscriptableBrand}
                    size="sm"
                    isActive={isActive}
                  />
                </div>
              </BrandTabButton>
            );
          })}
        </div>
      </div>
    </div>
  );
}
