import type { SubscriptionFormData } from "../types/type";
import { SUBSCRIPTION_STEPS } from "../subscription-form";
import { isSelectPaymentTypeValid } from "./selectPaymentType";
import type { StepType } from "@/app/hooks/useFunnel";

/**
 * 이전 step(select-brand, input-payment-info) 필수 필드만 검증.
 * 현재 step(select-payment-type)은 로컬 state라 parent state에 없을 수 있음.
 */
export function isPreviousStepsComplete(
  data: Partial<SubscriptionFormData>
): boolean {
  if (!data.service?.trim()) return false;
  if (
    !data.billing_cycle ||
    !data.payment_day?.trim() ||
    !data.start_date?.trim()
  ) {
    return false;
  }
  return true;
}

/**
 * 구독 폼 완성도 검증.
 * syncWithQuery로 URL 직접 접근 시 누락된 step이 있을 수 있으므로,
 * 제출 전 필수 필드를 검증하고 첫 누락 step을 반환.
 */
export function getFirstMissingSubscriptionStep(
  data: Partial<SubscriptionFormData>
): StepType<typeof SUBSCRIPTION_STEPS> | null {
  if (!data.service?.trim()) {
    return "select-brand";
  }

  if (
    !data.billing_cycle ||
    !data.payment_day?.trim() ||
    !data.start_date?.trim()
  ) {
    return "input-payment-info";
  }

  const memberCount = data.member_count ?? null;
  const totalAmount = data.total_amount ?? null;
  const trialMonths = data.trial_months ?? null;

  if (
    !data.subscription_mode ||
    !data.payment_type ||
    !isSelectPaymentTypeValid(
      data.subscription_mode,
      data.payment_type,
      memberCount,
      totalAmount,
      trialMonths
    )
  ) {
    return "select-payment-type";
  }

  return null;
}
