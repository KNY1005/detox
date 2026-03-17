import { addMonths, parseISO } from "date-fns";
import getNextPaymentDate from "./getNextPaymentDate";
import calculateTrial from "./calculateTrial";

type SubscriptionForNextPayment = {
  payment_day: number | null;
  billing_cycle: "monthly" | "yearly";
  payment_type: "paid" | "trial";
  start_date: string | null;
  trial_months: number | null;
  next_payment_date: string | null;
};

/**
 * 구독의 다음 결제 예정일 반환
 * - next_payment_date가 있으면 우선 사용
 * - 없으면 payment_day + billing_cycle로 계산 (무료체험 중이면 체험 종료일 이후 기준)
 */
export default function getNextPaymentDateForSubscription(
  subscription: SubscriptionForNextPayment
): string | null {
  if (subscription.next_payment_date?.trim()) {
    return subscription.next_payment_date;
  }
  if (subscription.payment_day == null) return null;

  let fromDate = new Date();
  const inTrial =
    subscription.payment_type === "trial" &&
    calculateTrial(
      subscription.start_date!,
      subscription.trial_months ?? 0
    );
  if (inTrial && subscription.start_date) {
    const trialEnd = addMonths(
      parseISO(subscription.start_date.split("T")[0]),
      subscription.trial_months ?? 0
    );
    if (trialEnd > fromDate) fromDate = trialEnd;
  }

  return getNextPaymentDate(
    subscription.payment_day,
    subscription.billing_cycle,
    fromDate
  );
}
