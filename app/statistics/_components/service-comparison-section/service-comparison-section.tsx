"use client";

import ComparisonInsight from "../comparison-insight";
import ComparisonChart from "../comparison-chart";
import CarouselButton from "../carousel-button";
import { useSubscriptionCarousel } from "@/hooks/useSubscriptionCarousel";

interface ServiceComparisonSectionProps {
  subscriptionSummaries: { service: string | null; amount: number }[];
  serviceAvgMap: Record<string, number>;
  isLoading: boolean;
}

export default function ServiceComparisonSection({
  subscriptionSummaries,
  serviceAvgMap,
  isLoading,
}: ServiceComparisonSectionProps) {
  const {
    current,
    currentIndex,
    serviceAvg,
    subDiff,
    subStatus,
    handlePrev,
    handleNext,
  } = useSubscriptionCarousel(subscriptionSummaries, serviceAvgMap);

  if (!current) return null;

  return (
    <div className="mt-10">
      <ComparisonInsight
        isLoading={isLoading}
        title={`${current.service ?? "서비스"} 유저 평균 소비와 비교`}
        diffAmount={subDiff}
        status={subStatus}
      />

      <div className="relative">
        {currentIndex > 0 && (
          <CarouselButton
            direction="left"
            onClick={handlePrev}
            label="이전 서비스 비교 보기"
          />
        )}
        {currentIndex < subscriptionSummaries.length - 1 && (
          <CarouselButton
            direction="right"
            onClick={handleNext}
            label="다음 서비스 비교 보기"
          />
        )}

        <ComparisonChart
          userName={current.service ?? ""}
          userAmount={current.amount}
          compareName={`${current.service ?? "서비스"} 평균 소비`}
          compareAmount={serviceAvg}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
