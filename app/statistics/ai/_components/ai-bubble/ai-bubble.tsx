"use client";

import Image from "next/image";
import { AnalysisResponse } from "@/app/utils/subscriptions/validation";
import ComparisonChart from "@/app/statistics/_components/comparison-chart";

type AIStatus = "text" | "analyzing" | "error" | "chart";

const getTrendLabel = (chartData?: { month: string; my_spend: number }[]) => {
  if (!chartData || chartData.length < 2)
    return "최근 구독 소비 추세를 파악할 데이터가 부족합니다.";

  const amounts = chartData.map((item) => item.my_spend);
  const first = amounts[0];
  const last = amounts[amounts.length - 1];

  if (last > first) {
    return "최근 3개월 동안 소비가 증가 추세입니다. 과도한 항목을 점검하거나 중복 구독을 통합할 여지가 있습니다.";
  }

  if (last < first) {
    return "최근 3개월 동안 소비가 감소 추세입니다. 현재 방식을 유지하거나 추가 절감 기회를 모색하세요.";
  }

  return "최근 3개월 소비가 대체로 안정적입니다. 큰 변동이 없으므로 현재 계획을 유지해도 괜찮습니다.";
};

interface AIBubbleProps {
  content?: string;
  time?: string;
  status?: AIStatus;
  analysisData?: AnalysisResponse;
}

export default function AIBubble({
  content,
  time,
  status = "text",
  analysisData,
}: AIBubbleProps) {
  return (
    <div className="flex flex-col mb-6 px-6 animate-in fade-in">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 overflow-hidden">
          <Image
            src="/images/emoji/ai-bot.png"
            alt="AI 디톡이"
            width={28}
            height={28}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-bold body-lg text-gray-300">AI디톡이</span>
      </div>

      <div className="flex flex-col items-start max-w-[80%]">
        <div className="bg-white border border-gray-100 rounded-tl-none px-4 py-3 rounded-lg w-full shadow-sm">
          {status === "analyzing" ? (
            <div className="flex flex-col gap-2 py-1 text-brand-primary body-lg">
              <div className="flex items-center gap-3">
                <span className="animate-pulse">●</span>
                <span className="font-medium">
                  디톡이가 분석을 시작했어요...
                </span>
              </div>

              {content && (
                <p className="mt-2 text-gray-600 body-md whitespace-pre-wrap border-l-2 border-brand-primary/20 pl-3 animate-in slide-in-from-top-1">
                  {content}

                  <span className="inline-block w-1.5 h-4 ml-1 bg-brand-primary animate-bounce align-middle">
                    |
                  </span>
                </p>
              )}
            </div>
          ) : status === "error" ? (
            <p className="body-lg text-red-500 font-medium">
              분석에 실패했어요. 다시 시도해주세요.
            </p>
          ) : analysisData?.payload?.analysis_items ? (
            <div className="mt-1 flex flex-col gap-4">
              <div className="py-2 border-b border-gray-50">
                <p className="title-sm text-brand-primary font-bold">
                  {analysisData.title}
                </p>

                {content && (
                  <p className="body-sm text-gray-400 whitespace-pre-line mt-1">
                    {content}
                  </p>
                )}
              </div>

              {analysisData.payload.analysis_items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded-xl flex flex-col gap-1 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-white bg-brand-primary px-2 py-0.5 rounded-full uppercase">
                      AI Insight
                    </span>
                  </div>
                  <p className="body-md font-bold text-gray-800">
                    Q. {item.question}
                  </p>
                  <p className="body-sm text-gray-600 leading-snug whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              ))}

              {analysisData.payload.diff_message && (
                <div className="bg-brand-primary/5 p-3 rounded-lg text-center mt-1 font-bold text-brand-primary text-xs">
                  💡 {analysisData.payload.diff_message}
                </div>
              )}

              {analysisData.payload.chart_data?.length ? (
                <div className="mt-4">
                  <div className="mb-2 font-bold text-gray-700">
                    최근 3개월 구독 소비 추세 (월별)
                  </div>
                  <ComparisonChart
                    data={analysisData.payload.chart_data}
                    isLoading={false}
                  />
                  <div className="text-sm mt-2 text-gray-600">
                    {getTrendLabel(analysisData.payload.chart_data)}
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-500">
                  최근 3개월 추적 데이터가 부족합니다. 다음에 추가 분석을
                  요청하세요.
                </div>
              )}

              <div className="mt-4 border border-brand-primary/20 rounded-lg bg-brand-primary/5 p-3 text-brand-primary text-sm">
                {analysisData.payload.analysis_items.length
                  ? "여기서 바로 실행할 수 있는 핵심 절감 제안: 현재 유지 + 1~2개 중복대체 서비스 결합을 추천합니다."
                  : "현재 구독 내역에서 절감 요소를 확인 중입니다. 중복 구독 정보를 명확히 입력하면 더 정확히 분석해드립니다."}
              </div>
            </div>
          ) : (
            content && (
              <p className="body-lg whitespace-pre-wrap text-gray-700">
                {content}
              </p>
            )
          )}
        </div>

        {status !== "analyzing" && time && (
          <span className="label-lg text-gray-300 mt-1.5 ml-1">{time}</span>
        )}
      </div>
    </div>
  );
}
