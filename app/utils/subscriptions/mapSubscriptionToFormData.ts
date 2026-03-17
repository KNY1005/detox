import type { SubscriptionFormData } from "@/app/components/subscription-form/types/type";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import type { Tables } from "@/types/supabase.types";

/**
 * DB 구독 row를 SubscriptionFormData 형식으로 변환
 */
function formatPaymentDayForForm(
  paymentDay: number | null,
  billingCycle: "monthly" | "yearly"
): string {
  if (paymentDay == null) return "";
  if (billingCycle === "yearly" && paymentDay >= 100) {
    let month = Math.floor(paymentDay / 100);
    let day = paymentDay % 100;
    // 3011 등 3000-3099 legacy 보정 (getNextPaymentDate와 동일)
    if (paymentDay >= 3000 && paymentDay < 3100) {
      month = Math.floor(paymentDay / 1000);
      day = paymentDay % 10 || 10;
    }
    return `${month}-${day}`;
  }
  return paymentDay.toString();
}

export default function mapSubscriptionToFormData(
  subscription: Tables<"subscription">
): Partial<SubscriptionFormData> {
  return {
    service: subscription.service as SubscriptableBrandType,
    billing_cycle: subscription.billing_cycle,
    payment_day: formatPaymentDayForForm(
      subscription.payment_day,
      subscription.billing_cycle
    ),
    start_date: subscription.start_date ?? "",
    next_payment_date: subscription.next_payment_date ?? "",
    end_date: subscription.end_date ?? "",
    subscription_mode: subscription.subscription_mode,
    payment_type: subscription.payment_type,
    trial_months: subscription.trial_months ?? 0,
    member_count: subscription.member_count,
    total_amount: subscription.total_amount,
    status: subscription.status,
  };
}
