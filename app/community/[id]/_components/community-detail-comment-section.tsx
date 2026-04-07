"use client";

import { useState, type KeyboardEvent, type RefObject } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FeedbackState from "@/app/components/feedback-state";
import { useLoginRedirect } from "@/app/hooks/use-login-redirect";
import TextButton from "@/app/components/text-button";
import { useToast } from "@/app/hooks/useToast";
import { useCreateCommunityCommentMutation } from "@/query/community";
import { useCurrentUserQuery } from "@/query/users";
import CommentList from "../../_components/comment-list";
import type { CommunityCommentItemData } from "../../_types";
import CommunityDetailCommentsSkeleton from "./community-detail-comments-skeleton";

interface CommunityDetailCommentSectionProps {
  postId: string;
  comments: CommunityCommentItemData[];
  isCommentsPending: boolean;
  isCommentsError: boolean;
  commentInputRef: RefObject<HTMLInputElement | null>;
}

export default function CommunityDetailCommentSection({
  postId,
  comments,
  isCommentsPending,
  isCommentsError,
  commentInputRef,
}: CommunityDetailCommentSectionProps) {
  const { success, error } = useToast();
  const [comment, setComment] = useState("");
  const {
    data: currentUser,
    isPending: isCurrentUserPending,
    isError: isCurrentUserError,
  } = useCurrentUserQuery();
  const currentUserId = currentUser?.id;
  const { moveToLogin, redirectToLoginIfNeeded } = useLoginRedirect();
  const { mutateAsync: createCommunityComment, isPending: isCreatePending } =
    useCreateCommunityCommentMutation();

  const isLoggedIn = Boolean(currentUserId);
  const isCommentInputReadOnly =
    !isLoggedIn || isCurrentUserPending || isCreatePending;

  const handleCreateComment = async () => {
    if (isCurrentUserPending || isCurrentUserError) {
      return;
    }

    if (redirectToLoginIfNeeded(isLoggedIn) || !currentUserId) {
      return;
    }

    if (!comment.trim() || isCreatePending) {
      return;
    }

    try {
      await createCommunityComment({
        postId,
        userId: currentUserId,
        content: comment.trim(),
      });
      setComment("");
      success("댓글이 등록되었어요.");
    } catch (createCommentError) {
      console.error(createCommentError);
      error("댓글 등록에 실패했어요.");
    }
  };

  const handleCommentLoginClick = () => {
    if (isCurrentUserPending || isCurrentUserError) {
      return;
    }

    moveToLogin();
  };

  const handleCommentKeyDown = async (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    await handleCreateComment();
  };

  return (
    <section
      className="border-t border-gray-50 px-6 py-5"
      aria-labelledby="community-comments-title"
    >
      <h2 id="community-comments-title" className="title-md text-gray-400">
        댓글
      </h2>

      {isCommentsPending ? (
        <CommunityDetailCommentsSkeleton />
      ) : isCommentsError ? (
        <FeedbackState
          description="댓글을 불러오지 못했어요."
          className="py-8"
          imageSrc="/images/emoji/error.png"
          contentClassName="gap-0"
          descriptionClassName="body-md font-normal text-gray-400"
        />
      ) : (
        <CommentList items={comments} />
      )}

      <div className="mt-4 flex items-center rounded-lg bg-gray-50 px-4 py-3">
        {isCurrentUserError ? (
          <p className="flex-1 text-left text-base text-gray-300">
            댓글을 입력할 수 없어요.
          </p>
        ) : isLoggedIn ? (
          <input
            ref={commentInputRef}
            type="text"
            aria-label="댓글 입력"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            onKeyDown={handleCommentKeyDown}
            placeholder="댓글을 입력하세요"
            readOnly={isCommentInputReadOnly}
            className="flex-1 bg-transparent text-base text-gray-400 outline-none placeholder:text-gray-300"
          />
        ) : (
          <button
            type="button"
            aria-label="로그인 후 댓글 작성"
            onClick={handleCommentLoginClick}
            className="flex-1 bg-transparent text-left text-base text-gray-300 outline-none  cursor-pointer"
          >
            댓글 작성은 로그인 후 가능해요
          </button>
        )}
        <TextButton
          size="md"
          aria-label="댓글 전송"
          disabled={
            !isLoggedIn ||
            isCurrentUserPending ||
            isCreatePending ||
            isCurrentUserError ||
            (isLoggedIn && !comment.trim())
          }
          onClick={handleCreateComment}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />
        </TextButton>
      </div>
    </section>
  );
}
