import { useState } from "react";

export const AGE_BANDS = ["10s", "20s", "30s", "40s", "50s", "60s"] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export const AGE_BAND_LABEL_MAP: Record<AgeBand, string> = {
  "10s": "10대 평균",
  "20s": "20대 평균",
  "30s": "30대 평균",
  "40s": "40대 평균",
  "50s": "50대 평균",
  "60s": "60대 평균",
};

export const AGE_BAND_AVERAGE_MAP: Record<AgeBand, number> = {
  "10s": 12000,
  "20s": 22000,
  "30s": 31000,
  "40s": 36000,
  "50s": 39000,
  "60s": 41000,
};

export function useAgeBandComparison(displayAmount: number) {
  const [ageBandIndex, setAgeBandIndex] = useState(0);

  const ageBand =
    AGE_BANDS[Math.min(Math.max(ageBandIndex, 0), AGE_BANDS.length - 1)];
  const ageAverage = AGE_BAND_AVERAGE_MAP[ageBand];
  const ageBandLabel = AGE_BAND_LABEL_MAP[ageBand];

  const diffAmount = Math.abs(displayAmount - ageAverage);
  const status: "over" | "under" =
    displayAmount > ageAverage ? "over" : "under";

  const handlePrev = () =>
    setAgeBandIndex((prev) => (prev === 0 ? AGE_BANDS.length - 1 : prev - 1));

  const handleNext = () =>
    setAgeBandIndex((prev) => (prev === AGE_BANDS.length - 1 ? 0 : prev + 1));

  return {
    ageBandIndex,
    ageBand,
    ageBandLabel,
    ageAverage,
    diffAmount,
    status,
    handlePrev,
    handleNext,
  };
}
