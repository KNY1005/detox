import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"; // [추가] cookies import 누락 해결
import { getSystemPrompt } from "@/app/utils/ai/constants";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import {
  makeCacheKey,
  upsertAnalysisCache,
} from "@/app/api/analyze/cache-utils";
import { OpenAI } from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("필수 환경 변수가 설정되지 않았습니다.");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * 타임아웃 래퍼
 */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} 타임아웃 (${ms}ms)`)), ms);
    }),
  ]) as Promise<T>;
}

export async function POST(req: Request) {
  try {
    const { userId, questions } = await req.json();

    if (!userId) {
      return Response.json({ error: "userId가 필요합니다." }, { status: 400 });
    }

    // [수정] cookies() 호출을 위해 import 확인 및 적용
    const cookieStore = await cookies();
    const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    });

    const { data: subs, error: subsError } = await supabase
      .from("subscription")
      .select("service, total_amount")
      .eq("user_id", userId);

    if (subsError) throw subsError;

    if (!subs || subs.length === 0) {
      return Response.json(
        { error: "구독 데이터가 없습니다." },
        { status: 404 }
      );
    }

    const categoryRatio = subs.reduce<Record<string, number>>((acc, cur) => {
      const amount = Number(cur.total_amount) || 0;
      const key = cur.service ?? "etc";
      acc[key] = (acc[key] ?? 0) + amount;
      return acc;
    }, {});

    const availableBrands = Object.keys(subscriptableBrand).join(", ");
    const defaultQuestions = questions ?? [
      "내 소비 습관에 맞는 통신사 결합 할인 혜택을 분석해줘",
      "내가 중복으로 내는 구독료가 얼마인지 알려줘",
      "최근 3개월간 나의 구독 소비 추이를 분석해줘",
    ];

    const results: Array<{
      question: string;
      cacheKey: string;
      status: string;
    }> = [];

    for (const question of defaultQuestions) {
      const cacheKey = makeCacheKey(userId, question, categoryRatio);
      const systemPrompt = getSystemPrompt(
        categoryRatio,
        new Date().toISOString().split("T")[0],
        availableBrands,
        question
      );

      // [수정] withTimeout을 사용하여 AI 호출을 감싸서 'unused-vars' 경고 해결
      const oneShot = await withTimeout(
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `질문: "${question}" \n구독: ${JSON.stringify(subs)}`,
            },
          ],
          stream: false,
        }),
        25000,
        "OpenAI Prefetch"
      );

      const generated = oneShot.choices?.[0]?.message?.content ?? "";
      await upsertAnalysisCache(cacheKey, generated);

      results.push({ question, cacheKey, status: "prefetched" });
    }

    return Response.json({ status: "prefetch-done", results });
  } catch (error) {
    console.error("prefetch error:", error);
    return Response.json({ error: "prefetch 실패" }, { status: 500 });
  }
}
