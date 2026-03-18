"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrentUserQuery } from "@/query/users";
import { supabase } from "@/lib/supabase";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { AnalysisResponse } from "@/app/utils/subscriptions/validation";

export interface Message {
  role: "user" | "ai";
  content: string;
  time: string;
  type?: "text" | "chart" | "error";
  analysisData?: AnalysisResponse;
}

const calculateCategoryRatio = (
  subscriptions: Array<{ service: string; total_amount: number }>
) => {
  const totals: Record<string, number> = {};
  let grandTotal = 0;

  subscriptions.forEach((sub) => {
    const category =
      subscriptableBrand[sub.service as keyof typeof subscriptableBrand]
        ?.category ?? "etc";
    const amount = Number(sub.total_amount) || 0;
    totals[category] = (totals[category] ?? 0) + amount;
    grandTotal += amount;
  });

  if (grandTotal === 0) return {};

  const ratio: Record<string, number> = {};
  Object.entries(totals).forEach(([category, value]) => {
    ratio[category] = Math.round((value / grandTotal) * 100);
  });

  return ratio;
};

export function useAiChat() {
  const [aiStatus, setAiStatus] = useState<
    "text" | "analyzing" | "error" | "chart"
  >("text");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { setResult } = useAnalysisStore();
  const { data: user } = useCurrentUserQuery();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, aiStatus]);

  const handleQuestionSelect = async (question: string) => {
    const now = new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setShowQuickQuestions(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question, time: now, type: "text" },
    ]);
    setAiStatus("analyzing");

    try {
      if (!user?.id) throw new Error("로그인이 필요합니다.");

      const { data: subscriptions } = await supabase
        .from("subscription")
        .select("service, total_amount")
        .eq("user_id", user.id);

      const categoryRatio = calculateCategoryRatio(subscriptions || []);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          userContext: { categoryRatio },
        }),
      });

      if (!response.ok) throw new Error("분석 실패");

      const data: AnalysisResponse = await response.json();

      const responseTime = new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (data.type === "NO_DATA") {
        setAiStatus("text");
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            type: "text",
            content: data.description || "분석할 데이터가 충분하지 않아요.",
            time: responseTime,
          },
        ]);
      } else {
        setAiStatus("chart");
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            type: "chart",
            content: data.description,
            time: responseTime,
            analysisData: data,
          },
        ]);

        setResult(data);
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      setAiStatus("error");
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "앗, 분석 중에 오류가 생겼어요. 잠시 후 다시 시도해 주시겠어요?",
          time: now,
          type: "error",
        },
      ]);
    } finally {
      setShowQuickQuestions(true);
    }
  };

  return {
    aiStatus,
    messages,
    showQuickQuestions,
    scrollRef,
    handleQuestionSelect,
  };
}
