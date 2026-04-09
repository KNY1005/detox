import { useState } from "react";
import { Database } from "@/types/supabase.types";

export type SubscriptionRow =
  Database["public"]["Tables"]["subscription"]["Row"];

export interface AIAnalyzePayload {
  subscriptions: SubscriptionRow[];
  totalAmount: number;
  selectedDate: string;
}

export function useAIStreaming() {
  const [streamedResult, setStreamedResult] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = async (payload: AIAnalyzePayload) => {
    setStreamedResult("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.body) return;

      const reader = response.body.getReader();

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        const chunkValue = decoder.decode(value);

        setStreamedResult((prev) => prev + chunkValue);
      }
    } catch (error) {
      console.error("AI Streaming error:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  return { streamedResult, isStreaming, startStreaming };
}
