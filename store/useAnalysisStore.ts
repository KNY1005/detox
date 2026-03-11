import { create } from "zustand";
import { persist } from "zustand/middleware";

// 공통 필드
interface BaseAnalysis {
  title: string;
  description: string;
  last_updated: string;
}

// 타입별 페이로드 정의
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

// 최종 분석 결과 타입
export type AnalysisResult =
  | StatisticsPayload
  | RecommendationPayload
  | MaintenancePayload
  | PaymentSchedulePayload;

export type AnalysisType = AnalysisResult["type"];

// 런타임 타입 검증 로직

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

// 스토어 로직

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

        // 검증을 통과한 경우에만 result에 저장
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
