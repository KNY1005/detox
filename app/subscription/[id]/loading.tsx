import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="w-full mt-5 px-6 flex flex-col gap-5">
        {/* SubscriptionList skeleton */}
        <div className="w-full flex justify-center items-center gap-3">
          <Skeleton className="min-w-12 min-h-12 w-12 h-12 rounded-md bg-brand-primary/20" />
          <div className="w-full flex flex-col gap-1">
            <Skeleton className="w-1/2 h-6 rounded-md bg-brand-primary/20" />
            <Skeleton className="w-1/4 h-4 rounded-md bg-brand-primary/20" />
          </div>
        </div>

        <Skeleton className="w-full h-49 rounded-md bg-brand-primary/20" />

        <div className="w-full flex flex-col gap-1">
          <Skeleton className="w-full h-8 rounded-md bg-brand-primary/20" />
          <Skeleton className="w-full h-8 rounded-md bg-brand-primary/20" />
        </div>
      </div>
    </>
  );
}
