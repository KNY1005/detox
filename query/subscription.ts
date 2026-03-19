import {
  createSubscription,
  deleteSubscription,
  getSubscriptionDetail,
  getSubscriptionList,
  updateSubscription,
} from "@/services/subscription";
import { Tables, TablesUpdate } from "@/types/supabase.types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const subscriptionKeys = {
  all: ["subscription"] as const,
  list: () => [...subscriptionKeys.all, "list"] as const,
  detail: (id: string) => [...subscriptionKeys.all, "detail", id] as const,
};

/**
 * 구독 목록 조회
 */
export const useGetSubscriptionListQuery = (userId: string) => {
  return useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: () => getSubscriptionList(userId),
    enabled: !!userId,
  });
};

/**
 * 구독 생성
 * @returns 구독 생성 뮤테이션
 */
export const useCreateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubscription,
    onSuccess: (data) => {
      queryClient.setQueryData(
        subscriptionKeys.list(),
        (old: Tables<"subscription">[] | undefined) => [...(old ?? []), data]
      );
    },
  });
};

/**
 * 구독 상세 조회 (useQuery - loading 상태 직접 처리)
 */
export const useGetSubscriptionDetailQuery = (id: string) => {
  return useQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => getSubscriptionDetail(id),
    enabled: !!id,
  });
};

/**
 * 구독 상세 조회 (useSuspenseQuery - Suspense fallback 사용)
 */
export const useGetSubscriptionDetailSuspenseQuery = (id: string) => {
  return useSuspenseQuery({
    queryKey: subscriptionKeys.detail(id),
    queryFn: () => getSubscriptionDetail(id),
  });
};

/*
 * 구독 삭제
 */
export const useDeleteSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.list() });
      queryClient.removeQueries({ queryKey: subscriptionKeys.detail(id) });
    },
  });
};

/*
 * 구독 수정
 */
export const useUpdateSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: TablesUpdate<"subscription">;
    }) => updateSubscription(id, values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.list() });
      queryClient.setQueryData(subscriptionKeys.detail(data.id), data);
    },
  });
};
