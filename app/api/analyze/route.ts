import { OpenAI } from "openai";
import { tavily } from "@tavily/core";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSystemPrompt } from "@/app/utils/subscriptions/constants";
import { validateAnalysisResponse } from "@/app/utils/subscriptions/validation";
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
    const { userContext, question } = await req.json();

    if (!userContext?.categoryRatio) {
      return Response.json(
        { error: "카테고리 비율 정보 부족" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const availableBrands = Object.keys(subscriptableBrand).join(", ");

    const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json(
        { error: "Unauthorized - 로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { data: subscriptions, error: dbError } = await supabase
      .from("subscription")
      .select("service, total_amount")
      .eq("user_id", userId);

    if (dbError) throw dbError;

    if (!subscriptions || subscriptions.length === 0) {
      return Response.json(
        { error: "분석할 구독 데이터가 없습니다." },
        { status: 404 }
      );
    }

    const currentYear = new Date().getFullYear();
    const searchQuery = question
      ? `${currentYear}년 ${question} 할인 혜택 및 최저가로 이용하는 꿀팁`
      : `${currentYear}년 한국 인기 구독 서비스(OTT, 쇼핑) 결합 할인 및 통신사 제휴 최신 정보`;

    const searchResult = await withTimeout(
      tavilyClient.search(searchQuery, {
        maxResults: 5,
        searchDepth: "advanced",
      }),
      10000,
      "Tavily Search"
    ).catch(() => ({ results: [] }));

    const lastUpdated = new Date().toISOString().split("T")[0];
    const systemPrompt = getSystemPrompt(
      userContext.categoryRatio,
      lastUpdated,
      availableBrands,
      question
    );

    const response = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `
              사용자 질문: "${question || "전반적인 소비 분석"}"
              보유 구독 리스트: ${JSON.stringify(subscriptions)}
              최신 시장 할인 정보: ${JSON.stringify(searchResult.results)}
              
              위 데이터를 분석하여 아래 규칙을 지켜 답변하세요:
              1. 사용자가 질문한 내용에 대해 즉시 실행 가능한 '최저가 대안'을 제시하세요.
              2. "방안을 찾아보세요"라고 하지 말고, "A를 B로 바꾸면 월 0,000원이 절약됩니다"라고 확정적으로 말하세요.
              3. 'analysis_items' 배열에 최소 2개 이상의 구체적인 해결책을 담으세요.
              4. 각 해결책의 'content'는 가독성을 위해 불렛포인트(•)와 줄바꿈(\\n)을 필수로 사용하세요.
            `,
          },
        ],
        response_format: { type: "json_object" },
      }),
      25000,
      "OpenAI Generation"
    );

    const content = response.choices[0].message.content;
    if (!content) throw new Error("AI 응답 생성 실패");

    const parsed = JSON.parse(content);

    if (!validateAnalysisResponse(parsed)) {
      console.error("AI 응답 구조 오류:", parsed);
      throw new Error("AI 응답 형식이 유효하지 않습니다.");
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("🔥🔥 [API 에러 추적]:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "분석 중 오류 발생" },
      { status: 500 }
    );
  }
}
