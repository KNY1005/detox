"use client";

import FeedbackState from "@/app/components/feedback-state";
import { useCommunityCommentActions } from "@/app/community/_hooks/use-community-comment-actions";
import type { CommunityCommentItemData } from "../_types";
import AuthorMeta from "./author-meta";
import DetailKebab from "./detail-kebab";

interface CommentListProps {
  items: CommunityCommentItemData[];
}

export default function CommentList({ items }: CommentListProps) {
  const { currentUserId, getDeleteHandler, getReportHandler } =
    useCommunityCommentActions();

  if (items.length === 0) {
    return (
      <FeedbackState
        description="남겨진 댓글이 없어요."
        className="py-8"
        imageSrc="/images/emoji/no-alarm.png"
        contentClassName="gap-0"
        descriptionClassName="body-md font-normal text-gray-400"
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 py-5 gap-5">
      {items.map((item) => (
        <li key={item.id} className="bg-white rounded-lg">
          <div className="grid grid-cols-[1fr_auto] items-start gap-2">
            <article className="grid grid-cols-1 items-center gap-1">
              <AuthorMeta
                thumbUrl={item.thumbUrl}
                author={item.author}
                timeAgo={item.timeAgo}
              />
              <p className="break-words text-base leading-[140%] text-gray-300">
                {item.content}
              </p>
            </article>
            {currentUserId ? (
              <div className="min-h-12 flex items-start justify-end">
                <DetailKebab
                  entityName="댓글"
                  variant={currentUserId === item.userId ? "edit" : "default"}
                  onDelete={getDeleteHandler(item)}
                  onReport={getReportHandler(item)}
                />
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
