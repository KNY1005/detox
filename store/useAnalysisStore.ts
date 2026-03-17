import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BaseAnalysis {
  title: string;
  description: string;
  last_updated: string;
}

interface StatisticsPayload extends BaseAnalysis {
  type: "STATISTICS";
  payload: {
    chart_data: { month: string; my_spend: number; avg_spend: number }[];
    diff_amount: number;
  };
}

interface RecommendationPayload extends BaseAnalysis {
  type: "RECOMMENDATION";
  payload: {
    recommended_services: {
      name: string;
      category: string;
      reason: string;
      logo_url?: string;
    }[];
  };
}

interface MaintenancePayload extends BaseAnalysis {
  type: "MAINTENANCE";
  payload: {
    redundant_services: string[];
    potential_savings: number;
  };
}

interface PaymentSchedulePayload extends BaseAnalysis {
  type: "PAYMENT_SCHEDULE";
  payload: {
    target_week: string;
    expected_amount: number;
    scheduled_services: string[];
  };
}

export type AnalysisResult =
  | StatisticsPayload
  | RecommendationPayload
  | MaintenancePayload
  | PaymentSchedulePayload;

export type AnalysisType = AnalysisResult["type"];

const isAnalysisType = (value: unknown): value is AnalysisType => {
  return (
    value === "STATISTICS" ||
    value === "RECOMMENDATION" ||
    value === "MAINTENANCE" ||
    value === "PAYMENT_SCHEDULE"
  );
};

const isAnalysisResult = (value: unknown): value is AnalysisResult => {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;

  return (
    isAnalysisType(data.type) &&
    typeof data.title === "string" &&
    typeof data.description === "string" &&
    typeof data.last_updated === "string" &&
    typeof data.payload === "object" &&
    data.payload !== null
  );
};

interface AnalysisState {
  result: AnalysisResult | null;
  isLoading: boolean;

  setResult: (newResult: unknown) => void;
  setIsLoading: (status: boolean) => void;
  clearResult: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      result: null,
      isLoading: false,

      setResult: (newResult) => {
        if (!isAnalysisResult(newResult)) {
          console.error(
            "[AnalysisStore] 유효하지 않은 데이터 형식입니다:",
            newResult
          );
          return;
        }

        set({ result: newResult, isLoading: false });
      },

      setIsLoading: (status) => set({ isLoading: status }),
      clearResult: () => set({ result: null, isLoading: false }),
    }),
    {
      name: "ai-analysis-storage",
      partialize: (state) => ({ result: state.result }),
    }
  )
);
