"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  type: "this-month" | "saved";
}

export default function HomeSummarySkeleton({ type }: Props) {
  const isSaved = type === "saved";

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="title">
          <Skeleton className="h-8 w-24 rounded-md bg-gray-100" />
          <div className="flex items-center gap-2 mt-1">
            <Skeleton className="h-8 w-28 rounded-md bg-gray-100" />
            <Skeleton className="h-8 w-16 rounded-md bg-gray-100" />
            {isSaved && (
              <Skeleton className="h-8 w-20 rounded-md bg-gray-100" />
            )}
          </div>
        </div>

        <Link
          href="/statistics"
          className="body-lg text-gray-300 inline-flex items-center gap-1 mt-2"
        >
          자세히 알아보기
          <FontAwesomeIcon icon={faAngleRight} size="xs" />
        </Link>
      </div>
      <div>
        <Skeleton className="w-[100px] h-[100px] rounded-2xl bg-gray-100" />
      </div>
    </>
  );
}
