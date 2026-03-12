"use client";

import { Skeleton } from "@/components/ui/skeleton";

type CommunityPostListSkeletonProps = {
  count?: number;
  className?: string;
  descriptionLineCount?: number;
};

export default function CommunityPostListSkeleton({
  count = 3,
  className,
  descriptionLineCount = 2,
}: CommunityPostListSkeletonProps) {
  return (
    <div
      className={["grid grid-cols-1 gap-5", className].filter(Boolean).join(" ")}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-3 rounded-lg bg-white px-6 py-4"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          {Array.from({ length: descriptionLineCount }).map((__, lineIndex) => (
            <Skeleton
              key={lineIndex}
              className={
                lineIndex === descriptionLineCount - 1
                  ? "h-4 w-2/3"
                  : "h-4 w-full"
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
