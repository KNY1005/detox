import { BillingCycle } from "@/app/components/subscription-form/types/type";

export default function formatBillingCycle(billingCycle: BillingCycle) {
  return billingCycle === "monthly" ? "월간결제" : "연간결제";
}
