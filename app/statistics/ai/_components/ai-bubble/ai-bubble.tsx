"use client";

import Image from "next/image";

type AIStatus = "text" | "analyzing" | "error" | "chart";

interface AIBubbleProps {
  content?: string;
  time?: string;
  status?: AIStatus;
  chartComponent?: React.ReactNode;
}

export default function AIBubble({
  content,
  time,
  status = "text",
  chartComponent,
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

      <div className="flex flex-col items-start max-w-[90%]">
        <div className="bg-white border border-gray-50 px-4 py-3 rounded-lg w-full">
          {status === "analyzing" && (
            <div className="flex items-center gap-3 py-1 text-gray-300 font-medium body-lg">
              분석 중이니 잠시만 기다려 주세요
            </div>
          )}

          {status === "error" && (
            <p className="body-lg text-gray-300 font-medium">
              분석에 실패했어요. 죄송하지만 나중에 다시 시도해주세요.
            </p>
          )}

          {status === "text" && (
            <p className="body-lg font-medium text-gray-300 leading-relaxed">
              {content}
            </p>
          )}

          {status === "chart" && (
            <div className="flex flex-col gap-3">
              {content && <p className="body-lg text-gray-300">{content}</p>}
              <div className="w-full mt-1 pt-2">{chartComponent}</div>
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
