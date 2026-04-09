"use client";

import type { AnalysisResponse } from "@/app/utils/subscriptions/validation";

type AIBubbleStatus = "text" | "analyzing" | "chart" | "error";

interface AIBubbleProps {
  status: AIBubbleStatus;
  content?: string;
  time?: string;
  analysisData?: AnalysisResponse;
}

export default function AIBubble({
  status,
  content = "",
  time,
  analysisData,
}: AIBubbleProps) {
  const isAnalyzing = status === "analyzing";
  const isChart = status === "chart" && !!analysisData?.payload;

  return (
    <div className="flex flex-col items-start mb-6 px-6 animate-in slide-in-from-left-2">
      <div className="bg-gray-100 text-gray-900 px-3 py-3 text-left rounded-lg rounded-tl-none max-w-[90%] break-keep wrap-anywhere">
        {isAnalyzing ? (
          <p className="body-lg leading-relaxed text-gray-700 whitespace-pre-line">
            {content || "분석 중..."}
          </p>
        ) : (
          <p className="body-lg leading-relaxed text-gray-800 whitespace-pre-line">
            {content}
          </p>
        )}

        {isChart && (
          <div className="mt-4 flex flex-col gap-4">
            {(analysisData!.payload.analysis_items || []).map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="title-sm font-bold text-gray-900">
                  {item.question}
                </div>
                <div className="body-md text-gray-700 mt-2 whitespace-pre-line">
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {time && <span className="label-lg text-gray-300 mt-1">{time}</span>}
    </div>
  );
}
