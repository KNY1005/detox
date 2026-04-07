"use client";

import type { CommunityCommentItemData } from "@/app/community/_types";
import {
  useDeleteCommunityCommentMutation,
  useReportCommunityCommentMutation,
} from "@/query/community";
import { useCurrentUserQuery } from "@/query/users";

export function useCommunityCommentActions() {
  const { data: currentUser } = useCurrentUserQuery();
  const { mutateAsync: deleteCommunityComment } =
    useDeleteCommunityCommentMutation();
  const { mutateAsync: reportCommunityComment } =
    useReportCommunityCommentMutation();
  const currentUserId = currentUser?.id;

  const getDeleteHandler = (item: CommunityCommentItemData) => {
    if (!currentUserId || currentUserId !== item.userId) {
      return undefined;
    }

    return async () => {
      await deleteCommunityComment({
        commentId: item.id,
        postId: item.postId,
        userId: currentUserId,
      });
    };
  };

  const getReportHandler = (item: CommunityCommentItemData) => {
    if (!currentUserId || currentUserId === item.userId) {
      return undefined;
    }

    return async () => {
      await reportCommunityComment({
        commentId: item.id,
        postId: item.postId,
        reporterUserId: currentUserId,
      });
    };
  };

  return {
    currentUserId,
    getDeleteHandler,
    getReportHandler,
  };
}
