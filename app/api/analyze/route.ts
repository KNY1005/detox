import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { validateAnalysisResponse } from "@/app/utils/subscriptions/validation";
import { extractJsonChunk } from "@/app/utils/ai/stream-parser";
import {
  getCachedAnalysis,
  upsertAnalysisCache,
  makeCacheKey,
} from "@/app/api/analyze/cache-utils";
import { streamSubscriptionAnalysis } from "@/app/api/analyze/analysis-pipeline";
import { calculateCategoryRatio } from "@/app/utils/ai/analysis";
import { QUICK_ANALYSIS_QUESTIONS } from "@/app/utils/ai/quick-analysis-questions";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** 프리패치 시 한 요청당 허용하는 최대 질문 수 (비용·지연 상한) */
const MAX_PREFETCH_QUESTIONS = 20;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("필수 환경 변수가 설정되지 않았습니다.");
}

type AnalyzeBody = {
  question?: string;
};

type PrefetchBody = {
  mode: "prefetch";
  userId: string;
  questions?: unknown;
};

function isPrefetchBody(body: unknown): body is PrefetchBody {
  return (
    typeof body === "object" &&
    body !== null &&
    (body as PrefetchBody).mode === "prefetch" &&
    typeof (body as PrefetchBody).userId === "string"
  );
}

/** questions 미지정 시 빠른 질문 목록, 지정 시 문자열 배열만 허용·상한 적용 */
function resolvePrefetchQuestionList(
  questions: unknown
): { ok: true; list: string[] } | { ok: false; response: Response } {
  if (questions === undefined) {
    return { ok: true, list: [...QUICK_ANALYSIS_QUESTIONS] };
  }
  if (!Array.isArray(questions)) {
    return {
      ok: false,
      response: Response.json(
        { error: "questions는 문자열 배열이어야 합니다." },
        { status: 400 }
      ),
    };
  }
  if (questions.some((q) => typeof q !== "string")) {
    return {
      ok: false,
      response: Response.json(
        { error: "questions의 각 항목은 문자열이어야 합니다." },
        { status: 400 }
      ),
    };
  }
  const trimmed = (questions as string[])
    .map((q) => q.trim())
    .filter(Boolean)
    .slice(0, MAX_PREFETCH_QUESTIONS);
  return { ok: true, list: trimmed };
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await req.json();

    if (isPrefetchBody(body)) {
      if (body.userId !== user.id) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      const resolved = resolvePrefetchQuestionList(body.questions);
      if (!resolved.ok) return resolved.response;

      const { data: subs, error: subsError } = await supabase
        .from("subscription")
        .select("*")
        .eq("user_id", body.userId);

      if (subsError) throw subsError;

      if (!subs || subs.length === 0) {
        return Response.json(
          { error: "구독 데이터가 없습니다." },
          { status: 404 }
        );
      }

      const categoryRatio = calculateCategoryRatio(subs);
      const list = resolved.list;

      const results: Array<{
        question: string;
        cacheKey: string;
        status: string;
      }> = [];

      for (const question of list) {
        const q = typeof question === "string" ? question.trim() : "";
        const cacheKey = makeCacheKey(body.userId, q, categoryRatio);

        const existing = await getCachedAnalysis(cacheKey);
        if (existing) {
          results.push({ question: q, cacheKey, status: "skip-hit" });
          continue;
        }

        try {
          const accumulated = await streamSubscriptionAnalysis(
            {
              subscriptions: subs as Record<string, unknown>[],
              categoryRatio,
              questionText: q,
            },
            () => {}
          );

          const { jsonPart } = extractJsonChunk(accumulated);
          if (jsonPart) {
            const parsed = JSON.parse(jsonPart);
            if (validateAnalysisResponse(parsed)) {
              await upsertAnalysisCache(cacheKey, accumulated);
              results.push({ question: q, cacheKey, status: "prefetched" });
            } else {
              results.push({ question: q, cacheKey, status: "skip-invalid" });
            }
          } else {
            results.push({ question: q, cacheKey, status: "skip-no-json" });
          }
        } catch (err) {
          console.error("[analyze prefetch] question failed:", q, err);
          results.push({ question: q, cacheKey, status: "error" });
        }
      }

      return Response.json({ status: "ok", results });
    }

    const { question } = body as AnalyzeBody;
    const questionText = typeof question === "string" ? question.trim() : "";

    const { data: subscriptions, error: dbError } = await supabase
      .from("subscription")
      .select("*")
      .eq("user_id", user.id);

    if (dbError || !subscriptions?.length) {
      return Response.json({ error: "데이터 부족" }, { status: 400 });
    }

    const categoryRatio = calculateCategoryRatio(subscriptions);

    const cacheKey = makeCacheKey(user.id, questionText, categoryRatio);
    const cached = await getCachedAnalysis(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "x-cache-status": "hit",
        },
      });
    }

    const encoder = new TextEncoder();

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          const accumulated = await streamSubscriptionAnalysis(
            {
              subscriptions: subscriptions as Record<string, unknown>[],
              categoryRatio,
              questionText,
            },
            (chunk) => {
              controller.enqueue(encoder.encode(chunk));
            }
          );

          try {
            const { jsonPart } = extractJsonChunk(accumulated);
            if (jsonPart) {
              const parsed = JSON.parse(jsonPart);
              if (validateAnalysisResponse(parsed)) {
                await upsertAnalysisCache(cacheKey, accumulated);
              } else {
                console.error("Invalid AI JSON shape — cache skip");
              }
            } else {
              console.error("Missing [JSON_DATA] marker in AI output");
            }
          } catch (e) {
            console.error("Final JSON parse/validate error:", e);
          }
          controller.close();
        } catch (e) {
          console.error("Analysis stream error:", e);
          controller.error(
            e instanceof Error ? e : new Error(String(e))
          );
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "x-cache-status": "miss",
      },
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    return Response.json({ error: "분석 중 오류 발생" }, { status: 500 });
  }
}
