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
import { AnalysisResponse } from "@/app/utils/subscriptions/validation";
import { Tables } from "@/types/supabase.types";

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

  const metadata = user?.user_metadata as
    | Record<string, string | undefined>
    | undefined;
  const userName = metadata?.nickname || profile?.nickname || "사용자";

  const { result: analysisData } = useAnalysisStore();

  const { data: subscriptions = [], isLoading: isSubscriptionsLoading } =
    useQuery<Tables<"subscription">[]>({
      queryKey: ["subscriptions", user?.id],
      queryFn: async () => {
        if (!user?.id) return [];
        const { data } = await supabase
          .from("subscription")
          .select("*")
          .eq("user_id", user.id);
        return (data as Tables<"subscription">[]) || [];
      },
      enabled: !!user?.id,
    });

  const isAllEmpty = !isSubscriptionsLoading && subscriptions.length === 0;

  const monthlyTotalAmount = useMemo(
    () => calculateMonthlyTotal(subscriptions, selectedDate),
    [selectedDate, subscriptions]
  );

  const isMonthlyEmpty =
    !isSubscriptionsLoading && !isAllEmpty && monthlyTotalAmount === 0;

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

  return (
    <main
      className={`relative flex flex-col w-full min-h-screen bg-white ${isAllEmpty ? "overflow-hidden h-screen" : ""}`}
    >
      <Header variant="text" leftText="통계" />

      <div className="flex flex-col w-full flex-1 pb-32">
        <AIAnalysisBanner isAllEmpty={isAllEmpty} />

        <div className="relative flex-1 flex flex-col">
          <MonthExpenseSelector
            selectedDate={selectedDate}
            groupCount={displayAmount}
            onChangeDate={setSelectedDate}
          />

          <div className="relative flex-1 w-full">
            {/* 1. 구독 정보가 아예 없는 경우 */}
            {isAllEmpty && <EmptySubscriptionOverlay />}

            {/* 2. 구독 정보는 있는데 이번 달 지출이 없는 경우 (차트 대신 표시) */}
            {!isAllEmpty && isMonthlyEmpty && <EmptyAnalysis />}

            {/* 3. 이번 달 지출이 있는 경우 (차트 표시) */}
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
                      onClick={() =>
                        setAgeBandIndex((prev) =>
                          prev === 0 ? ageBands.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-8 top-28 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 shadow-sm text-gray-600 flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faCaretLeft} size="lg" />
                    </button>
                    <button
                      onClick={() =>
                        setAgeBandIndex((prev) =>
                          prev === ageBands.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-8 top-28 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 shadow-sm text-gray-600 flex items-center justify-center"
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
                    {(() => {
                      const current =
                        subscriptionSummaries[currentSubscriptionIndex] ||
                        subscriptionSummaries[0];
                      const serviceAvg = serviceAvgMap[current.service] ?? 0;
                      return (
                        <>
                          <ComparisonInsight
                            isLoading={
                              isSubscriptionsLoading || isServiceAvgLoading
                            }
                            title={`${current.service} 유저 평균 소비와 비교`}
                            diffAmount={Math.abs(serviceAvg - current.amount)}
                            status={
                              current.amount > serviceAvg ? "over" : "under"
                            }
                          />
                          <div className="relative">
                            <button
                              onClick={() =>
                                setCurrentSubscriptionIndex((prev) =>
                                  prev === 0
                                    ? subscriptionSummaries.length - 1
                                    : prev - 1
                                )
                              }
                              className="absolute left-8 top-28 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 shadow-sm text-gray-600 flex items-center justify-center"
                            >
                              <FontAwesomeIcon icon={faCaretLeft} size="lg" />
                            </button>
                            <button
                              onClick={() =>
                                setCurrentSubscriptionIndex((prev) =>
                                  prev === subscriptionSummaries.length - 1
                                    ? 0
                                    : prev + 1
                                )
                              }
                              className="absolute right-8 top-28 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/90 shadow-sm text-gray-600 flex items-center justify-center"
                            >
                              <FontAwesomeIcon icon={faCaretRight} size="lg" />
                            </button>
                            <ComparisonChart
                              userName={current.service}
                              userAmount={current.amount}
                              compareName={`${current.service} 평균 소비`}
                              compareAmount={serviceAvg}
                              isLoading={
                                isSubscriptionsLoading || isServiceAvgLoading
                              }
                            />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* ✅ [수정 핵심] 어떤 상황에서도 리포트 영역은 무조건 렌더링 */}
            {/* isAllEmpty가 아닐 때(구독 데이터가 하나라도 있을 때)는 무조건 보여줍니다. */}
            {!isAllEmpty && (
              <div className="mt-10 border-t-8 border-gray-50 bg-white min-h-[400px]">
                <AnalysisSummary
                  hasData={!!analysisData}
                  analysisData={analysisData as unknown as AnalysisResponse}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
