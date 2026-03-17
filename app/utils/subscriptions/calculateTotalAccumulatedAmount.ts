import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { BillingCycle } from "@/app/components/subscription-form/types/type";

/**
 * 구독 1인당 총 누적 금액 계산
 * @param billingCycle 월간/연간
 * @param createdAt 구독 시작일 (ISO 문자열)
 * @param totalAmount 구독 총 금액
 * @param memberCount 멤버 수
 * @returns 1인당 누적 결제 금액
 */
export default function calculateTotalAccumulatedAmount(
  billingCycle: BillingCycle,
  createdAt: string,
  totalAmount: number,
  memberCount: number
): number {
  if (memberCount <= 0) return 0;
  if (!createdAt?.trim()) return 0;

  const createdAtDate = parseISO(createdAt.split("T")[0]);
  if (Number.isNaN(createdAtDate.getTime())) return 0;
  const today = new Date();

  if (createdAtDate > today) return 0;

  const amountPerPerson = totalAmount / memberCount;

  if (billingCycle === "monthly") {
    const months = Math.max(0, differenceInMonths(today, createdAtDate));
    return Math.floor(amountPerPerson * months);
  }

  const years = Math.max(0, differenceInYears(today, createdAtDate));
  return Math.floor(amountPerPerson * years);
}
