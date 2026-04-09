const CACHE_TTL_MS = 1000 * 60 * 30; // 30분 유효
const inMemoryCache = new Map<
  string,
  { responseText: string; updatedAt: number }
>();

export function makeCacheKey(
  userId: string,
  question: string,
  categoryRatio: Record<string, number>
) {
  return `${userId}::${question.trim() || "__default__"}::${JSON.stringify(categoryRatio)}`;
}

export async function getCachedAnalysis(
  cacheKey: string
): Promise<string | null> {
  const local = inMemoryCache.get(cacheKey);
  if (local && Date.now() - local.updatedAt < CACHE_TTL_MS) {
    return local.responseText;
  }
  return null;
}

export async function upsertAnalysisCache(
  cacheKey: string,
  responseText: string
) {
  inMemoryCache.set(cacheKey, {
    responseText,
    updatedAt: Date.now(),
  });
}
