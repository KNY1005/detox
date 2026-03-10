import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AnalysisResult {
  summary: string; // 분석 요약 문구
  total_saving_expect: number; // 예상 절약 금액
  comparison_text: string; // AI 비유
  analysis_tips: string[]; // 절약 팁 리스트 (배열)
}

interface AnalysisState {
  result: AnalysisResult | null;
  setResult: (newResult: AnalysisResult) => void;
  clearResult: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      result: null,
      setResult: (newResult) => set({ result: newResult }),
      clearResult: () => set({ result: null }),
    }),
    {
      name: "ai-analysis-storage",
    }
  )
);
