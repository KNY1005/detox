"use client";
import { faCommentDots, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib/utils";

interface Props {
  likeCount: number;
  commentCount: number;
  showLabel?: boolean;
  className?: string;
  readOnly?: boolean;
  isLiked?: boolean;
  likeDisabled?: boolean;
  onLikeClick?: () => void;
  onCommentClick?: () => void;
}

export default function CommunityReactionStats({
  likeCount,
  commentCount,
  showLabel = false,
  className,
  readOnly = false,
  isLiked = false,
  likeDisabled = false,
  onLikeClick,
  onCommentClick,
}: Props) {
  return (
    <div className={cn("flex gap-4", className)}>
      <button
        type="button"
        className="text-sm flex items-center gap-1 cursor-pointer disabled:cursor-default"
        onClick={readOnly ? undefined : onLikeClick}
        disabled={readOnly || likeDisabled}
      >
        <FontAwesomeIcon
          icon={faThumbsUp}
          size="sm"
          className={cn(isLiked ? "text-brand-primary" : "text-gray-200")}
        />
        <span className={cn(isLiked ? "text-brand-primary" : "text-gray-400")}>
          {showLabel ? `좋아요 ${likeCount}` : `${likeCount}`}
        </span>
      </button>

      <button
        type="button"
        className="text-sm flex items-center gap-1 cursor-pointer disabled:cursor-default"
        onClick={readOnly ? undefined : onCommentClick}
        disabled={readOnly}
      >
        <FontAwesomeIcon
          icon={faCommentDots}
          size="sm"
          className="text-gray-200"
        />
        <span className="text-gray-400">
          {showLabel ? `댓글 ${commentCount}` : `${commentCount}`}
        </span>
      </button>
    </div>
  );
}
