"use client";

import FeedbackState from "@/app/components/feedback-state";
import type { CommunityCommentItemData } from "../_types";
import AuthorMeta from "./author-meta";
import DetailKebab from "./detail-kebab";

type CommentListProps = {
  items: CommunityCommentItemData[];
  currentUserId?: string;
  onDeleteComment?: (comment: CommunityCommentItemData) => Promise<void> | void;
  onReportComment?: (comment: CommunityCommentItemData) => Promise<void> | void;
};

export default function CommentList({
  items,
  currentUserId,
  onDeleteComment,
  onReportComment,
}: CommentListProps) {
  if (items.length === 0) {
    return (
      <FeedbackState
        description="첫 댓글을 남겨보세요."
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
        <li
          key={item.id}
          className="w-full grid grid-cols-1 items-center gap-1 bg-white rounded-lg"
        >
          <div className="flex items-center justify-between min-h-12">
            <AuthorMeta
              thumbUrl={item.thumbUrl}
              author={item.author}
              timeAgo={item.timeAgo}
            />
            {currentUserId ? (
              <DetailKebab
                entityName="댓글"
                variant={currentUserId === item.userId ? "edit" : "default"}
                onDelete={
                  currentUserId === item.userId
                    ? () => onDeleteComment?.(item)
                    : undefined
                }
                onReport={
                  currentUserId !== item.userId
                    ? () => onReportComment?.(item)
                    : undefined
                }
              />
            ) : null}
          </div>
          <div className="text-sm text-gray-300">
            <p className="text-base leading-[140%] text-gray-300 line-clamp-3">
              {item.content}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
