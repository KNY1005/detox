const CACHE_TTL_MS = 1000 * 60 * 30;
const inMemoryCache = new Map<
  string,
  { responseText: string; updatedAt: number }
>();

function stableRatioKey(categoryRatio: Record<string, number>) {
  const sorted = Object.keys(categoryRatio)
    .sort()
    .reduce<Record<string, number>>((acc, k) => {
      acc[k] = categoryRatio[k]!;
      return acc;
    }, {});
  return JSON.stringify(sorted);
}

export function makeCacheKey(
  userId: string,
  question: string,
  categoryRatio: Record<string, number>
) {
  return `analyze::${userId}::${question.trim() || "__default__"}::${stableRatioKey(categoryRatio)}`;
}

export async function getCachedAnalysis(
  cacheKey: string
): Promise<string | null> {
  const local = inMemoryCache.get(cacheKey);
  if (!local) return null;
  if (Date.now() - local.updatedAt >= CACHE_TTL_MS) {
    inMemoryCache.delete(cacheKey);
    return null;
  }
  return local.responseText;
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
