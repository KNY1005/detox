"use client";

import { useParams, useRouter } from "next/navigation";
import PaymentInfoCard from "./payment-info-card";
import SubscriptionMetaList from "./subscription-meta-list";
import { useAlert } from "@/app/hooks/useAlert";
import TextButton from "@/app/components/text-button";
import {
  useDeleteSubscriptionMutation,
  useGetSubscriptionDetailSuspenseQuery,
} from "@/query/subscription";
import { useToast } from "@/app/hooks/useToast";
import formatSubscriptionEndDateLabel from "@/app/utils/date/formatSubscriptionEndDateLabel";
import calculateTotalAccumulatedAmount from "@/app/utils/subscriptions/calculateTotalAccumulatedAmount";
import getNextPaymentDateForSubscription from "@/app/utils/subscriptions/getNextPaymentDateForSubscription";
import SubscriptionList from "@/app/components/subscription-list";
import { SubscriptableBrandType } from "@/app/utils/brand/type";
import calculateTrial from "@/app/utils/subscriptions/calculateTrial";

export default function SubscriptionDetailContent() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: subscription } = useGetSubscriptionDetailSuspenseQuery(id!);
  const { mutateAsync: deleteSubscription, isPending: isDeletePending } =
    useDeleteSubscriptionMutation();

  const alert = useAlert();
  const toast = useToast();

  const handleDeleteConfirm = () => {
    alert.alert({
      title: "구독을 삭제하시겠습니까?",
      description: "삭제된 구독은 복구할 수 없습니다.",
      variant: "danger",
      cancelText: "취소",
      confirmText: "삭제",
      onConfirm: handleDelete,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteSubscription(id!);
      toast.success("구독이 삭제되었습니다.");
      router.replace("/");
    } catch (error) {
      console.error(error);
      toast.error("구독 삭제에 실패했습니다.");
    }
  };

  const nextPaymentDate = getNextPaymentDateForSubscription(subscription);

  return (
    <>
      <div className="w-full mt-5 px-6 flex flex-col gap-5">
        <SubscriptionList
          brandType={subscription.service as SubscriptableBrandType}
          group={subscription.subscription_mode === "group"}
          price={
            subscription.total_amount / Math.max(subscription.member_count, 1)
          }
          billingCycle={subscription.billing_cycle}
          groupCount={subscription.member_count}
          // 시작일로부터 무료체험기간이 자났다면 유료구독으로 봐야 함
          isFreeTrial={
            subscription.payment_type === "trial" &&
            calculateTrial(
              subscription.start_date!,
              subscription.trial_months ?? 0
            )
          }
        />

        <PaymentInfoCard
          splitBar={{
            type: subscription.subscription_mode,
            myAmount:
              subscription.total_amount /
              Math.max(subscription.member_count, 1),
            totalAmount: subscription.total_amount,
            partyCount: Math.max(subscription.member_count - 1, 0),
          }}
          nextPaymentAmount={
            subscription.total_amount / Math.max(subscription.member_count, 1)
          }
          totalAccumulatedAmount={calculateTotalAccumulatedAmount(
            subscription.billing_cycle,
            subscription.start_date ?? new Date().toISOString(),
            subscription.total_amount,
            subscription.member_count
          )}
        />

        <SubscriptionMetaList
          items={[
            {
              label: "결제 예정일",
              value: formatSubscriptionEndDateLabel(nextPaymentDate) || "-",
            },
          ]}
        />
      </div>

      <TextButton
        size="sm"
        className="absolute left-1/2 -translate-x-1/2 bottom-[108px]"
        underline
        onClick={handleDeleteConfirm}
        disabled={isDeletePending}
      >
        구독 삭제하기
      </TextButton>
    </>
  );
}
