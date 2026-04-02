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
  const [streamedResult, setStreamedResult] = useState("");
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [cacheStatus, setCacheStatus] = useState<
    "hit" | "miss" | "prefetch" | "error" | null
  >(null);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
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
    setStreamedResult("");
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

      const cacheHeader = response.headers.get("x-cache-status");
      setCacheStatus((cacheHeader as any) ?? "miss");

      if (!response.body) throw new Error("응답 본문이 없습니다.");

      const startTime = performance.now();
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let isCompleted = false;

      const extractJsonChunk = (text: string) => {
        const marker = "[JSON_DATA]";
        const markerIndex = text.indexOf(marker);

        if (markerIndex !== -1) {
          return {
            textPart: text.slice(0, markerIndex).trim(),
            jsonPart: text.slice(markerIndex + marker.length).trim(),
          };
        }

        const jsonMatch = text.match(/\{[\s\S]*\}$/);
        if (jsonMatch) {
          return {
            textPart: text.slice(0, jsonMatch.index ?? 0).trim(),
            jsonPart: jsonMatch[0].trim(),
          };
        }

        return { textPart: text.trim(), jsonPart: "" };
      };

      const readStream = async () => {
        try {
          while (!isCompleted) {
            const { done, value } = await reader.read();
            if (done) {
              isCompleted = true;
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;

            const { textPart } = extractJsonChunk(accumulatedText);
            setStreamedResult(textPart);
          }

          const { textPart, jsonPart } = extractJsonChunk(accumulatedText);
          const responseTime = new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const elapsed = Math.round(performance.now() - startTime);
          setLastLatency(elapsed);

          if (jsonPart) {
            try {
              const parsedData: AnalysisResponse = JSON.parse(jsonPart);

              setAiStatus("chart");
              setMessages((prev) => [
                ...prev,
                {
                  role: "ai",
                  type: "chart",
                  content: parsedData.description,
                  time: responseTime,
                  analysisData: parsedData,
                },
              ]);

              setResult(parsedData);
            } catch (parseError) {
              console.warn("JSON 파싱 실패, 일반 텍스트로 처리:", parseError);
              setAiStatus("text");
              setMessages((prev) => [
                ...prev,
                {
                  role: "ai",
                  type: "text",
                  content: textPart || "분석 결과를 불러올 수 없습니다.",
                  time: responseTime,
                },
              ]);
            }
          } else {
            setAiStatus("text");
            setMessages((prev) => [
              ...prev,
              {
                role: "ai",
                type: "text",
                content: textPart || "분석 결과를 불러올 수 없습니다.",
                time: responseTime,
              },
            ]);
          }
        } catch (streamError) {
          console.error("스트리밍 오류:", streamError);
          setAiStatus("error");
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              content: "스트리밍 중 오류가 발생했습니다. 다시 시도해주세요.",
              time: new Date().toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              type: "error",
            },
          ]);
        } finally {
          setShowQuickQuestions(true);
          setStreamedResult("");
        }
      };

      readStream();
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
      setStreamedResult("");
    }
  };

  return {
    aiStatus,
    messages,
    streamedResult,
    cacheStatus,
    lastLatency,
    showQuickQuestions,
    scrollRef,
    handleQuestionSelect,
  };
}
