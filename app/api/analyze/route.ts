import { OpenAI } from "openai";
import { tavily } from "@tavily/core";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient, SupabaseClient } from "@supabase/supabase-js"; // 💡 SupabaseClient 타입 추가

import { getSystemPrompt } from "@/app/utils/subscriptions/constants";
import {
  validateAnalysisResponse,
  AnalysisResponse,
} from "@/app/utils/subscriptions/validation";
import { subscriptableBrand } from "@/app/utils/brand/brand";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!OPENAI_API_KEY || !TAVILY_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("필수 환경 변수가 설정되지 않았습니다.");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const tavilyClient = tavily({ apiKey: TAVILY_API_KEY });

const withTimeout = async <T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`${label} 타임아웃 (${ms}ms)`)),
          ms
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export async function POST(req: Request) {
  try {
    const { userContext } = await req.json();

    if (!userContext?.categoryRatio) {
      return Response.json(
        { error: "카테고리 비율 정보 부족" },
        { status: 400 }
      );
    }

    const availableBrands = Object.keys(subscriptableBrand).join(", ");
    const cookieStore = await cookies();

    let supabase: SupabaseClient = createServerClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    let userId: string | undefined;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    userId = session?.user?.id;

    if (!userId && userContext?.session) {
      const tokenClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
      await tokenClient.auth.setSession(userContext.session);
      const {
        data: { user },
      } = await tokenClient.auth.getUser();
      userId = user?.id;
      supabase = tokenClient;
    }

    if (!userId)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: subscriptions, error: dbError } = await supabase
      .from("subscription")
      .select("*")
      .eq("user_id", userId);

    if (dbError) throw dbError;

    if (!subscriptions || subscriptions.length === 0) {
      return Response.json(
        { error: "분석할 구독 데이터가 없습니다." },
        { status: 404 }
      );
    }
    const currentYear = new Date().getFullYear();
    const searchResult = await withTimeout(
      tavilyClient.search(`${currentYear}년 한국 구독 서비스 최신 혜택`, {
        maxResults: 5,
      }),
      10000,
      "Tavily Search"
    ).catch(() => ({ results: [] }));

    const lastUpdated = new Date().toISOString().split("T")[0];
    const systemPrompt = getSystemPrompt(
      userContext.categoryRatio,
      lastUpdated,
      availableBrands
    );

    const response = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `구독내역: ${JSON.stringify(subscriptions)}, 시장정보: ${JSON.stringify(searchResult.results)}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
      20000,
      "OpenAI Generation"
    );

    const content = response.choices[0].message.content;
    if (!content) throw new Error("AI 응답 생성 실패");

    const parsed = JSON.parse(content);

    if (!validateAnalysisResponse<AnalysisResponse>(parsed)) {
      throw new Error("AI 응답 형식이 유효하지 않습니다.");
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Analysis API Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "분석 중 오류 발생" },
      { status: 500 }
    );
  }
}
