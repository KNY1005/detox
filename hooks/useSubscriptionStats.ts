import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUserQuery } from "@/query/users";
import { Database } from "@/types/supabase.types";
import { supabase } from "@/lib/supabase";

type SubscriptionRow = Database["public"]["Tables"]["subscription"]["Row"];

export function useSubscriptionStats() {
  const { data: user } = useCurrentUserQuery();

  const { data: subscriptions = [], isLoading: isSubscriptionsLoading } =
    useQuery<SubscriptionRow[]>({
      queryKey: ["subscriptions", user?.id],
      queryFn: async () => {
        if (!user?.id) return [];
        const { data, error } = await supabase
          .from("subscription")
          .select("*")
          .eq("user_id", user.id);
        if (error) throw error;
        return data || [];
      },
      enabled: !!user?.id,
    });

  const subscriptionSummaries = useMemo(
    () =>
      subscriptions.map((sub) => ({
        service: sub.service,
        amount: Number(sub.total_amount) || 0,
      })),
    [subscriptions]
  );

  const services = useMemo(
    () =>
      Array.from(new Set(subscriptionSummaries.map((s) => s.service))).filter(
        (service): service is string => Boolean(service)
      ),
    [subscriptionSummaries]
  );

  const { data: serviceAvgMap = {}, isLoading: isServiceAvgLoading } = useQuery<
    Record<string, number>
  >({
    queryKey: ["service-avg", services],
    queryFn: async () => {
      if (services.length === 0) return {};

      const { data, error } = await supabase
        .from("subscription")
        .select("service, total_amount")
        .in("service", services);

      if (error) throw error;

      const sums: Record<string, { sum: number; count: number }> = {};
      (data ?? []).forEach((row) => {
        const service = row.service;
        if (!service) return;
        const amount = Number(row.total_amount) || 0;
        const prev = sums[service] ?? { sum: 0, count: 0 };
        sums[service] = { sum: prev.sum + amount, count: prev.count + 1 };
      });

      return Object.fromEntries(
        Object.entries(sums).map(([service, { sum, count }]) => [
          service,
          count > 0 ? Math.round(sum / count) : 0,
        ])
      );
    },
    enabled: services.length > 0,
  });

  return {
    subscriptions,
    subscriptionSummaries,
    serviceAvgMap,
    isSubscriptionsLoading,
    isServiceAvgLoading,
  };
}
