"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCurrentUserQuery } from "@/query/users";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { AnalysisResponse } from "@/app/utils/subscriptions/validation";
import { extractJsonChunk } from "@/app/utils/ai/stream-parser";

export interface Message {
  role: "user" | "ai";
  content: string;
  time: string;
  type?: "text" | "chart" | "error";
  analysisData?: AnalysisResponse;
}

export interface AIAnalyzeStreamPayload {
  question: string;
}

export function useAiChat() {
  const [streamedResult, setStreamedResult] = useState("");
  const streamAnalyze = useCallback(async (payload: AIAnalyzeStreamPayload) => {
    setStreamedResult("");
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(errText || `분석 요청 실패 (${response.status})`);
    }

    if (!response.body) throw new Error("응답 본문이 없습니다.");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulatedText += decoder.decode(value, { stream: true });
      const { textPart } = extractJsonChunk(accumulatedText);
      setStreamedResult(textPart);
    }
    accumulatedText += decoder.decode();

    return accumulatedText;
  }, []);

  const clearStreamPreview = useCallback(() => {
    setStreamedResult("");
  }, []);

  const [aiStatus, setAiStatus] = useState<
    "text" | "analyzing" | "error" | "chart"
  >("text");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { setResultForQuestion } = useAnalysisStore();
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
    clearStreamPreview();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question, time: now, type: "text" },
    ]);
    setAiStatus("analyzing");

    try {
      if (!user?.id) throw new Error("로그인이 필요합니다.");

      const accumulatedText = await streamAnalyze({ question });

      const responseTime = new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const { textPart, jsonPart } = extractJsonChunk(accumulatedText);

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
          setResultForQuestion(question, parsedData);
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
    } finally {
      setShowQuickQuestions(true);
      clearStreamPreview();
    }
  };

  return {
    aiStatus,
    messages,
    streamedResult,
    showQuickQuestions,
    scrollRef,
    handleQuestionSelect,
  };
}
