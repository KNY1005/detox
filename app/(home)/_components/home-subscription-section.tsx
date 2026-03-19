import Link from "next/link";
import SubscriptionList from "@/app/components/subscription-list";
import Button from "@/app/components/button";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import type { Tables } from "@/types/supabase.types";
import BottomCTA from "@/app/components/bottom-cta";

interface Props {
  hasSubscription: boolean;
  subscriptions: Tables<"subscription">[];
  subscriptionCount: number;
  thisMonthTotal: number;
}

export default function HomeSubscriptionSection({
  hasSubscription,
  subscriptions,
  subscriptionCount,
  thisMonthTotal,
}: Props) {
  return (
    <section className="pt-10 bg-white border-t-gray-100 border-t-16">
      <div className="relative flex flex-col justify-center items-start gap-4 ">
        <div className="px-6 w-full flex justify-between items-center">
          <h6 className="title-md text-black">
            나의 구독{" "}
            <span className="text-brand-primary">총 {subscriptionCount}개</span>
          </h6>
          <h6 className="header-md">{thisMonthTotal.toLocaleString()}원</h6>
        </div>
        <ul className="px-6 w-full">
          {subscriptions.map((item) => (
            <li key={item.id}>
              <SubscriptionList
                href={`/subscription/${item.id}`}
                brandType={item.service as SubscriptableBrandType}
                price={item.total_amount / Math.max(item.member_count, 1)}
                billingCycle={item.billing_cycle}
                group={item.subscription_mode === "group"}
                groupCount={Math.max(item.member_count - 1, 0)}
                isFreeTrial={item.payment_type === "trial"}
              />
            </li>
          ))}
        </ul>
        {!hasSubscription && (
          <div className="absolute w-full h-full flex flex-col items-center justify-center gap-4 text-center bg-linear-to-bl from-white/50 to-white backdrop-blur-[1.5px]">
            <h6 className="title-md text-black">구독 서비스를 추가 하세요</h6>
            <p className="body-md text-gray-300">
              내가 사용하는 구독을 추가하고
              <br />
              소비를 절약해보세요
            </p>
          </div>
        )}
      </div>
      <BottomCTA hasBottomNav>
        <Link href="/subscription/add">
          <Button variant="primary" size="lg">
            구독 추가하기
          </Button>
        </Link>
      </BottomCTA>
    </section>
  );
}
