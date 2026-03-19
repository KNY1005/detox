"use client";

import Image from "next/image";
import { AnalysisResponse } from "@/app/utils/subscriptions/validation";
import BrandBox from "@/app/components/brand-box";
import { SubscriptableBrandType } from "@/app/utils/brand/type";

type AIStatus = "text" | "analyzing" | "error" | "chart";

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
            src="/images/emoji/robot.png"
            alt="AI 디톡이"
            width={28}
            height={28}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-bold body-lg text-gray-300">AI디톡이</span>
      </div>

      <div className="flex flex-col items-start max-w-[80%]">
        <div className="bg-white border border-gray-100 rounded-tl-none px-4 py-3 rounded-lg w-full">
          {status === "analyzing" && (
            <div className="flex items-center gap-3 py-1 text-brand-primary body-lg">
              <span className="animate-pulse">●</span> 분석 중이니 잠시만
              기다려주세요
            </div>
          )}

          {status === "error" && (
            <p className="body-lg text-red-500">
              분석에 실패했어요. 다시 시도해주세요.
            </p>
          )}

          {!analysisData && content && (
            <p className="body-lg whitespace-pre-wrap text-gray-400">
              {content}
            </p>
          )}

          {analysisData?.payload?.analysis_items && (
            <div className="mt-1 flex flex-col gap-4">
              <div className="py-2 border-b border-gray-50">
                <p className="title-sm text-brand-primary font-bold">
                  {analysisData.title}
                </p>
                <p className="body-sm text-gray-400 whitespace-pre-line mt-1">
                  {content}
                </p>
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
            </div>
          )}
        </div>

        {status !== "analyzing" && time && (
          <span className="label-lg text-gray-300 mt-1.5 ml-1">{time}</span>
        )}
      </div>
    </div>
  );
}
