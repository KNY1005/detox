"use client";

import Avatar from "@/app/components/avatar";

type AuthorMetaProps = {
  thumbUrl: string;
  author: string;
  timeAgo: string;
};

export default function AuthorMeta({
  thumbUrl,
  author,
  timeAgo,
}: AuthorMetaProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm" src={thumbUrl} alt={author} />
      <div className="flex gap-3">
        <div className="text-sm font-bold leading-[110%] text-black">
          {author}
        </div>
        <span className="text-xs text-gray-300">{timeAgo}</span>
      </div>
    </div>
  );
}
