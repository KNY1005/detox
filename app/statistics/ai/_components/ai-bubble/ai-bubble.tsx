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
  chartComponent 
}: AIBubbleProps) {
  return (
    <div className="flex flex-col mb-6 px-4 animate-in fade-in">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2 overflow-hidden">
          <Image 
            src="/images/emoji/robot.png" 
            alt="AI 디톡이"
            width={28}
            height={28}
            className="w-full h-full object-cover" 
          />
        </div>
        <span className="font-bold text-[14px] text-gray-700">AI디톡이</span>
      </div>
      
      <div className="flex flex-col items-start max-w-[90%]">
        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm w-full">
          
          {status === "analyzing" && (
            <div className="flex items-center gap-3 py-1 text-gray-600 font-medium text-[15px]">
               분석 중이니 잠시만 기다려 주세요
            </div>
          )}

          {status === "error" && (
            <p className="text-[15px] text-gray-300 font-medium">분석에 실패했어요. 죄송하지만 나중에 다시 시도해주세요.</p>
          )}

          {status === "text" && (
            <p className="text-[15px] text-gray-800 leading-relaxed">{content}</p>
          )}

          {status === "chart" && (
            <div className="flex flex-col gap-3">
              {content && <p className="text-[15px] text-gray-800">{content}</p>}
              <div className="w-full mt-2 border-t pt-4 border-gray-50">
                {chartComponent}
              </div>
            </div>
          )}
        </div>
        
        {status !== "analyzing" && time && (
          <span className="text-[11px] text-gray-400 mt-1.5 ml-1">{time}</span>
        )}
      </div>
    </div>
  );
}