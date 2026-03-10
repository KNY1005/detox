import { create } from "zustand";
import { persist } from "zustand/middleware";

// AI 분석 결과 유형
export type AnalysisType =
  | "STATISTICS"
  | "RECOMMENDATION"
  | "MAINTENANCE"
  | "PAYMENT_SCHEDULE";

// AI 분석 결과 스키마
export interface AnalysisResult {
  type: AnalysisType;
  title: string; // 공통 : 결과 제목
  description: string; // 공통 : AI 상세 분석 내용
  last_updated: string; // 공통 : 업데이트 시간

  // 선택 문장
  // [STATISTICS] 통계 비교용
  chart_data?: { month: string; my_spend: number; avg_spend: number }[];
  diff_amount?: number;

  // [RECOMMENDATION] 구독 추천용
  recommended_services?: {
    name: string;
    category: string;
    reason: string;
    logo_url?: string;
  }[];

  // [MAINTENANCE] 유지/해지 권고용
  redundant_services?: string[];
  potential_savings?: number;

  // [PAYMENT_SCHEDULE] 결제 일정 분석용
  target_week?: string;
  expected_amount?: number;
  scheduled_services?: string[];
}

// 스토어 상태 및 액션 타입
interface AnalysisState {
  result: AnalysisResult | null;
  isLoading: boolean;

  setResult: (newResult: AnalysisResult) => void;
  setIsLoading: (status: boolean) => void;
  clearResult: () => void;
}

// Zustand 스토어 생성
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
