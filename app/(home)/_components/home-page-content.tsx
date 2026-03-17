"use client";

import HomeSummaryCard from "./home-summary-card";
import HomeSubscriptionSection from "./home-subscription-section";
import Header from "../../components/header";
import BottomNav from "../../components/bottom-nav";
import { useGetSubscriptionListQuery } from "@/query/subscription";
import { useSupabase } from "@/hooks/useSupabase";

export default function HomePageContent() {
  const { session } = useSupabase();
  const { data: subscriptions = [] } = useGetSubscriptionListQuery(
    !!session?.user
  );

  const hasSubscription = subscriptions.length > 0;
  const subscriptionCount = subscriptions.length;
  const thisMonthTotal = subscriptions.reduce(
    (sum, item) =>
      sum +
      (item.payment_type === "trial"
        ? 0
        : item.total_amount / Math.max(item.member_count, 1)),
    0
  );

  return (
    <>
      <Header rightContent="알람아이콘" />
      <main>
        <section className="px-6 py-5 mb-4 bg-white grid grid-cols-[1fr_100px] items-center justify-between">
          <HomeSummaryCard
            hasSubscription={hasSubscription}
            thisMonthTotal={thisMonthTotal}
          />
        </section>
        <HomeSubscriptionSection
          hasSubscription={hasSubscription}
          subscriptions={subscriptions}
          subscriptionCount={subscriptionCount}
          thisMonthTotal={thisMonthTotal}
        />
      </main>
      <BottomNav />
    </>
  );
}
