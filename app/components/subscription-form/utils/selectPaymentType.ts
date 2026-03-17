import type { PaymentType, SubscriptionMode } from "../types/type";

/** 무료 체험 개월수 1~12로 제한 */
export function clampTrialMonths(value: number): number {
  return Math.min(12, Math.max(1, value));
}

/**
 * 결제 유형 선택 폼 유효성 검사
 */
export function isSelectPaymentTypeValid(
  subscriptionMode: SubscriptionMode,
  paymentType: PaymentType,
  memberCount: number | null,
  totalAmount: number | null,
  trialMonthCount: number | null
): boolean {
  if (subscriptionMode === "group" && !memberCount) return false;
  if (paymentType === "paid" && !totalAmount) return false;
  if (paymentType === "trial" && !trialMonthCount) return false;
  return true;
}
