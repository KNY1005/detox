"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

import AIAnalysisBanner from "./_components/ai-analysis-banner/ai-analysis-banner";
import Header from "@/app/components/header";
import BottomNav from "@/app/components/bottom-nav";
import MonthExpenseSelector from "./_components/month-expense-selector";
import ComparisonInsight from "./_components/comparison-insight";
import ComparisonChart from "./_components/comparison-chart";
import EmptyAnalysis from "./_components/empty-analysis";
import EmptySubscriptionOverlay from "./_components/empty-subscription-overlay";
import AnalysisSummary from "./_components/analysis-summary/analysis-summary";

import { calculateMonthlyTotal } from "@/app/utils/subscriptions/calculate";
import { useCurrentUserQuery, useUserProfileQuery } from "@/query/users";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { AnalysisResponse } from "@/app/utils/subscriptions/validation";

import { useSubscriptionStats } from "@/hooks/useSubscriptionStats";
import { useAgeBandComparison } from "@/hooks/useAgeBandComparison";
import { useSubscriptionCarousel } from "@/hooks/useSubscriptionCarousel";

// 연령대 비교 섹션

interface AgeBandSectionProps {
  userName: string;
  displayAmount: number;
  isSubscriptionsLoading: boolean;
}

function AgeBandSection({
  userName,
  displayAmount,
  isSubscriptionsLoading,
}: AgeBandSectionProps) {
  const {
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
        <CarouselButton
          direction="left"
          onClick={handlePrev}
          label="이전 연령대 비교 보기"
        />
        <CarouselButton
          direction="right"
          onClick={handleNext}
          label="다음 연령대 비교 보기"
        />

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

// 서비스별 비교 섹션

interface ServiceComparisonSectionProps {
  subscriptionSummaries: { service: string | null; amount: number }[];
  serviceAvgMap: Record<string, number>;
  isLoading: boolean;
}

function ServiceComparisonSection({
  subscriptionSummaries,
  serviceAvgMap,
  isLoading,
}: ServiceComparisonSectionProps) {
  const { current, serviceAvg, subDiff, subStatus, handlePrev, handleNext } =
    useSubscriptionCarousel(subscriptionSummaries, serviceAvgMap);

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
        <CarouselButton
          direction="left"
          onClick={handlePrev}
          label="이전 서비스 비교 보기"
        />
        <CarouselButton
          direction="right"
          onClick={handleNext}
          label="다음 서비스 비교 보기"
        />

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

// 캐러셀 버튼

interface CarouselButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}

function CarouselButton({ direction, onClick, label }: CarouselButtonProps) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute ${isLeft ? "left-8" : "right-8"} top-28 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm`}
    >
      <FontAwesomeIcon icon={isLeft ? faCaretLeft : faCaretRight} size="lg" />
    </button>
  );
}

// 메인 페이지 컴포넌트

export default function StatisticsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 유저 정보
  const { data: user } = useCurrentUserQuery();
  const isUserResolved = user !== undefined;
  const { data: profile } = useUserProfileQuery(user?.id);
  const metadata = user?.user_metadata as
    | Record<string, string | undefined>
    | undefined;
  const userName = metadata?.nickname || profile?.nickname || "사용자";

  // 구독 데이터
  const {
    subscriptions,
    subscriptionSummaries,
    serviceAvgMap,
    isSubscriptionsLoading,
    isServiceAvgLoading,
  } = useSubscriptionStats();

  // 분석 데이터
  const { result: analysisData } = useAnalysisStore();

  // 월별 통계 계산
  const monthlyTotalAmount = calculateMonthlyTotal(subscriptions, selectedDate);
  const isAllEmpty =
    isUserResolved && !isSubscriptionsLoading && subscriptions.length === 0;
  const isMonthlyEmpty =
    isUserResolved &&
    !isSubscriptionsLoading &&
    !isAllEmpty &&
    monthlyTotalAmount === 0;

  const displayAmount = isAllEmpty || isMonthlyEmpty ? 0 : monthlyTotalAmount;

  return (
    <>
      <main
        className={`relative flex min-h-screen w-full flex-col bg-white ${
          isAllEmpty ? "h-screen overflow-hidden" : ""
        }`}
      >
        <Header variant="text" leftText="통계" hasNotification />

        <div className="flex w-full flex-1 flex-col pb-32">
          <AIAnalysisBanner isAllEmpty={isAllEmpty} />

          <div className="relative flex flex-1 flex-col">
            <MonthExpenseSelector
              selectedDate={selectedDate}
              groupCount={displayAmount}
              onChangeDate={setSelectedDate}
            />

            <div className="relative flex-1 w-full">
              {!isAllEmpty && !isMonthlyEmpty && (
                <div className="w-full animate-in fade-in duration-500">
                  <AgeBandSection
                    userName={userName}
                    displayAmount={displayAmount}
                    isSubscriptionsLoading={isSubscriptionsLoading}
                  />

                  {subscriptionSummaries.length > 0 && (
                    <ServiceComparisonSection
                      subscriptionSummaries={subscriptionSummaries}
                      serviceAvgMap={serviceAvgMap}
                      isLoading={isSubscriptionsLoading || isServiceAvgLoading}
                    />
                  )}

                  {analysisData && (
                    <div className="mt-10 border-t-8 border-gray-50">
                      <AnalysisSummary
                        hasData={!!analysisData}
                        analysisData={
                          analysisData as unknown as AnalysisResponse
                        }
                      />
                    </div>
                  )}
                </div>
              )}

              {!isAllEmpty && isMonthlyEmpty && <EmptyAnalysis />}
            </div>

            {isAllEmpty && <EmptySubscriptionOverlay />}
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
