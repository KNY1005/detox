"use client";

import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import type {
  CommunityCommentItemData,
  CommunityDetailData,
  CommunityListCursor,
  CommunityListItemData,
  CommunityListPage,
} from "@/app/community/_types";
import type { SubscriptableBrandType } from "@/app/utils/brand/type";
import {
  communityKeys,
  createCommunityListInfiniteQueryOptions,
} from "@/query/community-options";
import {
  createCommunityComment,
  createCommunityPost,
  deleteCommunityComment,
  deleteCommunityPost,
  getCommunityComments,
  getCommunityDetail,
  getCommunityListPage,
  getCommunityPostLikeStatus,
  getRecommendedCommunityPosts,
  reportCommunityComment,
  reportCommunityPost,
  toggleCommunityPostLike,
  updateCommunityPost,
} from "@/services/community";
export { communityKeys } from "@/query/community-options";

//좋아요 낙관적 업데이트 롤백용
type CommunityLikeMutationContext = {
  previousDetail?: CommunityDetailData | null;
  previousLikeStatus?: boolean;
  previousLists: [
    readonly unknown[],
    InfiniteData<CommunityListPage, CommunityListCursor | null> | undefined,
  ][];
  previousRecommendations: [
    readonly unknown[],
    CommunityListItemData[] | undefined,
  ][];
};

//좋아요 수 공통타입
type CommunityLikeCountTarget = {
  id: string;
  likeCount: number;
};

//좋아요 업다운 계산
function getNextLikeCount(currentCount: number, nextLiked: boolean) {
  return nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
}

//좋아요 수 반영
function applyOptimisticLike<T extends CommunityLikeCountTarget>(
  item: T,
  postId: string,
  nextLiked: boolean
) {
  if (item.id !== postId) {
    return item;
  }

  return {
    ...item,
    likeCount: getNextLikeCount(item.likeCount, nextLiked),
  };
}

//상세 db있을때 좋아요
function applyOptimisticLikeToOptional<T extends CommunityLikeCountTarget>(
  data: T | null | undefined,
  postId: string,
  nextLiked: boolean
) {
  if (!data) {
    return data;
  }

  return applyOptimisticLike(data, postId, nextLiked);
}

//배열db에 좋아요
function applyOptimisticLikeToItems<T extends CommunityLikeCountTarget>(
  items: T[] | undefined,
  postId: string,
  nextLiked: boolean
) {
  if (!items) {
    return items;
  }

  return items.map((item) => applyOptimisticLike(item, postId, nextLiked));
}

//무한스크롤에 좋아요
function applyOptimisticLikeToInfiniteData(
  data: InfiniteData<CommunityListPage, CommunityListCursor | null> | undefined,
  postId: string,
  nextLiked: boolean
) {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items:
        applyOptimisticLikeToItems(page.items, postId, nextLiked) ?? page.items,
    })),
  };
}

async function invalidateCommunityCollections(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: communityKeys.lists(),
    }),
    queryClient.invalidateQueries({
      queryKey: communityKeys.recommendations(),
    }),
  ]);
}

async function invalidateCommunityPost(
  queryClient: QueryClient,
  postId: string
) {
  await Promise.all([
    invalidateCommunityCollections(queryClient),
    queryClient.invalidateQueries({
      queryKey: communityKeys.detail(postId),
    }),
  ]);
}

async function invalidateCommunityPostComments(
  queryClient: QueryClient,
  postId: string
) {
  await Promise.all([
    invalidateCommunityPost(queryClient, postId),
    queryClient.invalidateQueries({
      queryKey: communityKeys.commentList(postId),
    }),
  ]);
}

async function invalidateCommunityPostLikes(
  queryClient: QueryClient,
  postId: string,
  userId?: string
) {
  await Promise.all([
    invalidateCommunityPost(queryClient, postId),
    queryClient.invalidateQueries({
      queryKey: communityKeys.likeStatus(postId, userId),
    }),
  ]);
}

//리스트
export function useInfiniteCommunityListQuery(
  service?: SubscriptableBrandType
) {
  return useInfiniteQuery(
    createCommunityListInfiniteQueryOptions({
      service,
      fetchPage: getCommunityListPage,
    })
  );
}

export function useSuspenseInfiniteCommunityListQuery(
  service?: SubscriptableBrandType
) {
  return useSuspenseInfiniteQuery(
    createCommunityListInfiniteQueryOptions({
      service,
      fetchPage: getCommunityListPage,
    })
  );
}

//상세
export function useCommunityDetailQuery(
  postId: string,
  initialPost?: CommunityDetailData
) {
  return useQuery({
    queryKey: communityKeys.detail(postId),
    queryFn: () => getCommunityDetail(postId),
    enabled: Boolean(postId),
    initialData: initialPost,
  });
}

//추천게시글조회
export function useRecommendedCommunityPostsQuery(
  postId: string,
  service?: SubscriptableBrandType,
  initialRecommendedPosts?: CommunityListItemData[]
) {
  return useQuery({
    queryKey: communityKeys.recommendedPosts(postId, service),
    queryFn: () =>
      getRecommendedCommunityPosts({
        postId,
        service: service!,
      }),
    enabled: Boolean(postId && service),
    initialData: initialRecommendedPosts,
  });
}

