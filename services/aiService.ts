import { useAnalysisStore } from "@/store/useAnalysisStore";
import { MOCK_SUBSCRIPTIONS } from "@/app/statistics/mock-subscriptions";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

// AI 분석 요청 및 스토어 업데이트
export const fetchAIAnalysis = async (
  questionType:
    | "STATISTICS"
    | "RECOMMENDATION"
    | "MAINTENANCE"
    | "PAYMENT_SCHEDULE"
) => {
  const { setIsLoading, setResult } = useAnalysisStore.getState();

  setIsLoading(true); // 로딩 시작

  try {
    // 백엔드 AI 분석 API 호출
    const response = await fetch(
      `${NEXT_PUBLIC_BASE_URL}/api/analyze-subscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: questionType,
          user_subscriptions: MOCK_SUBSCRIPTIONS,
        }),
      }
    );

    if (!response.ok) throw new Error("AI 분석 실패");

    const aiResult = await response.json();

    setResult(aiResult); // 스토어에 결과 저장 (화면 자동 업데이트)
  } catch (error) {
    console.error("AI 연동 에러:", error);
    alert("AI 분석 중 문제가 발생했어요. 다시 시도해주세요!");
  } finally {
    setIsLoading(false); // 로딩 종료
  }
};
