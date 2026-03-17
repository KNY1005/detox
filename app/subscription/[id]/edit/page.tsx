import type { Metadata } from "next";
import { Suspense } from "react";
import EditPageContent from "./_components/edit-page-content";
import LoadingScreen from "@/app/components/loading-screen";

export const metadata: Metadata = {
  title: "구독 수정",
  description: "구독 정보를 수정합니다",
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <EditPageContent />
    </Suspense>
  );
}
