"use client";

import { useId } from "react";
import Link from "next/link";
import type { CommunityListItemData } from "../_types";
import CommunityReactionStats from "./community-reaction-stats";
import AuthorMeta from "./author-meta";

type CommunityItemProps = {
  item: CommunityListItemData;
};

const CONTENT_PREVIEW_MAX_LENGTH = 80;

function getContentPreview(content: string) {
  const normalizedContent = content.replace(/\s+/g, " ").trim();

  if (normalizedContent.length <= CONTENT_PREVIEW_MAX_LENGTH) {
    return normalizedContent;
  }

  return `${normalizedContent.slice(0, CONTENT_PREVIEW_MAX_LENGTH).trimEnd()}...`;
}

export default function CommunityItem({ item }: CommunityItemProps) {
  const titleId = useId();
  const metaId = useId();
  const previewId = useId();
  const statsId = useId();
  const contentPreview = getContentPreview(item.content);

  return (
    <li className="w-full rounded-lg bg-white px-6 py-4">
      <article className=" grid grid-cols-1 items-center gap-2 ">
        <Link
          href={`/community/${item.id}`}
          className="block"
          aria-labelledby={titleId}
          aria-describedby={`${previewId} ${metaId} ${statsId}`}
        >
          <div id={metaId}>
            <AuthorMeta
              thumbUrl={item.thumbUrl}
              author={item.author}
              timeAgo={item.timeAgo}
            />
          </div>
          <div className="mt-4 text-sm text-gray-300">
            <h2
              id={titleId}
              className="mb-2 line-clamp-2 text-lg font-bold leading-[140%] text-black"
            >
              {item.title}
            </h2>
            <p
              aria-hidden="true"
              className="line-clamp-3 text-base leading-[140%] text-gray-300"
            >
              {item.content}
            </p>
          </div>
          <p id={previewId} className="sr-only">
            {contentPreview}
          </p>
          <p id={statsId} className="sr-only">
            {`좋아요 ${item.likeCount}개, 댓글 ${item.commentCount}개`}
          </p>
        </Link>
        <div aria-hidden="true">
          <CommunityReactionStats
            likeCount={item.likeCount}
            commentCount={item.commentCount}
            readOnly
          />
        </div>
      </article>
    </li>
  );
}
