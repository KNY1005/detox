"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function StatisticsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentSubscriptionIndex, setCurrentSubscriptionIndex] = useState(0);
  const [ageBandIndex, setAgeBandIndex] = useState(0);

  const { data: user } = useCurrentUserQuery();
  const { data: profile } = useUserProfileQuery(user?.id);
  const userName = profile?.nickname || "사용자";

  const { result: analysisData } = useAnalysisStore();

  const { data: subscriptions = [], isLoading: isSubscriptionsLoading } =
    useQuery<{ service: string; total_amount: number }[]>({
      queryKey: ["subscriptions", user?.id],
      queryFn: async () => {
        if (!user?.id) return [];
        const { data } = await supabase
          .from("subscription")
          .select("*")
          .eq("user_id", user.id);
        return data || [];
      },
      enabled: !!user?.id,
    });

  const isAllEmpty = !isSubscriptionsLoading && subscriptions.length === 0;

  const subscriptionSummaries = useMemo(
    () =>
      subscriptions.map((sub) => ({
        service: sub.service,
        amount: Number(sub.total_amount) || 0,
      })),
    [subscriptions]
  );

  const services = useMemo(
    () => Array.from(new Set(subscriptionSummaries.map((s) => s.service))),
    [subscriptionSummaries]
  );

  const { data: serviceAvgMap = {}, isLoading: isServiceAvgLoading } = useQuery<
    Record<string, number>
  >({
    queryKey: ["service-avg", services],
    queryFn: async () => {
      if (services.length === 0) return {};

      const { data, error } = await supabase
        .from("subscription")
        .select("service, total_amount")
        .in("service", services);

      if (error) throw error;

      const sums: Record<string, { sum: number; count: number }> = {};
      (data ?? []).forEach((row) => {
        const r = row as { service: string; total_amount: number };
        const amount = Number(r.total_amount) || 0;
        if (!r.service) return;
        const prev = sums[r.service] ?? { sum: 0, count: 0 };
        sums[r.service] = { sum: prev.sum + amount, count: prev.count + 1 };
      });

      const avg: Record<string, number> = {};
      Object.entries(sums).forEach(([service, { sum, count }]) => {
        avg[service] = count > 0 ? Math.round(sum / count) : 0;
      });

      return avg;
    },
    enabled: services.length > 0,
  });

  const monthlyTotalAmount = useMemo(
    () => calculateMonthlyTotal(subscriptions, selectedDate),
    [selectedDate, subscriptions]
  );

  const isMonthlyEmpty =
    !isSubscriptionsLoading && !isAllEmpty && monthlyTotalAmount === 0;

  const ageBands = ["10s", "20s", "30s", "40s", "50s", "60s"] as const;
  const ageBand =
    ageBands[Math.min(Math.max(ageBandIndex, 0), ageBands.length - 1)];
  const ageBandLabelMap = {
    "10s": "10대 평균",
    "20s": "20대 평균",
    "30s": "30대 평균",
    "40s": "40대 평균",
    "50s": "50대 평균",
    "60s": "60대 평균",
  } as const;
  const ageBandAverageMap = {
    "10s": 12000,
    "20s": 22000,
    "30s": 31000,
    "40s": 36000,
    "50s": 39000,
    "60s": 41000,
  } as const;
  const ageAverage = ageBandAverageMap[ageBand];

  const displayAmount = isAllEmpty || isMonthlyEmpty ? 0 : monthlyTotalAmount;
  const diffAmount = Math.abs(displayAmount - ageAverage);
  const status = displayAmount > ageAverage ? "over" : "under";

  const handleMonthChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrevSubscription = () => {
    setCurrentSubscriptionIndex((prev) =>
      prev === 0 ? subscriptionSummaries.length - 1 : prev - 1
    );
  };

  const handleNextSubscription = () => {
    setCurrentSubscriptionIndex((prev) =>
      prev === subscriptionSummaries.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevAgeBand = () => {
    setAgeBandIndex((prev) => (prev === 0 ? ageBands.length - 1 : prev - 1));
  };

  const handleNextAgeBand = () => {
    setAgeBandIndex((prev) => (prev === ageBands.length - 1 ? 0 : prev + 1));
  };

  return (
    <main
      className={`relative flex flex-col w-full min-h-screen bg-white ${isAllEmpty ? "overflow-hidden h-screen" : ""}`}
    >
      <Header variant="text" leftText="통계" hasNotification />

      <div className="flex flex-col w-full flex-1 pb-32">
        <AIAnalysisBanner isAllEmpty={isAllEmpty} />

        <div className="relative flex-1 flex flex-col">
          <MonthExpenseSelector
            selectedDate={selectedDate}
            groupCount={displayAmount}
            onChangeDate={handleMonthChange}
          />

          <div className="relative flex-1 w-full">
            {!isAllEmpty && !isMonthlyEmpty && (
              <div className="w-full animate-in fade-in duration-500">
                <div className="mt-4">
                  <ComparisonInsight
                    isLoading={isSubscriptionsLoading}
                    title={`${ageBandLabelMap[ageBand]} 소비 비교`}
                    diffAmount={diffAmount}
                    status={status}
                  />
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="이전 연령대"
                      className="absolute left-8 top-28 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 text-gray-600"
                      onClick={handlePrevAgeBand}
                    >
                      <FontAwesomeIcon icon={faCaretLeft} size="lg" />
                    </button>
                    <button
                      type="button"
                      aria-label="다음 연령대"
                      className="absolute right-8 top-28 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 text-gray-600"
                      onClick={handleNextAgeBand}
                    >
                      <FontAwesomeIcon icon={faCaretRight} size="lg" />
                    </button>

                    <ComparisonChart
                      userName={`${userName}님`}
                      userAmount={displayAmount}
                      compareName={ageBandLabelMap[ageBand]}
                      compareAmount={ageAverage}
                      isLoading={isSubscriptionsLoading}
                    />
                  </div>
                </div>

                {subscriptionSummaries.length > 0 && (
                  <div className="mt-10">
                    {subscriptionSummaries.length > 0 && (
                      <>
                        {(() => {
                          const current =
                            subscriptionSummaries[currentSubscriptionIndex] ||
                            subscriptionSummaries[0];
                          const serviceAvg =
                            serviceAvgMap[current.service] ?? 0;
                          const subDiff = Math.abs(serviceAvg - current.amount);
                          const subStatus =
                            current.amount > serviceAvg ? "over" : "under";

                          return (
                            <>
                              <ComparisonInsight
                                isLoading={
                                  isSubscriptionsLoading || isServiceAvgLoading
                                }
                                title={`${current.service} 유저 평균 소비와 비교`}
                                diffAmount={subDiff}
                                status={subStatus}
                              />
                              <div className="relative">
                                <button
                                  type="button"
                                  aria-label="이전 구독 서비스"
                                  className="absolute left-8 top-28 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 text-gray-600 "
                                  onClick={handlePrevSubscription}
                                >
                                  <FontAwesomeIcon
                                    icon={faCaretLeft}
                                    size="lg"
                                  />
                                </button>
                                <button
                                  type="button"
                                  aria-label="다음 구독 서비스"
                                  className="absolute right-8 top-28 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 text-gray-600"
                                  onClick={handleNextSubscription}
                                >
                                  <FontAwesomeIcon
                                    icon={faCaretRight}
                                    size="lg"
                                  />
                                </button>

                                <ComparisonChart
                                  userName={current.service}
                                  userAmount={current.amount}
                                  compareName={`${current.service} 평균 소비`}
                                  compareAmount={serviceAvg}
                                  diffAmount={subDiff}
                                  isLoading={
                                    isSubscriptionsLoading ||
                                    isServiceAvgLoading
                                  }
                                />
                              </div>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                )}

                {analysisData && (
                  <div className="mt-10 border-t-8 border-gray-50">
                    <AnalysisSummary
                      hasData={true}
                      analysisData={analysisData}
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

      <BottomNav />
    </main>
  );
}
