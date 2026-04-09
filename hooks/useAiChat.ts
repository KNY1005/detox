"use client";

import { useState, useEffect, useRef } from "react";
import { useCurrentUserQuery } from "@/query/users";
import { supabase } from "@/lib/supabase";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { AnalysisResponse } from "@/app/utils/subscriptions/validation";
import { calculateCategoryRatio } from "@/app/utils/ai/analysis";
import { extractJsonChunk } from "@/app/utils/ai/stream-parser";

export type CacheStatus = "hit" | "miss" | "prefetch" | "error";

export interface Message {
  role: "user" | "ai";
  content: string;
  time: string;
  type?: "text" | "chart" | "error";
  analysisData?: AnalysisResponse;
}

export function useAiChat() {
  const [aiStatus, setAiStatus] = useState<
    "text" | "analyzing" | "error" | "chart"
  >("text");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamedResult, setStreamedResult] = useState("");
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { setResult } = useAnalysisStore();
  const { data: user } = useCurrentUserQuery();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, aiStatus, streamedResult]);

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

      const { data: subscriptions, error: subError } = await supabase
        .from("subscription")
        .select("service, total_amount")
        .eq("user_id", user.id);

      if (subError) throw subError;

      const categoryRatio = calculateCategoryRatio(subscriptions || []);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, userContext: { categoryRatio } }),
      });

      if (!response.ok) throw new Error("분석 실패");

      const cacheHeader = response.headers.get("x-cache-status");
      setCacheStatus((cacheHeader as CacheStatus) ?? "miss");

      if (!response.body) throw new Error("응답 본문이 없습니다.");

      const startTime = performance.now();
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      const readStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

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
          setLastLatency(Math.round(performance.now() - startTime));

          if (jsonPart) {
            try {
              const parsedData: AnalysisResponse = JSON.parse(jsonPart);
              setAiStatus("chart");
              setMessages((prev) => [
                ...prev,
                {
                  role: "ai",
                  type: "chart",
                  content: parsedData.description || "",
                  time: responseTime,
                  analysisData: parsedData,
                },
              ]);
              setResult(parsedData);
            } catch (parseErr) {
              console.error("최종 데이터 파싱 에러:", parseErr);
              setAiStatus("text");
              setMessages((prev) => [
                ...prev,
                {
                  role: "ai",
                  type: "text",
                  content: textPart,
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
                content: textPart,
                time: responseTime,
              },
            ]);
          }
        } catch (streamErr) {
          console.error("스트리밍 읽기 중단:", streamErr);
          setAiStatus("error");
        } finally {
          setShowQuickQuestions(true);
          setStreamedResult("");
        }
      };

      readStream();
    } catch (error) {
      console.error("분석 프로세스 오류:", error);
      setAiStatus("error");
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "분석 중 문제가 발생했습니다. 다시 시도해주세요.",
          time: now,
          type: "error",
        },
      ]);
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
