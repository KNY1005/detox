import { Database } from "@/types/supabase.types";

type SubscriptionRow = Database["public"]["Tables"]["subscription"]["Row"];

export const calculateMonthlyTotal = (
  data: SubscriptionRow[],
  selectedDate: Date
): number => {
  const currentMonthKey = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}`;

  return data.reduce((acc, sub) => {
    if (sub.payment_type !== "paid") return acc;

    const amount = sub.total_amount || 0;

    if (sub.billing_cycle === "monthly") {
      return acc + amount;
    }

    if (sub.billing_cycle === "yearly" && sub.next_payment_date) {
      const billingMonthKey = sub.next_payment_date.slice(0, 7);
      if (billingMonthKey === currentMonthKey) {
        return acc + amount;
      }
    }

    return acc;
  }, 0);
};
