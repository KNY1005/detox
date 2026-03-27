"use client";

import { useSupabase } from "@/hooks/useSupabase";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import MypageContent from "./mypage-content";
import MypageSkeleton from "./mypage-skeleton";

export default function MypagePage() {
  const router = useRouter();
  const { session, loading } = useSupabase();
  const userId = session?.user?.id;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!loading && !session && !isLoggingOut) {
      router.replace("/login");
    }
  }, [session, loading, isLoggingOut, router]);

  if (loading || !session) {
    return <MypageSkeleton />;
  }

  if (!userId) {
    return <MypageSkeleton />;
  }

  return (
    <Suspense fallback={<MypageSkeleton />}>
      <MypageContent
        userId={userId}
        onLogoutStateChange={setIsLoggingOut}
      />
    </Suspense>
  );
}
