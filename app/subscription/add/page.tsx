import type { Metadata } from "next";
import { Suspense } from "react";
import LoadingScreen from "@/app/components/loading-screen";
import AddPageContent from "./_components/add-page-content";

export const metadata: Metadata = {
  title: "구독 추가",
  description: "새 구독을 추가합니다",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AddPageContent />
    </Suspense>
  );
}
