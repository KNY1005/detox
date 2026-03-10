"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/app/components/header";
import DateDivider from "./_components/date-divider/date-divider";
import UserBubble from "./_components/user-bubble";
import AIBubble from "./_components/ai-bubble";
import QuickQuestions from "./_components/quick-questions";
import MyChart from "../_components/comparison-chart";

interface Message {
  role: "user" | "ai";
  content: string;
  time: string;
  type?: "text" | "chart"; 
}

export default function ChatPage() {
  const [aiStatus, setAiStatus] = useState<"text" | "analyzing" | "error" | "chart">("text");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, aiStatus]);

  const handleQuestionSelect = (question: string) => {
    const now = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

    setShowQuickQuestions(false);
    setMessages((prev) => [...prev, { role: "user", content: question, time: now, type: "text" }]);

    setAiStatus("analyzing");

    timeoutRef.current = setTimeout(() => {
      const responseTime = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
      const isChartQuestion = question.includes("분석") || question.includes("얼마");
      
      if (isChartQuestion) {
        setAiStatus("chart");
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            type: "chart",
            content: "나영님의 최근 3개월 소비 추이 분석 결과입니다.",
             time: responseTime,
          },
        ]);
      } else {
        setAiStatus("text");
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            type: "text",
            content: "중복된 서비스 2개를 찾았어요! 하나를 해지하면 월 12,000원을 아낄 수 있습니다.",
            time: now,
          },
        ]);
      }
      
      setShowQuickQuestions(true);
    }, 3000);
  };

  return (
    <div className="relative flex flex-col w-full h-screen bg-white ">
      <Header variant="back" title="AI디톡이와 소비분석" />

      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-4 pb-10 custom-scrollbar">
        <DateDivider />

        <AIBubble status="text" content="어떤 서비스 기준으로 분석해드릴까요? 아래 질문 중 하나를 골라주세요!" />

        {messages.map((msg, idx) => (
          msg.role === "user" ? (
            <UserBubble key={idx} content={msg.content} time={msg.time} />
          ) : (
            <AIBubble 
              key={idx} 
              status={msg.type === "chart" ? "chart" : "text"} 
              content={msg.content} 
              time={msg.time}
              chartComponent={
              msg.type === "chart" ? (
                <MyChart 
                  userName="나영" 
                  userAmount={27900} 
                  compareName="평균" 
                  compareAmount={45000} 
                />
              ) : null
            }
            />
          )
        ))}

        {aiStatus === "analyzing" && <AIBubble status="analyzing" />}

        {/* 하단 질문 선택 버튼 */}
        {showQuickQuestions && aiStatus !== "analyzing" && (
          <QuickQuestions onSelect={handleQuestionSelect} />
        )}
      </div>
    </div>
  );
}
