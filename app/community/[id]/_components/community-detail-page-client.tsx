"use client";

import { useRef } from "react";
import FeedbackPage from "@/app/components/feedback-page";
import Header from "@/app/components/header";
import {
  useCommunityCommentsQuery,
  useCommunityDetailQuery,
  useRecommendedCommunityPostsQuery,
} from "@/query/community";
import CommunityReactionStats from "../../_components/community-reaction-stats";
import CommunityList from "../../_components/community-list";
import AuthorMeta from "../../_components/author-meta";
import type {
  CommunityDetailData,
  CommunityCommentItemData,
  CommunityListItemData,
} from "../../_types";
import CommunityDetailCommentSection from "./community-detail-comment-section";
import CommunityDetailPostActions from "./community-detail-post-actions";
import CommunityDetailRecommendedPostsSkeleton from "./community-detail-recommended-posts-skeleton";

type CommunityDetailPageClientProps = {
  postId: string;
  initialPost: CommunityDetailData;
  initialRecommendedPosts: CommunityListItemData[];
  initialComments: CommunityCommentItemData[];
};

export default function CommunityDetailPageClient({
  postId,
  initialPost,
  initialRecommendedPosts,
  initialComments,
}: CommunityDetailPageClientProps) {
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const detailQuery = useCommunityDetailQuery(postId, initialPost);
  const commentsQuery = useCommunityCommentsQuery(postId, initialComments);
  const recommendedPostsQuery = useRecommendedCommunityPostsQuery(
    postId,
    initialPost.service,
    initialRecommendedPosts
  );

  const post = detailQuery.data === undefined ? initialPost : detailQuery.data;
  const comments = commentsQuery.data ?? [];
  const recommendedPosts = recommendedPostsQuery.data ?? [];

  if (post === null) {
    return (
      <FeedbackPage
        title="게시글을 찾을 수 없어요."
        description="삭제되었거나 더 이상 볼 수 없는 게시글이에요."
        buttonLabel="커뮤니티로 가기"
        buttonHref="/community"
      />
    );
  }

  return (
    <>
      <Header variant="back" fallbackPath="/community" />
      <main>
        <section className="px-6 py-4">
          <div className="flex flex-col">
            <article className="order-2 mt-4 text-sm text-gray-300">
              <h1
                id="community-post-title"
                className="mb-2 text-lg font-bold leading-[140%] text-black"
              >
                {post.title}
              </h1>
              <p
                id="community-post-content"
                className="text-base leading-[140%] text-gray-300 whitespace-pre-wrap"
              >
                {post.content}
              </p>
            </article>

            <div className="order-1 flex items-center justify-between gap-4">
              <AuthorMeta
                thumbUrl={post.thumbUrl}
                author={post.author}
                timeAgo={post.timeAgo}
              />
              <CommunityDetailPostActions
                postId={postId}
                postUserId={post.userId}
              />
            </div>
          </div>
        </section>

        <section
          className="border-t-8 border-gray-50 py-5"
          aria-labelledby="community-reaction-title"
        >
          <h2 id="community-reaction-title" className="sr-only">
            게시글 반응
          </h2>
          <CommunityReactionStats
            likeCount={post.likeCount}
            commentCount={comments.length}
            showLabel
            className="px-6"
            postId={postId}
            commentInputRef={commentInputRef}
          />
        </section>

        <CommunityDetailCommentSection
          postId={postId}
          comments={comments}
          isCommentsPending={commentsQuery.isPending}
          isCommentsError={commentsQuery.isError}
          commentInputRef={commentInputRef}
        />

        {recommendedPostsQuery.isPending ? (
          <CommunityDetailRecommendedPostsSkeleton />
        ) : recommendedPosts.length > 0 ? (
          <section
            className="bg-gray-50 px-6 py-6"
            aria-labelledby="recommended-posts-title"
          >
            <h2 id="recommended-posts-title" className="title-md">
              <span className="text-blue-600">AI디톡이</span>가 추천해주는 관련
              게시글
            </h2>

            <CommunityList items={recommendedPosts} />
          </section>
        ) : null}
      </main>
    </>
  );
}
