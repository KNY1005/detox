"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  title: string;
  diffAmount: number;
  status: "over" | "under";
  isLoading?: boolean;
}

export default function ComparisonInsight({
  title,
  diffAmount,
  status,
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-start px-6 py-6 w-full gap-2">
        <Skeleton className="h-7 w-40 rounded-md bg-brand-primary/20" />
        <Skeleton className="h-5 w-60 rounded-md bg-brand-primary/20" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start px-6 py-6 w-full">
      <h3 className="title-md text-black leading-tight">{title}</h3>
      <div className="flex items-center mt-1 body-lg text-gray-400">
        <span>평균보다&nbsp;</span>
        <span className="font-bold text-brand-primary">
          {diffAmount.toLocaleString()}원
        </span>
        <span>
          &nbsp;{status === "over" ? "더 쓰고 있어요" : "아끼고 있어요"}
        </span>
      </div>
    </div>
  );
}
