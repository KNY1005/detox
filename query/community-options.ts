import { infiniteQueryOptions } from "@tanstack/react-query";
import type {
  CommunityListCursor,
  CommunityListPage,
} from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";

export const communityKeys = {
  all: ["community"],
  lists: () => [...communityKeys.all, "list"],
  list: (service?: SubscriptableBrandType) => [
    ...communityKeys.lists(),
    service ?? "all",
  ],
  details: () => [...communityKeys.all, "detail"],
  detail: (postId: string) => [...communityKeys.details(), postId],
  recommendations: () => [...communityKeys.all, "recommendation"],
  recommendationList: (postId: string) => [
    ...communityKeys.recommendations(),
    postId,
  ],
  recommendedPosts: (postId: string, service?: SubscriptableBrandType) => [
    ...communityKeys.recommendationList(postId),
    service ?? "all",
  ],
  comments: () => [...communityKeys.all, "comment"],
  commentList: (postId: string) => [...communityKeys.comments(), postId],
  likes: () => [...communityKeys.all, "like"],
  likeStatuses: (postId: string) => [...communityKeys.likes(), postId],
  likeStatus: (postId: string, userId?: string) => [
    ...communityKeys.likeStatuses(postId),
    userId ?? "guest",
  ],
} as const;

export const COMMUNITY_LIST_STALE_TIME = 30 * 1000;

type CommunityListPageFetcher = (params: {
  service?: SubscriptableBrandType;
  cursor?: CommunityListCursor | null;
  pageSize?: number;
}) => Promise<CommunityListPage>;

export function createCommunityListInfiniteQueryOptions(params: {
  service?: SubscriptableBrandType;
  fetchPage: CommunityListPageFetcher;
}) {
  return infiniteQueryOptions({
    queryKey: communityKeys.list(params.service),
    initialPageParam: null as CommunityListCursor | null,
    queryFn: ({ pageParam }) =>
      params.fetchPage({
        service: params.service,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: COMMUNITY_LIST_STALE_TIME,
  });
}
