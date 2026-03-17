import { addMonths, format, getDaysInMonth, startOfDay } from "date-fns";

type BillingCycle = "monthly" | "yearly";

/**
 * payment_day와 billing_cycle로 다음 결제일 계산
 * @param paymentDay 월간: 1-31 (일), 연간: month*100+day (예: 315 = 3월 15일)
 * @param billingCycle 월간/연간
 * @param fromDate 기준일 (이 날짜 이후의 다음 결제일 반환)
 * @returns ISO 날짜 문자열 또는 null
 */
export default function getNextPaymentDate(
  paymentDay: number | null,
  billingCycle: BillingCycle,
  fromDate: Date
): string | null {
  if (paymentDay == null) return null;

  const from = startOfDay(fromDate);

  if (billingCycle === "monthly") {
    const day = Math.min(Math.max(1, paymentDay), 31);
    const year = from.getFullYear();
    const month = from.getMonth();

    let candidate = new Date(
      year,
      month,
      Math.min(day, getDaysInMonth(new Date(year, month, 1)))
    );
    candidate = startOfDay(candidate);

    if (candidate < from) {
      const nextMonth = addMonths(new Date(year, month, 1), 1);
      candidate = new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth(),
        Math.min(day, getDaysInMonth(nextMonth))
      );
      candidate = startOfDay(candidate);
    }

    // toISOString()은 UTC 변환으로 KST에서 3월 1일 → 2월 28일로 잘못 표시됨
    return format(candidate, "yyyy-MM-dd");
  }

  // yearly: payment_day = month*100 + day (예: 315 = 3월 15일, 301 = 3월 1일)
  // 3011 등 3000-3099 범위 legacy: 잘못 저장된 3월 1일(301) 보정
  let month = Math.floor(paymentDay / 100);
  let day = paymentDay % 100;
  if (paymentDay >= 3000 && paymentDay < 3100) {
    month = Math.floor(paymentDay / 1000);
    day = paymentDay % 10 || 10; // 3011→1일, 3010→10일
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  let candidate = new Date(
    from.getFullYear(),
    month - 1,
    Math.min(day, getDaysInMonth(new Date(from.getFullYear(), month - 1, 1)))
  );
  candidate = startOfDay(candidate);

  if (candidate < from) {
    candidate = new Date(
      from.getFullYear() + 1,
      month - 1,
      Math.min(
        day,
        getDaysInMonth(new Date(from.getFullYear() + 1, month - 1, 1))
      )
    );
    candidate = startOfDay(candidate);
  }

  // toISOString()은 UTC 변환으로 KST에서 3월 1일 → 2월 28일로 잘못 표시됨. YYYY-MM-DD로 반환
  return format(candidate, "yyyy-MM-dd");
}
