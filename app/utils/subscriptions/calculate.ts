// 목데이터
import { SubscriptionItem } from "@/app/statistics/mock-subscriptions";

/**
 * @description 선택된 날짜(월) 기준, 사용자가 지불해야 하는 총 구독료를 계산합니다.
 * @param data 전체 구독 리스
 * @param selectedDate 사용자가 통계 페이지에서 선택한 날짜 객체
 * @returns 해당 월의 총 결제 금액 (number)
 */
export const calculateMonthlyTotal = (data: SubscriptionItem[], selectedDate: Date): number => {
  // 1. 비교를 위해 선택된 날짜에서 '월' 정보만 추출 (1~12월)
  const currentMonth = selectedDate.getMonth() + 1;

  return data.reduce((acc, sub) => {
    // 2. 유료 결제(paid) 상태가 아닌 데이터(무료 체험 등)는 계산에서 제외
    if (sub.paymentType !== "paid") return acc;

    // 3. 결제 주기(type)에 따른 분기 처리
    
    // 3-1. 월간 결제(monthly)인 경우: 매달 지불하므로 무조건 합산
    if (sub.type === "monthly") {
      return acc + sub.price;
    }

    // 3-2. 연간 결제(yearly)인 경우: 결제 약정 월(billingDate.month)이 현재 보고 있는 월과 일치할 때만 합산
    if (sub.type === "yearly" && sub.billingDate.month === currentMonth) {
      return acc + sub.price;
    }

    // 4. 그 외 조건에 맞지 않는 데이터는 누적값 그대로 반환
    return acc;
  }, 0);
};