//작성
export function useCreateCommunityPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    networkMode: "always",
    mutationFn: createCommunityPost,
    onSuccess: () => {
      void invalidateCommunityCollections(queryClient);
    },
  });
}

//수정
export function useUpdateCommunityPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    networkMode: "always",
    mutationFn: updateCommunityPost,
    onSuccess: async (_, variables) => {
      await invalidateCommunityPost(queryClient, variables.postId);
    },
  });
}

//삭제
export function useDeleteCommunityPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunityPost,
    onSuccess: (_, variables) => {
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: communityKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: communityKeys.recommendations(),
        }),
      ]);
      queryClient.removeQueries({
        queryKey: communityKeys.likeStatuses(variables.postId),
      });
      queryClient.removeQueries({
        queryKey: communityKeys.commentList(variables.postId),
        exact: true,
      });
      queryClient.removeQueries({
        queryKey: communityKeys.recommendationList(variables.postId),
      });
    },
  });
}

//댓글조회
export function useCommunityCommentsQuery(
  postId: string,
  initialComments?: CommunityCommentItemData[]
) {
  return useQuery({
    queryKey: communityKeys.commentList(postId),
    queryFn: () => getCommunityComments(postId),
    enabled: Boolean(postId),
    initialData: initialComments,
  });
}

//좋아요조회
export function useCommunityPostLikeStatusQuery(
  postId: string,
  userId?: string
) {
  return useQuery({
    queryKey: communityKeys.likeStatus(postId, userId),
    queryFn: () =>
      getCommunityPostLikeStatus({
        postId,
        userId: userId!,
      }),
    enabled: Boolean(postId && userId),
  });
}

//댓글작성
export function useCreateCommunityCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommunityComment,
    onSuccess: async (_, variables) => {
      await invalidateCommunityPostComments(queryClient, variables.postId);
    },
  });
}

//좋아요토글(낙관적업데이트 포함)
export function useToggleCommunityPostLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCommunityPostLike,
    onMutate: async (variables): Promise<CommunityLikeMutationContext> => {
      const detailKey = communityKeys.detail(variables.postId);
      const likeStatusKey = communityKeys.likeStatus(
        variables.postId,
        variables.userId
      );

      await Promise.all([
        queryClient.cancelQueries({ queryKey: detailKey }),
        queryClient.cancelQueries({ queryKey: likeStatusKey }),
        queryClient.cancelQueries({ queryKey: communityKeys.lists() }),
        queryClient.cancelQueries({
          queryKey: communityKeys.recommendations(),
        }),
      ]);

      const previousDetail =
        queryClient.getQueryData<CommunityDetailData | null>(detailKey);
      const previousLikeStatus =
        queryClient.getQueryData<boolean>(likeStatusKey);
      const previousLists = queryClient.getQueriesData<
        InfiniteData<CommunityListPage, CommunityListCursor | null>
      >({
        queryKey: communityKeys.lists(),
      });
      const previousRecommendations = queryClient.getQueriesData<
        CommunityListItemData[]
      >({
        queryKey: communityKeys.recommendations(),
      });

      if (typeof previousLikeStatus === "boolean") {
        const nextLiked = !previousLikeStatus;

        queryClient.setQueryData<boolean>(likeStatusKey, nextLiked);
        queryClient.setQueryData<CommunityDetailData | null>(
          detailKey,
          (oldData) =>
            applyOptimisticLikeToOptional(
              oldData,
              variables.postId,
              nextLiked
            ) ?? oldData
        );
        queryClient.setQueriesData<
          InfiniteData<CommunityListPage, CommunityListCursor | null>
        >(
          {
            queryKey: communityKeys.lists(),
          },
          (oldData) =>
            applyOptimisticLikeToInfiniteData(
              oldData,
              variables.postId,
              nextLiked
            ) ?? oldData
        );
        queryClient.setQueriesData<CommunityListItemData[]>(
          {
            queryKey: communityKeys.recommendations(),
          },
          (oldData) =>
            applyOptimisticLikeToItems(oldData, variables.postId, nextLiked) ??
            oldData
        );
      }

      return {
        previousDetail,
        previousLikeStatus,
        previousLists,
        previousRecommendations,
      };
    },
    onError: (_error, variables, context) => {
      if (!context) {
        return;
      }

      const detailKey = communityKeys.detail(variables.postId);
      const likeStatusKey = communityKeys.likeStatus(
        variables.postId,
        variables.userId
      );

      if (context.previousDetail !== undefined) {
        queryClient.setQueryData(detailKey, context.previousDetail);
      }

      if (typeof context.previousLikeStatus === "boolean") {
        queryClient.setQueryData(likeStatusKey, context.previousLikeStatus);
      }

      context.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      context.previousRecommendations.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: async (_data, _error, variables) => {
      await invalidateCommunityPostLikes(
        queryClient,
        variables.postId,
        variables.userId
      );
    },
  });
}

//댓글삭제
export function useDeleteCommunityCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommunityComment,
    onSuccess: async (_, variables) => {
      await invalidateCommunityPostComments(queryClient, variables.postId);
    },
  });
}

//게시글신고
export function useReportCommunityPostMutation() {
  return useMutation({
    mutationFn: reportCommunityPost,
  });
}

//댓글신고
export function useReportCommunityCommentMutation() {
  return useMutation({
    mutationFn: reportCommunityComment,
  });
}
