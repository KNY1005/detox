export interface ChartDataItem {
  month: string;
  my_spend: number;
  avg_spend: number;
}

export interface AnalysisItem {
  savings_amount?: number | string | null;
  question: string;
  content: string;
  brand?: string;
}

export interface AnalysisResponse {
  type: string;
  title: string;
  description: string;
  last_updated: string;
  payload: {
    analysis_items: AnalysisItem[];
    chart_data: ChartDataItem[];
    diff_amount: number;
    diff_message: string;
  };
}

export const validateAnalysisResponse = <T extends AnalysisResponse>(
  data: unknown
): data is T => {
  if (typeof data !== "object" || data === null) return false;

  const target = data as Record<string, unknown>;

  if (target.type !== "STATISTICS") return false;
  if (
    typeof target.title !== "string" ||
    typeof target.description !== "string"
  )
    return false;

  const payload = target.payload as Record<string, unknown> | undefined;
  if (!payload || typeof payload !== "object") return false;

  const analysisItems = payload.analysis_items;
  if (!Array.isArray(analysisItems)) return false;

  const isItemsValid = analysisItems.every((item: unknown) => {
    if (typeof item !== "object" || item === null) return false;
    const i = item as Record<string, unknown>;
    return typeof i.question === "string" && typeof i.content === "string";
  });

  if (!isItemsValid) return false;

  const isPayloadValid =
    Array.isArray(payload.chart_data) &&
    typeof payload.diff_message === "string";

  return isPayloadValid;
};
