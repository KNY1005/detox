"use client";
import Header from "@/app/components/header";
import { useParams, useRouter } from "next/navigation";
import TextButton from "@/app/components/text-button";
import SubscriptionDetailContent from "./_components/subscription-detail-content";
import { Suspense } from "react";
import LoadingScreen from "./loading";

export default function Page() {
  const router = useRouter();
  const { id } = useParams();

  const goEdit = () => {
    router.push(`/subscription/${id}/edit`);
  };

  return (
    <main className="relative w-full min-h-screen flex flex-col items-start justify-start">
      <Header
        variant="back"
        onBack={() => router.back()}
        rightContent={<TextButton onClick={goEdit}>수정</TextButton>}
      />

      <Suspense fallback={<LoadingScreen />}>
        <SubscriptionDetailContent />
      </Suspense>
    </main>
  );
}
