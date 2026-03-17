"use client";

import { StepType } from "@/app/hooks/useFunnel";
import { SubscriptionFormData } from "./types/type";
import InputPaymentInfo from "./_components/_steps/input-payment-info";
import SelectBrand from "./_components/_steps/select-brand";
import SelectPaymentType from "./_components/_steps/select-payment-type";
import ProgressBar from "./_components/progress-bar/progress-bar";

const SUBSCRIPTION_FUNNEL_BASE = "subscription-form";

/** Per-route funnel key to avoid state collision between add/edit flows */
export function getSubscriptionFunnelKey(routeId: string): string {
  return `${SUBSCRIPTION_FUNNEL_BASE}-${routeId}`;
}
export const SUBSCRIPTION_STEPS = [
  "select-brand",
  "input-payment-info",
  "select-payment-type",
] as const;

export const initialSubscriptionFormData: Partial<SubscriptionFormData> = {};

interface Props {
  currentStep: StepType<typeof SUBSCRIPTION_STEPS>;
  currentStepIndex: number;
  state: Partial<SubscriptionFormData>;
  next: () => void;
  setState: (
    partial:
      | Partial<SubscriptionFormData>
      | ((prev: Partial<SubscriptionFormData>) => Partial<SubscriptionFormData>)
  ) => void;
  onSubmit: (data: Partial<SubscriptionFormData>) => void;
  loading?: boolean;
  /** syncWithQuery로 URL 직접 접근 시 이전 step 누락 시 true */
  submitDisabled?: boolean;
}

export default function SubscriptionForm({
  currentStep,
  currentStepIndex,
  state,
  next,
  setState,
  onSubmit,
  loading,
  submitDisabled = false,
}: Props) {
  return (
    <>
      <ProgressBar
        steps={[...SUBSCRIPTION_STEPS]}
        currentStep={currentStepIndex + 1}
      />

      {currentStep === "select-brand" && (
        <SelectBrand
          values={state}
          onNext={(values) => {
            setState((prev) => ({ ...prev, ...values }));
            next();
          }}
        />
      )}
      {currentStep === "input-payment-info" && (
        <InputPaymentInfo
          key={`input-payment-${state.billing_cycle ?? ""}-${state.payment_day ?? ""}-${state.start_date ?? ""}`}
          values={state}
          onNext={(values) => {
            setState((prev) => ({ ...prev, ...values }));
            next();
          }}
        />
      )}
      {currentStep === "select-payment-type" && (
        <SelectPaymentType
          values={state}
          onNext={(values) => {
            const merged = { ...state, ...values };
            setState(merged);
            onSubmit(merged);
          }}
          loading={loading}
          submitDisabled={submitDisabled}
        />
      )}
    </>
  );
}
