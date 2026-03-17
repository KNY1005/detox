import { addMonths, parseISO } from "date-fns";
import { SubscriptionFormData } from "@/app/components/subscription-form/types/type";
import { TablesInsert } from "@/types/supabase.types";
import getNextPaymentDate from "./getNextPaymentDate";

function parsePaymentDayToDb(
  paymentDay: string | undefined,
  billingCycle: "monthly" | "yearly"
): number | null {
  if (!paymentDay?.trim()) return null;
  const cleaned = paymentDay.replace("-", "");
  const num = parseInt(cleaned, 10);
  if (Number.isNaN(num)) return null;
  return num || null;
}

function calculateNextPaymentDate(
  paymentDay: number | null,
  billingCycle: "monthly" | "yearly",
  startDate: string | null | undefined,
  trialMonths: number | null | undefined,
  paymentType: "paid" | "trial"
): string | null {
  if (paymentDay == null || !startDate?.trim()) return null;
  const start = parseISO(startDate.split("T")[0]);
  const fromDate =
    paymentType === "trial" && (trialMonths ?? 0) > 0
      ? addMonths(start, trialMonths ?? 0)
      : start;
  return getNextPaymentDate(paymentDay, billingCycle, fromDate);
}

export default function parseSubscriptionFormData(
  data: Partial<SubscriptionFormData>,
  userId: string
): TablesInsert<"subscription"> {
  const paymentDay = parsePaymentDayToDb(
    data.payment_day,
    data.billing_cycle ?? "monthly"
  );

  if (
    !data.service ||
    !data.billing_cycle ||
    !data.subscription_mode ||
    !data.payment_type
  ) {
    throw new Error("필수 필드가 누락되었습니다");
  }

  const nextPaymentDate = calculateNextPaymentDate(
    paymentDay,
    data.billing_cycle,
    data.start_date,
    data.trial_months,
    data.payment_type
  );

  return {
    service: data.service,
    billing_cycle: data.billing_cycle,
    payment_day: paymentDay,
    start_date: data.start_date || null,
    end_date: data.end_date || null,
    next_payment_date: nextPaymentDate,
    subscription_mode: data.subscription_mode,
    payment_type: data.payment_type,
    member_count:
      data.subscription_mode === "solo" ? 1 : (data.member_count ?? 1),
    total_amount: data.total_amount ?? 0,
    trial_months: data.trial_months ?? null,
    status: data.status ?? "active",
    user_id: userId,
  };
}
