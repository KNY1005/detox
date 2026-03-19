"use client";

import Header from "@/app/components/header";
import BottomNav from "@/app/components/bottom-nav";
import BrandTabs from "./brand-tabs";
import CommunityPostListSkeleton from "./community-post-list-skeleton";

export default function CommunityListLoadingScreen() {
  return (
    <div className="bg-gray-100 pb-15 min-h-screen">
      <Header variant="text" leftText="커뮤니티" rightContent="알람" />

      <main>
        <div className="pointer-events-none" aria-hidden="true">
          <BrandTabs value="all" />
        </div>

        <section className="px-6">
          <CommunityPostListSkeleton count={4} className="pt-6" />
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
