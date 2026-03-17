"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/header";
import SubscriptionForm, {
  getSubscriptionFunnelKey,
  initialSubscriptionFormData,
  SUBSCRIPTION_STEPS,
} from "@/app/components/subscription-form";
import { useFunnel } from "@/app/hooks/useFunnel";
import type { SubscriptionFormData } from "@/app/components/subscription-form/types/type";
import TextButton from "@/app/components/text-button";
import mapSubscriptionToFormData from "@/app/utils/subscriptions/mapSubscriptionToFormData";
import {
  useGetSubscriptionDetailSuspenseQuery,
  useUpdateSubscriptionMutation,
} from "@/query/subscription";
import { useToast } from "@/app/hooks/useToast";
import parseSubscriptionFormData from "@/app/utils/subscriptions/parseSubscriptionFormData";
import {
  getFirstMissingSubscriptionStep,
  isPreviousStepsComplete,
} from "@/app/components/subscription-form/utils/validateSubscriptionForm";

export default function EditPageContent() {
  const router = useRouter();

  const { id } = useParams<{ id: string }>();
  const { data: subscription } = useGetSubscriptionDetailSuspenseQuery(id!);
  const { mutateAsync: updateSubscription, isPending: isUpdatePending } =
    useUpdateSubscriptionMutation();

  const toast = useToast();

  const SUBSCRIPTION_EDIT_PERSIST_KEY = `subscription-edit-${id}`;

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
    key: getSubscriptionFunnelKey(`edit-${id}`),
    steps: SUBSCRIPTION_STEPS,
    initialState: {
      ...initialSubscriptionFormData,
      ...mapSubscriptionToFormData(subscription),
    },
    syncWithQuery: true,
    queryKey: "subscription-step",
    destroyOnUnmount: false,
    persistKey: SUBSCRIPTION_EDIT_PERSIST_KEY,
  });

  const handleSubmit = async (data: Partial<SubscriptionFormData>) => {
    const firstMissingStep = getFirstMissingSubscriptionStep(data);
    if (firstMissingStep) {
      setStep(firstMissingStep);
      return;
    }

    try {
      await updateSubscription({
        id: id!,
        values: parseSubscriptionFormData(data, subscription.user_id),
      });
      clearPersistedDraft?.();
      toast.success("구독이 수정되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("구독 수정에 실패했습니다.");
    }
  };

  return (
    <main className="mx-auto flex flex-col gap-5 relative">
      <Header
        variant="back"
        title="구독 수정"
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
        loading={isUpdatePending}
        submitDisabled={!isPreviousStepsComplete(state)}
      />
    </main>
  );
}
