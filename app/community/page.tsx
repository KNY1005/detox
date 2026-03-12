"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FeedbackState from "@/app/components/feedback-state";
import Header from "../components/header";
import BottomNav from "../components/bottom-nav";
import BrandTabs from "./_components/brand-tabs";
import CommunityList from "./_components/community-list";
import CommunityPostListSkeleton from "./_components/community-post-list-skeleton";
import Button from "@/app/components/button";
import { subscriptableBrand } from "@/app/utils/brand/brand";
import type { CommunityServiceFilter } from "./_types";
import { useInfiniteCommunityListQuery } from "@/query/community";
import FloatingButton from "../components/floating-button";
import CommunityAuthGuard from "./_components/community-auth-guard";

function CommunityListPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const serviceParam = searchParams.get("service");

  const selectedService: CommunityServiceFilter =
    serviceParam &&
    Object.prototype.hasOwnProperty.call(subscriptableBrand, serviceParam)
      ? (serviceParam as CommunityServiceFilter)
      : "all";

  const queryService = selectedService === "all" ? undefined : selectedService;

  const communityListQuery = useInfiniteCommunityListQuery(queryService);

  const items =
    communityListQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const handleChangeService = (nextService: CommunityServiceFilter) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextService === "all") {
      params.delete("service");
    } else {
      params.set("service", nextService);
    }

    const nextUrl = params.toString()
      ? `/community?${params.toString()}`
      : "/community";

    router.replace(nextUrl);
  };

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = communityListQuery;
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderLoading = () => (
    <CommunityPostListSkeleton count={4} className="pt-6" />
  );

  const renderFetchMoreLoading = () => (
    <CommunityPostListSkeleton
      count={2}
      className="pt-5"
      descriptionLineCount={1}
    />
  );

  const renderError = () => (
    <FeedbackState
      description="게시글을 불러오지 못했어요."
      className="px-6 py-12"
      bottomCTA
      ctaClassName="bg-gray-100"
      hasBottomNav
      imageSrc="/images/emoji/no-alarm.png"
      contentClassName="gap-0"
      descriptionClassName="body-md font-normal text-gray-400"
    >
      <Button
        variant="secondary"
        size="md"
        className="w-full"
        onClick={() => communityListQuery.refetch()}
      >
        다시 시도
      </Button>
    </FeedbackState>
  );

  const renderEmpty = () => (
    <FeedbackState
      description={
        selectedService === "all"
          ? "아직 등록된 게시글이 없어요."
          : "선택한 서비스의 게시글이 아직 없어요."
      }
      className="gap-5 px-6 py-12"
      imageSrc="/images/emoji/no-alarm.png"
      contentClassName="gap-0"
      descriptionClassName="body-md font-normal text-gray-400"
    />
  );

  return (
    <div className="bg-gray-100 pb-15 min-h-screen">
      <Header variant="text" leftText="커뮤니티" rightContent="알람" />

      <main>
        <BrandTabs value={selectedService} onChange={handleChangeService} />

        <section className="px-6">
          {communityListQuery.isPending && renderLoading()}
          {communityListQuery.isError && renderError()}
          {communityListQuery.isSuccess && items.length === 0 && renderEmpty()}
          {communityListQuery.isSuccess && items.length > 0 && (
            <>
              <CommunityList items={items} />
              {communityListQuery.isFetchingNextPage &&
                renderFetchMoreLoading()}
              <div ref={loadMoreRef} className="h-10" />
            </>
          )}
        </section>

        <div className="fixed right-0 bottom-24 z-10">
          <FloatingButton variant="create" />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default function CommunityListPage() {
  return (
    <CommunityAuthGuard>
      <CommunityListPageContent />
    </CommunityAuthGuard>
  );
}
