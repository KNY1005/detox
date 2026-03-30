import { useState } from "react";

interface SubscriptionSummary {
  service: string | null;
  amount: number;
}

export function useSubscriptionCarousel(
  subscriptionSummaries: SubscriptionSummary[],
  serviceAvgMap: Record<string, number>
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current =
    subscriptionSummaries[currentIndex] || subscriptionSummaries[0];

  const serviceAvg = current ? (serviceAvgMap[current.service ?? ""] ?? 0) : 0;
  const subDiff = current ? Math.abs(serviceAvg - current.amount) : 0;
  const subStatus: "over" | "under" =
    current && current.amount > serviceAvg ? "over" : "under";

  const handlePrev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? subscriptionSummaries.length - 1 : prev - 1
    );

  const handleNext = () =>
    setCurrentIndex((prev) =>
      prev === subscriptionSummaries.length - 1 ? 0 : prev + 1
    );

  return {
    current,
    currentIndex,
    serviceAvg,
    subDiff,
    subStatus,
    handlePrev,
    handleNext,
  };
}
