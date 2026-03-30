"use client";

import { startTransition, Suspense, useEffect, useRef, useState } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import TopFloatingButton from "@/app/components/floating-button/top-floating-button";
import FeedbackState from "@/app/components/feedback-state";
import Header from "@/app/components/header";
import BottomNav from "@/app/components/bottom-nav";
import { useTopFloatingButtonVisible } from "@/app/hooks/use-top-floating-button-visible";
import BrandTabs from "./brand-tabs";
import CommunityCreateFloatingButton from "./community-create-floating-button";
import CommunityList from "./community-list";
import CommunityListErrorBoundary from "./community-list-error-boundary";
import CommunityPostListSkeleton from "./community-post-list-skeleton";
import type { CommunityServiceFilter } from "../_types";
import { useSuspenseInfiniteCommunityListQuery } from "@/query/community";
import { useCurrentUserQuery } from "@/query/users";

interface CommunityListPageClientProps {
  initialService: CommunityServiceFilter;
}

function CommunityListContent({
  service,
}: {
  service: CommunityServiceFilter;
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const queryService = service === "all" ? undefined : service;
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteCommunityListQuery(queryService);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFetchMoreLoading = () => (
    <CommunityPostListSkeleton
      count={2}
      className="pt-5"
      descriptionLineCount={1}
    />
  );

  const renderEmpty = () => (
    <FeedbackState
      description={
        service === "all"
          ? "아직 등록된 게시글이 없어요."
          : "선택한 서비스의 게시글이 아직 없어요."
      }
      className="gap-5 px-6 py-12"
      imageSrc="/images/emoji/no-alarm.png"
      contentClassName="gap-0"
      descriptionClassName="body-md font-normal text-gray-400"
    />
  );

  if (items.length === 0) {
    return renderEmpty();
  }

  return (
    <>
      <CommunityList items={items} />
      {isFetchingNextPage && renderFetchMoreLoading()}
      <div ref={loadMoreRef} className="h-10" />
    </>
  );
}

function CommunityFloatingActions() {
  const showTopFloatingButton = useTopFloatingButtonVisible();
  const {
    data: currentUser,
    isPending: isCurrentUserPending,
    isError: isCurrentUserError,
  } = useCurrentUserQuery();
  const showCreateFloatingButton =
    !isCurrentUserPending && !isCurrentUserError && Boolean(currentUser?.id);

  return (
    <div className="fixed bottom-24 left-1/2 z-10 w-full max-w-(--max-width) -translate-x-1/2">
      <div className="relative flex justify-end">
        <div
          className={`absolute right-0 transition-opacity duration-200 ease-out ${
            showCreateFloatingButton
              ? "bottom-[calc(100%+0.75rem)]"
              : "bottom-0"
          } ${
            showTopFloatingButton
              ? "visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }`}
          aria-hidden={!showTopFloatingButton}
        >
          <TopFloatingButton />
        </div>
        {showCreateFloatingButton ? <CommunityCreateFloatingButton /> : null}
      </div>
    </div>
  );
}

export default function CommunityListPageClient({
  initialService,
}: CommunityListPageClientProps) {
  const [selectedService, setSelectedService] =
    useState<CommunityServiceFilter>(initialService);
  const resetKey = selectedService;

  const syncServiceToUrl = (service: CommunityServiceFilter) => {
    const nextUrl =
      service === "all" ? "/community" : `/community?service=${service}`;

    window.history.replaceState(null, "", nextUrl);
  };

  const handleChangeService = (nextService: CommunityServiceFilter) => {
    if (nextService === selectedService) {
      return;
    }

    setSelectedService(nextService);
    syncServiceToUrl(nextService);
  };

  return (
    <div className="bg-gray-100 pb-15 min-h-screen">
      <Header variant="text" leftText="커뮤니티" hasNotification />

      <main>
        <BrandTabs value={selectedService} onChange={handleChangeService} />

        <section className="px-6">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <CommunityListErrorBoundary onReset={reset} resetKey={resetKey}>
                <Suspense
                  fallback={
                    <CommunityPostListSkeleton count={4} className="pt-6" />
                  }
                >
                  <CommunityListContent service={selectedService} />
                </Suspense>
              </CommunityListErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </section>

        <CommunityFloatingActions />
      </main>

      <BottomNav />
    </div>
  );
}
