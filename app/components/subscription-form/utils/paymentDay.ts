import type { BillingCycle } from "../types/type";

export type MonthDayValue = { month: number; day: number };

/**
 * 결제일 문자열(월간 "15") → 일(day) 파싱
 */
export function parsePaymentDayToDay(
  paymentDay: string | undefined
): number | null {
  if (!paymentDay) return null;
  if (paymentDay.includes("-")) return null;
  const n = parseInt(paymentDay, 10);
  return Number.isNaN(n) ? null : n;
}

/**
 * 결제일 문자열(연간 "3-15") → 월-일 파싱
 */
export function parsePaymentDayToMonthDay(
  paymentDay: string | undefined
): MonthDayValue | null {
  if (!paymentDay?.includes("-")) return null;
  const [m, d] = paymentDay.split("-").map(Number);
  if (Number.isNaN(m) || Number.isNaN(d)) return null;
  return { month: m, day: d };
}

/**
 * 선택된 결제일을 폼용 문자열로 변환
 */
export function formatPaymentDay(
  billingCycle: BillingCycle,
  selectedDay: number | null,
  selectedMonthDay: MonthDayValue | null
): string | null {
  if (billingCycle === "monthly") {
    return selectedDay ? selectedDay.toString() : null;
  }
  if (selectedMonthDay) {
    const m = selectedMonthDay.month.toString().padStart(2, "0");
    const d = selectedMonthDay.day.toString().padStart(2, "0");
    return `${m}-${d}`;
  }
  return null;
}
