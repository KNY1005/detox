"use client";

import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import SubscriptionForm, {
  getSubscriptionFunnelKey,
  initialSubscriptionFormData,
  SUBSCRIPTION_STEPS,
} from "@/app/components/subscription-form";
import { useFunnel } from "@/app/hooks/useFunnel";
import type { SubscriptionFormData } from "@/app/components/subscription-form/types/type";
import TextButton from "@/app/components/text-button";
import { useSupabase } from "@/hooks/useSupabase";
import { useCreateSubscriptionMutation } from "@/query/subscription";
import { useToast } from "@/app/hooks/useToast";
import parseSubscriptionFormData from "@/app/utils/subscriptions/parseSubscriptionFormData";
import {
  getFirstMissingSubscriptionStep,
  isPreviousStepsComplete,
} from "@/app/components/subscription-form/utils/validateSubscriptionForm";

const SUBSCRIPTION_ADD_PERSIST_KEY = "subscription-add";

export default function AddPageContent() {
  const router = useRouter();
  const { session } = useSupabase();

  const {
    currentStep,
    currentStepIndex,
    next,
    back,
    setState,
    state,
    setStep,
    clearPersistedDraft,
  } = useFunnel<Partial<SubscriptionFormData>, typeof SUBSCRIPTION_STEPS>({
    key: getSubscriptionFunnelKey("add"),
    steps: SUBSCRIPTION_STEPS,
    initialState: initialSubscriptionFormData,
    syncWithQuery: true,
    queryKey: "subscription-step",
    destroyOnUnmount: false,
    persistKey: SUBSCRIPTION_ADD_PERSIST_KEY,
  });

  const { mutateAsync: createSubscription, isPending } =
    useCreateSubscriptionMutation();

  const { success, error } = useToast();

  const handleSubmit = async (data: Partial<SubscriptionFormData>) => {
    const user = session?.user;
    if (!user) return;

    const firstMissingStep = getFirstMissingSubscriptionStep(data);
    if (firstMissingStep) {
      setStep(firstMissingStep);
      return;
    }

    try {
      await createSubscription(parseSubscriptionFormData(data, user.id));
      if (clearPersistedDraft) {
        clearPersistedDraft();
      }
      success("구독이 추가되었습니다");
    } catch (err) {
      console.error(err);
      error("구독 추가에 실패했습니다");
    }
  };

  return (
    <main className="mx-auto flex flex-col gap-5 relative">
      <Header
        variant="back"
        title="구독 추가"
        onBack={() => back(router.back)}
        rightContent={
          <TextButton
            onClick={() => {
              clearPersistedDraft?.();
              router.back();
            }}
          >
            취소
          </TextButton>
        }
      />
      <SubscriptionForm
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        state={state}
        next={next}
        setState={setState}
        onSubmit={handleSubmit}
        loading={isPending}
        submitDisabled={!isPreviousStepsComplete(state)}
      />
    </main>
  );
}
