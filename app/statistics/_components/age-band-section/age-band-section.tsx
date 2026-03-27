"use client";

import ComparisonInsight from "../comparison-insight";
import ComparisonChart from "../comparison-chart";
import CarouselButton from "../carousel-button/carousel-button";

import { useAgeBandComparison, AGE_BANDS } from "@/hooks/useAgeBandComparison";

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
    ageBandIndex,
    ageBandLabel,
    ageAverage,
    diffAmount,
    status,
    handlePrev,
    handleNext,
  } = useAgeBandComparison(displayAmount);

  return (
    <div className="mt-4">
      <ComparisonInsight
        isLoading={isSubscriptionsLoading}
        title={`${ageBandLabel} 소비 비교`}
        diffAmount={diffAmount}
        status={status}
      />

      <div className="relative">
        {ageBandIndex > 0 && (
          <CarouselButton
            direction="left"
            onClick={handlePrev}
            label="이전 연령대 비교 보기"
          />
        )}
        {ageBandIndex < AGE_BANDS.length - 1 && (
          <CarouselButton
            direction="right"
            onClick={handleNext}
            label="다음 연령대 비교 보기"
          />
        )}

        <ComparisonChart
          userName={`${userName}님`}
          userAmount={displayAmount}
          compareName={ageBandLabel}
          compareAmount={ageAverage}
          isLoading={isSubscriptionsLoading}
        />
      </div>
    </div>
  );
}
