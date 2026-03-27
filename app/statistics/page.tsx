"use client";

import { useState } from "react";

import AIAnalysisBanner from "./_components/ai-analysis-banner/ai-analysis-banner";
import Header from "@/app/components/header";
import BottomNav from "@/app/components/bottom-nav";
import MonthExpenseSelector from "./_components/month-expense-selector";
import AgeBandSection from "./_components/age-band-section";
import ServiceComparisonSection from "./_components/service-comparison-section";
import EmptyAnalysis from "./_components/empty-analysis";
import EmptySubscriptionOverlay from "./_components/empty-subscription-overlay";
import AnalysisSummary from "./_components/analysis-summary/analysis-summary";

import { calculateMonthlyTotal } from "@/app/utils/subscriptions/calculate";
import { useCurrentUserQuery, useUserProfileQuery } from "@/query/users";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { AnalysisResponse } from "@/app/utils/subscriptions/validation";
import { useSubscriptionStats } from "@/hooks/useSubscriptionStats";

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
