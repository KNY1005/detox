import { SubscriptableBrandType } from "@/app/utils/brand/type";
import { Database } from "@/types/supabase.types";

export type BillingCycle = Database["public"]["Enums"]["BILLING_CYCLE"];
export type PaymentType = Database["public"]["Enums"]["PAYMENT_TYPE"];
export type SubscriptionMode = Database["public"]["Enums"]["SUBSCRIPTION_MODE"];
export type SubscriptionStatus =
  Database["public"]["Enums"]["SUBSCRIPTION_STATUS"];

export interface SubscriptionFormData {
  service: SubscriptableBrandType; // 서비스 선택
  billing_cycle: BillingCycle; // 결제 유형 선택 (월간/연간)
  payment_day: string; // 결제일 선택
  next_payment_date: string; // 다음 결제일
  start_date: string;
  end_date: string; // 구독 종료일
  subscription_mode: SubscriptionMode; // 결제 유형 (혼자서/여럿이서)
  payment_type: PaymentType; // 결제 타입 (유료인지/무료인지)
  trial_months: number; // 무료 체험 기간
  member_count: number; // 멤버 수
  total_amount: number; // 총 금액
  status: SubscriptionStatus; // 구독 상태
}
