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

// 스토어 로직
interface AnalysisState {
  result: AnalysisResult | null;
  isLoading: boolean;
  setResult: (newResult: AnalysisResult) => void;
  setIsLoading: (status: boolean) => void;
  clearResult: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      result: null,
      isLoading: false,
      setResult: (newResult) => set({ result: newResult, isLoading: false }),
      setIsLoading: (status) => set({ isLoading: status }),
      clearResult: () => set({ result: null, isLoading: false }),
    }),
    {
      name: "ai-analysis-storage",
      partialize: (state) => ({ result: state.result }),
    }
  )
);
