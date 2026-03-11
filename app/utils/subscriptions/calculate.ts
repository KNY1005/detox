import { SubscriptionItem } from "@/app/statistics/mock-subscriptions";

/**
 * @description 선택된 날짜(월) 기준, 사용자가 지불해야 하는 총 구독료를 계산합니다.
 * @param data 전체 구독 리스트 (DB 스키마 기준)
 * @param selectedDate 사용자가 통계 페이지에서 선택한 날짜 객체
 * @returns 해당 월의 총 결제 금액 (number)
 */
export const calculateMonthlyTotal = (
  data: SubscriptionItem[],
  selectedDate: Date
): number => {
  const currentMonthKey = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}`;

  return data.reduce((acc, sub) => {
    if (sub.payment_type !== "paid" || sub.status !== "active") return acc;

    if (sub.billing_cycle === "monthly") {
      return acc + sub.total_amount;
    }

    if (sub.billing_cycle === "yearly" && sub.next_payment_date) {
      const billingMonthKey = sub.next_payment_date.slice(0, 7);
      if (billingMonthKey === currentMonthKey) {
        return acc + sub.total_amount;
      }
    }

    return acc;
  }, 0);
};
