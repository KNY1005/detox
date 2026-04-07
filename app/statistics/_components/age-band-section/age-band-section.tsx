"use client";

import ComparisonInsight from "../comparison-insight";
import ComparisonChart from "../comparison-chart";
import CarouselButton from "../carousel-button/carousel-button";

import { useDynamicBenchmark } from "@/hooks/useBenchmark";

interface AgeBandSectionProps {
  userName: string;
  displayAmount: number;
  isSubscriptionsLoading: boolean;
}

export default function AgeBandSection({
  userName,
  displayAmount,
  isSubscriptionsLoading,
}: AgeBandSectionProps) {
  const {
    label,
    averageAmount,
    diffAmount,
    status,
    isLoading: isBenchmarkLoading,
    handlePrev,
    handleNext,
    currentIndex,
    benchmarks,
  } = useDynamicBenchmark(displayAmount);

  const isLoading = isSubscriptionsLoading || isBenchmarkLoading;

  return (
    <div className="mt-4">
      <ComparisonInsight
        isLoading={isLoading}
        title={`${label} 소비 비교`}
        diffAmount={diffAmount}
        status={status}
      />

      <div className="relative">
        {currentIndex > 0 && (
          <CarouselButton
            direction="left"
            onClick={handlePrev}
            label="이전 연령대 비교 보기"
          />
        )}
        {currentIndex < benchmarks.length - 1 && (
          <CarouselButton
            direction="right"
            onClick={handleNext}
            label="다음 연령대 비교 보기"
          />
        )}

        <ComparisonChart
          userName={`${userName}님`}
          userAmount={displayAmount}
          compareName={label}
          compareAmount={averageAmount}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
